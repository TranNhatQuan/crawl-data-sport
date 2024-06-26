/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { AbstractLogger, LogLevel, LogMessage, QueryRunner } from 'typeorm'
import { logger } from '../utils/logger'

export class TypeORMLogger extends AbstractLogger {
    protected writeLog(
        level: LogLevel,
        message:
            | string
            | number
            | LogMessage
            | (string | number | LogMessage)[],
        queryRunner?: QueryRunner
    ): void {
        throw new Error('Method not implemented.')
    }

    logQuery(
        query: string,
        parameters?: any[],
        queryRunner?: QueryRunner
    ): void {
        logger.info(`${this.generateQuery(query, parameters)}`)
    }

    logQuerySlow(
        time: number,
        query: string,
        parameters?: any[],
        queryRunner?: QueryRunner
    ): void {
        logger.warn(`[${time}ms] - ${this.generateQuery(query, parameters)}`)
    }

    logQueryError(
        error: string,
        query: string,
        parameters?: any[],
        queryRunner?: QueryRunner
    ): void {
        logger.error(
            `Error: ${error} - Query: ${this.generateQuery(query, parameters)}`
        )
    }

    private generateQuery(query: string, parameters: any[]) {
        if (!parameters) return query.replace(/[\s\n]+/g, ' ')
        parameters.forEach((param) => {
            query = query.replace('?', `${this.stringifyParams(param)}`)
        })
        return query.replace(/[\s\n]+/g, ' ')
    }
}
