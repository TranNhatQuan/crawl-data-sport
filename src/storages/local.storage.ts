import { randomUUID } from 'crypto'
import fs from 'fs'
import multer from 'multer'
import path from 'path'
import { Service } from 'typedi'
import { FileType, SUPPORT_FILE_TYPES, fileFilter } from './storage'

@Service()
export class LocalStorage {
    static TEMP_DIR = [__dirname, 'tmp'].join('/')

    uploadFile(filename: string, fileType: FileType) {
        return multer({
            fileFilter: fileFilter.bind(this, fileType),
            storage: multer.diskStorage({
                destination: (req, res, cb) => {
                    const dir = LocalStorage.getTempDir()
                    cb(null, dir)
                },
                filename: (req, file, cb) => {
                    const name =
                        (filename ? `${filename}_` : '') +
                        randomUUID().replace(/-/g, '')
                    const ext =
                        path.extname(file.originalname)?.toLowerCase() || ''
                    cb(null, name + ext)
                },
            }),
            limits: {
                fileSize: SUPPORT_FILE_TYPES.get(fileType).size,
            },
        })
    }

    async deleteFile(path: string) {
        return new Promise((resolve, reject) => {
            fs.unlink(path, (err) => {
                if (err) return reject(err)
                resolve(true)
            })
        })
    }

    static getTempDir() {
        const dir = 'tmp'
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir)
        }
        return dir
    }
}
