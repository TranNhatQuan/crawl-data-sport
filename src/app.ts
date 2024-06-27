import { ClassConstructor } from 'class-transformer'
import cors from 'cors'
import express, {
    json,
    NextFunction,
    Request,
    Response,
    Router,
    urlencoded,
} from 'express'
import expressBasicAuth from 'express-basic-auth'
import helmet from 'helmet'
import morgan from 'morgan'
import 'reflect-metadata'
import Container from 'typedi'
import { Config, validateEnv } from './configs'
import { AppDataSource } from './database/connection'
import { QueueManager, setupCronJob, setupQueues } from './queues/queues'
import { setupWorkers } from './queues/workers'
import { handleError } from './utils/error'
import { logger } from './utils/logger'

export interface BaseRoute {
    route?: string
    router: Router
}

export interface AppRoute {
    version?: string
    groups?: {
        group?: string
        routes: ClassConstructor<BaseRoute>[]
    }[]
    routes?: ClassConstructor<BaseRoute>[]
}

export class App {
    private app = express()

    constructor(private config: Config, routes: AppRoute[]) {
        this.initMiddlewares()
        this.initRoutes(routes)
    }

    private initMiddlewares() {
        // cross-origin resource sharing
        this.app.use(cors())

        // http headers to improve security
        this.app.use(helmet())

        // body parser
        this.app.use(json())
        this.app.use(urlencoded({ extended: true }))

        // http request logger
        this.app.use(
            morgan('short', {
                skip: (req) => {
                    return (
                        req.url.startsWith('/api/queues') ||
                        req.url.startsWith('/admin/queues') ||
                        req.url.startsWith('/healthcheck')
                    )
                },
            })
        )
    }

    private initRoutes(routes: AppRoute[]) {
        routes.forEach((route) => {
            let path = '/'
            if (route.version) {
                path += route.version + '/'
            }
            // init group routes
            route.groups?.forEach((group) => {
                group.routes.forEach((clsRoute) => {
                    const route = Container.get(clsRoute)
                    let routePath = path
                    if (group.group) {
                        routePath += group.group + '/'
                    }
                    routePath += route.route ?? ''
                    this.app.use(routePath, route.router)
                })
            })

            // init routes
            route.routes?.forEach((clsRoute) => {
                const route = Container.get(clsRoute)
                const routePath = path + (route.route ?? '')
                this.app.use(routePath, route.router)
            })
        })

        // error handler
        this.app.use(
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            (err: Error, req: Request, res: Response, next: NextFunction) => {
                handleError(err, res)
            }
        )
    }

    async start() {
        const start = Date.now()

        validateEnv(this.config)
        await Promise.all([AppDataSource.initialize()])
        setupQueues()
        setupWorkers()
        setupCronJob()

        this.app.use(
            '/admin/queues',
            expressBasicAuth({
                challenge: true,
                users: { admin: this.config.basicAuthPassword },
            }),
            Container.get(QueueManager).createBoard().getRouter()
        )

        this.app.listen(this.config.port, () => {
            return logger.info(
                `Server is listening at port ${
                    this.config.port
                } - Elapsed time: ${(Date.now() - start) / 1000}s`
            )
        })

        process.on('uncaughtException', (err) => {
            logger.error(err)
        })

        process.on('unhandledRejection', (reason, promise) => {
            logger.error(
                `Unhandled Rejection at: Promise ${JSON.stringify({
                    promise,
                    reason,
                })}`
            )
        })
    }
}
