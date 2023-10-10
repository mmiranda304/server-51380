import express from "express";
import { productsController } from "../controllers/products.controller.js";
import { isAdmin, isPremium } from "../middlewares/auth.js";

export const productsRouter = express.Router();

productsRouter.get('/', productsController.getProducts);
productsRouter.get('/:id', productsController.getProductById);
productsRouter.post('/', isAdmin, isPremium, productsController.addProduct);
productsRouter.put('/:id', isAdmin, productsController.updateProduct);
productsRouter.delete('/:id', isAdmin, isPremium, productsController.deleteProduct);

