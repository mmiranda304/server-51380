import express from "express";
import { ProductService } from "../services/products.service.js";

export const productsRouter = express.Router();
export const productService = new ProductService();

productsRouter.get('/', async function(req, res) {
    try {
        const limit = req.query.limit;
        const products = await productService.getProducts();
        if(!limit) {
            return res.status(200).json(products); 
        }

    } catch (error) {
        res.status(400).json({message: 'Server error - productsRouter.get'});
    }
});

productsRouter.get('/:id', async function(req, res) {
    try {
        const id = req.params.id;
        const product = await productService.getProductById(id);
    
        if(!product.length) {
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
        const productCreated = await productService.addProduct(product);
        return res.status(201).json({
            status: 'success',
            msg: 'user created',
            data: productCreated,
        });
    } 
    catch (e) {
        console.log(e);
        return res.status(500).json({
            status: 'error',
            msg: 'Server error - productsRouter.post',
            data: {},
        });
    }
});

productsRouter.put('/:id', async function(req, res) {
    try {
        const id = req.params.id;
        const productUpdate = req.body;
        const productExists = await productService.getProductById(id);
    
        if(!productExists.length) {
            return res.status(404).json({error: `Product id '${id}' not found`});
        }
        const product = await productService.updateProduct(id, productUpdate);
        if(product) {
            return res.status(201).json({
                status: "success", 
                msg: 'Product updated',
                data: product,
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

        if(await productService.deleteProduct(id)) {
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