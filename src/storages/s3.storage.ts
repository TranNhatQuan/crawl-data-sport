import {
    DeleteObjectCommand,
    GetObjectCommand,
    PutObjectCommand,
    S3Client,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { randomUUID } from 'crypto'
import { Request } from 'express'
import fs from 'fs'
import multer from 'multer'
import multerS3 from 'multer-s3'
import path from 'path'
import { Inject, Service } from 'typedi'
import { Config } from '../configs'
import {
    FileType,
    SPECIFIC_MIMETYPES_MAP,
    SUPPORT_FILE_TYPES,
    fileFilter,
} from './storage'

const createPath = (...segments: unknown[]) => segments.join('/')

export const S3Dir = {}

@Service()
export class S3Storage {
    private s3: S3Client

    constructor(@Inject() private config: Config) {
        const { region, accessKeyId, secretAccessKey } = config.awsConfig
        this.s3 = new S3Client({
            region,
            credentials: {
                accessKeyId,
                secretAccessKey,
            },
        })
    }

    uploadFile(
        dir: string,
        filename: string = null,
        fileType: FileType = FileType.image,
        acl: 'public-read' | 'private' = 'public-read'
    ) {
        return multer({
            fileFilter: fileFilter.bind(this, fileType),
            storage: multerS3({
                s3: this.s3,
                bucket: this.config.awsConfig.bucketName,
                acl,
                contentType: (req, file, cb) => {
                    const ext =
                        path.extname(file.originalname)?.toLowerCase() || ''
                    const mime = SPECIFIC_MIMETYPES_MAP.get(
                        ext.replace('.', '')
                    )
                    if (mime) {
                        return cb(null, mime, null)
                    }
                    multerS3.AUTO_CONTENT_TYPE(req, file, cb)
                },
                key: (req: Request, file, cb) => {
                    const name =
                        (filename ? `${filename}_` : '') +
                        randomUUID().replace(/-/g, '')
                    const ext =
                        path.extname(file.originalname)?.toLowerCase() || ''
                    cb(null, dir + '/' + name + ext)
                },
            }),
            limits: {
                fileSize: SUPPORT_FILE_TYPES.get(fileType).size,
            },
        })
    }

    async putFile(path: string, key: string) {
        const fileStream = fs.createReadStream(path)
        const putParams = {
            Bucket: this.config.awsConfig.bucketName,
            Key: key,
            Body: fileStream,
        }
        await this.s3.send(new PutObjectCommand(putParams))
    }

    async deleteFile(path: string) {
        const bucketParams = {
            Bucket: this.config.awsConfig.bucketName,
            Key: path,
        }
        await this.s3.send(new DeleteObjectCommand(bucketParams))
    }

    getUrl(path: string) {
        const { bucketName, region } = this.config.awsConfig
        return `https://${bucketName}.s3.${region}.amazonaws.com/${path}`
    }

    async getSignedUrl(path: string) {
        if (!path) return
        const command = new GetObjectCommand({
            Bucket: this.config.awsConfig.bucketName,
            Key: path,
        })
        return await getSignedUrl(this.s3, command)
    }

    async getSignedUrls(paths: string[]) {
        return await Promise.all(paths.map((path) => this.getSignedUrl(path)))
    }
}
