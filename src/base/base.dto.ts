/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import { Expose } from 'class-transformer'
import { Request } from 'express'
export class BaseDTO {
    @Expose()
    createdAt: Date

    @Expose()
    updatedAt: Date
}

export class BaseReqDTO {
    bind?(req: Request): void {}
}
