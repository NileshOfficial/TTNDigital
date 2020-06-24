import express from 'express';
import * as authControllers from '../controllers/auth.controller';
import { retrieveAuthHeadersMidware, verifyTokenMidware } from '../middlewares/auth.midware';

export const authRouter = express.Router();

authRouter.get('/signup/:code', authControllers.signup);
authRouter.get('/signin/:code', authControllers.signin);
authRouter.post('/refreshAuthToken', authControllers.handleRefreshAuthTokenRequest);
authRouter.post('/logout', authControllers.handleRevokeAuthTokenRequest);
authRouter.get('/validate', retrieveAuthHeadersMidware, verifyTokenMidware, authControllers.verifyAccessTokenValidity);