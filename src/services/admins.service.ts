import Admin from '../schemas/mongooseSchemas/admin/admin.schema';
import { InternalServerError } from '../customExceptions/generic/generic.exceptions';
import * as responses from '../response.messages';
import { Admin as IAdmin } from '../schemas/mongooseSchemas/admin/admin.model';

export async function isAdmin(email: string) {
    try {
        const result = await Admin.findOne({ email: email });
        if (result)
            return true;
        else return false;
    } catch (err) {
        throw new InternalServerError(responses.internalServerErrorRepsonse, 500);
    }
}

export async function addAdmin(email: string) {
    const admin = new Admin({ email: email });

    try {
        await admin.save();
        return responses.insertionSuccessful;
    } catch (err) {
        throw new InternalServerError(responses.internalServerErrorRepsonse, 500);
    }
}