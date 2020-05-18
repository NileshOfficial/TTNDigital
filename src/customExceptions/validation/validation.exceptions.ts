import * as codes from './validation.errCodes';
import { CustomExceptionTemplate } from '../exception.model';

export class RequiredKeyAbsent extends CustomExceptionTemplate {
    constructor(message: string, responseCode: number, payload?: object) {
        super(message, codes.requiredKeyAbsent, responseCode, payload);
        this.name = 'RequiredKeyAbsentError';
        this.stack = `${this.message}\n${new Error().stack}`;
    }
}