import { MarketFromPriceKineticsDTO } from '../../crawl-data/dtos/market-from-price-kinetics.dto'

export interface MarketDataFromCrawlDTO {
    markets: MarketFromPriceKineticsDTO[]
    eventId: string
    marketTrending: string
}
