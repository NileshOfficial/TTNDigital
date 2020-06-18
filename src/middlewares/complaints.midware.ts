import { Request, Response, NextFunction } from 'express';
import { isAdmin } from '../services/admins.service';
import { UnauthorizedAccessRequest } from '../customExceptions/auth/auth.exceptions';

export async function checkAdmin(req: Request, res: Response, next: NextFunction) {
    // req.body['email'] = ;
    try {
        const mail = req['userProfile']['email'];
        
        if (await isAdmin(mail))
            return next();
        else return next(new UnauthorizedAccessRequest('operation not allowed', 403));
    } catch (err) {
        next(err);
    }
}