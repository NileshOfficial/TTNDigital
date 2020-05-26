import express from 'express';
import { addAdmin, isAdmin } from '../controllers/admin.controller';

export const adminRouter = express.Router();

adminRouter.post('/', addAdmin);
adminRouter.get('/isAdmin', isAdmin);