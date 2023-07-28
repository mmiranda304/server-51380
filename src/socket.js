import { Server } from "socket.io";
import { httpServer } from "./app";
import { productsService } from "../services/products.service.js";

const socketServer = new Server(httpServer);

socketServer.on("connection", async (socket) => {       //New client connection
    console.log('New client connected '+ socket.id);
    let products = await productsService.getProducts();

    socket.on('newProduct', async (product) => {            //New product comm
        await productsService.addProduct(product);
        products = await productsService.getProducts();
        socket.emit('newProduct', products);
    });

    socket.on('deleteProduct', async (_id) => {              //Delete product comm
        await productsService.deleteProduct(_id);
        products = await productsService.getProducts();
        socket.emit('newProduct', products);
    });

    socket.emit('newProduct', products);
});
