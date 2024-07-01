import { plainToInstance } from 'class-transformer'
import {
    AppDataSource,
    createQuery,
    DBSource,
} from '../../../database/connection'
import { MarketGetListByEventDTO } from '../dtos/market-get-list-by-event.dto'
import { Market } from '../entities/market.entity'
import { EventDTO } from '../../events/dtos/event.dto'

export const MarketRepos = AppDataSource.getRepository(Market).extend({
    async getListMarketsByEventId(
        data: MarketGetListByEventDTO,
        db: DBSource = 'slave'
    ) {
        const { eventId } = data
        return createQuery(db, async (manager) => {
            const plan = await manager
                .createQueryBuilder()
                .select()
                .from(Event, 'c')
                .where('c.eventId = :eventId', { eventId })
                .getRawMany()
            return plainToInstance(EventDTO, plan, {
                excludeExtraneousValues: true,
            })
        })
    },
})
