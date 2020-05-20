import express from 'express';
import { addAdmin } from '../controllers/admin.controller';

export const adminRouter = express.Router();

adminRouter.post('/', addAdmin);