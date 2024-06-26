import { AppDataSource } from '../../../database/connection'
import { League } from '../entities/league.entity'

export const LeagueRepos = AppDataSource.getRepository(League).extend({})
