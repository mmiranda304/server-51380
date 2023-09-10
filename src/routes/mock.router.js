import express from "express";
import { mockController } from "../controllers/mock.controller.js";
import { isAdmin } from "../middlewares/auth.js";


export const mockRouter = express.Router();

mockRouter.get('/mockingproducts', isAdmin, mockController.generateProducts);