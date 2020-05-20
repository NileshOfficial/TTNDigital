import { Express, Request } from 'express'
import multer from 'multer';
import { UnsupportedFileType } from '../customExceptions/validation/validation.exceptions';

const storage = multer.diskStorage({
    //{[fieldname: string]: Express.Multer.File[]} | Express.Multer.File[], 
    destination: function (req: Request, files: Express.Multer.File, callback: (err: Error | null, destination: string) => void) {
        callback(null, `${process.cwd()}/buzzUploads`);
    },

    filename: function (req: Request, file: Express.Multer.File, callback: (err: Error | null, destination: string) => void) {
        callback(null, new Date().toISOString() + file.originalname);
    }
})

const fileFilter = function (req: Request, file: Express.Multer.File, callback: (err: Error | null, accepted: boolean) => void) {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png')
        callback(null, true);
    else callback(new UnsupportedFileType('only images are allowed', 400), false);
}

export const uploadImages = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 },
    fileFilter: fileFilter
});

export const uploadAny = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 }
});