import { Job, Worker } from 'bullmq'
import { Redis } from 'ioredis'
import { config } from '../../configs'
import { QueueManager, QueueName } from '../queues'
import Container from 'typedi'
import { EventService } from '../../modules/events/event.service'

export let countJobEvent = 0

export const updateEventToDBWorker = new Worker(
    QueueName.updateEventToDB,
    async (job: Job) => {
        countJobEvent = await Container.get(QueueManager)
            .getQueue(QueueName.updateEventToDB)
            .getWaitingCount()
        const { leagueId, events } = job.data
        return await Container.get(
            EventService
        ).updateDataEventsFromPriceKineticToDB({
            events,
            leagueId,
        })
    },
    {
        connection: new Redis({
            ...config.redis,
            maxRetriesPerRequest: null,
            enableReadyCheck: true,
        }),
    }
)
