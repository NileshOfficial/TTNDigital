import mongoose, { Schema } from 'mongoose';
import { Department } from './department.model';

const departmentSchema = new Schema({
	name: {
		type: String,
		required: true,
		unique: true,
	},
});

departmentSchema.pre<Department>('save', function (next) {
	this.name = this.name.toLowerCase();
	next();
});

export default mongoose.model<Department>('department', departmentSchema);
