import { Request, Response, NextFunction } from 'express';
import axios from 'axios';
import * as uris from '../uris.conf';
import * as authExceptions from '../customExceptions/auth/auth.exceptions';
import { InternalServerError } from '../customExceptions/generic/generic.exceptions';
import { CustomExceptionTemplate } from '../customExceptions/exception.model';

export function retrieveAuthHeadersMidware(req: Request, res: Response, next: NextFunction) {
    try {
        if (!req.headers['authorization'])
        return next(new authExceptions.AuthHeaderAbsent('authorization header missing', 401));

    const headersSequence = ['access_token', 'id_token'];
    const authHeader = req.headers['authorization'].split(',');
    const tokens: Array<string> = [];

    for (let idx = 0; idx < authHeader.length; idx++) {
        let splitPieces = authHeader[idx].split(' ');
        if (splitPieces[0] !== 'Bearer')
            return next(new authExceptions.InvalidAuthHeaderFormat('auth tokens should be of bearer type', 401));
        else if (!splitPieces[1])
            return next(new authExceptions.AuthTokenAbsent('auth token missing', 401));
        tokens.push(splitPieces[1]);
    }

    const authTokens = {};

    tokens.forEach((token, idx) => {
        authTokens[headersSequence[idx]] = token;
    });

    req['retrievedHeaders'] = authTokens;
    return next();
    } catch(err) {
        return next(new InternalServerError('error occurred', 500));
    }
}

export async function verifyTokenMidware(req: Request, res: Response, next: NextFunction) {
    try {
        await axios.get(uris.oAuthTokenInfoUri + `?access_token=${req['retrievedHeaders']['access_token']}`);
        return next();
    } catch (err) {
        return next(new authExceptions.InvalidAuthToken('invalid refresh token', 401, err['response']['data']));
    }
}

export async function validateIdTokenMidware(req: Request, res: Response, next: NextFunction) {
    if (!req['retrievedHeaders']['id_token'])
        return next(new authExceptions.AuthTokenAbsent('auth token missing', 401));

    try {
        await axios.get(uris.oAuthTokenInfoUri + `?id_token=${req['retrievedHeaders']['id_token']}`);
    } catch (err) {
        return next(new authExceptions.InvalidAuthToken('invalid id_token', 401, err['response']['data']))
    }
}

export function errorHandlingMidware(err: CustomExceptionTemplate, req: Request, res: Response, next: NextFunction) {
    res.status(err.responseCode || 400);
    return res.json({
        error: err.name,
        errorCode: err.code,
        message: err.message,
        payload: err.payload
    });
}