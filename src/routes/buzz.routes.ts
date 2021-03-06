import express from 'express';
import * as buzzControllers from '../controllers/buzz.controller';
import { uploadImages } from '../middlewares/multer.midware';

export const buzzRouter = express.Router();

buzzRouter.route('/')
    .get(buzzControllers.getBuzzes)
    .post(uploadImages.array('files'), buzzControllers.createBuzz);

buzzRouter.patch('/like/:docId', buzzControllers.updateLikes);
buzzRouter.patch('/dislike/:docId', buzzControllers.updateDisLikes);