import { createBullBoard } from '@bull-board/api'
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter'
import { ExpressAdapter } from '@bull-board/express'
import { DefaultJobOptions, Queue } from 'bullmq'
import { Redis } from 'ioredis'
import Container, { Inject, Service } from 'typedi'
import { Config } from '../configs'

export enum QueueName {
    mail = 'mail',
    cronJobCrawlListLeague = 'cronJobCrawlListLeague',
    cronJobCrawlListEventByLeague = 'cronJobCrawlListEventByLeague',
    cronJobCrawlDetailEvent = 'cronJobCrawlDetailEvent',
    updateLeagueToDB = 'updateLeagueToDB',
    updateEventToDB = 'updateEventToDB',
    updateMarketToDB = 'updateMarketToDB',
}

@Service()
export class QueueManager {
    private readonly queues: Record<string, Queue> = {}

    constructor(@Inject() private config: Config) {}

    createQueue(
        queueName: QueueName,
        jobOptions: DefaultJobOptions = {
            removeOnComplete: 500,
            removeOnFail: 500,
        }
    ): Queue {
        const queue = new Queue(queueName, {
            connection: new Redis(this.config.redis),
            defaultJobOptions: jobOptions,
        })
        this.queues[queueName] = queue
        return queue
    }

    getQueue(queueName: QueueName): Queue {
        const queue = this.queues[queueName]
        if (!queue) {
            throw new Error(`Queue [${queueName}] does not exist`)
        }
        return queue
    }

    createBoard() {
        const queueAdapter = new ExpressAdapter()
        createBullBoard({
            queues: Object.values(this.queues).map(
                (queue) => new BullMQAdapter(queue)
            ),
            serverAdapter: queueAdapter,
            options: {
                uiConfig: {
                    boardTitle: '',
                    boardLogo: { path: '' },
                },
            },
        })
        queueAdapter.setBasePath('/admin/queues')

        return queueAdapter
    }
}

export const setupQueues = () => {
    Object.values(QueueName).forEach((queueName) =>
        Container.get(QueueManager).createQueue(queueName)
    )
}
