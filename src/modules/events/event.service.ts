import { Inject, Service } from 'typedi'
import { CrawlService } from '../crawl-data/crawl.service'
import { QueueManager, QueueName } from '../../queues/queues'
import { Errors } from '../../utils/error'
import { CrawlEventDTO } from '../crawl-data/dtos/crawl-event.dto'
import { EventGetListByLeague } from './dtos/event-get-list-by-league.dto'
import { EventRepos } from './repos/event.repos'
import { EventDataFromCrawlDTO } from './dtos/event-data-from-crawl.dto'
import { LeagueService } from '../leagues/leagues.service'
import { LeagueDTO } from '../leagues/dtos/league.dto'
import { EventFromPriceKineticsDTO } from '../crawl-data/dtos/event-from-price-kinetics.dto'
import { EventUpdateDTO } from './dtos/event-update.dto'

@Service()
export class EventService {
    constructor(
        @Inject() private crawlService: CrawlService,
        @Inject() private leagueService: LeagueService,
        @Inject() private queueManager: QueueManager
    ) {}

    async crawlListEventByLeague(data: CrawlEventDTO) {
        const { leagueName, sportId, leagueId } = data
        const leagues = await this.crawlService.crawlListEventByLeague({
            leagueName,
            sportId,
            leagueId,
        })
        return leagues
    }

    async getListEventByLeague(data: EventGetListByLeague) {
        const leaguesDB = await EventRepos.getListEventsByLeague(data)
        return leaguesDB
    }

    async getListEvent() {
        const eventsDB = await EventRepos.getListEvents()
        return eventsDB
    }

    async updateDataEventsFromPriceKineticToDB(data: EventDataFromCrawlDTO) {
        const { events, leagueId } = data
        if (events.length == 0) return leagueId + ' = []'
        const league = await this.leagueService.getLeague({ leagueId })
        if (!league) throw Errors.LeagueNotFound
        const eventsDB = await this.getListEventByLeague({ leagueId })
        const chunkSize = 20
        if (eventsDB.length == 0) {
            const chunks = []
            for (let i = 0; i < events.length; i += chunkSize) {
                chunks.push(events.slice(i, i + chunkSize))
            }
            for (const chunk of chunks) {
                const promises = chunk.map(
                    (event: EventFromPriceKineticsDTO) => {
                        if (event.bettingStatus == 'BettingOpen') {
                            const {
                                eventId,
                                finishedAt,
                                marketTrending,
                                selections,
                                startTime,
                                startedAt,
                                title,
                            } = event
                            return EventRepos.addEvent({
                                eventId,
                                finishedAt,
                                leagueId,
                                marketTrending,
                                selections,
                                startTime,
                                startedAt,
                                title,
                            })
                        }
                    }
                )
                await Promise.all(promises)
            }
            return true
        } else {
            const eventsDBSet = new Set(eventsDB.map((event) => event.eventId))
            const chunks = []
            for (let i = 0; i < events.length; i += chunkSize) {
                chunks.push(events.slice(i, i + chunkSize))
            }
            for (const chunk of chunks) {
                const promises = chunk.map(
                    (event: EventFromPriceKineticsDTO) => {
                        if (eventsDBSet.has(event.eventId)) {
                            eventsDBSet.delete(event.eventId)
                        } else {
                            if (event.bettingStatus == 'BettingOpen') {
                                const {
                                    eventId,
                                    finishedAt,
                                    marketTrending,
                                    selections,
                                    startTime,
                                    startedAt,
                                    title,
                                } = event
                                return EventRepos.addEvent({
                                    eventId,
                                    finishedAt,
                                    leagueId,
                                    marketTrending,
                                    selections,
                                    startTime,
                                    startedAt,
                                    title,
                                })
                            } else {
                                return EventRepos.updateEvent({
                                    eventId: event.eventId,
                                    enabled: false,
                                })
                            }
                        }
                    }
                )
                await Promise.all(promises)
            }
            const remainingEventDB = Array.from(eventsDBSet)
            if (remainingEventDB.length == 0) return true
            const newChunks: string[][] = []
            for (let i = 0; i < remainingEventDB.length; i += chunkSize) {
                newChunks.push(remainingEventDB.slice(i, i + chunkSize))
            }
            for (const chunk of newChunks) {
                const promises = chunk.map((eventId: string) => {
                    return EventRepos.updateEvent({
                        eventId,
                        enabled: false,
                    })
                })
                await Promise.all(promises)
            }
            return true
        }
    }

    async addJobUpdateEvent(data: CrawlEventDTO) {
        const { sportId, leagueId, leagueName } = data
        let events: EventFromPriceKineticsDTO[] = []
        try {
            events = await this.crawlListEventByLeague({
                leagueId,
                leagueName,
                sportId,
            })
        } catch (error) {
            console.log(error + ' of ' + leagueName)
            return
        }
        return this.queueManager
            .getQueue(QueueName.updateEventToDB)
            .add(QueueName.updateEventToDB, {
                leagueId,
                events,
            })
    }

    async scanLeaguesAndCrawlEvent() {
        const list = await this.leagueService.getListLeague()
        const chunkSize = 10
        const chunks = []
        for (let i = 0; i < list.length; i += chunkSize) {
            chunks.push(list.slice(i, i + chunkSize))
        }
        for (const chunk of chunks) {
            const promises = chunk.map((league: LeagueDTO) => {
                return this.addJobUpdateEvent({
                    leagueName: league.name,
                    leagueId: league.leagueId,
                    sportId: league.sportId,
                })
            })
            await Promise.all(promises)
        }
        return true
    }

    async setMarketTrending(data: EventUpdateDTO) {
        const { eventId, marketTrending } = data
        await EventRepos.updateEvent({
            eventId,
            marketTrending,
        })
        return true
    }
}
