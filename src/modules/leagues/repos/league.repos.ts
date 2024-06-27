import { plainToInstance } from 'class-transformer'
import {
    AppDataSource,
    createQuery,
    DBSource,
} from '../../../database/connection'
import { LeagueDTO } from '../dtos/league.dto'
import { League } from '../entities/league.entity'

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
})
