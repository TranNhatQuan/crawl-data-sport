import { Job, Worker } from 'bullmq'
import { Redis } from 'ioredis'
import { config } from '../../configs'
import { QueueManager, QueueName } from '../queues'
import Container from 'typedi'
import { LeagueService } from '../../modules/leagues/leagues.service'

export let countJobLeague = 0

export const updateLeagueToDBWorker = new Worker(
    QueueName.updateLeagueToDB,
    async (job: Job) => {
        countJobLeague = await Container.get(QueueManager)
            .getQueue(QueueName.updateLeagueToDB)
            .getWaitingCount()
        const { sportId, leagues } = job.data
        return Container.get(
            LeagueService
        ).updateDataLeaguesFromPriceKineticToDB({
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
