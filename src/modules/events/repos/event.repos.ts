import { AppDataSource } from '../../../database/connection'
import { Event } from '../entities/event.entity'

export const EventRepos = AppDataSource.getRepository(Event).extend({})
