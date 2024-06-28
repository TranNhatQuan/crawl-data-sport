import { Worker } from 'bullmq'
import Container, { Service } from 'typedi'
import { crawlListLeagueWorker } from './workers/crawl-list-league.worker'
import { updateLeagueToDBWorker } from './workers/update-leagues-to-db.worker'
import { crawlListEventWorker } from './workers/crawl-list-event.worker'
import { updateEventToDBWorker } from './workers/update-events-to-db.worker'

@Service()
export class WorkerManager {
    private workers: Record<string, Worker> = {}

    addWorker(worker: Worker) {
        this.workers[worker.name] = worker
        return worker
    }

    async close() {
        await Promise.all(
            Object.values(this.workers).map((worker) => worker.close())
        )
    }
}

export const setupWorkers = () => {
    const workers = [
        crawlListLeagueWorker,
        updateLeagueToDBWorker,
        crawlListEventWorker,
        updateEventToDBWorker,
    ]
    workers.forEach((worker) => Container.get(WorkerManager).addWorker(worker))
}
