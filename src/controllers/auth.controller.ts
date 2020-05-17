import { Request, Response } from 'express';
import axios from 'axios';
import * as dotenv from 'dotenv';
import * as uris from '../uris.conf';

dotenv.config();

export async function handleAuthTokenRequest(req: Request, res: Response) {
    
    const tokenRequestConfig = {
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        // redirect_uri: 'https://www.example.com/authenticate/google',
        grant_type: 'authorization_code',
        // code: req.params['code']
        code: '4/zwEsAU4NFG6VLdNQLLXvUYyEZuvNzdST33ZCwObPFumF1RP3FobfZwKw8wCaYw47M9UNMC7DuF6h1n2unxa93Jo'
    }
    try {
        const token = await axios.post(uris.oAuthTokenUri, tokenRequestConfig);   
        console.log(token);
        res.json(token['data']);
    } catch (error) {
        console.log(error);
    }

}