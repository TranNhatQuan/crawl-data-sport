import { Expose } from 'class-transformer'
import { BaseDTO } from '../../../base/base.dto'

export class SportDTO extends BaseDTO {
    @Expose()
    sportId: string

    @Expose()
    name: string

    @Expose()
    enabled: boolean
}
