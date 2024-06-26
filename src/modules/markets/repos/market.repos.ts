import { AppDataSource } from '../../../database/connection'
import { Market } from '../entities/market.entity'

export const MarketRepos = AppDataSource.getRepository(Market).extend({})
