import { Expose } from 'class-transformer'
import { BaseDTO } from '../../../base/base.dto'

export class SelectionDTO extends BaseDTO {
    @Expose()
    marketId: number

    @Expose()
    name: string

    @Expose()
    role: string

    @Expose()
    winPrice: number

    @Expose()
    enabled: boolean
}
