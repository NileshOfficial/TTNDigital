import Department from '../schemas/mongooseSchemas/department/department.schema';
import { Department as IDepartment } from '../schemas/mongooseSchemas/department/department.model';
import { DataValidationFailed, DuplicateKey } from '../customExceptions/validation/validation.exceptions';
import { InternalServerError } from '../customExceptions/generic/generic.exceptions';
import * as responses from '../response.messages';

export const addDepartment = async (deptData: IDepartment) => {
	const dept = new Department(deptData);

	try {
		await dept.save();
		return responses.insertionSuccessful;
	} catch (err) {
        console.log(err);
        if(err.code === 11000) throw new DuplicateKey('department name must be unique', 400);
		if (err.name === 'ValidationError') throw new DataValidationFailed(err.message, 400);
		else throw new InternalServerError(responses.internalServerErrorRepsonse, 500);
	}
};

export const deleteDepartment = async (_id: string) => {
	try {
		await Department.deleteOne({ _id: _id });
		return responses.removed;
	} catch (err) {
		throw new InternalServerError(responses.internalServerErrorRepsonse, 500);
	}
};

export const getDepartments = async (query: any, limit: number, skip: number) => {
	try {
		return await Department.find(query)
			.limit(limit ? limit : 0)
			.skip(skip ? skip : 0);
	} catch (err) {
		console.log(err);
		throw new InternalServerError(responses.internalServerErrorRepsonse, 500);
	}
};

export const getDepartment = async (filter: any) => {
	try {
		return await Department.findOne(filter);
	} catch (err) {
		console.log(err);
		throw new InternalServerError(responses.internalServerErrorRepsonse, 500);
	}
};
