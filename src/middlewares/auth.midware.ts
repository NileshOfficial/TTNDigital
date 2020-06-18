import { Request, Response, NextFunction } from 'express';
import axios from 'axios';
import * as uris from '../uris.conf';
import * as authExceptions from '../customExceptions/auth/auth.exceptions';
import { InternalServerError } from '../customExceptions/generic/generic.exceptions';
import { verify } from 'jsonwebtoken';
import * as dotenv from 'dotenv';

dotenv.config();
export function retrieveAuthHeadersMidware(req: Request, res: Response, next: NextFunction) {
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
            else if (!splitPieces[1])
                return next(new authExceptions.AuthTokenAbsent('auth token missing', 401));
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
}

export async function verifyTokenMidware(req: Request, res: Response, next: NextFunction) {
    try {
        await axios.get(uris.oAuthTokenInfoUri + `?access_token=${req['retrievedHeaders']['access_token']}`);
        return next();
    } catch (err) {
        return next(new authExceptions.InvalidAuthToken('invalid auth token', 401, err['response']['data']));
    }
}

export async function validateIdTokenMidware(req: Request, res: Response, next: NextFunction) {
    if (!req['retrievedHeaders']['id_token'])
        return next(new authExceptions.AuthTokenAbsent('auth token missing', 401));

    try {
        req['userProfile'] = verify(req['retrievedHeaders']['id_token'], process.env.CLIENT_SECRET);
        return next();
    } catch (err) {
        return next(new authExceptions.InvalidAuthToken('invalid id_token', 401, err['response']['data']))
    }
}