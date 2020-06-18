import express from 'express';
import { uploadAny } from '../middlewares/multer.midware';
import * as complaintControllers from '../controllers/complaints.controller';
import { checkAdmin } from '../middlewares/complaints.midware';

export const complaintsRouter = express.Router();

complaintsRouter.route('/')
    .get(complaintControllers.getUserComplaints)
    .post(uploadAny.array('files'), complaintControllers.createComplaint);

complaintsRouter.get('/all', checkAdmin, complaintControllers.getAllComplaints);
complaintsRouter.patch('/:id', checkAdmin, complaintControllers.updateComplaint);