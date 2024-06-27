import axios from 'axios'
import { Inject, Service } from 'typedi'
import { CrawlLeagueDTO, CrawlLeagueReqDTO } from './dtos/crawl-league.dto'
import { Config } from '../../configs'
import { Errors } from '../../utils/error'
import { plainToInstance } from 'class-transformer'
import { LeagueFromPriceKineticsDTO } from './dtos/league-from-price-kinetics.dto'
import { filterDuplicates } from '../../utils'
import { CrawlEventDTO, CrawlEventReqDTO } from './dtos/crawl-event.dto'
import { EventFromPriceKineticsDTO } from './dtos/event-from-price-kinetics.dto'
import {
    CrawlDetailEventDTO,
    CrawlDetailEventReqDTO,
} from './dtos/crawl-detail-event.dto'
import { MarketFromPriceKineticsDTO } from './dtos/market-from-price-kinetics.dto'

enum typeCrawl {
    summary = 'summary',
    detail = 'detail',
}

@Service()
export class CrawlService {
    constructor(@Inject() private config: Config) {}

    async getListLeague(data: CrawlLeagueReqDTO) {
        const { sportId } = data
        const days = 10
        const url =
            this.config.sourceCrawl +
            '/' +
            typeCrawl.summary +
            '/' +
            sportId +
            '?api_key=' +
            this.config.apiKeySourceCrawl +
            '&days=' +
            days
        const response = await axios.get(url)
        if (!response || !response.data || !response.data.Success) {
            throw Errors.crawlError
        }
        const events = response.data.Events
        if (Array.isArray(events)) {
            const leagues = plainToInstance(
                LeagueFromPriceKineticsDTO,
                events,
                {
                    excludeExtraneousValues: true,
                }
            )
            return filterDuplicates(leagues)
        } else {
            throw Errors.crawlError
        }
    }

    async getListEventByLeague(data: CrawlEventReqDTO) {
        const { sportId, league } = data
        const days = 10
        const url =
            this.config.sourceCrawl +
            '/' +
            typeCrawl.summary +
            '/' +
            sportId +
            '?api_key=' +
            this.config.apiKeySourceCrawl +
            '&days=' +
            days +
            '&league=' +
            league
        const response = await axios.get(url)
        //console.log(response)
        if (!response || !response.data || !response.data.Success) {
            throw Errors.crawlError
        }
        const events = response.data.Events
        if (Array.isArray(events)) {
            const leagues = plainToInstance(EventFromPriceKineticsDTO, events, {
                excludeExtraneousValues: true,
            })
            return leagues
        } else {
            throw Errors.crawlError
        }
    }

    async getDetailEventByLeague(data: CrawlDetailEventReqDTO) {
        const { eventId } = data
        const days = 10
        const url =
            this.config.sourceCrawl +
            '/' +
            typeCrawl.detail +
            '/' +
            eventId +
            '?api_key=' +
            this.config.apiKeySourceCrawl +
            '&days=' +
            days
        const response = await axios.get(url)
        if (!response || !response.data || !response.data.Success) {
            throw Errors.crawlError
        }
        const markets = response.data.Event.Markets
        if (Array.isArray(markets)) {
            const leagues = plainToInstance(
                MarketFromPriceKineticsDTO,
                markets,
                {
                    excludeExtraneousValues: true,
                }
            )
            return leagues
        } else {
            throw Errors.crawlError
        }
    }

    async crawlListEventByLeague(data: CrawlEventDTO) {
        const { sportId, league } = data
        const days = 10
        const url =
            this.config.sourceCrawl +
            '/' +
            typeCrawl.summary +
            '/' +
            sportId +
            '?api_key=' +
            this.config.apiKeySourceCrawl +
            '&days=' +
            days +
            '&league=' +
            league
        const response = await axios.get(url)
        //console.log(response)
        if (!response || !response.data || !response.data.Success) {
            throw Errors.crawlError
        }
        const events = response.data.Events
        if (Array.isArray(events)) {
            const leagues = plainToInstance(EventFromPriceKineticsDTO, events, {
                excludeExtraneousValues: true,
            })
            return leagues
        } else {
            throw Errors.crawlError
        }
    }

    async crawlDetailEventByLeague(data: CrawlDetailEventDTO) {
        const { eventId } = data
        const days = 10
        const url =
            this.config.sourceCrawl +
            '/' +
            typeCrawl.detail +
            '/' +
            eventId +
            '?api_key=' +
            this.config.apiKeySourceCrawl +
            '&days=' +
            days
        const response = await axios.get(url)
        if (!response || !response.data || !response.data.Success) {
            throw Errors.crawlError
        }
        const markets = response.data.Event.Markets
        if (Array.isArray(markets)) {
            const leagues = plainToInstance(
                MarketFromPriceKineticsDTO,
                markets,
                {
                    excludeExtraneousValues: true,
                }
            )
            return leagues
        } else {
            throw Errors.crawlError
        }
    }

    async crawlListLeague(data: CrawlLeagueDTO) {
        const { sportId } = data
        const days = 10
        const response = await axios.get(
            this.config.sourceCrawl +
                '/' +
                typeCrawl.summary +
                '/' +
                sportId +
                '?api_key=' +
                this.config.apiKeySourceCrawl +
                '&days=' +
                days
        )
        if (!response || !response.data || !response.data.Success) {
            throw Errors.crawlError
        }
        const events = response.data.Events
        if (Array.isArray(events)) {
            const leagues = plainToInstance(
                LeagueFromPriceKineticsDTO,
                events,
                {
                    excludeExtraneousValues: true,
                }
            )
            return filterDuplicates(leagues)
        } else {
            throw Errors.crawlError
        }
    }
}
