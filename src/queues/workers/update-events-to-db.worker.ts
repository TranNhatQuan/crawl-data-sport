import { Job, Worker } from 'bullmq'
import { Redis } from 'ioredis'
import { config } from '../../configs'
import { QueueManager, QueueName } from '../queues'
import Container from 'typedi'
import { EventService } from '../../modules/events/event.service'

export let countJobEvent = 0

export const updateEventToDBWorker = new Worker(
    QueueName.updateLeagueToDB,
    async (job: Job) => {
        countJobEvent = await Container.get(QueueManager)
            .getQueue(QueueName.updateLeagueToDB)
            .getWaitingCount()
        const { leagueId, events } = job.data
        await Container.get(EventService).updateDataFormPriceKineticToDB({
            events,
            leagueId,
        })
        return true
    },
    {
        connection: new Redis({
            ...config.redis,
            maxRetriesPerRequest: null,
            enableReadyCheck: true,
        }),
    }
)
