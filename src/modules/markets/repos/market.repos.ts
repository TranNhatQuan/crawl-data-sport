import { plainToInstance } from 'class-transformer'
import {
    AppDataSource,
    createQuery,
    DBSource,
} from '../../../database/connection'
import { MarketGetListByEventDTO } from '../dtos/market-get-list-by-event.dto'
import { Market } from '../entities/market.entity'
import { MarketDTO } from '../dtos/market.dto'
import { MarketFromPriceKineticsDTO } from '../../crawl-data/dtos/market-from-price-kinetics.dto'
import { EntityManager } from 'typeorm'

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
                .from(Market, 'c')
                .where('c.eventId = :eventId', { eventId })
                .getRawMany()
            return plainToInstance(MarketDTO, plan, {
                excludeExtraneousValues: true,
            })
        })
    },

    async addMarket(data: MarketFromPriceKineticsDTO, manager: EntityManager) {
        const { marketType, name, startTime } = data
    },

    async updateMarket(data: )
})
