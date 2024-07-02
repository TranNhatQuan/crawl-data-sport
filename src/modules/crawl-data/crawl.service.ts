import axios from 'axios'
import { Inject, Service } from 'typedi'
import { CrawlLeagueDTO } from './dtos/crawl-league.dto'
import { Config } from '../../configs'
import { Errors } from '../../utils/error'
import { plainToInstance } from 'class-transformer'
import { LeagueFromPriceKineticsDTO } from './dtos/league-from-price-kinetics.dto'
import { CrawlEventDTO } from './dtos/crawl-event.dto'
import { EventFromPriceKineticsDTO } from './dtos/event-from-price-kinetics.dto'
import { CrawlDetailEventDTO } from './dtos/crawl-detail-event.dto'
import { MarketFromPriceKineticsDTO } from './dtos/market-from-price-kinetics.dto'

enum typeCrawl {
    summary = 'summary',
    detail = 'detail',
}

@Service()
export class CrawlService {
    constructor(@Inject() private config: Config) {}

    async crawlListEventByLeague(data: CrawlEventDTO) {
        const { sportId, leagueName } = data
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
            encodeURIComponent(leagueName)
        const response = await axios.get(url)
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

    async crawlDetailEvent(data: CrawlDetailEventDTO) {
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
        const marketsFromCrawl = response.data.Event.Markets
        if (Array.isArray(marketsFromCrawl)) {
            const marketTrending = String(response.data.Event.PrimaryMarketName)
            const markets = plainToInstance(
                MarketFromPriceKineticsDTO,
                marketsFromCrawl,
                {
                    excludeExtraneousValues: true,
                }
            )
            return { markets, marketTrending }
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
            return leagues
        } else {
            throw Errors.crawlError
        }
    }
}
