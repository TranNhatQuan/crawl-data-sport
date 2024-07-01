import { plainToInstance, Type } from 'class-transformer'
import {
    IsNotEmpty,
    IsNumber,
    IsString,
    ValidateNested,
    validateSync,
} from 'class-validator'
import Container, { Service } from 'typedi'
import { MySqlDataSourceConfig } from './db.config'
import { RedisConfig } from './redis.config'

@Service()
export class Config {
    @IsString()
    @IsNotEmpty()
    nodeEnv: string

    @IsString()
    @IsNotEmpty()
    appEnv: string

    @IsNumber()
    @IsNotEmpty()
    port: number

    @ValidateNested()
    @Type(() => MySqlDataSourceConfig)
    masterDb: MySqlDataSourceConfig

    @ValidateNested({ each: true })
    @Type(() => MySqlDataSourceConfig)
    slavesDb: MySqlDataSourceConfig[]

    @ValidateNested()
    @Type(() => RedisConfig)
    redis: RedisConfig

    @IsString()
    basicAuthPassword: string

    @IsString()
    @IsNotEmpty()
    sourceCrawl: string

    @IsString()
    @IsNotEmpty()
    apiKeySourceCrawl: string

    constructor() {
        const env = process.env
        this.nodeEnv = env.NODE_ENV
        this.appEnv = env.APP_ENV
        this.port = parseInt(env.PORT)
        this.masterDb = this.decodeStringObj(env.MASTER_DB)
        this.slavesDb = this.decodeStringObj(env.SLAVES_DB)
        this.redis = this.decodeStringObj(env.REDIS)
        this.basicAuthPassword = env.BASIC_AUTH_PASSWORD
        this.sourceCrawl = env.SOURCE_CRAWL
        this.apiKeySourceCrawl = env.API_KEY_SOURCE_CRAWL
    }

    isProductionNodeEnv() {
        return this.nodeEnv === 'production'
    }

    isProductionAppEnv() {
        return this.appEnv === 'production'
    }

    private decodeStringObj(str: string) {
        return JSON.parse(str.replace(/\\/g, ''))
    }
}

export const validateEnv = (config: Config) => {
    const errors = validateSync(plainToInstance(Config, config))
    if (errors.length) {
        const childErrors = errors.map((e) => e.children).flat()
        const constraints = [...errors, ...childErrors].map(
            (e) => e.constraints
        )
        throw new Error(`Env validation error: ${JSON.stringify(constraints)}`)
    }
}

export const config = Container.get(Config)
