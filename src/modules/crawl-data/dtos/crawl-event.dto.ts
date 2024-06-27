import { Expose } from 'class-transformer'
import { IsString } from 'class-validator'
import { DataReqDTO } from '../../../base/base.dto'

export interface CrawlEventDTO {
    sportId: string
    league: string
}

export class CrawlEventReqDTO extends DataReqDTO implements CrawlEventDTO {
    @Expose()
    @IsString()
    sportId: string

    @Expose()
    @IsString()
    league: string
}
