import { Router } from 'express'
import { Service } from 'typedi'
import { BaseRoute } from '../../app'

@Service()
export class HealthRoute implements BaseRoute {
    route?: string = 'healthcheck'
    router: Router = Router()

    constructor() {
        this.router.get('/', (req, res) => {
            res.send('Server is running')
        })
    }
}
