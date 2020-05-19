import mongoose ,{ Schema } from 'mongoose';
import { Buzz } from './buzz.model';

const buzzSchema = new Schema({
    description: {
        type: String
    },
    category: {
        type: String,
        enum: ['activity', 'lost and found'],
        required: true
    },
    images: [
        {
            type: String
        }
    ],
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
        default: Date.now()
    },
    user: {
        type: String,
        required: true
    }
});

export default mongoose.model<Buzz>('buzz', buzzSchema);