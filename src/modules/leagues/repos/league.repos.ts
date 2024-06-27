import { plainToInstance } from 'class-transformer'
import {
    AppDataSource,
    createQuery,
    DBSource,
    startTransaction,
} from '../../../database/connection'
import { LeagueDTO } from '../dtos/league.dto'
import { League } from '../entities/league.entity'
import { EntityManager } from 'typeorm'
import { LeagueFromPriceKineticsDTO } from '../../crawl-data/dtos/league-from-price-kinetics.dto'
import { LaegueUpdateDTO } from '../dtos/league-update.dto'
import { LaegueGetListBySportDTO } from '../dtos/league-get-list-by-sport.dto'

export const LeagueRepos = AppDataSource.getRepository(League).extend({
    async getListLeagues(db: DBSource = 'slave') {
        return createQuery(db, async (manager) => {
            const plan = await manager
                .createQueryBuilder()
                .select()
                .from(League, 'c')
                .where('c.enabled = :enabled', { enabled: true })
                .getRawMany()
            return plainToInstance(LeagueDTO, plan, {
                excludeExtraneousValues: true,
            })
        })
    },

    async getListLeaguesBySportId(
        data: LaegueGetListBySportDTO,
        db: DBSource = 'slave'
    ) {
        const { sportId } = data
        return createQuery(db, async (manager) => {
            const plan = await manager
                .createQueryBuilder()
                .select()
                .from(League, 'c')
                .where('c.sportId = :sportId', { sportId })
                .getRawMany()
            return plainToInstance(LeagueDTO, plan, {
                excludeExtraneousValues: true,
            })
        })
    },

    async addLeague(data: LeagueFromPriceKineticsDTO) {
        const { name, sportId } = data
        startTransaction(async (manager) => {
            await manager.insert(League, { name, sportId })
        })
    },

    async updateLeague(data: LaegueUpdateDTO) {
        const { leagueId, enabled } = data
        startTransaction(async (manager) => {
            await manager.update(League, { leagueId }, { enabled })
        })
    },
})
