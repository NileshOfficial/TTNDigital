import { Document } from 'mongoose';

export interface User extends Document {
    name: string;
    picture: string;
    email: string;
    dob?: string;
    contact?: string;
    role?: string;
    department?: string;
}