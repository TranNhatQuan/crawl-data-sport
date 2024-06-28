import { EventFromPriceKineticsDTO } from '../../crawl-data/dtos/event-from-price-kinetics.dto'

export interface EventDataFromCrawlDTO {
    events: EventFromPriceKineticsDTO[]
    leagueId: number
}
