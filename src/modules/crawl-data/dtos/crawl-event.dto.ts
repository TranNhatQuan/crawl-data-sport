import { Expose } from 'class-transformer'
import { IsNumber, IsString } from 'class-validator'
import { DataReqDTO } from '../../../base/base.dto'

export interface CrawlEventDTO {
    sportId: string
    leagueName: string
    leagueId: number
}

export class CrawlEventReqDTO extends DataReqDTO implements CrawlEventDTO {
    @Expose()
    @IsString()
    sportId: string

    @Expose()
    @IsString()
    leagueName: string

    @Expose()
    @IsNumber()
    leagueId: number
}
