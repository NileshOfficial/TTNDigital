import mongoose, { Schema } from 'mongoose';
import { Complaint } from './complaints.model';
import { validateDepartment, validateAdmin } from '../../../utils/mongoose.validators';

const complaintSchema = new Schema({
    issueId: {
        type: String,
        required: true,
        immutable: true
    },
    department: {
        type: mongoose.Types.ObjectId,
        required: true,
        validate: {
            validator: validateDepartment,
            message: 'invalid department value'
        }
    },
    title: {
        type: String,
        enum: ['hardware', 'infrastructure', 'others'],
        required: true
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
        enum: ['open', 'resolved', 'in progress'],
        required: true,
        default: 'open'
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
        immutable: true
    }
});

export default mongoose.model<Complaint>('complaints', complaintSchema);