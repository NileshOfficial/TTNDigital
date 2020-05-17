import express from 'express';
import * as authControllers from '../controllers/auth.controller';

export const router = express.Router();

router.get('/authToken/:code', authControllers.handleAuthTokenRequest);
router.post('/refreshAuthToken', authControllers.handleRefreshAuthTokenRequest);