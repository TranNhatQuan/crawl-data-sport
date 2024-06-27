import { plainToInstance } from 'class-transformer'
import {
    AppDataSource,
    createQuery,
    DBSource,
} from '../../../database/connection'
import { EventDTO } from '../dtos/event.dto'
import { Event } from '../entities/event.entity'

export const EventRepos = AppDataSource.getRepository(Event).extend({
    async getListEvents(db: DBSource = 'slave') {
        return createQuery(db, async (manager) => {
            const plan = await manager
                .createQueryBuilder()
                .select()
                .from(Event, 'c')
                .where('c.enabled = :enabled', { enabled: true })
                .getRawMany()
            return plainToInstance(EventDTO, plan, {
                excludeExtraneousValues: true,
            })
        })
    },
})
