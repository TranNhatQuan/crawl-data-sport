import { AppDataSource } from '../../../database/connection'
import { Selection } from '../entities/selection.entity'

export const SelectionRepos = AppDataSource.getRepository(Selection).extend({})
