import { Expose, plainToInstance, Transform } from 'class-transformer'
import { SelectionFromPriceKineticsDTO } from './selection-from-price-kinetics.dto'

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
        const data = value.obj?.Selections || []
        if (Array.isArray(data)) {
            return plainToInstance(SelectionFromPriceKineticsDTO, data, {
                excludeExtraneousValues: true,
            })
        } else {
            return []
        }
    })
    selections: SelectionFromPriceKineticsDTO[]

    leagueId: number
}
