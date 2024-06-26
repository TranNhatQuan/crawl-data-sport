import winston from 'winston'

const { combine, timestamp, prettyPrint, colorize } = winston.format

export const logger = winston.createLogger({
    level: 'info',
    format: combine(timestamp(), prettyPrint(), colorize()),
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
    ],
})

if (process.env.NODE_ENV !== 'production') {
    logger.add(
        new winston.transports.Console({
            format: winston.format.simple(),
        })
    )
}
