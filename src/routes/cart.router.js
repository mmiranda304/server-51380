import express from "express";
import CartManager from '../cartManager.js';

export const cartRouter = express.Router();
const cartManager = new CartManager('./src/carts.json');

cartRouter.get('/', async function(req, res) {
    try {
        const carts = await cartManager.getCarts();

        return res.status(200).json(carts);
    } catch (error) {
        res.status(400).json({error: 'Server error - cartRouter.get'});
    }
});
cartRouter.get('/:id', async function(req, res) {
    try {
        const id = req.params.id;
        const cart = await cartManager.getCartById(parseInt(id));
    
        if(!cart) {
            return res.status(404).json({error: `cart id '${id}' not found`});
        }
        return res.status(200).json(cart);
    } catch (error) {
        res.status(400).json({error: 'Server error - cartRouter.get'});
    }
});
cartRouter.post('/', async function(req, res) {
    try {
        if(await cartManager.addCart()) {
            let carts = await cartManager.getCarts();
            return res.status(201).json({
                status: "success", 
                msg: 'New cart added',
                data: carts,
            });
        }
    } catch (error) {
        res.status(400).json({error: 'Server error - cartRouter.post'});
    }
});
cartRouter.post('/:cid/product/:pid', async function(req, res) {
    try {
        const cid = req.params.cid;
        const pid = req.params.pid;
        
        if(await cartManager.addProduct(parseInt(cid),parseInt(pid))) {
            let cart = await cartManager.getCartById(parseInt(cid));
            return res.status(201).json({
                status: "success", 
                msg: `Product ${pid} added to cart ${cid}`,
                data: cart
            });
        }
        return res.status(404).json({error: `The product could not be added to cart. Please verify and try again`});
    } catch (error) {
        console.log(error);
        res.status(400).json({error: 'Server error - cartRouter.post'});
    }
});