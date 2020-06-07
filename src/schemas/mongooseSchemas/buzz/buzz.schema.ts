import mongoose, { Schema } from 'mongoose';
import { Buzz } from './buzz.model';

const buzzSchema = new Schema({
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ['activity', 'lost and found'],
        required: true
    },
    images: {
        type: [String],
        default: []
    },
    likes: {
        type: Number,
        default: 0
    },
    dislikes: {
        type: Number,
        default: 0
    },
    date: {
        type: Number,
        immutable: true
    },
    email: {
        type: String,
        required: true,
        immutable: true
    },
    likedBy: {
        type: [String],
        default: [],
    },
    dislikedBy: {
        type: [String],
        default: []
    }
});

export default mongoose.model<Buzz>('buzz', buzzSchema);