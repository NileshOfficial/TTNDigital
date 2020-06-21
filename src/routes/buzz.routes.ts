import express from 'express';
import * as buzzControllers from '../controllers/buzz.controller';

export const buzzRouter = express.Router();

buzzRouter.route('/')
    .get(buzzControllers.getBuzzes)
    .post(buzzControllers.upload.array('files'), buzzControllers.createBuzz);

buzzRouter.route('/:id')
    .delete(buzzControllers.deleteBuzz)
    .patch(buzzControllers.updateBuzz);

buzzRouter.patch('/like/:id', buzzControllers.updateLikes);
buzzRouter.patch('/dislike/:id', buzzControllers.updateDisLikes);