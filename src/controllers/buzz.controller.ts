import { Request, Response, NextFunction } from 'express';
import * as buzzService from '../services/buzz.service';

function _retrieveFileNames(files: { [fieldname: string]: Express.Multer.File[] } | Express.Multer.File[]): Array<string> {
    const filePaths = [];
    const fileData = [].concat(files);

    fileData.forEach(fileSpec => {
        filePaths.push(fileSpec['filename']);
    });

    return filePaths;
}

export async function createBuzz(req: Request, res: Response, next: NextFunction) {

    req.body['email'] = req['userProfile']['email'];
    if (req.files)
        req.body['images'] = _retrieveFileNames(req.files);
    req.body['date'] = Date.now();
    
    try {
        const result = await buzzService.createBuzz(req.body);
        res.json(result);
    } catch (err) {
        next(err);
    }
}

export async function getBuzzes(req: Request, res: Response, next: NextFunction) {
    const limit = req.query['limit'] as string;
    const skip = req.query['skip'] as string;
    const email = req['userProfile']['email'];

    try {
        const result = await buzzService.getBuzz(Number(limit), Number(skip), email);
        res.json(result);
    } catch (err) {
        next(err);
    }

}

export async function updateLikes(req: Request, res: Response, next: NextFunction) {
    try {
        const result = await buzzService.updateLikes(req.params['docId'], true, Boolean(req.query['reverse']));
        res.json(result);
    } catch (err) {
        next(err);
    }
}

export async function updateDisLikes(req: Request, res: Response, next: NextFunction) {
    try {
        const result = await buzzService.updateLikes(req.params['docId'], false, Boolean(req.query['reverse']));
        res.json(result);
    } catch (err) {
        next(err);
    }
}