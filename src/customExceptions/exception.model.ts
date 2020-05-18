export class CustomExceptionTemplate extends Error {
    
    code: string;
    responseCode: number;
    payload: object;
    constructor(message: string, code: string, responseCode: number, payload?: object) {
        super(message);
        this.code = code;
        this.responseCode = responseCode;
        this.payload = payload || {};
    }
}