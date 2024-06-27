import { Worker } from 'bullmq'
import { Redis } from 'ioredis'
import { config } from '../../configs'
import { QueueName } from '../queues'
import Container from 'typedi'
import { LeagueService } from '../../modules/leagues/leagues.service'

export const crawlListLeagueWorker = new Worker(
    QueueName.cronJobCrawlListLeague,
    async () => {
        return Container.get(LeagueService).scanSportsAndCrawlLeague()
    },
    {
        connection: new Redis({
            ...config.redis,
            maxRetriesPerRequest: null,
            enableReadyCheck: true,
        }),
    }
)
