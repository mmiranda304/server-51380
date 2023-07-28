//@ts-check
import express from "express";
import { usersController } from "../controllers/users.controller.js";

export const usersRouter = express.Router();

usersRouter.get('/', usersController.getUsers);           //isAdmin
usersRouter.post('/', usersController.addUser);           //isAdmin
usersRouter.delete('/:id', usersController.deleteUser);   //isAdmin
usersRouter.put('/:id', usersController.updateUser);      //isAdmin