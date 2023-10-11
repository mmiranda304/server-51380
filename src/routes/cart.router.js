import express from "express";
import { cartController } from "../controllers/cart.controller.js";
import { isAdmin, isLogged } from "../middlewares/auth.js";

export const cartRouter = express.Router();

cartRouter.get('/', isAdmin, cartController.getCarts);          
cartRouter.get('/:id', cartController.getCartById);
cartRouter.post('/', cartController.addCart);
cartRouter.post('/:cid/product/:pid', isLogged, cartController.addCartProduct); 
cartRouter.put('/:cid', cartController.addCartProducts);
cartRouter.put('/:cid/product/:pid', cartController.updateProductQuantity);
cartRouter.delete('/:cid/product/:pid', cartController.removeCartProduct);
cartRouter.delete('/:cid', cartController.clearCart);
cartRouter.put('/:cid/purchase', isLogged, cartController.purchaseCart);
cartRouter.get('/purchase/:tid', isLogged, cartController.getTicketById);
