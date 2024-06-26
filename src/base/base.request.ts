import { Request } from 'express'

export interface DataRequest<T> extends Request {
    data: T
}
