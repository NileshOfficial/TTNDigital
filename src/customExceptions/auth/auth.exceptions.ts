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

export class AuthHeaderAbsent extends CustomExceptionTemplate {

    constructor(message: string, responseCode: number, payload?: object) {
        super(message, codes.authHeaderAbsent, responseCode, payload);
        this.name = 'AuthHeaderAbsentError';
        this.stack = `${this.message}\n${new Error().stack}`;
    }
}

export class InvalidAuthHeaderFormat extends CustomExceptionTemplate {
    
    constructor(message: string, responseCode: number, payload?: object) {
        super(message, codes.invalidAuthHeaderFormat, responseCode, payload);
        this.name = 'InvalidAuthHeaderFormatError';
        this.stack = `${this.message}\n${new Error().stack}`;
    }
}

export class AuthTokenAbsent extends CustomExceptionTemplate {

    constructor(message: string, responseCode: number, payload?: object) {
        super(message, codes.authTokenAbsent, responseCode, payload);
        this.name = 'AuthTokenAbsentError';
        this.stack = `${this.message}\n${new Error().stack}`;
    }
}

export class UnauthorizedAccessRequest extends CustomExceptionTemplate {
    
    constructor(message: string, responseCode: number, payload?: object) {
        super(message, codes.unauthorizedAccessRequest, responseCode, payload);
        this.name = 'UnauthorizedAccessError';
        this.stack = `${this.message}\n${new Error().stack}`;
    }
}