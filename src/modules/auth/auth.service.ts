import { instanceToPlain, plainToInstance } from 'class-transformer'
import jwt from 'jsonwebtoken'
import { Inject, Service } from 'typedi'
import { CacheKeys, CacheManager } from '../../cache'
import { Config } from '../../configs'
import { Errors } from '../../utils/error'
import { User } from '../users/entities/user.entity'

export class AuthPayload {
    userId: string
    address: string
}

@Service()
export class AuthService {
    constructor(
        @Inject() private config: Config,
        @Inject() private cacheManager: CacheManager
    ) {}

    async signToken(payload: AuthPayload, salt?: string) {
        const { accessSecret, accessExpiresIn } = this.config.jwt
        const jwtSecret = accessSecret + (salt ?? '')
        const sign = jwt.sign(payload, jwtSecret, {
            expiresIn: accessExpiresIn,
        })

        this.cacheManager.set(
            CacheKeys.accessToken(payload.userId, sign),
            Date.now().toString(),
            accessExpiresIn
        )
        return sign
    }

    async verifyToken(token: string) {
        const decoded = jwt.decode(token, {
            complete: true,
        })
        const authPayload = plainToInstance(
            AuthPayload,
            instanceToPlain(decoded.payload)
        )

        const user = await User.getProfile(authPayload.userId)
        if (!user) {
            throw Errors.Unauthorized
        }

        const jwtSecret = this.config.jwt.accessSecret + user.salt
        jwt.verify(token, jwtSecret)

        const cacheKey = CacheKeys.accessToken(authPayload.userId, token)
        const isTokenExisted = await this.cacheManager.exist(cacheKey)
        if (!isTokenExisted) {
            throw Errors.Unauthorized
        }

        return authPayload
    }

    async signRefreshToken(payload: AuthPayload, salt?: string) {
        const { refreshSecret, refreshExpiresIn } = this.config.jwt
        const jwtSecret = refreshSecret + (salt ?? '')
        const sign = jwt.sign(payload, jwtSecret, {
            expiresIn: refreshExpiresIn,
        })
        const cacheKey = CacheKeys.refreshToken(payload.userId, sign)
        await this.cacheManager.set(
            cacheKey,
            Date.now().toString(),
            refreshExpiresIn
        )
        return sign
    }

    async verifyRefreshToken(token: string) {
        const decoded = jwt.decode(token, {
            complete: true,
        })
        const authPayload = plainToInstance(
            AuthPayload,
            instanceToPlain(decoded.payload)
        )

        const user = await User.getProfile(authPayload.userId)
        if (!user) {
            throw Errors.Unauthorized
        }

        const jwtSecret = this.config.jwt.refreshSecret + user.salt
        jwt.verify(token, jwtSecret)

        const cacheKey = CacheKeys.refreshToken(authPayload.userId, token)
        const isTokenExisted = await this.cacheManager.exist(cacheKey)
        if (!isTokenExisted) {
            throw Errors.Unauthorized
        }

        return authPayload
    }
}
