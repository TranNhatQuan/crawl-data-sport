import { Worker } from 'bullmq'
import { Redis } from 'ioredis'
import { config } from '../../configs'
import { QueueName } from '../queues'
import Container from 'typedi'
import { MarketService } from '../../modules/markets/market.service'
import { countJobMarket } from './update-markets-to-db.worker'

export const crawlListMarketWorker = new Worker(
    QueueName.cronJobCrawlDetailEvent,
    async () => {
        if (countJobMarket <= 0) {
            return Container.get(MarketService).scanEventsAndCrawlMarket()
        }
        return countJobMarket
    },
    {
        connection: new Redis({
            ...config.redis,
            maxRetriesPerRequest: null,
            enableReadyCheck: true,
        }),
    }
)
