import Complaints from '../schemas/mongooseSchemas/complaints/complaints.schema';
import { Complaint as IComplaint } from '../schemas/mongooseSchemas/complaints/complaints.model';
import { DataValidationFailed } from '../customExceptions/validation/validation.exceptions';
import { InternalServerError } from '../customExceptions/generic/generic.exceptions';
import * as responses from '../response.messages';

export async function getUserComplaints(email: string, limit: number, skip: number) {
    try {
        return await Complaints.find({ email: email }, 'department issueId assignedTo status estimatedTime description').limit(limit ? limit : 0).skip(skip ? skip : 0);
    } catch (err) {
        throw new InternalServerError(responses.internalServerErrorRepsonse, 500);
    }
}

export async function getAllComplaints(query: object, limit: number, skip: number) {
    try {
        return await Complaints.find(query, 'department issueId lockedBy assignedTo status description').sort({timestamp: -1}).limit(limit ? limit : 0).skip(skip ? skip : 0);
    } catch (err) {
        throw new InternalServerError(responses.internalServerErrorRepsonse, 500);
    }
}

export async function createComplaint(complaintData: IComplaint) {
    const complaint = new Complaints(complaintData);

    try {
        await complaint.save();
        return responses.insertionSuccessful;
    } catch (err) {
        if (err.name === 'ValidationError')
            throw new DataValidationFailed(err.message, 400);
        else
            throw new InternalServerError(responses.internalServerErrorRepsonse, 500);
    }
}