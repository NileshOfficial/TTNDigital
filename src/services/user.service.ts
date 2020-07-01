import User from '../schemas/mongooseSchemas/user/user.schema';
import { User as IUser } from '../schemas/mongooseSchemas/user/user.model';
import { DataValidationFailed, DuplicateKey } from '../customExceptions/validation/validation.exceptions';
import { InternalServerError } from '../customExceptions/generic/generic.exceptions';
import * as responses from '../response.messages';

export const createUser = async (userData: IUser) => {
	try {
		const user = new User(userData);
		return (await user.save()).toJSON();
	} catch (err) {
		if (err.code === 11000) throw new DuplicateKey('user already exists', 403);
		throw new InternalServerError(responses.internalServerErrorRepsonse, 500);
	}
};

export const getUserByEmail = async (email: string) => {
	try {
		const user = await User.findOne({ email });
		return user ? user.toJSON() : user;
	} catch (err) {
		throw new InternalServerError(responses.internalServerErrorRepsonse, 500);
	}
};

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
		const pipeline: Array<any> = [
			{ $match: query },
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
					department: { $arrayElemAt: [ '$department', 0 ] }
				}
			},
			{
				$skip: skip ? skip : 0
			}
		];
		if(limit) pipeline.push( { $limit: limit });

		return await User.aggregate(pipeline).exec();
	} catch (err) {
		console.log(err);
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