import { Request, Response, NextFunction, ErrorRequestHandler, response } from 'express';
import axios from 'axios';
import * as dotenv from 'dotenv';
import * as uris from '../uris.conf';
import * as authExceptions from '../customExceptions/auth/auth.exceptions';
import { RequiredKeyAbsent } from '../customExceptions/validation/validation.exceptions';
import { findOrAddUser } from '../services/user.service';
import { User } from '../schemas/mongooseSchemas/user/user.model';
import { ROLES } from '../roles.conf';
import { decode, sign } from 'jsonwebtoken';
import { createWriteStream } from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { UPLOAD_ROOT, UPLOAD_DESTINATION } from '../serve.conf';
import { InternalServerError } from '../customExceptions/generic/generic.exceptions';
import { internalServerErrorRepsonse } from '../response.messages';

dotenv.config();

// const _download = async (path: string) => {
// 	const pathSegments = path.split('/');
// 	const filename = uuidv4() + pathSegments[pathSegments.length - 1];
// 	const fileStream = createWriteStream([process.cwd(), UPLOAD_ROOT, UPLOAD_DESTINATION.user, filename].join('/'));
// 	try {
//         const fileData = await axios.get(path);
//         console.log(fileData);
// 		fileStream.write(fileData.data, err => {
//             if(err) {
//                 throw new InternalServerError(internalServerErrorRepsonse, 500);
//             }
//         });
//         return filename;
// 	} catch (err) {
// 		throw new InternalServerError(internalServerErrorRepsonse, 500);
// 	}
// };

export async function handleGetAuthTokenRequest(req: Request, res: Response, next: NextFunction) {
	const tokenRequestConfig = {
		client_id: process.env.CLIENT_ID,
		client_secret: process.env.CLIENT_SECRET,
		redirect_uri: 'http://localhost:4200/auth',
		grant_type: 'authorization_code',
		code: decodeURIComponent(req.params['code']),
	};

	try {
		const token = await axios.post(uris.oAuthTokenUri, tokenRequestConfig);
		const userProfile = decode(token.data['id_token']);

		// const filename = await _download(userProfile['picture']);

		const userData: User = {
			name: userProfile['name'],
			email: userProfile['email'],
			picture: userProfile['picture'],
		} as User;

		const updationResponse = await findOrAddUser(userData);

		token.data['id_token'] = sign(
			{
				...updationResponse,
				role_code: ROLES[updationResponse.role],
			},
			process.env.CLIENT_SECRET
		);
		return res.json(token['data']);
	} catch (err) {
		return next(new authExceptions.InvalidTokenGrantCode('invalid code', 401, err['response']['data']));
	}
}

export async function handleRefreshAuthTokenRequest(req: Request, res: Response, next: NextFunction) {
	if (!req.body || !req.body['refreshToken']) return next(new RequiredKeyAbsent('refresh token not provided', 400));

	const tokenRequestConfig = {
		grant_type: 'refresh_token',
		refresh_token: req.body['refreshToken'],
		client_id: process.env.CLIENT_ID,
		client_secret: process.env.CLIENT_SECRET,
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
