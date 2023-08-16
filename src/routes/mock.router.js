import express from "express";
import { mockController } from "../controllers/mock.controller.js";


export const mockRouter = express.Router();

mockRouter.get('/mockingproducts', mockController.generateProducts);