/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request } from 'express'
import { ErrorResp } from './error'

export class ResponseWrapper {
    data: any
    error: ErrorResp
    pagination: Pagination

    constructor(
        data: any,
        pagination: Pagination = null,
        error: ErrorResp = null
    ) {
        this.data = data
        this.error = error
        this.pagination = pagination
    }
}

export class Pagination {
    total: number
    page: number
    limit: number
    totalPages: number

    constructor(page = 1, limit = 10, total?: number) {
        this.page = page
        this.limit = limit
        this.total = total
        if (total) {
            this.totalPages = Math.ceil(this.total / this.limit)
        }
    }

    static fromReq = (req: Request): Pagination => {
        const page = Number(req.query.page)
        const limit = Number(req.query.limit)
        return new Pagination(isNaN(page) ? 1 : page, isNaN(limit) ? 10 : limit)
    }

    getOffset = () => {
        return (this.page - 1) * this.limit
    }

    setTotal = (total: number) => {
        this.total = total
        this.totalPages = Math.ceil(this.total / this.limit)
    }
}
