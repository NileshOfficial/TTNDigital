import * as codes from './generic.errCodes';
import { CustomExceptionTemplate } from './exception.model';

export class ResourceNotFound extends CustomExceptionTemplate {
    code: string;
    responseCode: number;

    constructor(message: string, responseCode: number, payload?: object) {
        super(message, codes.notFound, responseCode, payload);
        this.name = 'ResourceNotFoundError';
        this.stack = `${this.message}\n${new Error().stack}`;
    }
}