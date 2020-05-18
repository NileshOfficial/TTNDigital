import * as codes from './auth.errCodes';
import { CustomExceptionTemplate } from '../exception.model';

export class InvalidTokenGrantCode extends CustomExceptionTemplate {

    constructor(message: string, responseCode: number, payload?: object) {
        super(message, codes.invalidGrantCode, responseCode, payload);
        this.name = 'InvalidTokenGrantCodeError';
        this.stack = `${this.message}\n${new Error().stack}`;
    }
}

export class InvalidAuthToken extends CustomExceptionTemplate {
    
    constructor(message: string, responseCode: number, payload?: object) {
        super(message, codes.invalidAuthToken, responseCode, payload);
        this.name = 'InvalidAuthTokenError';
        this.stack = `${this.message}\n${new Error().stack}`;
    }
}