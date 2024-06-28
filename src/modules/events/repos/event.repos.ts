import { plainToInstance } from 'class-transformer'
import {
    AppDataSource,
    createQuery,
    DBSource,
    startTransaction,
} from '../../../database/connection'
import { EventDTO } from '../dtos/event.dto'
import { Event } from '../entities/event.entity'
import { EventFromPriceKineticsDTO } from '../../crawl-data/dtos/event-from-price-kinetics.dto'
import { EventUpdateDTO } from '../dtos/event-update.dto'

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
    async addEvent(data: EventFromPriceKineticsDTO) {
        const { eventId, finishedAt, startTime, startedAt, title, leagueId } =
            data
        startTransaction(async (manager) => {
            await manager.insert(Event, {
                eventId,
                leagueId,
                finishedAt,
                startTime,
                startedAt,
                title,
            })
        })
    },

    async updateEvent(data: EventUpdateDTO) {
        const { eventId, finishedAt, startedAt, enabled } = data
        startTransaction(async (manager) => {
            await manager.update(
                Event,
                { eventId },
                { enabled, finishedAt, startedAt }
            )
        })
    },
})
