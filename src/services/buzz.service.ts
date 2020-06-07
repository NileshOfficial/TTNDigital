import Buzz from '../schemas/mongooseSchemas/buzz/buzz.schema';
import { Buzz as IBuzz } from '../schemas/mongooseSchemas/buzz/buzz.model';
import { DataValidationFailed } from '../customExceptions/validation/validation.exceptions';
import { InternalServerError } from '../customExceptions/generic/generic.exceptions';
import * as responses from '../response.messages';

export async function createBuzz(buzzData: IBuzz) {
    const buzz = new Buzz(buzzData);

    try {
        await buzz.save();
        return responses.insertionSuccessful;
    } catch (err) {
        if (err.name === 'ValidationError')
            throw new DataValidationFailed(err.message, 400);
        else
            throw new InternalServerError(responses.internalServerErrorRepsonse, 500);
    }
}

export async function getBuzz(limit: number, skip: number, email: string) {
    try {
        // return await Buzz.find().sort({date: -1}).limit(limit ? limit : 0).skip(skip ? skip : 0);
        const res = await Buzz.aggregate([
            {
                $addFields: {
                    liked: { $in: [email, "$likedBy"] },
                    disliked: { $in: [email, "$dislikedBy"] }
                }
            },
            {
                $project: {
                    likedBy: 0,
                    dislikedBy: 0
                }
            },
            {
                $sort: {
                    date: -1
                }
            },
            {
                $skip: skip
            },
            {
                $limit: limit
            }
        ]).exec();
        console.log(res);
        return res;
    } catch (err) {
        console.log(err);
        throw new InternalServerError(responses.internalServerErrorRepsonse, 500);
    }
}

export async function updateLikes(docId: string, likes: boolean, reverse: boolean = false) {
    try {
        if (likes)
            await Buzz.findByIdAndUpdate(docId, {
                $inc: {
                    likes: reverse ? -1 : 1
                }
            });
        else
            await Buzz.findByIdAndUpdate(docId, {
                $inc: {
                    dislikes: reverse ? -1 : 1
                }
            });
        return responses.updationSuccessful;
    } catch (err) {
        throw new InternalServerError(responses.internalServerErrorRepsonse, 500);
    }
}