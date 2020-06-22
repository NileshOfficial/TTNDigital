import express from 'express';
import * as complaintControllers from '../controllers/complaints.controller';
import { checkAdmin } from '../middlewares/complaints.midware';

export const complaintsRouter = express.Router();

complaintsRouter.route('/')
    .get(complaintControllers.getComplaints)
    .post(complaintControllers.upload.array('files'), complaintControllers.createComplaint);

complaintsRouter.patch('/:id', checkAdmin, complaintControllers.updateComplaint);