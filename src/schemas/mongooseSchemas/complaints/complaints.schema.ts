import mongoose, { Schema } from 'mongoose';
import { Complaint } from './complaints.model';

const complaintSchema = new Schema({
    department: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    files: [{
        type: String
    }],
    status: {
        type: String,
        required: true
    },
    estimatedTime: {
        value: {
            type: Number,
            required: true
        },
        spanType: {
            type: String,
            required: true
        }
    }
});

export default mongoose.model<Complaint>('complaints', complaintSchema);