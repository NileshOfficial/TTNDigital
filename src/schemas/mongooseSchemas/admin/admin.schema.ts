import mongoose, { Schema } from 'mongoose';
import { Admin } from './admin.model';

const adminSchema = new Schema({
    email: {
        type: String,
        required: true,
        immutable: true,
        unique: true
    }
});

export default mongoose.model<Admin>('admin', adminSchema);