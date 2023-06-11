//@ts-check

import express from "express";
import { UserModel } from "../DAO/models/users.model.js";
import { UserService } from "../services/users.service.js";

const Service = new UserService();

export const usersRouter = express.Router();

usersRouter.get("/", async (req, res) => {
  try {
    // const users = await UserModel.find({});
    const users = await Service.getAll();
    return res.status(200).json({
      status: "success",
      msg: "listado de usuarios",
      data: users,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      status: "error",
      msg: "something went wrong :(",
      data: {},
    });
  }
});

usersRouter.post('/', async (req, res) => {
    try {
      const { firstName, lastName, email } = req.body;
      //const userCreated = await UserModel.create({firstName, lastName, email});
      const userCreated = await Service.createOne(firstName, lastName, email);
      return res.status(201).json({
        status: 'success',
        msg: 'user created',
        data: userCreated,
      });
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        status: 'error',
        msg: 'something went wrong :(',
        data: {},
      });
    }
  });
  
  usersRouter.delete('/:id', async (req, res) => {
    try {
      const { id } = req.params;

      //const deleted = await UserModel.deleteOne({ _id: id });
      const deleted = await Service.deletedOne(id);
      return res.status(200).json({
        status: 'success',
        msg: 'user deleted',
        data: {},
      });
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        status: 'error',
        msg: 'something went wrong :(',
        data: {},
      });
    }
  });
  
  usersRouter.put('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { firstName, lastName, email } = req.body;
  
      // const userUptaded = await UserModel.updateOne(
      //   { _id: id },
      //   { firstName, lastName, email }
      // );  
      const userUptaded = await Service.updateOne(id, firstName, lastName, email);  
      return res.status(201).json({
        status: 'success',
        msg: 'user uptaded',
        data: { _id: id, firstName, lastName, email },
      });
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        status: 'error',
        msg: 'something went wrong :(',
        data: {},
      });
    }
  });