import { Inject, Service } from 'typedi'
import { CrawlService } from '../crawl-data/crawl.service'
import { QueueManager, QueueName } from '../../queues/queues'
import { EventService } from '../events/event.service'
import { CrawlDetailEventDTO } from '../crawl-data/dtos/crawl-detail-event.dto'
import { MarketGetListByEventDTO } from './dtos/market-get-list-by-event.dto'
import { MarketRepos } from './repos/market.repos'
import { MarketDataFromCrawlDTO } from './dtos/market-data-from-crawl.dto'
import { EventDTO } from '../events/dtos/event.dto'
import { MarketFromPriceKineticsDTO } from '../crawl-data/dtos/market-from-price-kinetics.dto'

@Service()
export class MarketService {
    constructor(
        @Inject() private crawlService: CrawlService,
        @Inject() private eventService: EventService,
        @Inject() private queueManager: QueueManager
    ) {}

    async crawlListMarket(data: CrawlDetailEventDTO) {
        const { eventId } = data
        const { markets, marketTrending } =
            await this.crawlService.crawlDetailEvent({
                eventId,
            })
        return { eventId, markets, marketTrending }
    }

    async getListMarketFromEvent(data: MarketGetListByEventDTO) {
        const marketsDB = await MarketRepos.getListMarketsByEventId(data)
        return marketsDB
    }

    async updateDataMarketsFromPriceKineticToDB(data: MarketDataFromCrawlDTO) {
        const { eventId, marketTrending, markets } = data
        if (markets.length == 0) return eventId + ' = []'
        const marketDB = await this.getListMarketFromEvent({ eventId })
        const chunkSize = 20
        if (marketDB.length == 0) {
            const chunks = []
            for (let i = 0; i < markets.length; i += chunkSize) {
                chunks.push(markets.slice(i, i + chunkSize))
            }
            for (const chunk of chunks) {
                const promises = chunk.map(
                    (market: MarketFromPriceKineticsDTO) => {
                        //add market
                    }
                )
                await Promise.all(promises)
            }
        } else {
            const marketsDBSet = new Set(marketDB.map((market) => market.name))
            const chunks = []
            for (let i = 0; i < markets.length; i += chunkSize) {
                chunks.push(markets.slice(i, i + chunkSize))
            }
            for (const chunk of chunks) {
                const promises = chunk.map(
                    (market: MarketFromPriceKineticsDTO) => {
                        if (marketsDBSet.has(market.name)) {
                            marketsDBSet.delete(market.name)
                        } else {
                            //add market
                        }
                    }
                )
                await Promise.all(promises)
            }
        }

        return
    }

    async addJobUpdateMarket(data: CrawlDetailEventDTO) {
        const { eventId } = data
        let dataMarketsFromCrawl: MarketDataFromCrawlDTO
        try {
            dataMarketsFromCrawl = await this.crawlListMarket(data)
        } catch (error) {
            console.log(error + ' of ' + eventId)
            return
        }
        return this.queueManager
            .getQueue(QueueName.updateMarketToDB)
            .add(QueueName.updateMarketToDB, dataMarketsFromCrawl)
    }

    async scanEventsAndCrawlMarket() {
        const list = await this.eventService.getListEvent()
        const chunkSize = 10
        const chunks = []
        for (let i = 0; i < list.length; i += chunkSize) {
            chunks.push(list.slice(i, i + chunkSize))
        }
        for (const chunk of chunks) {
            const promises = chunk.map((event: EventDTO) => {
                return this.addJobUpdateMarket({ eventId: event.eventId })
            })
            await Promise.all(promises)
        }

        return true
    }

    async addMarket(data: MarketFromPriceKineticsDTO) {
        //add market
        return data
    }
}
