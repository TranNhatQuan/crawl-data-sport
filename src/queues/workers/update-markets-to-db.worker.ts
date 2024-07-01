import { Job, Worker } from 'bullmq'
import { Redis } from 'ioredis'
import { config } from '../../configs'
import { QueueManager, QueueName } from '../queues'
import Container from 'typedi'
import { MarketService } from '../../modules/markets/market.service'

export let countJobMarket = 0

export const updateMarketToDBWorker = new Worker(
    QueueName.updateMarketToDB,
    async (job: Job) => {
        countJobMarket = await Container.get(QueueManager)
            .getQueue(QueueName.updateMarketToDB)
            .getWaitingCount()
        const { markets, eventId, marketTrending } = job.data
        return await Container.get(
            MarketService
        ).updateDataMarketsFromPriceKineticToDB({
            eventId,
            markets,
            marketTrending,
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
