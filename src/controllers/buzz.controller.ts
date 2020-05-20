import { Request, Response, NextFunction } from 'express';
import * as buzzService from '../services/buzz.service';
import buzzSchema from '../schemas/mongooseSchemas/buzz/buzz.schema';

function retrieveFileNames(files) {
    const filePaths = [];
    const fileData = [].concat(files);

    fileData.forEach(fileSpec => {
        filePaths.push(fileSpec['filename']);
    });

    return filePaths;
}

export async function createBuzz(req: Request, res: Response, next: NextFunction) {
    // req.body['email'] = req['userProfile']['email'];
    req.body['email'] = 'a@b.c';
    if (req.files)
        req.body['images'] = retrieveFileNames(req.files);

    try {
        const result = await buzzService.createBuzz(req.body);
        res.json(result);
    } catch (err) {
        next(err);
    }
}

export async function getBuzzes(req: Request, res: Response, next: NextFunction) {
    const skipCount = req.query['skip'] as string;
    try {
        const result = await buzzService.getBuzz(Number(skipCount));
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