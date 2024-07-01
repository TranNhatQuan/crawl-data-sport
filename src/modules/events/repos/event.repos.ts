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
import { EventGetListByLeague } from '../dtos/event-get-list-by-league.dto'

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

    async getListEventsByLeague(
        data: EventGetListByLeague,
        db: DBSource = 'slave'
    ) {
        const { leagueId } = data
        return createQuery(db, async (manager) => {
            const plan = await manager
                .createQueryBuilder()
                .select()
                .from(Event, 'c')
                .where('c.leagueId = :leagueId and c.enabled = :enabled', {
                    leagueId,
                    enabled: true,
                })
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
            await manager
                .insert(Event, {
                    eventId,
                    leagueId,
                    finishedAt,
                    startTime,
                    startedAt,
                    title,
                })
                .catch((error) => {
                    if (error.code === 'ER_DUP_ENTRY') {
                        return this.updateEvent({
                            eventId,
                            enabled: true,
                        })
                    }
                    console.log(
                        `Error adding event: ${eventId}, Error: ${error}`
                    )
                    return
                })
        })
    },

    async updateEvent(data: EventUpdateDTO) {
        const { eventId, finishedAt, startedAt, enabled } = data
        startTransaction(async (manager) => {
            await manager
                .update(Event, { eventId }, { enabled, finishedAt, startedAt })
                .catch((error) => {
                    console.log(
                        `Error update event: ${eventId}, Error: ${error}`
                    )
                    return
                })
        })
    },
})
