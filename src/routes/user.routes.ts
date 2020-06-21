import express from 'express';
import * as userServices from '../controllers/user.controller';
import { validateIdTokenMidware, checkPrivileges } from '../middlewares/auth.midware';

export const userRouter = express.Router();

userRouter.route('/')
    .get(userServices.getUsers)
    .patch(validateIdTokenMidware, userServices.updateUserProfile);
userRouter.delete('/:id', validateIdTokenMidware, checkPrivileges('su'), userServices.deleteUser);
userRouter.patch('/role/:id/:role', validateIdTokenMidware, checkPrivileges('su'), userServices.updateUserRole);