import express from 'express'
import ProductManager from './productManager.js';
const productManager = new ProductManager('./src/products.json');

const app = express();
const port = 8080;

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.listen(port, () => {
    console.log(`app listening on port http://localhost:${port}`);
});

app.get("/products", async (req, res) => {
    try {
        const limit = req.query.limit;
        const products = await productManager.getProducts();
        
        if(!limit) {
            return res.status(200).json(products);
        }
        return res.status(200).json(products.slice(0, limit)); 
    } catch (error) {
        res.status(500).json({message: 'Server error'});
    }
});

app.get("/products/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const product = await productManager.getProductById(parseInt(id));
    
        if(!product) {
            return res.status(404).json({error: `Product id "${id}" not found`});
        }
        return res.status(200).json(product);
    } catch (error) {
        res.status(500).json({error: 'Server error'});
    }
});