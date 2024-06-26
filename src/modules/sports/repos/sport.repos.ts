import { plainToInstance } from 'class-transformer'
import {
    AppDataSource,
    createQuery,
    DBSource,
} from '../../../database/connection'
import { SportDTO } from '../dtos/sport.dto'
import { Sport } from '../entities/sport.entity'
import { SportGeTDTO } from '../dtos/sport-get.dto'

export const SportRepos = AppDataSource.getRepository(Sport).extend({
    async getListSports(db: DBSource = 'slave') {
        return createQuery(db, async (manager) => {
            const plan = await manager
                .createQueryBuilder()
                .select()
                .from(Sport, 'c')
                .where('c.enabled = :enabled', { enabled: true })
                .getRawMany()
            return plainToInstance(SportDTO, plan, {
                excludeExtraneousValues: true,
            })
        })
    },

    async getSport(data: SportGeTDTO, db: DBSource = 'slave') {
        const { sportId } = data
        return createQuery(db, async (manager) => {
            const plan = await manager
                .createQueryBuilder()
                .select()
                .from(Sport, 'c')
                .where('c.sportId = :sportId', { sportId })
                .getRawMany()
            return plainToInstance(SportDTO, plan, {
                excludeExtraneousValues: true,
            })
        })
    },
})
