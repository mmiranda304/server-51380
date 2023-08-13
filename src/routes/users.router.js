//ts-check
import express from "express";
import { usersController } from "../controllers/users.controller.js";
import { isAdmin } from "../middlewares/auth.js";

export const usersRouter = express.Router();

usersRouter.get('/', isAdmin, usersController.getUsers);           
usersRouter.post('/', isAdmin, usersController.addUser);           
usersRouter.delete('/:id', isAdmin, usersController.deleteUser);   
usersRouter.put('/:id', isAdmin, usersController.updateUser);      