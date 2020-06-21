import express from 'express';
import * as buzzControllers from '../controllers/buzz.controller';

export const buzzRouter = express.Router();

buzzRouter.route('/')
    .get(buzzControllers.getBuzzes)
    .post(buzzControllers.upload.array('files'), buzzControllers.createBuzz);

buzzRouter.patch('/like/:docId', buzzControllers.updateLikes);
buzzRouter.patch('/dislike/:docId', buzzControllers.updateDisLikes);