import Complaints from '../schemas/mongooseSchemas/complaints/complaints.schema';
import User from '../schemas/mongooseSchemas/user/user.schema';
import { Complaint as IComplaint } from '../schemas/mongooseSchemas/complaints/complaints.model';
import { DataValidationFailed } from '../customExceptions/validation/validation.exceptions';
import { InternalServerError } from '../customExceptions/generic/generic.exceptions';
import * as responses from '../response.messages';

export const getComplaints = async (query: any, limit: number, skip: number) => {
	const pipeline: Array<any> = [
		{ $match: query },
		{
			$lookup: {
				from: 'users',
				localField: 'email',
				foreignField: 'email',
				as: 'lockedBy'
			}
		},
		{
			$lookup: {
				from: 'users',
				localField: 'assignedTo',
				foreignField: 'email',
				as: 'assignedTo'
			}
		},
		{
			$lookup: {
				from: 'departments',
				localField: 'department',
				foreignField: '_id',
				as: 'department'
			}
		},
		{
			$set: {
				lockedBy: { $arrayElemAt: ['$lockedBy', 0] },
				assignedTo: { $arrayElemAt: ['$assignedTo', 0] },
				department: { $arrayElemAt: ['$department', 0] }
			}
		},
		{
			$project: {
				__v: 0,
				email: 0,
				lockedBy: {
					_id: 0,
					__v: 0,
					picture: 0,
					dob: 0,
					contact: 0,
					role: 0,
					department: 0
				},
				assignedTo: {
					_id: 0,
					__v: 0,
					picture: 0,
					dob: 0,
					contact: 0,
					role: 0,
					department: 0
				},
				department: {
					__v: 0
				}
			}
		},
		{
			$sort: { timestamp: -1 }
		},
		{
			$skip: skip ? skip : 0
		}
	];

	if (limit) pipeline.push({ $limit: limit });

	try {
		return await Complaints.aggregate(pipeline).exec();
	} catch (err) {
		console.log(err);
		throw new InternalServerError(responses.internalServerErrorRepsonse, 500, err);
	}
};

export const createComplaint = async (complaintData: IComplaint) => {
	const complaint = new Complaints(complaintData);

	try {
		await complaint.save();
		return responses.insertionSuccessful;
	} catch (err) {
		if (err.name === 'ValidationError') throw new DataValidationFailed(err.message, 400);
		else throw new InternalServerError(responses.internalServerErrorRepsonse, 500);
	}
};

export const updateComplaint = async (id: string, complaintData: IComplaint) => {
	try {
		await Complaints.findByIdAndUpdate(id, { $set: complaintData }, { runValidators: true }).exec();
		return responses.updationSuccessful;
	} catch (err) {
		console.log(err, err.message);
		if (err.name === 'ValidationError') throw new DataValidationFailed(err.message, 400);
		else throw new InternalServerError(responses.internalServerErrorRepsonse, 500);
	}
};

const _randomFromInterval = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min);

const _ensureAdmin = (admins: Array<any>): string => {
	while (1) {
		const idx = _randomFromInterval(0, admins.length - 1);
		if (admins[idx].role !== 'su') return admins[idx].email;
	}
};

export const getAdmin = async (department: string, email: string) => {
	try {
		const departmentAdmins = await User.find({
			$or: [
				{ department, role: 'admin' },
				{ role: 'su' }
			],
			email: { $ne: email },
		}).lean();

		if (departmentAdmins.length === 1) {
			return departmentAdmins[0].email;
		}
		return _ensureAdmin(departmentAdmins);
	} catch (err) {
		throw new InternalServerError(responses.internalServerErrorRepsonse, 500);
	}
};
