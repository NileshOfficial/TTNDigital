import Buzz from '../schemas/mongooseSchemas/buzz/buzz.schema';
import { Buzz as IBuzz } from '../schemas/mongooseSchemas/buzz/buzz.model';
import { DataValidationFailed } from '../customExceptions/validation/validation.exceptions';
import { InternalServerError } from '../customExceptions/generic/generic.exceptions';
import * as responses from '../response.messages';

export const createBuzz = async (buzzData: IBuzz) => {
	const buzz = new Buzz(buzzData);

	try {
		await buzz.save();
		return responses.insertionSuccessful;
	} catch (err) {
		if (err.name === 'ValidationError') throw new DataValidationFailed(err.message, 400);
		else throw new InternalServerError(responses.internalServerErrorRepsonse, 500);
	}
}

export const getBuzz = async (query: any, limit: number, skip: number, email: string) => {
	const pipeline: Array<any> = [
		{ $match: query },
		{
			$addFields: {
				liked: { $in: [email, '$likedBy'] },
				disliked: { $in: [email, '$dislikedBy'] },
			},
		},
		{
			$lookup: {
				from: 'users',
				localField: 'email',
				foreignField: 'email',
				as: 'user',
			},
		},
		{
			$project: {
				likedBy: 0,
				dislikedBy: 0,
				user: {
					email: 0,
					role: 0,
					department: 0,
				},
			},
		},
		{
			$sort: {
				date: -1,
			},
		},
		{
			$skip: skip ? skip : 0,
		},
	];

	if (limit) pipeline.push({ $limit: limit });

	try {
		return await Buzz.aggregate(pipeline).exec();
	} catch (err) {
		throw new InternalServerError(responses.internalServerErrorRepsonse, 500);
	}
}

export const updateLikes = async (id: string, email: string, reverse: boolean = false) => {
	try {
		if (reverse)
			await Buzz.findByIdAndUpdate(id, {
				$inc: {
					likes: -1,
				},
				$pull: {
					likedBy: email,
				},
			});
		else
			await Buzz.findByIdAndUpdate(id, {
				$inc: {
					likes: 1,
				},
				$push: {
					likedBy: email,
				},
			});
		return responses.updationSuccessful;
	} catch (err) {
		throw new InternalServerError(responses.internalServerErrorRepsonse, 500);
	}
}

export const updateDislikes = async (id: string, email: string, reverse: boolean = false) => {
	try {
		if (reverse)
			await Buzz.findByIdAndUpdate(id, {
				$inc: {
					dislikes: -1,
				},
				$pull: {
					dislikedBy: email,
				},
			});
		else
			await Buzz.findByIdAndUpdate(id, {
				$inc: {
					dislikes: 1,
				},
				$push: {
					dislikedBy: email,
				},
			});
		return responses.updationSuccessful;
	} catch (err) {
		throw new InternalServerError(responses.internalServerErrorRepsonse, 500);
	}
}

export const deleteBuzz = async (id: string) => {
	try {
		await Buzz.findByIdAndDelete(id);
		return responses.removed;
	} catch (err) {
		throw new InternalServerError(responses.internalServerErrorRepsonse, 500);
	}
};

export const updateBuzz = async (id: string, update: IBuzz) => {
	try {
		const result = await Buzz.findByIdAndUpdate(id, { $set: update }, { runValidators: true, new: true });
		return result;
	} catch (err) {
		throw new InternalServerError(responses.internalServerErrorRepsonse, 500);
	}
};
