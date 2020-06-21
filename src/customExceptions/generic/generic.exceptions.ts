import * as codes from './generic.errCodes';
import { CustomExceptionTemplate } from '../exception.model';

export class ResourceNotFound extends CustomExceptionTemplate {
    constructor(message: string, responseCode: number, payload?: object) {
        super(message, codes.notFound, responseCode, payload);
        this.name = 'ResourceNotFoundError';
        this.stack = `${this.message}\n${new Error().stack}`;
    }
}

export class InternalServerError extends CustomExceptionTemplate {
    constructor(message: string, responseCode: number, payload?: object) {
        super(message, codes.serverError, responseCode, payload);
        this.name = 'InternalServerError';
        this.stack = `${this.message}\n${new Error().stack}`;
    }
}

export class ActionNotAcceptableError extends CustomExceptionTemplate {
    constructor(message: string, responseCode: number, payload?: object) {
        super(message, codes.notAcceptableError, responseCode, payload);
        this.name = 'ActionNotAcceptableError';
        this.stack = `${this.message}\n${new Error().stack}`;
    }
}