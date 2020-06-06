import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import axios from 'axios';
import * as dotenv from 'dotenv';
import * as uris from '../uris.conf';
import * as authExceptions from '../customExceptions/auth/auth.exceptions';
import { RequiredKeyAbsent } from '../customExceptions/validation/validation.exceptions';
import { decode, sign } from 'jsonwebtoken';

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
        const userProfile = decode(token.data['id_token']);
        token.data['id_token'] = sign({
                                        name: userProfile['name'],
                                        email: userProfile['email']
                                    }, process.env.CLIENT_SECRET);
        return res.json(token['data']);
    } catch (err) {
        return next(new authExceptions.InvalidTokenGrantCode('invalid code', 401, err['response']['data']));
    }
}

export async function handleRefreshAuthTokenRequest(req: Request, res: Response, next: NextFunction) {
    if (!req.body || !req.body['refreshToken'])
        return next(new RequiredKeyAbsent('refresh token not provided', 400));

    const tokenRequestConfig = {
        grant_type: "refresh_token",
        refresh_token: req.body['refreshToken'],
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
    }

    try {
        const token = await axios.post(uris.oAuthTokenUri, tokenRequestConfig);
        delete token.data['id_token'];
        return res.json(token['data']);
    } catch (err) {
        return next(new authExceptions.InvalidAuthToken('invalid refresh token', 401, err['response']['data']));
    }
}

export async function handleRevokeAuthTokenRequest(req: Request, res: Response, next: NextFunction) {
    if (!req.body || !req.body['refreshToken'])
        return next(new RequiredKeyAbsent('refresh token not provided', 400));

    try {
        await axios.post(uris.oAuthTokenRevokeUri + `?token=${encodeURIComponent(req.body['refreshToken'])}`, {});
        return res.json({ success: true });
    } catch (err) {
        return next(new authExceptions.InvalidAuthToken('invalid token or it is already expired or revoked', 401, err['response']['data']));
    }
}

export async function verifyAccessTokenValidity(req: Request, res: Response, next: NextFunction) {
    res.send({valid: true});
}