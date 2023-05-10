import express from 'express'
import ProductManager from './productManager.js';
import { productsRouter } from './routes/products.router.js';
import { cartRouter } from './routes/cart.router.js';

const app = express();
const port = 8080;

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('/products', productsRouter);
app.use('/cart', cartRouter);

app.listen(port, () => {
    console.log(`app listening on port http://localhost:${port}`);
});

app.get("*", (req, res) => {    // Catch all
    return res.status(400).json({
        status: "error", 
        msg: 'Route not found',
        data: {},
    });
});