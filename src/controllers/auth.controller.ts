import { Request, Response } from 'express';
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