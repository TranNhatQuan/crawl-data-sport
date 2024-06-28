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

    async updateDataFormPriceKineticToDB(data: EventDataFromCrawlDTO) {
        const { events, leagueId } = data
        if (events.length == 0) return leagueId + ' = []'
        const league = await this.leagueService.getLeague({ leagueId })
        if (!league) throw Errors.LeagueNotFound
        const eventsDB = await this.getListEventByLeague({ leagueId })
        const eventsDBSet = new Set(eventsDB.map((event) => event.eventId))
        const chunkSize = 20
        const chunks = []
        for (let i = 0; i < events.length; i += chunkSize) {
            chunks.push(events.slice(i, i + chunkSize))
        }
        for (const chunk of chunks) {
            const promises = chunk.map((event: EventFromPriceKineticsDTO) => {
                if (eventsDBSet.has(event.eventId)) {
                    if (event.startedAt) {
                        const { eventId, startedAt } = event
                        return EventRepos.updateEvent({
                            eventId,
                            startedAt,
                        }).catch((error) => {
                            console.log(
                                `Error update event: ${event.eventId}, Error: ${error}`
                            )
                            return
                        })
                    }
                } else {
                    const {
                        eventId,
                        finishedAt,
                        leagueId,
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
                    }).catch((error) => {
                        console.log(
                            `Error update event: ${event.eventId}, Error: ${error}`
                        )
                        return
                    })
                }
            })
            await Promise.all(promises)
        }
        return true
    }

    async addJobUpdateLeague(data: CrawlEventDTO) {
        const { sportId, leagueId, leagueName } = data
        let events: EventFromPriceKineticsDTO[] = []
        try {
            events = await this.crawlListEventByLeague({
                leagueId,
                leagueName,
                sportId,
            })
        } catch (error) {
            console.log(error + ' of' + leagueName)
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
                return this.addJobUpdateLeague({
                    leagueName: league.name,
                    leagueId: league.leagueId,
                    sportId: league.sportId,
                })
            })
            await Promise.all(promises)
        }

        return true
    }
}
