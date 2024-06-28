import { Expose, plainToInstance } from 'class-transformer'
import { Response } from 'express'
import { config } from '../configs'
import { ResponseWrapper } from './response'

export class ErrorResp extends Error {
    @Expose()
    readonly status: number

    @Expose()
    readonly code: string

    @Expose()
    readonly message: string

    constructor(code: string, message: string, status?: number) {
        super()
        this.status = status
        this.code = code
        this.message = message
        this.stack = undefined
    }
}

export const Errors = {
    BadRequest: new ErrorResp('error.badRequest', 'Bad request', 400),
    Unauthorized: new ErrorResp('error.unauthorized', 'Unauthorized', 401),
    Forbidden: new ErrorResp('error.forbiden', 'Forbidden', 403),
    Sensitive: new ErrorResp(
        'error.sensitive',
        'An error occurred, please try again later.',
        400
    ),
    InternalServerError: new ErrorResp(
        'error.internalServerError',
        'Internal server error.',
        500
    ),
    crawlError: new ErrorResp('error.CrawlError', 'Crawl error'),
    InvalidFileType: new ErrorResp(
        'error.invalidFileType',
        'Invalid file type.'
    ),
    UserNotFound: new ErrorResp('error.userNotFound', 'User not found'),
    SportNotFound: new ErrorResp('error.SportNotFound', 'Sport not found'),
    LeagueNotFound: new ErrorResp('error.LeagueNotFound', 'League not found'),
    EventNotFound: new ErrorResp('error.EventNotFound', 'Event not found'),
}

export const handleError = (err: Error, res: Response) => {
    if (err instanceof ErrorResp) {
        const errResp = err as ErrorResp
        res.status(errResp.status || Errors.BadRequest.status).send(
            new ResponseWrapper(
                null,
                null,
                plainToInstance(ErrorResp, errResp, {
                    excludeExtraneousValues: true,
                })
            )
        )
    } else {
        console.log(err)
        if (config.isProductionAppEnv()) {
            res.status(Errors.Sensitive.status).send(
                new ResponseWrapper(null, null, Errors.Sensitive)
            )
            return
        }
        const errResp = new ErrorResp(
            Errors.InternalServerError.code,
            JSON.stringify(err),
            Errors.InternalServerError.status
        )
        res.status(Errors.Sensitive.status).send(
            new ResponseWrapper(null, null, errResp)
        )
    }
}
