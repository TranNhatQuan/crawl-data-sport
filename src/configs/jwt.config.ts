import { IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class JwtConfig {
    @IsString()
    @IsNotEmpty()
    accessSecret: string

    @IsNumber()
    @IsNotEmpty()
    accessExpiresIn: number

    @IsString()
    @IsNotEmpty()
    refreshSecret: string

    @IsNumber()
    @IsNotEmpty()
    refreshExpiresIn: number
}
