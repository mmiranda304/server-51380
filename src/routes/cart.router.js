import express from "express";
import { CartService } from "../services/cart.service.js";

export const cartRouter = express.Router();
const cartService = new CartService();

cartRouter.get('/', async function(req, res) {      // Get All Carts
    try {
        const carts = await cartService.getCarts();

        return res.status(200).json(carts);
        
    } catch (error) {
        res.status(400).json({error: 'Server error - cartRouter.getCarts: ' + error});
    }
});

cartRouter.get('/:id', async function(req, res) {   // Get Cart by ID
    try {
        const id = req.params.id;
        const cart = await cartService.getCartById(id);
    
        if(!cart.length) {
            return res.status(404).json({error: `cart id '${id}' not found`});
        }
        
        return res.status(200).json(cart);

    } catch (error) {
        res.status(400).json({error: 'Server error - cartRouter.getCart: ' + error});
    }
});

cartRouter.post('/', async function(req, res) {     // Create new Cart
    try {
        const cartCreated = await cartService.addCart();
        
        return res.status(201).json({
            status: "success", 
            msg: 'New cart added',
            data: cartCreated,
        });

    } catch (error) {
        console.log(error);
        res.status(400).json({error: 'Server error - cartRouter.addCart: ' + error});
    }
});

cartRouter.post('/:cid/product/:pid', async function(req, res) {    // Add product to Cart
    try {
        const cid = req.params.cid;
        const pid = req.params.pid; 
        const productAdded = await cartService.addCartProduct(cid, pid);
        
        return res.status(201).json({
            status: "success", 
            msg: `Product ${pid} added to cart ${cid}`,
            data: productAdded
        });

    } catch (error) {
        console.log(error);
        res.status(400).json({error: 'Server error - cartRouter.addProduct: ' + error});
    }
});

cartRouter.put('/:cid', async function(req, res) {      // Add several products to Cart
    try {
        const { cid } = req.params;
        const products  = req.body;  
        const cart = await cartService.updateCartProducts(cid, products);
        
        return res.status(201).json({
            status: "success", 
            msg: 'Products added to cart',
            data: cart,
        });

    } catch (error) {
        res.status(400).json({error: 'Server error - cartRouter.addProducts: ' + error});
    }
});

cartRouter.put('/:cid/product/:pid', async function(req, res) {     // Updated product quantity
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;  
        const cart = await cartService.updateProductQuantity(cid, pid, quantity);
        
        return res.status(201).json({
            status: "success", 
            msg: `Product ${pid} updated`,
            data: cart,
        });
        
    } catch (error) {
        res.status(400).json({error: 'Server error - cartRouter.UpdateProductQuantity: ' + error});
    }
});

cartRouter.delete('/:cid/product/:pid', async function(req, res) {      // Delete Cart product
    try {
        const { cid, pid } = req.params;      
        const cart = await cartService.removeCartProduct(cid, pid);
        
        return res.status(201).json({
            status: "success", 
            msg: `Product ${pid} deleted`,
            data: cart,
        });
       
    } catch (error) {
        res.status(400).json({error: 'Server error - cartRouter.deleteProduct: ' + error});
    }
});

cartRouter.delete('/:cid', async function(req, res) {       // Clear Cart
    try {
        const { cid } =  req.params;
        
        await cartService.clearCart(cid);
        return res.status(201).json({
            status: "success", 
            msg: 'Cart cleared',
            data: `id: '${cid}'`,
        });

    } catch (error) {
        res.status(400).json({error: 'Server error - cartRouter.clearCart: ' + error});        
    }
});