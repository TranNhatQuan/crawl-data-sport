import 'reflect-metadata'
import { App } from './app'
import { config } from './configs'
import { HealthRoute } from './modules/health/health.route'
import { CrawlRoute } from './modules/crawl-data/crawl.route'

const app = new App(config, [
    {
        routes: [HealthRoute],
    },
    {
        version: 'v1',
        groups: [
            {
                routes: [CrawlRoute],
            },
        ],
    },
])

app.start()
