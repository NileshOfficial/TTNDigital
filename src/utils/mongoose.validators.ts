import {getDepartment} from '../services/departments.service';

export const validateDepartment = async (_id: string) => {
	try {
		const result = await getDepartment({ _id });
		return result ? true : false;
	} catch (err) {
		throw err;
	}
};