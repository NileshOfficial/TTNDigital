import express from 'express';
import * as departmentControllers from '../controllers/department.controller';

export const departmentRouter = express.Router();

departmentRouter.route('/')
    .get(departmentControllers.getDeparments)
    .post(departmentControllers.addDepartment);

departmentRouter.delete('/:id', departmentControllers.deleteDepartment);