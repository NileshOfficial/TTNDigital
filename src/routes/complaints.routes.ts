import express from 'express';
import * as complaintControllers from '../controllers/complaints.controller';
import { checkPrivileges } from '../middlewares/auth.midware';

export const complaintsRouter = express.Router();

complaintsRouter
	.route('/')
	.get(complaintControllers.getComplaints)
	.post(complaintControllers.upload.array('files', 5), complaintControllers.createComplaint);

complaintsRouter
	.route('/:id')
	.patch(complaintControllers.upload.array('files', 5), complaintControllers.updateComplaint)
	.delete(complaintControllers.deleteComplaint);

complaintsRouter.get('/assigned', checkPrivileges('admin'), complaintControllers.getAssignedComplaints);
complaintsRouter.patch('/resolve/:id', checkPrivileges('admin'), complaintControllers.updateResolve);
