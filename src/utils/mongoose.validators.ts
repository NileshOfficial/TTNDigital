import { getDepartment } from '../services/departments.service';
import { getUserByEmail } from '../services/user.service';

export const validateDepartment = async (_id: string) => {
	try {
		const result = await getDepartment({ _id });
		return result ? true : false;
	} catch (err) {
		throw err;
	}
};

export const validateAdmin = async (email: string) => {
	try {
		const result = await getUserByEmail(email);
		return result && (result.role === 'su' || result.role === 'admin') ? true : false;
	} catch (err) {}
};
