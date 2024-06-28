import { Inject, Service } from 'typedi'
import { CrawlService } from '../crawl-data/crawl.service'
import { CrawlLeagueDTO } from '../crawl-data/dtos/crawl-league.dto'
import { SportService } from '../sports/sport.service'
import { QueueManager, QueueName } from '../../queues/queues'
import { SportDTO } from '../sports/dtos/sport.dto'
import { LeagueRepos } from './repos/league.repos'
import { LeagueGetListBySportDTO } from './dtos/league-get-list-by-sport.dto'
import { LeagueDataFromCrawlDTO } from './dtos/league-data-from-crawl.dto'
import { Errors } from '../../utils/error'
import { LeagueDTO } from './dtos/league.dto'
import { LeagueFromPriceKineticsDTO } from '../crawl-data/dtos/league-from-price-kinetics.dto'
import { LeagueGetDTO } from './dtos/league-get.dto'

@Service()
export class LeagueService {
    constructor(
        @Inject() private crawlService: CrawlService,
        @Inject() private sportService: SportService,
        @Inject() private queueManager: QueueManager
    ) {}

    async crawlListLeague(data: CrawlLeagueDTO) {
        const { sportId } = data
        const leagues = await this.crawlService.crawlListLeague({
            sportId,
        })
        return leagues
    }

    async getListLeagueBySport(data: LeagueGetListBySportDTO) {
        const leaguesDB = await LeagueRepos.getListLeaguesBySportId(data)
        return leaguesDB
    }

    async getListLeague() {
        const leaguesDB = await LeagueRepos.getListLeagues()
        return leaguesDB
    }

    async getLeague(data: LeagueGetDTO) {
        const leaguesDB = await LeagueRepos.getLeague(data)
        return leaguesDB
    }

    async updateDataFormPriceKineticToDB(data: LeagueDataFromCrawlDTO) {
        const { leagues, sportId } = data
        if (leagues.length == 0) return sportId + ' = []'
        const sport = await this.sportService.getSport({ sportId })
        if (!sport) throw Errors.SportNotFound
        const leaguesDB = await this.getListLeagueBySport({ sportId })
        const leaguesSet = new Set(leagues.map((league) => league.name))
        const chunkSize = 20
        const chunks = []
        for (let i = 0; i < leaguesDB.length; i += chunkSize) {
            chunks.push(leaguesDB.slice(i, i + chunkSize))
        }
        for (const chunk of chunks) {
            const promises = chunk.map((league: LeagueDTO) => {
                if (leaguesSet.has(league.name)) {
                    if (!league.enabled) {
                        return LeagueRepos.updateLeague({
                            leagueId: league.leagueId,
                            enabled: true,
                        }).catch((error) => {
                            console.log(
                                `Error update league: ${league.name}, Error: ${error}`
                            )
                            return
                        })
                    }
                    leaguesSet.delete(league.name)
                } else {
                    if (league.enabled) {
                        return LeagueRepos.updateLeague({
                            leagueId: league.leagueId,
                            enabled: false,
                        }).catch((error) => {
                            console.log(
                                `Error update league: ${league.name}, Error: ${error}`
                            )
                            return
                        })
                    }
                }
            })
            await Promise.all(promises)
        }
        const remainingLeagues = Array.from(leaguesSet)
        if (remainingLeagues.length == 0) return true
        const newChunks: string[][] = []
        for (let i = 0; i < remainingLeagues.length; i += chunkSize) {
            newChunks.push(remainingLeagues.slice(i, i + chunkSize))
        }
        for (const chunk of newChunks) {
            const promises = chunk.map((leagueName: string) => {
                return LeagueRepos.addLeague({
                    name: leagueName,
                    sportId,
                }).catch((error) => {
                    console.log(
                        `Error adding league: ${leagueName}, Error: ${error}`
                    )
                    return null
                })
            })
            await Promise.all(promises)
        }
        return true
    }

    async addJobUpdateLeague(data: CrawlLeagueDTO) {
        const { sportId } = data
        let leagues: LeagueFromPriceKineticsDTO[] = []
        try {
            leagues = await this.crawlListLeague(data)
        } catch (error) {
            console.log(error + ' of' + sportId)
        }
        return this.queueManager
            .getQueue(QueueName.updateLeagueToDB)
            .add(QueueName.updateLeagueToDB, {
                sportId,
                leagues,
            })
    }

    async scanSportsAndCrawlLeague() {
        const list = await this.sportService.getListSport()
        const chunkSize = 10
        const chunks = []
        for (let i = 0; i < list.length; i += chunkSize) {
            chunks.push(list.slice(i, i + chunkSize))
        }

        for (const chunk of chunks) {
            const promises = chunk.map((sport: SportDTO) => {
                return this.addJobUpdateLeague({ sportId: sport.sportId })
            })
            await Promise.all(promises)
        }

        return true
    }
}
