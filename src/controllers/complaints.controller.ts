import { Request, Response, NextFunction } from 'express';
import * as complaintsService from '../services/complaints.service';
import multer from 'multer';
import { getFilterUtil, getStorageEngine, setSizeLimit } from '../utils/multer.util';
import { UPLOAD_ROOT, UPLOAD_DESTINATION } from '../serve.conf';
import { v4 as uuidv4 } from 'uuid';
import { ROLES } from '../roles.conf';
import { UnauthorizedAccessRequest } from '../customExceptions/auth/auth.exceptions';
import { ActionNotAcceptableError, ResourceNotFound } from '../customExceptions/generic/generic.exceptions';
import { unlink } from 'fs';
import { getUserByEmail } from '../services/user.service';
import { DataValidationFailed } from '../customExceptions/validation/validation.exceptions';

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

	if (!(req.query.all && req['userProfile'].role === 'su')) queryDoc['email'] = req['userProfile']['email'];
	delete req.query['all'];

	try {
		const result = await complaintsService.getComplaints(queryDoc, Number(limit), Number(skip));
		res.json(result);
	} catch (err) {
		next(err);
	}
};

export const getAssignedComplaints = async (req: Request, res: Response, next: NextFunction) => {
	const skip = req.query['skip'] as string;
	delete req.query['skip'];
	const limit = req.query['limit'] as string;
	delete req.query['limit'];

	let queryDoc = req.query['issueId'] ? { issueId: req.query['issueId'] } : req.query;

	queryDoc['assignedTo'] = req['userProfile']['email'];

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

const _deleteFiles = (files: Array<string>, dir: string) => {
	console.log('deleting', dir, files);
	files.forEach((file) => unlink([dir, file].join('/'), () => {}));
};

export const updateComplaint = async (req: Request, res: Response, next: NextFunction) => {
	let uploadedFiles: Array<string> = null;
	try {
		if (req.body.assignedTo || req.body.status || req.body.estimatedTime)
			throw new UnauthorizedAccessRequest('Insufficient priviledges', 403);

		if (req.files) {
			req.body['files'] = retrieveFileNames(req.files);
			uploadedFiles = req.body['files'];
		}

		const complaint = await complaintsService.getComplaint(req.params['id']);

		if (!complaint) throw new ResourceNotFound('complaint does not exists', 404);
		else if (req['userProfile'].email !== complaint.email)
			throw new UnauthorizedAccessRequest('operation not allowed', 403);

		if (req.body.department && req.body.department !== complaint.department.toString())
			req.body.assignedTo = await complaintsService.getAdmin(req.body.department, req['userProfile'].email);

		const result = await complaintsService.updateComplaint(req.params['id'], req.body);
		res.json(result);

		if (req.files)
			_deleteFiles(complaint.files, [process.cwd(), UPLOAD_ROOT, UPLOAD_DESTINATION.complaint].join('/'));
	} catch (err) {
		if (uploadedFiles)
			_deleteFiles(uploadedFiles, [process.cwd(), UPLOAD_ROOT, UPLOAD_DESTINATION.complaint].join('/'));
		next(err);
	}
};

const _checkDeferredUserCredentials = async (email, department) => {
	const user = await getUserByEmail(email);

	if (!user) throw new DataValidationFailed('assigned user doesnot exists', 500);
	else if (user.role !== 'admin') throw new DataValidationFailed('assigned user must be an admin', 500);
	else if (!user.department || (user.department && user.department.toString() !== department.toString()))
		throw new DataValidationFailed('cannot be assigned to user of another department', 500);
};

export const updateResolve = async (req: Request, res: Response, next: NextFunction) => {
	try {
		if (req.body.department || req.body.title || req.body.description || req.body.files)
			throw new ActionNotAcceptableError('complaint description data can only be updated by the creator', 406);

		const complaint = await complaintsService.getComplaint(req.params['id']);

		if (!complaint) throw new ResourceNotFound('complaint does not exists', 404);
		else if (req['userProfile'].email !== complaint.assignedTo)
			throw new UnauthorizedAccessRequest('this complaint is not assigned to you', 403);
		else if (req['userProfile'].email === complaint.email)
			throw new ActionNotAcceptableError('administrators cannot resolve their own complaints', 406);

		if (req.body.assignedTo) {
			if (req.body.assignedTo === complaint.email)
				throw new ActionNotAcceptableError('complaint cannot be assigned to the same user who locked it', 406);
			else if (req.body.assignedTo === complaint.assignedTo)
				throw new ActionNotAcceptableError('cannot update assigned to with the same value', 406);
			await _checkDeferredUserCredentials(req.body.assignedTo, complaint.department);
		}

		const result = await complaintsService.updateComplaint(req.params['id'], req.body);
		res.json(result);
	} catch (err) {
		next(err);
	}
};

export const deleteComplaint = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const complaint = await complaintsService.getComplaint(req.params['id']);
		if (complaint.email !== req['userProfile'].email)
			throw new UnauthorizedAccessRequest('operation not allowed', 403);

		const result = await complaintsService.deleteComplaint(req.params['id']);
		res.json(result);
	} catch (err) {
		console.log(err);
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
	const filename = file.originalname.replace(/ /g, '_');
	callback(null, uuidv4() + filename);
};

export const upload = multer({
	storage: getStorageEngine(multerDest, multerFileName),
	limits: setSizeLimit(1024 * 1024 * 5),
	fileFilter: getFilterUtil(['image/jpeg', 'image/png', 'text/plain', 'application/pdf'], 'invalid file type')
});
