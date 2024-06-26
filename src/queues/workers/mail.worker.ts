import { Job, Worker } from 'bullmq'
import { Redis } from 'ioredis'
import { config } from '../../configs'
import { logger } from '../../utils/logger'
import { QueueName } from '../queues'

export const mailWorker = new Worker(
    QueueName.mail,
    async (job: Job) => {
        logger.info(`Send mail ${job.data}}`)
    },
    {
        connection: new Redis({
            ...config.redis,
            maxRetriesPerRequest: null,
            enableReadyCheck: true,
        }),
    }
)
