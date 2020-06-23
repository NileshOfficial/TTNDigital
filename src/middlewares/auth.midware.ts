import { Request, Response, NextFunction } from 'express';
import axios from 'axios';
import * as uris from '../uris.conf';
import * as authExceptions from '../customExceptions/auth/auth.exceptions';
import { InternalServerError } from '../customExceptions/generic/generic.exceptions';
import { verify } from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import { ROLES } from '../roles.conf';
import { UnauthorizedAccessRequest } from '../customExceptions/auth/auth.exceptions';
import { getUserByEmail } from '../services/user.service';

dotenv.config();
export const retrieveAuthHeadersMidware = (req: Request, res: Response, next: NextFunction) => {
	try {
		if (!req.headers['authorization'])
			return next(new authExceptions.AuthHeaderAbsent('authorization header missing', 401));

		const headersSequence = ['access_token', 'id_token'];
		const authHeader = req.headers['authorization'].split(',');
		const tokens: Array<string> = [];

		for (let idx = 0; idx < authHeader.length; idx++) {
			let splitPieces = authHeader[idx].trim().split(' ');
			if (splitPieces[0].trim().toLowerCase() !== 'bearer')
				return next(new authExceptions.InvalidAuthHeaderFormat('auth tokens should be of bearer type', 401));
			else if (!splitPieces[1]) return next(new authExceptions.AuthTokenAbsent('auth token missing', 401));
			tokens.push(splitPieces[1].trim());
		}

		const authTokens = {};

		tokens.forEach((token, idx) => {
			authTokens[headersSequence[idx]] = token;
		});

		req['retrievedHeaders'] = authTokens;
		return next();
	} catch (err) {
		return next(new InternalServerError('error occurred', 500));
	}
};

export const verifyTokenMidware = async (req: Request, res: Response, next: NextFunction) => {
	try {
		await axios.get(uris.oAuthTokenInfoUri + `?access_token=${req['retrievedHeaders']['access_token']}`);
		return next();
	} catch (err) {
		return next(new authExceptions.InvalidAuthToken('invalid auth token', 401, err['response']['data']));
	}
};

export const validateIdTokenMidware = async (req: Request, res: Response, next: NextFunction) => {
	if (!req['retrievedHeaders']['id_token'])
		return next(new authExceptions.AuthTokenAbsent('auth token missing', 401));

	try {
		req['userProfile'] = verify(req['retrievedHeaders']['id_token'], process.env.CLIENT_SECRET);
		return next();
	} catch (err) {
		return next(new authExceptions.InvalidAuthToken('invalid id_token', 401, err['response']['data']));
	}
};

const _verifyUserRole = async (userProfile: any) => {
	try {
		const user = await getUserByEmail(userProfile.email);
		if (!user) throw new UnauthorizedAccessRequest('user does not exists', 401);
		if (userProfile.role === user.role) return true;
		return false;
	} catch (err) {
		throw err;
	}
};

const _checkClearance = (userRole: number, requiredRole: number): boolean => {
	if (userRole >= requiredRole) return true;
	return false;
};

export const checkPrivileges = (role: string) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		const userProfile = req['userProfile'];
		try {
			const status = await _verifyUserRole(userProfile);
			if (status) {
				const allowed = _checkClearance(userProfile.role_code, ROLES[role]);
				return allowed ? next() : next(new UnauthorizedAccessRequest('insufficient privileges', 403));
			} else throw next(new UnauthorizedAccessRequest('mismatched credentials', 403));
		} catch (err) {
			next(err);
		}
	};
};
