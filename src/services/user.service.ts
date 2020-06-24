import User from '../schemas/mongooseSchemas/user/user.schema';
import { User as IUser } from '../schemas/mongooseSchemas/user/user.model';
import { DataValidationFailed } from '../customExceptions/validation/validation.exceptions';
import { InternalServerError } from '../customExceptions/generic/generic.exceptions';
import * as responses from '../response.messages';

export const findOrAddUser = async (userData: IUser) => {
	try {
		const result = await User.findOneAndUpdate(
			{ email: userData.email },
			{ $setOnInsert: userData },
			{
				upsert: true,
				new: true,
				runValidators: true,
				setDefaultsOnInsert: true
			}
		);
		return result.toJSON();
	} catch (err) {
		if (err.name === 'ValidationError') throw new DataValidationFailed(err.message, 400);
		else throw new InternalServerError(responses.internalServerErrorRepsonse, 500);
	}
};

export const updateUserProfile = async (email: string, update: IUser) => {
	try {
		const result = await User.findOneAndUpdate(
			{ email: email },
			{ $set: update },
			{ runValidators: true, new: true }
		);
		return result.toJSON();
	} catch (err) {
		if (err.name === 'ValidationError') throw new DataValidationFailed(err.message, 400);
		else throw new InternalServerError(responses.internalServerErrorRepsonse, 500);
	}
};

export const updatePrivileges = async (email: string, update: { role?: string; department?: string }) => {
	try {
		const result = await User.findOneAndUpdate(
			{ email },
			{
				$set: update
			},
			{ runValidators: true, new: true }
		);
		return result.toJSON();
	} catch (err) {
		if (err.name === 'ValidationError') throw new DataValidationFailed(err.message, 400);
		else throw new InternalServerError(responses.internalServerErrorRepsonse, 500);
	}
};

export const getUsers = async (query: any, limit: number, skip: number) => {
	try {
		return await User.find(query)
			.limit(limit ? limit : 0)
			.skip(skip ? skip : 0);
	} catch (err) {
		throw new InternalServerError(responses.internalServerErrorRepsonse, 500);
	}
};

export const deleteUser = async (email: string) => {
	try {
		await User.deleteOne({ email: email });
		return responses.removed;
	} catch (err) {
		throw new InternalServerError(responses.internalServerErrorRepsonse, 500);
	}
};

export const getUserByEmail = async (email: string) => {
	try {
		return await User.findOne({ email }).lean();
	} catch (err) {
		throw new InternalServerError(responses.internalServerErrorRepsonse, 500);
	}
};
