import 'reflect-metadata'
import { App } from './app'
import { config } from './configs'
import { CrawlRoute } from './modules/crawl-data/crawl.route'

const app = new App(config, [
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
