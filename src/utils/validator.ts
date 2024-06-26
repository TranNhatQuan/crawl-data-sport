import {
    ClassConstructor,
    instanceToPlain,
    plainToInstance,
} from 'class-transformer'
import { ValidationError, validateOrReject } from 'class-validator'
import { NextFunction, Response } from 'express'
import { BaseReqDTO } from '../base/base.dto'
import { DataRequest } from '../base/base.request'
import { ErrorResp, Errors } from './error'

export const transformAndValidate = <T extends BaseReqDTO>(
    cls: ClassConstructor<T>
) => {
    return async (req: DataRequest<T>, res: Response, next: NextFunction) => {
        try {
            const data = {
                ...req.params,
                ...req.query,
                ...req.body,
            }

            // transform data to target instance
            req.data = plainToInstance(cls, data, {
                excludeExtraneousValues: true,
            })

            // binding data from req
            req.data.bind(req)

            // validate instance
            await validateOrReject(req.data)
            next()
        } catch (err) {
            next(parseValidationError(err))
        }
    }
}

export const parseValidationError = (err: unknown) => {
    if (!Array.isArray(err)) {
        return err
    }

    const validationErrs = err as ValidationError[]
    if (validationErrs.length == 0) {
        return err
    }

    const [firstErr] = validationErrs
    const contexts = firstErr?.contexts
    const constraints = firstErr?.constraints
    const children = firstErr?.children

    if (contexts && Object.values(contexts).length > 0) {
        const errResp = plainToInstance(
            ErrorResp,
            instanceToPlain(Object.values(contexts)[0])
        )
        if (errResp.message) return errResp
    }

    if (constraints && Object.values(constraints).length > 0) {
        return new ErrorResp(
            Errors.BadRequest.code,
            Object.values(constraints)[0],
            Errors.BadRequest.status
        )
    }

    if (children) {
        return parseValidationError(validationErrs[0].children)
    }

    return Errors.BadRequest
}
