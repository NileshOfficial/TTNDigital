import { Request } from 'express'
import multer from 'multer';
import { UnsupportedFileType } from '../customExceptions/validation/validation.exceptions';

interface MulterStorageMethod {
    (req: Request, file: Express.Multer.File, callback: (err: Error | null, destination: string) => void): void
}

interface MulterFilterMethod {
    (req: Request, file: Express.Multer.File, callback: (err: Error | null, accepted: boolean) => void): void
}

export const getStorageEngine = (destination: MulterStorageMethod, filename: MulterStorageMethod): multer.StorageEngine => {
    return multer.diskStorage({
        destination: destination,
        filename: filename
    })
};

export const getFilterUtil = (supportedMimetypes: Array<string>, errMessage: string = ''): MulterFilterMethod => {
    return (req: Request, file: Express.Multer.File, callback: (err: Error | null, accepted: boolean) => void) => {
        if(supportedMimetypes.includes(file.mimetype))
            callback(null, true);
        else callback(new UnsupportedFileType(errMessage, 400), false);
    }
}

export const setSizeLimit = (limit: number): { fileSize: number } => {
    return { fileSize: limit }
}