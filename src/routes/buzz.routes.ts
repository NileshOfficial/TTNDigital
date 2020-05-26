import express from 'express';
import * as buzzControllers from '../controllers/buzz.controller';
import * as authMidwares from '../controllers/auth.midware';
import { uploadImages } from '../controllers/multer.midware';

export const buzzRouter = express.Router();

buzzRouter.route('/')
    .get(authMidwares.validateIdTokenMidware, buzzControllers.getBuzzes)
    .post(authMidwares.validateIdTokenMidware, authMidwares.validateIdTokenMidware, uploadImages.array('files'), buzzControllers.createBuzz);

buzzRouter.patch('/like/:docId', buzzControllers.updateLikes);
buzzRouter.patch('/dislike/:docId', buzzControllers.updateDisLikes);