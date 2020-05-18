import express from 'express';
import * as authControllers from '../controllers/auth.controller';

export const authRouter = express.Router();

authRouter.get('/login/:code', authControllers.handleGetAuthTokenRequest);
authRouter.post('/refreshAuthToken', authControllers.handleRefreshAuthTokenRequest);
authRouter.use(authControllers.handleWildCardRequests);
authRouter.use(authControllers.errorHandlingMidware);