import { Server } from "socket.io";
import { httpServer } from "./app";
  
const socketServer = new Server(httpServer);

socketServer.on("connection", async (socket) => {       //New client connection
    console.log('New client connected '+ socket.id);
    let products = await productService.getProducts();

    socket.on('newProduct', async (product) => {            //New product comm
        await productService.addProduct(product);
        products = await productService.getProducts();
        socket.emit('newProduct', products);
    });

    socket.on('deleteProduct', async (_id) => {              //Delete product comm
        await productService.deleteProduct(_id);
        products = await productService.getProducts();
        socket.emit('newProduct', products);
    });

    socket.emit('newProduct', products);
});
