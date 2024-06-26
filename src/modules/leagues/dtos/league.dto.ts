import { Expose } from 'class-transformer'
import { BaseDTO } from '../../../base/base.dto'

export class LeagueDTO extends BaseDTO {
    @Expose()
    leagueId: number

    @Expose()
    name: string

    @Expose()
    sportId: string

    @Expose()
    enabled: boolean
}
