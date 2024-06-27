import { Service } from 'typedi'
import { SportRepos } from './repos/sport.repos'
import { SportGeTDTO } from './dtos/sport-get.dto'

@Service()
export class SportService {
    async getListSport() {
        const sports = await SportRepos.getListSports()
        return sports
    }

    async getSport(data: SportGeTDTO) {
        const sport = await SportRepos.getSport(data)
        return sport
    }
}
