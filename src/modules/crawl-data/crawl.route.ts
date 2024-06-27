import { Router } from 'express'
import { Inject, Service } from 'typedi'
import { BaseRoute } from '../../app'
import { transformAndValidate } from '../../utils/validator'
import { CrawlController } from './crawl.controller'
import { CrawlLeagueReqDTO } from './dtos/crawl-league.dto'
import { CrawlEventReqDTO } from './dtos/crawl-event.dto'
import { CrawlDetailEventReqDTO } from './dtos/crawl-detail-event.dto'

@Service()
export class CrawlRoute implements BaseRoute {
    route?: string = 'crawl'

    router: Router = Router()

    constructor(@Inject() private crawlController: CrawlController) {
        this.initRoutes()
    }
    private initRoutes() {
        this.router.get(
            '/leagues',
            transformAndValidate(CrawlLeagueReqDTO),
            this.crawlController.getListLeague.bind(this.crawlController)
        )

        this.router.get(
            '/events',
            transformAndValidate(CrawlEventReqDTO),
            this.crawlController.getListEvent.bind(this.crawlController)
        )

        this.router.get(
            '/detail',
            transformAndValidate(CrawlDetailEventReqDTO),
            this.crawlController.getDetailEvent.bind(this.crawlController)
        )
    }
}
