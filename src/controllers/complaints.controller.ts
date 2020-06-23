import { Request, Response, NextFunction, response } from 'express';
import * as complaintsService from '../services/complaints.service';
import multer from 'multer';
import { getFilterUtil, getStorageEngine, setSizeLimit } from '../utils/multer.util';
import { UPLOAD_ROOT, UPLOAD_DESTINATION } from '../serve.conf';
import { v4 as uuidv4 } from 'uuid';
import { ROLES } from '../roles.conf';

const customId = require('custom-id');

const retrieveFileNames = (files) => {
	const filePaths = [];
	const fileData = [].concat(files);

	fileData.forEach((fileSpec) => {
		filePaths.push(fileSpec['filename']);
	});

	return filePaths;
};

export const getComplaints = async (req: Request, res: Response, next: NextFunction) => {
	const skip = req.query['skip'] as string;
	delete req.query['skip'];
	const limit = req.query['limit'] as string;
	delete req.query['limit'];

	let queryDoc = req.query['issueId'] ? { issueId: req.query['issueId'] } : req.query;

	if (req['userProfile'].role_code === ROLES.user) queryDoc['email'] = req['userProfile']['email'];
	else if (req['userProfile'].role_code === ROLES.admin) queryDoc['assignedTo'] = req['userProfile']['email'];

	try {
		const result = await complaintsService.getComplaints(queryDoc, Number(limit), Number(skip));
		res.json(result);
	} catch (err) {
		next(err);
	}
};

export const createComplaint = async (req: Request, res: Response, next: NextFunction) => {

    try {
        if (req.files) req.body['files'] = retrieveFileNames(req.files);

        const mail = req['userProfile']['email'];
		req.body['assignedTo'] = await complaintsService.getAdmin(req.body.department, req['userProfile'].email);
		req.body['email'] = mail;
		const issueId = customId({ email: mail, randomLength: 2 });
		req.body['issueId'] = issueId;
		req.body['timestamp'] = Date.now();

		const result = await complaintsService.createComplaint(req.body);
		result['referenceToken'] = issueId;

        res.json(result);
	} catch (err) {
		next(err);
	}
};

export const updateComplaint = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const result = await complaintsService.updateComplaint(req.params['id'], req.body);
		res.json(result);
	} catch (err) {
		next(err);
	}
};

const multerDest = (
	req: Request,
	files: Express.Multer.File,
	callback: (err: Error | null, destination: string) => void
) => {
	callback(null, [process.cwd(), UPLOAD_ROOT, UPLOAD_DESTINATION.complaint].join('/'));
};

const multerFileName = (
	req: Request,
	file: Express.Multer.File,
	callback: (err: Error | null, destination: string) => void
) => {
	callback(null, uuidv4() + file.originalname);
};

export const upload = multer({
	storage: getStorageEngine(multerDest, multerFileName),
	limits: setSizeLimit(1024 * 1024 * 5),
	fileFilter: getFilterUtil(['image/jpeg', 'image/png', 'text/plain', 'application/pdf'], 'invalid file type')
});
