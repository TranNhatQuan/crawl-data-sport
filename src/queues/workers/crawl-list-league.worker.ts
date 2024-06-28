import { Worker } from 'bullmq'
import { Redis } from 'ioredis'
import { config } from '../../configs'
import { QueueName } from '../queues'
import Container from 'typedi'
import { LeagueService } from '../../modules/leagues/leagues.service'
import { count } from './update-leagues-to-db.worker'

export const crawlListLeagueWorker = new Worker(
    QueueName.cronJobCrawlListLeague,
    async () => {
        if (count <= 0) {
            return Container.get(LeagueService).scanSportsAndCrawlLeague()
        }
        return count
    },
    {
        connection: new Redis({
            ...config.redis,
            maxRetriesPerRequest: null,
            enableReadyCheck: true,
        }),
    }
)
