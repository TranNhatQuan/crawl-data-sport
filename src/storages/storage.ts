import multer from 'multer'
import path from 'path'
import { Errors } from '../utils/error'

const MB = 1024 * 1024 // mb

export enum FileType {
    image,
    video,
    document,
    spreedsheet,
}

export const SUPPORT_FILE_TYPES = new Map<
    FileType,
    { size: number; types: string[] }
>([
    [
        FileType.image,
        {
            size: 10 * MB,
            types: ['jpeg', 'jpg', 'png', 'heic', 'gif'],
        },
    ],
    [
        FileType.video,
        {
            size: 100 * MB,
            types: ['mp4', 'mov'],
        },
    ],
    [
        FileType.document,
        {
            size: 30 * MB,
            types: [
                'pdf',
                'doc',
                'docx',
                'xlsx',
                'csv',
                'jpeg',
                'jpg',
                'png',
                'heic',
            ],
        },
    ],
    [
        FileType.spreedsheet,
        {
            size: 10 * MB,
            types: ['csv', 'xlsx'],
        },
    ],
])

export const SPECIFIC_MIMETYPES_MAP = new Map<string, string>([
    ['doc', 'application/msword'],
    [
        'docx',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ],
    [
        'xlsx',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ],
])

export const fileFilter = (
    fileType: FileType,
    req: Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
) => {
    const supportTypes = new Set(SUPPORT_FILE_TYPES.get(fileType).types)
    if (
        supportTypes.has(
            path.extname(file.originalname)?.slice(1).toLowerCase()
        )
    ) {
        cb(null, true)
        return
    }
    cb(Errors.InvalidFileType)
}
