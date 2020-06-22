import { Document, Types } from 'mongoose';

export interface Complaint extends Document {
    issueId?: string,
    department?: string,
    title?: string,
    email: string,
    assignedTo?: string
    description: string,
    files?: Types.Array<string>,
    status?: string,
    estimatedTime?: {
        value: number,
        spanType: string
    },
    timestamp?: number
}