import { Request, Response, NextFunction } from 'express';
import { ResourceNotFound } from '../customExceptions/generic/generic.exceptions';
import { CustomExceptionTemplate } from '../customExceptions/exception.model';

export function handleWildCardRequests(req: Request, res: Response, next: NextFunction) {
    return next(new ResourceNotFound('requested resource not found', 404));
}


export function errorHandlingMidware(err: CustomExceptionTemplate, req: Request, res: Response, next: NextFunction) {
    res.status(err.responseCode || 500);
    return res.json({
        error: err.name,
        errorCode: err.code,
        message: err.message,
        payload: err.payload
    });
}