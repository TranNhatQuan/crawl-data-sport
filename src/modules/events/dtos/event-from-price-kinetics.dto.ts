import { Expose, plainToInstance, Transform } from 'class-transformer'
import { MarketFromPriceKineticsDTO } from '../../markets/dtos/market-from-price-kinetics.dto'

export class EventFromPriceKineticsDTO {
    @Expose()
    @Transform((value) => {
        return value.obj?.EventID
    })
    eventId: string

    @Expose()
    @Transform((value) => {
        return value.obj?.EventTitle
    })
    title: string

    @Expose()
    @Transform((value) => {
        return new Date(value.obj?.StartTime)
    })
    startTime: Date

    @Expose()
    @Transform((value) => {
        return new Date(value.obj?.StartedAt)
    })
    startedAt: Date

    @Expose()
    @Transform((value) => {
        return new Date(value.obj?.finishedAt)
    })
    finishedAt: Date

    @Expose()
    @Transform((value) => {
        return value.obj?.PrimaryMarketName
    })
    marketTrending: string

    @Expose()
    @Transform((value) => {
        const data = value.obj?.Markets || []
        if (Array.isArray(data)) {
            return plainToInstance(MarketFromPriceKineticsDTO, data, {
                excludeExtraneousValues: true,
            })
        } else {
            return []
        }
    })
    markets: MarketFromPriceKineticsDTO[]
}
