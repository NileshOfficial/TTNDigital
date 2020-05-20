import express from 'express';
import { uploadAny } from '../controllers/multer.midware';
import * as complaintControllers from '../controllers/complaints.controller';

export const complaintsRouter = express.Router();

complaintsRouter.route('/')
    .get(complaintControllers.getUserComplaints)
    .post(uploadAny.array('files'), complaintControllers.createComplaint);

complaintsRouter.get('/all', complaintControllers.getAllComplaints);