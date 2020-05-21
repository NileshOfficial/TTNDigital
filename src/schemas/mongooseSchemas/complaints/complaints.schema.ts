import mongoose, { Schema } from 'mongoose';
import { Complaint } from './complaints.model';

const complaintSchema = new Schema({
    issueId: {
        type: String,
        required: true,
        immutable: true
    },
    department: {
        type: String,
        enum: ['Admin', 'IT', 'Infra', 'HR'],
        required: true,
        immutable: true
    },
    title: {
        type: String,
        enum: ['Hardware', 'Infrastructure', 'Others'],
        required: true
    },
    name: {
        type: String,
        required: true,
        immutable: true
    },
    lockedBy: {
        type: String,
        required: true,
        immutable: true
    },
    assignedTo: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        immutable: true
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
        required: true,
        default: 'Open'
    },
    estimatedTime: {
        value: {
            type: Number,
            default: 0
        },
        spanType: {
            type: String,
            enum: ['hours', 'days', 'weeks', 'months'],
            default: 'hours'
        }
    },
    timestamp: {
        type: Number,
        default: Date.now(),
        immutable: true
    }
});

export default mongoose.model<Complaint>('complaints', complaintSchema);