import { Job, Worker } from 'bullmq'
import { Redis } from 'ioredis'
import { config } from '../../configs'
import { QueueName } from '../queues'
import Container from 'typedi'
import { LeagueService } from '../../modules/leagues/leagues.service'

export const updateLeagueToDBWorker = new Worker(
    QueueName.cronJobCrawlListLeague,
    async (job: Job) => {
        const { sportId, leagues } = job.data
        console.log(job.data)
        return Container.get(LeagueService).updateDataFormPriceKineticToDB({
            leagues,
            sportId,
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
