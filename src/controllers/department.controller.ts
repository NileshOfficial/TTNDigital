import { Request, Response, NextFunction } from 'express';
import * as departmentService from '../services/departments.service';

export const addDepartment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await departmentService.addDepartment(req.body);
        res.json(result);
    } catch (err) {
        next(err);
    }
}

export const deleteDepartment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await departmentService.deleteDepartment(req.params.id);
        res.json(result);
    } catch(err) {
        next(err);
    }
}

export const getDeparments = async (req: Request, res: Response, next: NextFunction) => {
    
    const skip = req.query['skip'] as string;
    delete req.query['skip'];
    const limit = req.query['limit'] as string;
    delete req.query['limit'];

    try {
        const result = await departmentService.getDepartments(req.query, Number(limit), Number(skip));
        res.json(result);
    } catch(err) {
        next(err);
    }
}