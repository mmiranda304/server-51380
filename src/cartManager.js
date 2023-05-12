import fs from 'fs';
import ProductManager from './productManager.js';
import { productManager } from './routes/products.router.js';

class CartManager {
    idAssign = 1;
    constructor(path) {
        this.path = path;
    }
    async getCarts() {
        try {
            if(fs.existsSync(this.path)) {
                let data = await fs.promises.readFile(this.path, "utf-8");
                let carts = JSON.parse(data);
                for (let i = 0; i < carts.length; i++) {
                    if (carts[i].idCart === this.idAssign) {
                        this.idAssign++;
                    }
                }
                return carts;
            }
            await fs.promises.writeFile(this.path, JSON.stringify([])); // If data doesn't exist, then create
            console.log('New carts.json data created');
            return [];
        } catch (error) {
            throw new Error(error.message);
        }
    }
    async getCartById(cartId) {
        try {
            let carts = await this.getCarts();
            let cartFound = carts.find(cart => cart.idCart === cartId);

            if(cartFound != undefined) {
                return cartFound;
            }
            console.log("Product not found");
            return undefined;            
        } catch (error) {
            throw new Error(error.message);
        }
    }
    async addCart() {
        try {
            let carts = await this.getCarts();
            let newCart = {
                idCart: this.idAssign, 
                products: [],
            };

            carts.push(newCart);
            await fs.promises.writeFile(this.path,JSON.stringify(carts));

            console.log("Cart added successfully.");
            return true;
        } catch (error) {
            throw new Error(error.message);
        }
    }
    async addProduct(cartId, productId) {
        try {
            const product = await productManager.getProductById(productId);
            const cart = await this.getCartById(cartId);

            if(!product || !cart) {     // IDs don't exist
                if(!product && !cart) {
                    console.log(`The cart id ${cartId} and the product id ${productId} dont exist`);
                }
                if(!cart) {
                    console.log(`The cart id ${cartId} doesn't exist`);
                }
                if(!product) {
                    console.log(`The product id ${productId} doesn't exist`);
                }
                return undefined;
            }
            let carts = await this.getCarts();

            let iCart = carts.findIndex(cart => cart.idCart === cartId);                                // Finding index cart
            let iProduct = carts[iCart].products.findIndex(product => product.idProduct === productId); // Finding index product in cart

            if(iProduct < 0) {  // Product doesn't exist
                carts[iCart].products.push({idProduct: productId, quantity: 1});
            }
            else {              // Product exist
                carts[iCart].products[iProduct].quantity++;
            }
            const productsString = JSON.stringify(carts);
            await fs.promises.writeFile(this.path,productsString);
            
            console.log('Product added to cart successfuly');
            return true;
        } catch (error) {
            throw new Error(error.message);
        }
    }
}
export default CartManager;