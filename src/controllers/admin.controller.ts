import { Request, Response, NextFunction } from 'express';
import { addAdmin as saveAdmin } from '../services/admins.service';

export async function addAdmin(req: Request, res: Response, next: NextFunction) {
    try {
        const result = await saveAdmin(req.body);
        res.json(result);
    } catch (err) {
        next(err);
    }
}