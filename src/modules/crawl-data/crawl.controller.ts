import { NextFunction, Response } from 'express'
import { Inject, Service } from 'typedi'
import { DataRequest } from '../../base/base.request'
import { ResponseWrapper } from '../../utils/response'
import { CrawlService } from './crawl.service'
import { CrawlLeagueReqDTO } from './dtos/crawl-league.dto'
import { CrawlEventReqDTO } from './dtos/crawl-event.dto'
import { CrawlDetailEventReqDTO } from './dtos/crawl-detail-event.dto'

@Service()
export class CrawlController {
    constructor(@Inject() private crawlService: CrawlService) {}

    async getListLeague(
        req: DataRequest<CrawlLeagueReqDTO>,
        res: Response,
        next: NextFunction
    ) {
        try {
            const data = await this.crawlService.getListLeague(req.data)
            res.send(new ResponseWrapper(data))
        } catch (err) {
            next(err)
        }
    }

    async getListEvent(
        req: DataRequest<CrawlEventReqDTO>,
        res: Response,
        next: NextFunction
    ) {
        try {
            const data = await this.crawlService.getListEventByLeague(req.data)
            res.send(new ResponseWrapper(data))
        } catch (err) {
            next(err)
        }
    }

    async getDetailEvent(
        req: DataRequest<CrawlDetailEventReqDTO>,
        res: Response,
        next: NextFunction
    ) {
        try {
            const data = await this.crawlService.getDetailEventByLeague(
                req.data
            )
            res.send(new ResponseWrapper(data))
        } catch (err) {
            next(err)
        }
    }
}
