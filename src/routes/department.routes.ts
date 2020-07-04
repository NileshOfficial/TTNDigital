import express from 'express';
import * as departmentControllers from '../controllers/department.controller';
import { checkPrivileges } from '../middlewares/auth.midware';

export const departmentRouter = express.Router();

departmentRouter
	.route('/')
	.get(departmentControllers.getDeparments)
	.post(checkPrivileges('su'), departmentControllers.addDepartment);

departmentRouter
	.route('/:id')
	.patch(checkPrivileges('su'), departmentControllers.updateDepartment)
	.delete(checkPrivileges('su'), departmentControllers.deleteDepartment);
