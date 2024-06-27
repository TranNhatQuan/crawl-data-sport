import { Inject, Service } from 'typedi'
import { CrawlService } from '../crawl-data/crawl.service'
import { CrawlLeagueDTO } from '../crawl-data/dtos/crawl-league.dto'

@Service()
export class LeagueService {
    constructor(@Inject() private crawlService: CrawlService) {}

    async crawlListLeague(data: CrawlLeagueDTO) {
        const { sportId } = data
        const leagues = await this.crawlService.crawlListLeague({
            sportId,
        })
        return leagues
    }
}
