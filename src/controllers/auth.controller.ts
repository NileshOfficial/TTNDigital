import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import axios from 'axios';
import * as dotenv from 'dotenv';
import * as uris from '../uris.conf';
import * as authExceptions from '../customExceptions/auth.exceptions';
import { ResourceNotFound } from '../customExceptions/generic.exceptions';
import { CustomExceptionTemplate } from '../customExceptions/exception.model';

dotenv.config();

export async function handleGetAuthTokenRequest(req: Request, res: Response, next: NextFunction) {
    const tokenRequestConfig = {
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        redirect_uri: 'http://localhost:4200/auth',
        grant_type: 'authorization_code',
        code: decodeURIComponent(req.params['code'])
    }

    try {
        const token = await axios.post(uris.oAuthTokenUri, tokenRequestConfig);
        return res.json(token['data']);
    } catch (err) {
        next(new authExceptions.InvalidTokenGrantCode('invalid code', 401, err['response']['data']));
    }
}

export async function handleRefreshAuthTokenRequest(req: Request, res: Response, next: NextFunction) {
    const tokenRequestConfig = {
        grant_type: "refresh_token",
        refresh_token: req.body['refreshToken'],
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
    }

    try {
        const token = await axios.post(uris.oAuthTokenUri, tokenRequestConfig);
        res.json(token['data']);
    } catch (err) {
        next(new authExceptions.InvalidAuthToken('invalid refresh token', 401, err['response']['data']));
    }
}

export async function handleRevokeAuthTokenRequest(req: Request, res: Response, next: NextFunction) {
    try {
        await axios.post(uris.oAuthTokenRevokeUri + `?token=${req.body['refreshToken']}`, {});
        res.json({success: true});
    } catch(err) {
        next(new authExceptions.InvalidAuthToken('invalid token or it is already expired or revoked', 401, err['response']['data']));
    }
}

export async function verifyTokenMidware(req: Request, res: Response, next: NextFunction) {
    const accessToken = req.headers['authorization'].split(' ')[1];

    try {
        const verificationResponse = await axios.get(uris.oAuthTokenInfoUri + `?access_token=${accessToken}`);
        return next();
    } catch (err) {
        next(new authExceptions.InvalidAuthToken('invalid refresh token', 401, err['response']['data']));
    }
}

export function handleWildCardRequests(req: Request, res: Response, next: NextFunction) {
    next(new ResourceNotFound('requested resource not found', 404));
}

export function errorHandlingMidware(err: CustomExceptionTemplate, req: Request, res: Response, next: NextFunction) {
    res.status(err.responseCode || 400);
    res.json({
        error: err.name,
        errorCode: err.code,
        message: err.message,
        payload: err.payload
    });
}