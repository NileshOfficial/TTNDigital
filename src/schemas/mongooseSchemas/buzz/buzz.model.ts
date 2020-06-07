import { Document, Types } from 'mongoose';

export interface Buzz extends Document {
    description?: string,
    category:  string,
    email: string,
    images?: Types.Array<string>,
    likes?: number,
    dislikes?: number,
    date?: number,
    likedBy: Array<string>,
    dislikedBy: Array<string>
}