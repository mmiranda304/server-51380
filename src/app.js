import express from 'express'
import handlebars from "express-handlebars";
import { productsRouter } from './routes/products.router.js';
import { cartRouter } from './routes/cart.router.js';
import { productManager } from './routes/products.router.js';
import { Server } from "socket.io";
import path from "path";
import { __dirname } from "./utils.js";

const app = express();
const port = 8080;

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));

app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");

app.use('/products', productsRouter);
app.use('/cart', cartRouter);

const httpServer = app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}`);
});

const socketServer = new Server(httpServer);

socketServer.on("connection", async (socket) => {       //New client connection
  console.log('New client connected '+ socket.id);
  const products = await productManager.getProducts();
  
  socket.on('newProduct', async (product) => {            //New product comm
    console.log(JSON.stringify(product));
    await productManager.addProduct(product);
    products = await productManager.getProducts();
  });

  socket.on('deleteProduct', async (id) => {              //Delete product comm
    console.log(JSON.stringify(id));
    await productManager.deleteProduct(id);
    products = await productManager.getProducts();
  });

  socket.emit('newProduct', products);
});

app.get('/realtimeproducts', async function(req, res) {
  try {
      const products = await productManager.getProducts();
      
      return res.status(200).render('realTimeProducts', {products}); 
  } catch (error) {
      res.status(400).json({message: 'Server error - productsRouter.get.realtimeproducts'});
  }
});
app.get('/home', async function(req, res) {
  try {
      const products = await productManager.getProducts();
      
      return res.status(200).render('home', {products}); 
  } catch (error) {
      res.status(400).json({message: 'Server error - productsRouter.get.realtimeproducts'});
  }
});

app.get("*", (req, res) => {    // Catch all
    return res.status(400).json({
        status: "error", 
        msg: 'Route not found',
        data: {},
    });
});