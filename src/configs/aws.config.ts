import { IsString } from 'class-validator'

export class AwsConfig {
    @IsString()
    accessKeyId: string

    @IsString()
    secretAccessKey: string

    @IsString()
    region: string

    @IsString()
    bucketName: string
}
