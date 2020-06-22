import mongoose, { Schema } from 'mongoose';
import { User } from './user.model';
import { ROLES } from '../../../roles.conf';
import { validateDepartment } from '../../../utils/mongoose.validators';

const roleNames = Object.keys(ROLES);

const userSchema = new Schema({
	name: {
		type: String,
		required: true,
	},

	picture: {
		type: String,
		required: true,
	},

	email: {
		type: String,
		required: true,
		immutable: true,
		unique: true,
	},

	dob: {
		type: Number,
	},

	contact: {
		type: String,
		validate: {
			validator: function (v) {
				var re = /^\d{10}$/;
				return v == null || v.trim().length < 1 || re.test(v);
			},
			message: 'provided phone number is invalid.',
		},
	},

	role: {
		type: String,
		default: roleNames[0],
		enum: roleNames,
	},

	department: {
		type: mongoose.Types.ObjectId,
		validate: {
			validator: validateDepartment,
			message: 'invalid department value',
		},
	},
});

export default mongoose.model<User>('users', userSchema);
