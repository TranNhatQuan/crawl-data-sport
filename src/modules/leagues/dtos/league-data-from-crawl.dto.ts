import { LeagueFromPriceKineticsDTO } from '../../crawl-data/dtos/league-from-price-kinetics.dto'

export interface LeagueDataFromCrawlDTO {
    leagues: LeagueFromPriceKineticsDTO[]
    sportId: string
}
