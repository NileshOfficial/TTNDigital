import express from 'express';
import * as userServices from '../controllers/user.controller';
import { validateIdTokenMidware, checkPrivileges } from '../middlewares/auth.midware';

export const userRouter = express.Router();

userRouter.route('/')
    .get(userServices.getUsers)
    .patch(validateIdTokenMidware, userServices.updateUserProfile)
    .delete(validateIdTokenMidware, checkPrivileges('su'), userServices.deleteUser);
userRouter.patch('/picture', validateIdTokenMidware, userServices.upload.single('file'), userServices.changeProfilePicture);
userRouter.patch('/privileges', validateIdTokenMidware, checkPrivileges('su'), userServices.updatePrivileges);