import mongoose, { Schema } from 'mongoose';
import { Complaint } from './complaints.model';
import { validateDepartment } from '../../../utils/mongoose.validators';

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
        enum: ['Hardware', 'Infrastructure', 'Others'],
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
        immutable: true
    }
});

export default mongoose.model<Complaint>('complaints', complaintSchema);