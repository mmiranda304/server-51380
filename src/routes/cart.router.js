import express from "express";
import { CartService } from "../services/cart.service.js";
import { ProductService } from "../services/products.service.js";


export const cartRouter = express.Router();
const cartService = new CartService();
const productService = new ProductService();

cartRouter.get('/', async function(req, res) {
    try {
        const carts = await cartService.getCarts();

        return res.status(200).json(carts);
    } catch (error) {
        res.status(400).json({error: 'Server error - cartRouter.get'});
    }
});
cartRouter.get('/:id', async function(req, res) {
    try {
        const id = req.params.id;
        const cart = await cartService.getCartById(id);
    
        if(!cart.length) {
            return res.status(404).json({error: `cart id '${id}' not found`});
        }
        return res.status(200).json(cart);
    } catch (error) {
        res.status(400).json({error: 'Server error - cartRouter.get'});
    }
});
cartRouter.post('/', async function(req, res) {
    try {
        const cartCreated = await cartService.addCart();
        return res.status(201).json({
            status: "success", 
            msg: 'New cart added',
            data: cartCreated,
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({error: 'Server error - cartRouter.post'});
    }
});
cartRouter.post('/:cid/product/:pid', async function(req, res) {
    try {
        const cid = req.params.cid;
        const pid = req.params.pid;
        
        const cartExists = await cartService.getCartById(cid);
        const productExists = await productService.getProductById(pid);

        if(!cartExists.length && !productExists.length) {
            return res.status(404).json({error: `The cart and product IDs do not exist. Please verify and try again`});
        }
        if(!cartExists.length) {
            return res.status(404).json({error: `The cart ID does not exists. Please verify and try again`});
        }
        if(!productExists.length) {
            return res.status(404).json({error: `The product ID does not exists. Please verify and try again`});
        }
        const productAdded = await cartService.addCartProduct(cid, pid);
        return res.status(201).json({
            status: "success", 
            msg: `Product ${pid} added to cart ${cid}`,
            data: productAdded
        });

    } catch (error) {
        console.log(error);
        res.status(400).json({error: 'Server error - cartRouter.post'});
    }
});