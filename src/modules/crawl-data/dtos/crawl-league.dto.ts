import { Expose } from 'class-transformer'
import { IsString } from 'class-validator'
import { DataReqDTO } from '../../../base/base.dto'

export interface CrawlLeagueDTO {
    sportId: string
}

export class CrawlLeagueReqDTO extends DataReqDTO implements CrawlLeagueDTO {
    @Expose()
    @IsString()
    sportId: string
}
