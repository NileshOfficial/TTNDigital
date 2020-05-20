import express from 'express';
import * as buzzControllers from '../controllers/buzz.controller';
import * as authMidwares from '../controllers/auth.midware';
import { upload } from '../controllers/multer.midware';

export const buzzRouter = express.Router();

buzzRouter.route('/')
    .get()
    // .post(retrieveAuthHeadersMidware, verifyTokenMidware, validateIdTokenMidware, upload.array('files'), buzzControllers.createBuzz)
    .post(upload.array('files'), buzzControllers.createBuzz);

buzzRouter.patch('/like/:docId', buzzControllers.updateLikes);
buzzRouter.patch('/dislike/:docId', buzzControllers.updateDisLikes);