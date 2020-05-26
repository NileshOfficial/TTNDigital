import { Request, Response, NextFunction, response } from 'express';
import * as complaintsService from '../services/complaints.service';

const customId = require('custom-id');

function retrieveFileNames(files) {

    const filePaths = [];
    const fileData = [].concat(files);

    fileData.forEach(fileSpec => {
        filePaths.push(fileSpec['filename']);
    });

    return filePaths;
}

export async function getUserComplaints(req: Request, res: Response, next: NextFunction) {

    try {
        const limit = req.query['limit'] as string;
        const skip = req.query['skip'] as string;
        const result = await complaintsService.getUserComplaints(req['userProfile']['email'], Number(limit), Number(skip));
        res.json(result);
    } catch (err) {
        next(err);
    }
}

export async function getAllComplaints(req: Request, res: Response, next: NextFunction) {

    const skip = req.query['skip'] as string;
    delete req.query['skip'];
    const limit = req.query['limit'] as string;
    delete req.query['limit'];

    let queryDoc = req.query['issueId'] ? { 'issueId': req.query['issueId'] } : req.query;

    try {
        const result = await complaintsService.getAllComplaints(queryDoc, Number(limit), Number(skip));
        res.json(result);
    } catch (err) {
        next(err);
    }
}

export async function createComplaint(req: Request, res: Response, next: NextFunction) {

    if (req.files)
        req.body['files'] = retrieveFileNames(req.files);

    const name = req['userProfile']['name'];
    const mail = req['userProfile']['email'];
    req.body['name'] = name;
    req.body['lockedBy'] = name;
    req.body['assignedTo'] = name;
    req.body['email'] = mail;
    const issueId = customId({ email: mail, randomLength: 2 });
    req.body['issueId'] = issueId;

    try {
        const result = await complaintsService.createComplaint(req.body);
        result['referenceToken'] = issueId;
        res.json(result);
    } catch (err) {
        next(err);
    }

}

export async function updateComplaint(req: Request, res: Response, next: NextFunction) {

    try {
        const result = await complaintsService.updateComplaint(req.params['id'], req.body);
        res.json(result);
    } catch (err) {
        next(err);
    }
}