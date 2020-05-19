import mongoose, { Schema } from 'mongoose';
import { Complaint } from './complaints.model';

const complaintSchema = new Schema({
    issueId: {
        type: String,
        required: true
    },
    department: {
        type: String,
        enum: ['Admin', 'IT', 'Infra', 'HR'],
        required: true
    },
    title: {
        type: String,
        enum: ['Hardware', 'Infrastructure', 'Others'],
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
        enum: ['Open', 'Resolved', 'In Progress'],
        required: true
    },
    estimatedTime: {
        value: {
            type: Number,
            required: true
        },
        spanType: {
            type: String,
            enum: ['hours', 'days', 'weeks', 'months'],
            required: true
        }
    }
});

export default mongoose.model<Complaint>('complaints', complaintSchema);