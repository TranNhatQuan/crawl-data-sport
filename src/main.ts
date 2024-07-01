import 'reflect-metadata'
import { App } from './app'
import { config } from './configs'

const app = new App(config, [
    {
        version: 'v1',
        groups: [
            {
                routes: [],
            },
        ],
    },
])

app.start()
