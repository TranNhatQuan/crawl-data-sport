import 'reflect-metadata'
import { App } from './app'
import { config } from './configs'
import { HealthRoute } from './modules/health/health.route'

const app = new App(config, [
    {
        routes: [HealthRoute],
    },
])
app.start()
