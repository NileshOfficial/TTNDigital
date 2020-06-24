import { Request, Response, NextFunction } from 'express';
import axios from 'axios';
import * as dotenv from 'dotenv';
import * as uris from '../uris.conf';
import * as authExceptions from '../customExceptions/auth/auth.exceptions';
import { RequiredKeyAbsent } from '../customExceptions/validation/validation.exceptions';
import { createUser, getUserByEmail } from '../services/user.service';
import { User } from '../schemas/mongooseSchemas/user/user.model';
import { ROLES } from '../roles.conf';
import { decode, sign } from 'jsonwebtoken';
import { createWriteStream, unlink } from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { UPLOAD_ROOT, UPLOAD_DESTINATION } from '../serve.conf';
import { InternalServerError } from '../customExceptions/generic/generic.exceptions';
import { internalServerErrorRepsonse } from '../response.messages';
import { notify } from '../utils/mail.service';

dotenv.config();

const _download = async (path: string) => {
	const filename = uuidv4() + 'photo.jpg';
	const filepath = [process.cwd(), UPLOAD_ROOT, UPLOAD_DESTINATION.user, filename].join('/');
	const fileStream = createWriteStream(filepath);
	try {
		const fileData = await axios.request({
			method: 'GET',
			url: path,
			responseType: 'arraybuffer'
		});
		fileStream.write(Buffer.from(fileData.data, 'binary'), 'binary', (err) => {
			if (err) {
				throw new InternalServerError(internalServerErrorRepsonse, 500);
			}
		});
		return { filename, filepath };
	} catch (err) {
		throw new InternalServerError(internalServerErrorRepsonse, 500);
	}
};

const _getTokenRequestConfig = (code: string) => ({
	client_id: process.env.CLIENT_ID,
	client_secret: process.env.CLIENT_SECRET,
	redirect_uri: 'http://localhost:4200/auth',
	grant_type: 'authorization_code',
	code: decodeURIComponent(code)
});

export const signup = async (req: Request, res: Response, next: NextFunction) => {
	let fileData: { filename: string; filepath: string } = null;
	try {
		const token = await axios.post(uris.oAuthTokenUri, _getTokenRequestConfig(req.params['code']));
		const userProfile = decode(token.data['id_token']);

		fileData = await _download(userProfile['picture']);

		const userData: User = {
			name: userProfile['name'],
			email: userProfile['email'],
			picture: fileData.filename
		} as User;

		const newUser = await createUser(userData);
		delete newUser.__v;

		newUser['role_code'] = ROLES[newUser.role];
		token.data['id_token'] = sign(newUser, process.env.CLIENT_SECRET);

		res.json(token['data']);
		notify(userProfile['email'], 'Signup confimation', {
			heading: `welcome ${userData.name.split(' ')[0]}`,
			content: `Welcome to To The New Digital platform, login to view what's trending in you feed.
				You are yet to be assigned a department, once that is done you can log your concerns and issues.`,
			salutation: 'thank you',
			from: 'to the new digital team'
		});
	} catch (err) {
		if (fileData) unlink(fileData.filepath, () => {});
		if (err.code === 'DUPLICATE_KEY') return next(err);
		return next(new authExceptions.InvalidTokenGrantCode('invalid code', 401));
	}
};

export const signin = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const token = await axios.post(uris.oAuthTokenUri, _getTokenRequestConfig(req.params['code']));
		const userProfile = decode(token.data['id_token']);
		const user = await getUserByEmail(userProfile['email']);
		if (!user) {
			throw new authExceptions.UnauthorizedAccessRequest('user does not exist', 401);
		}

		delete user.__v;

		user['role_code'] = ROLES[user.role];
		token.data['id_token'] = sign(user, process.env.CLIENT_SECRET);

		return res.json(token['data']);
	} catch (err) {
		if (err.code === 'UNAUTHORIZED_ACCESS_REQUEST') return next(err);
		return next(new authExceptions.InvalidTokenGrantCode('invalid code', 401));
	}
};

export async function handleRefreshAuthTokenRequest(req: Request, res: Response, next: NextFunction) {
	if (!req.body || !req.body['refreshToken']) return next(new RequiredKeyAbsent('refresh token not provided', 400));

	const tokenRequestConfig = {
		grant_type: 'refresh_token',
		refresh_token: req.body['refreshToken'],
		client_id: process.env.CLIENT_ID,
		client_secret: process.env.CLIENT_SECRET
	};

	try {
		const token = await axios.post(uris.oAuthTokenUri, tokenRequestConfig);
		delete token.data['id_token'];
		return res.json(token['data']);
	} catch (err) {
		return next(new authExceptions.InvalidAuthToken('invalid refresh token', 401, err['response']['data']));
	}
}

export async function handleRevokeAuthTokenRequest(req: Request, res: Response, next: NextFunction) {
	if (!req.body || !req.body['refreshToken']) return next(new RequiredKeyAbsent('refresh token not provided', 400));

	try {
		await axios.post(uris.oAuthTokenRevokeUri + `?token=${encodeURIComponent(req.body['refreshToken'])}`, {});
		return res.json({ success: true });
	} catch (err) {
		return next(
			new authExceptions.InvalidAuthToken(
				'invalid token or it is already expired or revoked',
				401,
				err['response']['data']
			)
		);
	}
}

export async function verifyAccessTokenValidity(req: Request, res: Response, next: NextFunction) {
	res.send({ valid: true });
}
