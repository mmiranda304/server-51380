import express from "express";
import { productsController } from "../controllers/products.controller.js";
import { isAdmin } from "../middlewares/auth.js";

export const productsRouter = express.Router();

productsRouter.get('/', productsController.getProducts);
productsRouter.get('/:id', productsController.getProductById);
productsRouter.post('/', isAdmin, productsController.addProduct);
productsRouter.put('/:id', isAdmin, productsController.updateProduct);
productsRouter.delete('/:id', isAdmin, productsController.deleteProduct);

