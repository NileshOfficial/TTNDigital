import { Document, Types } from 'mongoose';

export interface Buzz extends Document {
    description?: string,
    category:  string,
    user: string,
    images?: Types.Array<string>,
    likes?: number,
    dislikes?: number,
    date?: number
}