import { Request, Response, NextFunction } from 'express';
import axios from 'axios';
import * as dotenv from 'dotenv';
import * as uris from '../uris.conf';

dotenv.config();

export async function handleAuthTokenRequest(req: Request, res: Response) {

    const tokenRequestConfig = {
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        redirect_uri: 'http://localhost:4200/auth',
        grant_type: 'authorization_code',
        code: decodeURIComponent(req.params['code'])
    }
    try {
        const token = await axios.post(uris.oAuthTokenUri, tokenRequestConfig);
        res.json(token['data']);
    } catch (error) {
        console.log(error);
    }
}

export async function handleRefreshAuthTokenRequest(req: Request, res: Response) {
    const tokenRequestConfig = {
        grant_type: "refresh_token",
        refresh_token: req.body['refreshToken'],
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
    }

    try {
        const token = await axios.post(uris.oAuthTokenUri, tokenRequestConfig);
        res.json(token['data']);
    } catch (error) {
        console.log(error);
    }
}

export async function verifyTokenMidware(req: Request, res: Response, next: NextFunction) {
    const accessToken = req.headers['authorization'].split(' ')[1];
    
    try{
        const verificationResponse = await axios.get(uris.oAuthTokenInfoUri + `?access_token=${accessToken}`);
        return next();
    } catch (err) {
        console.log(err);
        return res.json(err['data']);
    }

}