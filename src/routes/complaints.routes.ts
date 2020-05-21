import express from 'express';
import { uploadAny } from '../controllers/multer.midware';
import * as complaintControllers from '../controllers/complaints.controller';
import { checkAdmin } from '../controllers/complaints.midware';

export const complaintsRouter = express.Router();

complaintsRouter.route('/')
    .get(complaintControllers.getUserComplaints)
    .post(uploadAny.array('files'), complaintControllers.createComplaint);

complaintsRouter.get('/all', checkAdmin, complaintControllers.getAllComplaints);
complaintsRouter.patch('/:id', complaintControllers.updateComplaint);