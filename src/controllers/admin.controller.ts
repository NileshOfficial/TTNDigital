import { Request, Response, NextFunction } from 'express';
import * as adminService from '../services/admins.service';

export async function addAdmin(req: Request, res: Response, next: NextFunction) {
    try {
        const result = await adminService.addAdmin(req.body);
        res.json(result);
    } catch (err) {
        next(err);
    }
}

export async function isAdmin(req: Request, res: Response, next: NextFunction) {
    try {
        const result = await adminService.isAdmin(req['userProfile']['email']);
        res.json({ admin: result });
    } catch (err) {
        next(err);
    }
}