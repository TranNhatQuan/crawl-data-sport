import { Service } from 'typedi'
import { SportRepos } from './repos/sport.repos'

@Service()
export class SportService {
    async getListSport() {
        const sports = await SportRepos.getListSports()
        return sports
    }
}
