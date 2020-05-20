import Admin from '../schemas/mongooseSchemas/admin/admin.schema';
import { InternalServerError } from '../customExceptions/generic/generic.exceptions';
import * as responses from '../response.messages';
import { Admin as IAdmin} from '../schemas/mongooseSchemas/admin/admin.model';

export async function isAdmin(email: string) {
    try {
        const result = await Admin.findOne({email: email});
        if (result._id)
            return true;
        else return false;
    } catch (err) {
        throw new InternalServerError(responses.internalServerErrorRepsonse, 500);
    }
}

export async function addAdmin(adminData: IAdmin) {
    const admin = new Admin(adminData);

    try {
        await admin.save();
        return responses.insertionSuccessful;
    } catch (err) {
        throw new InternalServerError(responses.internalServerErrorRepsonse, 500);
    }
}