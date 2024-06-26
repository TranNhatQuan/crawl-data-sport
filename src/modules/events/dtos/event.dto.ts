import { Expose } from 'class-transformer'
import { BaseDTO } from '../../../base/base.dto'
import { MarketDTO } from '../../markets/dtos/market.dto'

export class EventDTO extends BaseDTO {
    @Expose()
    eventId: string

    @Expose()
    leagueId: number

    @Expose()
    title: string

    @Expose()
    startTime: Date

    @Expose()
    startedAt: Date

    @Expose()
    finishedAt: Date

    @Expose()
    enabled: boolean

    marketTrending: MarketDTO
}
