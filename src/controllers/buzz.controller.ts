import { Request, Response, NextFunction } from 'express';
import * as buzzService from '../services/buzz.service';
import multer from 'multer';
import { getFilterUtil, getStorageEngine, setSizeLimit } from '../utils/multer.util';
import { UPLOAD_ROOT, UPLOAD_DESTINATION } from '../serve.conf';
import { ActionNotAcceptableError } from '../customExceptions/generic/generic.exceptions';
import { v4 as uuidv4 } from 'uuid';
import { UnauthorizedAccessRequest } from '../customExceptions/auth/auth.exceptions';

const _retrieveFileNames = (
	files: { [fieldname: string]: Express.Multer.File[] } | Express.Multer.File[]
): Array<string> => {
	const filePaths = [];
	const fileData = [].concat(files);

	fileData.forEach((fileSpec) => {
		filePaths.push(fileSpec['filename']);
	});

	return filePaths;
};

export const createBuzz = async (req: Request, res: Response, next: NextFunction) => {
	req.body['email'] = req['userProfile']['email'];
	if (req.files) req.body['images'] = _retrieveFileNames(req.files);
	req.body['date'] = Date.now();

	try {
		const result = await buzzService.createBuzz(req.body);
		res.json(result);
	} catch (err) {
		next(err);
	}
};

export const getBuzzes = async (req: Request, res: Response, next: NextFunction) => {
	const limit = req.query['limit'] as string;
	delete req.query['limit'];
	const skip = req.query['skip'] as string;
	delete req.query['skip'];
	const email = req['userProfile']['email'];

	try {
		const result = await buzzService.getBuzz(req.query, Number(limit), Number(skip), email);
		res.json(result);
	} catch (err) {
		next(err);
	}
};

export const updateLikes = async (req: Request, res: Response, next: NextFunction) => {
	const email = req['userProfile']['email'];
	try {
		const result = await buzzService.updateLikes(req.params['id'], email, Boolean(req.query['reverse']));
		res.json(result);
	} catch (err) {
		next(err);
	}
};

export const updateDisLikes = async (req: Request, res: Response, next: NextFunction) => {
	const email = req['userProfile']['email'];
	try {
		const result = await buzzService.updateDislikes(req.params['id'], email, Boolean(req.query['reverse']));
		res.json(result);
	} catch (err) {
		next(err);
	}
};

export const deleteBuzz = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const buzz = await buzzService.getBuzzById(req.params.id);

		if (buzz.email !== req['userProfile'].email)
			throw new UnauthorizedAccessRequest('action not allowed', 403);

		const result = await buzzService.deleteBuzz(req.params.id);
		res.json(result);
	} catch (err) {
		next(err);
	}
};

export const updateBuzz = async (req: Request, res: Response, next: NextFunction) => {
	try {
		if (req.body['likes'] || req.body['dislikes'] || req.body['likedBy'] || req.body['dislikedBy'])
			throw new ActionNotAcceptableError(
				'keys: likes, dislikes, likedBy, dislikedBy cannot be updated directly',
				406
			);
		const buzz = await buzzService.getBuzzById(req.params.id);

		if (req.files) req.body['files'] = _retrieveFileNames(req.files);

		if (buzz.email !== req['userProfile'].email)
			throw new UnauthorizedAccessRequest('action not allowed', 403);

		const result = await buzzService.updateBuzz(req.params.id, req.body);
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
	callback(null, [process.cwd(), UPLOAD_ROOT, UPLOAD_DESTINATION.buzz].join('/'));
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
	fileFilter: getFilterUtil(['image/jpeg', 'image/png'], 'only images are allowed')
});
