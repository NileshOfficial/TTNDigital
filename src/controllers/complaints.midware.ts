import { Request, Response, NextFunction } from 'express';
import { isAdmin } from '../services/admins.service';
import { UnauthorizedAccessRequest } from '../customExceptions/auth/auth.exceptions';

export async function checkAdmin(req: Request, res: Response, next: NextFunction) {
    // req.body['email'] = req['userProfile']['email'];
    try {
        const mail = decodeURIComponent('a@b.c');
        
        if (await isAdmin(mail))
            return next();
        else return next(new UnauthorizedAccessRequest('operation not allowed', 403));
    } catch (err) {
        next(err);
    }
}