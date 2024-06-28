import { Worker } from 'bullmq'
import { Redis } from 'ioredis'
import { config } from '../../configs'
import { QueueName } from '../queues'
import Container from 'typedi'
import { EventService } from '../../modules/events/event.service'
import { countJobEvent } from './update-events-to-db.worker'

export const crawlListEventWorker = new Worker(
    QueueName.cronJobCrawlListEventByLeague,
    async () => {
        if (countJobEvent <= 0) {
            return Container.get(EventService).scanLeaguesAndCrawlEvent()
        }
        return countJobEvent
    },
    {
        connection: new Redis({
            ...config.redis,
            maxRetriesPerRequest: null,
            enableReadyCheck: true,
        }),
    }
)
