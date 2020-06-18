import { Router } from 'express';
import { authRouter } from '../routes/auth.routes';
import { buzzRouter } from '../routes/buzz.routes';
import { complaintsRouter } from '../routes/complaints.routes';
import { adminRouter } from '../routes/admin.routes';
import * as genericMidwares from '../middlewares/generic.midwares';
import * as authMidwares from '../middlewares/auth.midware';

export const globalRouter = Router();

globalRouter.use('/auth', authRouter);
globalRouter.use('/buzz', authMidwares.retrieveAuthHeadersMidware, authMidwares.verifyTokenMidware, authMidwares.validateIdTokenMidware, buzzRouter);
globalRouter.use('/complaints', authMidwares.retrieveAuthHeadersMidware, authMidwares.verifyTokenMidware, authMidwares.validateIdTokenMidware, complaintsRouter);
globalRouter.use('/admin', authMidwares.retrieveAuthHeadersMidware, authMidwares.verifyTokenMidware, authMidwares.validateIdTokenMidware, adminRouter);
globalRouter.use(genericMidwares.handleWildCardRequests);
globalRouter.use(genericMidwares.errorHandlingMidware);