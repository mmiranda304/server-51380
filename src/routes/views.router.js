import express from "express";
import passport from "passport";
import { sessionsController } from "../controllers/sessions.controller.js";
import { productsController } from "../controllers/products.controller.js";
import { cartController } from "../controllers/cart.controller.js";

export const viewsRouter = express.Router();

viewsRouter.get('/', sessionsController.getHome);
viewsRouter.get('/home', sessionsController.getHome2);
viewsRouter.get('/login', sessionsController.getLogin);
viewsRouter.post('/login', passport.authenticate("login", { failureRedirect: "error"}), sessionsController.postLogin);
viewsRouter.get('/register', sessionsController.getRegister);
viewsRouter.post('/register', passport.authenticate("register", { failureRedirect: "error"}), sessionsController.postRegister);
viewsRouter.get('/logout', sessionsController.getLogout);
viewsRouter.get('/current', sessionsController.getProfile);
viewsRouter.get('/products', productsController.getViewProducts);
viewsRouter.get('/product/:id', productsController.getUserProduct);
viewsRouter.get('/cart/:id', cartController.getUserCart);
viewsRouter.get('/cart/realtimeproducts', productsController.realTimeProducts);