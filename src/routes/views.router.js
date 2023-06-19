import express from "express";
import { ProductService } from "../services/products.service.js";
import { CartService } from "../services/cart.service.js";

export const viewsRouter = express.Router();
const productService = new ProductService();
const cartService = new CartService();

viewsRouter.get('/', async function(req, res) {     // TERMINAR
    try {
        const { limit = 10, page = 1, sort, query } = req.query;
        const queryParams = { limit, page, sort, query };

        const products = productService.getProductsView();

        return res.status(200).render('home', {products}); 
    
    } catch (error) {
        res.status(400).json({message: 'Server error - productsRouter.get: ' + error});
    }
  });
viewsRouter.get('/products', async function(req, res) {
    try {
        const { limit = 10, page = 1, sort, query } = req.query;
        const queryParams = { limit, page, sort, query };
        
        const {
            payload: products,
            totalPages,
            payload,
            prevPage,
            nextPage,
            page: currentPage,
            hasPrevPage,
            hasNextPage,
            prevLink,
            nextLink,
        } = await productService.getProductsView(queryParams);

        return res.render('products', {
            products: payload,
            totalPages,
            prevPage,
            nextPage,
            currentPage,
            hasPrevPage,
            hasNextPage,
            prevLink,
            nextLink
        });
    } catch (error) {
        res.status(400).json({message: 'Server error - viewsRouter.getProducts: ' + error});
    }
  });

  viewsRouter.get('/product/:id', async function(req, res) {
    try {
        const id = req.params.id;
        const product = await productService.getProductById(id);
        
        if(!product.length) {
            return res.status(404).json({error: `Product id '${id}' not found`});
        }
        const Simplifiedproduct = {
            _id: product[0]._id.toString(),
            title: product[0].title,
            description: product[0].description,
            price: product[0].price,
            thumbnail: product[0].thumbnail,
            category: product[0].category,
        };
        
        return res.status(200).render('product', {product: Simplifiedproduct});
    } catch (error) {
        res.status(400).json({message: 'Server error - viewsRouter.getProduct: ' + error});
    }
  });

  viewsRouter.get('/cart/:id', async function(req, res) {
    try {
        const id = req.params.id;
        const cart = await cartService.getCartById(id);
        
        if(!cart.length) {
            return res.status(404).json({error: `cart id '${id}' not found`});
        }
        console.log(cart);
        console.log(cart.products);
        const simplifiedCart = cart[0].products.map((item) => {
            return {
                title: item.product.title,
                price: item.product.price,
                thumbnail: item.product.thumbnail,
                quantity: item.quantity,
            };
        });
        console.log(simplifiedCart);
        return res.status(200).render('cart', {cart: simplifiedCart});
    } catch (error) {
        res.status(400).json({message: 'Server error - viewsRouter.getCart: ' + error});
    }
  });

viewsRouter.get('/realtimeproducts', async function(req, res) {
    try {
        const products = await productService.getProducts();
        return res.status(200).render('realTimeProducts', {products}); 
    
    } catch (error) {
        res.status(400).json({message: 'Server error - viewsRouter.get.realtimeproducts' + error});
    }
  });

  viewsRouter.get('/home', async function(req, res) {
    try {
        const products = await productService.getProducts();
        return res.status(200).render('home', {products}); 
   
    } catch (error) {
        res.status(400).json({message: 'Server error - viewsRouter.get.home' + error});
    }
  });