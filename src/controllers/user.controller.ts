import { Request, Response, NextFunction } from 'express';
import { sign } from 'jsonwebtoken';
import * as userServices from '../services/user.service';
import * as dotenv from 'dotenv';
import { UnauthorizedAccessRequest } from '../customExceptions/auth/auth.exceptions';
import multer from 'multer';
import { getFilterUtil, getStorageEngine, setSizeLimit } from '../utils/multer.util';
import { UPLOAD_ROOT, UPLOAD_DESTINATION } from '../serve.conf';
import { User } from '../schemas/mongooseSchemas/user/user.model';
import { ROLES } from '../roles.conf';

dotenv.config();

export const updateUserProfile = async (req: Request, res: Response, next: NextFunction) => {
	try {
		delete req.body.picture;
		if (req.body.email || req.body.role)
			throw new UnauthorizedAccessRequest('Insufficient priviledges to update email or role fields', 403);
		const updationResponse = await userServices.updateUserProfile(req['userProfile'].email, req.body);

		const id_token = sign(
			{
				name: updationResponse.name,
				email: updationResponse.email,
				picture: updationResponse.picture,
                role: updationResponse.role,
                role_code: ROLES[updationResponse.role]
			},
			process.env.CLIENT_SECRET
		);

		res.json({ id_token });
	} catch (err) {
		next(err);
	}
};

export const updateUserRole = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const updationResponse = await userServices.updateUserRole(req.params.id, req.params.role);

		const id_token = sign(
			{
				name: updationResponse.name,
				email: updationResponse.email,
				picture: updationResponse.picture,
                role: updationResponse.role,
                role_code: ROLES[updationResponse.role]
			},
			process.env.CLIENT_SECRET
		);

		res.json({ id_token });
	} catch (err) {
		next(err);
	}
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const result = await userServices.deleteUser(req.params.id);
		res.json(result);
	} catch (err) {
		next(err);
	}
};

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
	const skip = req.query['skip'] as string;
	delete req.query['skip'];
	const limit = req.query['limit'] as string;
	delete req.query['limit'];

	try {
		const result = await userServices.getUsers(req.query, Number(limit), Number(skip));
		res.json(result);
	} catch (err) {
		next(err);
	}
};

export const changeProfilePicture = async (req: Request, res: Response, next: NextFunction) => {
	try {
		if (req.file) {
			const updationResponse = await userServices.updateUserProfile(req['userProfile'].email, {
				picture: req.file.filename,
            } as User);
            
			const id_token = sign(
				{
					name: updationResponse.name,
					email: updationResponse.email,
					picture: updationResponse.picture,
					role: updationResponse.role,
				},
				process.env.CLIENT_SECRET
			);

			res.json({ id_token });
		}
	} catch (err) {
		next(err);
	}
};

const multerDest = (
	req: Request,
	files: Express.Multer.File,
	callback: (err: Error | null, destination: string) => void
) => {
	callback(null, [process.cwd(), UPLOAD_ROOT, UPLOAD_DESTINATION.user].join('/'));
};

const multerFileName = (
	req: Request,
	file: Express.Multer.File,
	callback: (err: Error | null, destination: string) => void
) => {
	callback(null, new Date().toISOString() + file.originalname);
};

export const upload = multer({
	storage: getStorageEngine(multerDest, multerFileName),
	limits: setSizeLimit(1024 * 1024 * 5),
	fileFilter: getFilterUtil(['image/jpeg', 'image/png', 'image/gif'], 'only images are allowed'),
});
