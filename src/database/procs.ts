/* eslint-disable @typescript-eslint/no-explicit-any */
import { ClassConstructor, plainToInstance } from 'class-transformer'
import { AppDataSource } from './connection'

export const Procs = {
    /** sp_user_getProfile(pUserId) */
    UserGetProfile: 'sp_user_getProfile',
}

export const execProc = async <T>(
    cls: ClassConstructor<T>,
    procName: string,
    params: unknown[],
    manager = AppDataSource.manager
): Promise<T[]> => {
    const qs: string[] = new Array(params.length).fill('?')
    const [result] = await manager.query(
        `CALL ${procName}(${qs.join(',')})`,
        params
    )
    return (
        plainToInstance(cls, <any[]>result, {
            excludeExtraneousValues: true,
        }) ?? []
    )
}
