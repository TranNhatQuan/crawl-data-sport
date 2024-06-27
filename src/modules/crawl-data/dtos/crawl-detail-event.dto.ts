import { Expose } from 'class-transformer'
import { IsString } from 'class-validator'
import { DataReqDTO } from '../../../base/base.dto'

export interface CrawlDetailEventDTO {
    eventId: string
}

export class CrawlDetailEventReqDTO
    extends DataReqDTO
    implements CrawlDetailEventDTO
{
    @Expose()
    @IsString()
    eventId: string
}
