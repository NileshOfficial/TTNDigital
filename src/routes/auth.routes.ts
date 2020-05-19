import express from 'express';
import * as authControllers from '../controllers/auth.controller';
import { errorHandlingMidware } from '../controllers/auth.midware';

export const authRouter = express.Router();

authRouter.get('/login/:code', authControllers.handleGetAuthTokenRequest);
authRouter.post('/refreshAuthToken', authControllers.handleRefreshAuthTokenRequest);
authRouter.post('/logout', authControllers.handleRevokeAuthTokenRequest);
authRouter.use(authControllers.handleWildCardRequests);
authRouter.use(errorHandlingMidware);