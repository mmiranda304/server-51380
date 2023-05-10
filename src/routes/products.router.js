import express from "express";
import ProductManager from '../productManager.js';

export const productsRouter = express.Router();
export const productManager = new ProductManager('./src/products.json');

productsRouter.get('/', async function(req, res) {
    try {
        const limit = req.query.limit;
        const products = await productManager.getProducts();
        
        if(!limit) {
            return res.status(200).json(products);
        }
        return res.status(200).json(products.slice(0, limit)); 
    } catch (error) {
        res.status(400).json({message: 'Server error - productsRouter.get'});
    }
});
productsRouter.get('/:id', async function(req, res) {
    try {
        const id = req.params.id;
        const product = await productManager.getProductById(parseInt(id));
    
        if(!product) {
            return res.status(404).json({error: `Product id '${id}' not found`});
        }
        return res.status(200).json(product);
    } catch (error) {
        res.status(400).json({error: 'Server error - productsRouter.get'});
    }
});
productsRouter.post('/', async function(req, res) {
    try {
        const product = req.body;

        if(await productManager.addProduct(product)) {
            return res.status(201).json({
                status: "success", 
                msg: 'Product created',
                data: product,
            });
        }
        else { 
            res.status(400).json({error: 'The product could not be created. Plase verify and try again'});
        }
    } catch (error) {
        res.status(400).json({error: 'Server error - productsRouter.post'});
    }
});
productsRouter.put('/:id', async function(req, res) {
    try {
        const id = req.params.id;
        const productUpdate = req.body;

        if(await productManager.updateProduct(parseInt(id), productUpdate)) {
            return res.status(201).json({
                status: "success", 
                msg: 'Product updated',
                data: productUpdate,
            });
        }
        else { 
            res.status(400).json({error: 'The product could not be updated. Plase verify and try again'});
        }
    } catch (error) {
        res.status(400).json({error: 'Server error - productsRouter.put'});
    }
});
productsRouter.delete('/:id', async function(req, res) {
    try {
        const id = req.params.id;

        if(await productManager.deleteProduct(parseInt(id))) {
            return res.status(201).json({
                status: "success", 
                msg: 'Product deleted',
                data: `id: '${id}'`,
            });
        }
        else { 
            res.status(400).json({error: 'The product could not be deleted. Plase verify and try again'});
        }
    } catch (error) {
        res.status(400).json({error: 'Server error - productsRouter.delete'});
    } 
});