import { Document, Types } from 'mongoose';

export interface Complaint extends Document {
    department: string,
    title: string,
    name: string,
    email: string,
    description: string,
    files?: Types.Array<string>,
    status: string,
    estimatedTime: {
        value: number,
        spanType: string
    }
}