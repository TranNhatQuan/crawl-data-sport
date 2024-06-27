import { Expose, plainToInstance, Transform } from 'class-transformer'
import { SelectionFromPriceKineticsDTO } from './selection-from-price-kinetics.dto'

export class MarketFromPriceKineticsDTO {
    @Expose()
    @Transform((value) => {
        return value.obj?.Name
    })
    name: string

    @Expose()
    @Transform((value) => {
        return new Date(value.obj?.StartTime)
    })
    startTime: Date

    @Expose()
    @Transform((value) => {
        return value.obj?.MarketType
    })
    marketType: string

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
    seletions: SelectionFromPriceKineticsDTO[]
}
