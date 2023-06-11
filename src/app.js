import express from 'express'
import handlebars from "express-handlebars";
import { productService, productsRouter } from './routes/products.router.js';
import { cartRouter } from './routes/cart.router.js';
import { usersRouter } from './routes/users.router.js';
import { Server } from "socket.io";
import path from "path";
import { __dirname, connectMongo } from "./utils.js";

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

//Rutas: API REST CON JSON
app.use('/api/users', usersRouter);


const httpServer = app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}`);
});

connectMongo();


const socketServer = new Server(httpServer);

socketServer.on("connection", async (socket) => {       //New client connection
  console.log('New client connected '+ socket.id);
  let products = await productService.getProducts();
  
  socket.on('newProduct', async (product) => {            //New product comm
    console.log(JSON.stringify(product));
    await productService.addProduct(product);
    products = await productService.getProducts();
    socket.emit('newProduct', products);
  });

  socket.on('deleteProduct', async (_id) => {              //Delete product comm
    console.log('socket.on.delProd - id: ' + _id);
    await productService.deleteProduct(_id);
    products = await productService.getProducts();
    socket.emit('newProduct', products);
  });

  socket.emit('newProduct', products);
});

app.get('/realtimeproducts', async function(req, res) {
  try {
      const products = await productService.getProducts();
      
      return res.status(200).render('realTimeProducts', {products}); 
  } catch (error) {
      res.status(400).json({message: 'Server error - productsRouter.get.realtimeproducts'});
  }
});
app.get('/home', async function(req, res) {
  try {
      const products = await productService.getProducts();
      
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