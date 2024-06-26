import { Expose } from 'class-transformer'
import { BaseDTO } from '../../../base/base.dto'
import { SelectionDTO } from './selection.dto'

export class MarketDTO extends BaseDTO {
    @Expose()
    marketId: number

    @Expose()
    eventId: string

    @Expose()
    marketType: string

    @Expose()
    name: string

    @Expose()
    startTime: Date

    @Expose()
    enabled: boolean

    @Expose()
    isTrending: boolean

    selections: SelectionDTO[]
}
