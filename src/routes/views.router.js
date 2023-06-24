import express from "express";
import { ProductService } from "../services/products.service.js";
import { CartService } from "../services/cart.service.js";
import { UserModel } from '../DAO/models/users.model.js';
import { createHash, isValidPassword } from '../utils.js';

export const viewsRouter = express.Router();
const productService = new ProductService();
const cartService = new CartService();

viewsRouter.get('/', async function(req, res) {     // TERMINAR
    try {
        const { limit = 10, page = 1, sort, query } = req.query;
        const queryParams = { limit, page, sort, query };
        const user = req.session.user;

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
            user: user,
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
        res.status(400).json({message: 'Server error - viewsRouter.getHome: ' + error});
    }
  });

viewsRouter.get('/login', (req, res) => {              // Login Page
    return res.render('login', {});
});
  
viewsRouter.post('/login', async (req, res) => {       // Login POST
    try {
        const email = req.body.email;
        const password = req.body.password;

        const user = await UserModel.findOne({email: email});
        if(user && !isValidPassword(user.password, password)) {
            delete user.password;
            req.session.user = user;

            return res.redirect("/");
        }
        else {
            return res.status(401).render("error", { error: 'Email o contraseña erróneos'});
        }
        
    } catch (error) {
        return res.status(400).render("error", { message: 'Server error - viewsRouter.postLogin: ' + error});
    }
});

viewsRouter.get('/register', (req, res) => {           // Register Page
    return res.render('register', {});
});

viewsRouter.post('/register', async (req, res) => {    // Register POST
    try {
        let { email, password, firstName, lastName } = req.body;
        if (!email || !password || !firstName || !lastName) {
            return res.status(400).render("error", { error: 'Completar todos los campos correctamente'});
        }
        password = createHash(password);
        await UserModel.create({ email, password, firstName, lastName, isAdmin: false});

        return res.redirect("/login");
    } catch (error) {
        console.log(error);
        return res.status(400).render("error", { error: 'No se pudo crear el usuario. Intente con otro mail'});
    }
        
});

viewsRouter.get('/logout', (req, res) => {               // Logout page
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).render('error', {error: 'no se pudo cerrar la sesión'});
      }
      res.redirect('/login')
    });
});

viewsRouter.get('/products', async function(req, res) {
    try {
        const { limit = 10, page = 1, sort, query } = req.query;
        const queryParams = { limit, page, sort, query };
        const {firstName, email, password, isAdmin} = req.session;
        const user = {firstName, email, password, isAdmin};

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
            user: user,
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
        const {firstName, email, password, isAdmin} = req.session;
        const user = {firstName, email, password, isAdmin};
        const product = await productService.getProductById(id);
        
        if(!product) {
            return res.status(404).json({error: `Product id '${id}' not found`});
        }
        const Simplifiedproduct = {
            _id: product._id.toString(),
            title: product.title,
            description: product.description,
            price: product.price,
            thumbnail: product.thumbnail,
            category: product.category,
        };
        
        return res.status(200).render('product', {user: user, product: Simplifiedproduct});
    } catch (error) {
        res.status(400).json({message: 'Server error - viewsRouter.getProduct: ' + error});
    }
  });

  viewsRouter.get('/cart/:id', async function(req, res) {
    try {
        const id = req.params.id;
        const {firstName, email, password, isAdmin} = req.session;
        const user = {firstName, email, password, isAdmin};
        const cart = await cartService.getCartById(id);
        
        if(!cart) {
            return res.status(404).json({error: `cart id '${id}' not found`});
        }
        console.log(cart);
        console.log(cart.products);
        const simplifiedCart = cart.products.map((item) => {
            return {
                title: item.product.title,
                price: item.product.price,
                thumbnail: item.product.thumbnail,
                quantity: item.quantity,
            };
        });
        console.log(simplifiedCart);
        return res.status(200).render('cart', {user: user, cart: simplifiedCart});
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