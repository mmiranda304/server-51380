import express from "express";
import { cartController } from "../controllers/cart.controller.js";

export const cartRouter = express.Router();

cartRouter.get('/', cartController.getCarts);          // Agregar isAdmin
cartRouter.get('/:id', cartController.getCartById);
cartRouter.post('/', cartController.addCart);
cartRouter.post('/:cid/product/:pid', cartController.addCartProduct);      // Agregar isAdmin
cartRouter.put('/:cid', cartController.addCartProducts);
cartRouter.put('/:cid/product/:pid', cartController.updateProductQuantity);
cartRouter.delete('/:cid/product/:pid', cartController.removeCartProduct);
cartRouter.delete('/:cid', cartController.clearCart);

