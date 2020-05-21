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

export async function getBuzz(limit: number, skip: number) {
    try {
        return await Buzz.find().limit(limit ? limit : 0).skip(skip ? skip : 0);
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