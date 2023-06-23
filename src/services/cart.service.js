import { CartModel } from "../DAO/models/cart.model.js";
import { ProductService } from "../services/products.service.js";

const productService = new ProductService();

export class CartService {

    async validateCartProduct(cid, pid) {               // Cart and Product IDs validatión
        try {
            const cartExists = await CartModel.findOne({_id: cid});
            const productExists = await productService.getProductById(pid);

            if(!cartExists && !productExists) {
                throw new Error('Cart and product IDs not found. Please verify and try again');
            }
            if(!cartExists) {
                throw new Error('Cart not found');
            }
            if(!productExists) {
                throw new Error('Product does not exists');
            }
            return cartExists;

        } catch (error) {
            throw new Error('CartService.validateCartProduct: ' + error); 
        }
    }
    async getCarts() {      // Get Carts
        try {
            const carts = await CartModel.find();
            return carts;  

        } catch (error) {
            throw new Error('CartService.getCart: ' + error); 
        }
    }

    async getCartById(_id) {        // Get Cart by ID
        try {
            const cart = await CartModel.findOne({_id: _id}).populate('products.product');
            return cart;

        } catch (error) {
            throw new Error('CartService.getCart: ' + error); 
        }
    }

    async addCart() {           // Add new Cart
        try {
            const cartCreated = await CartModel.create({});
            return cartCreated;
            
        } catch (error) {
            throw new Error('CartService.addCart: ' + error); 
        }
    }

    async addCartProduct( cid, pid ) {      // Add product to Cart
        try {
            const cart = await this.validateCartProduct(cid, pid);
            const pIndex = cart.products.findIndex(cart => cart.product.equals(pid)); // Finding index product in cart
            if(pIndex !== -1) {                             // Product exists -> increment quantity
                cart.products[pIndex].quantity += 1;
                await cart.save();
                return await this.getCartById(cid);  
            }
            cart.products.push({product: pid});       // Product does not exists -> add Product
            const cartUpdated = await CartModel.updateOne({_id: cid}, cart);
            return await this.getCartById(cid);     

        } catch (error) {
            throw new Error('CartService.addCartProduct: ' + error); 
        }
    }
    
    async updateCartProducts( _id, products ) {         // Add several producst to Cart
        try {
            const cart = await CartModel.findOne({_id: _id});     // ID cart validation
            if(!cart) {
                throw new Error('Cart not found');
            }
        
            const updateProducts = products.map(async (product) => {
                const { pid, quantity } = product;
                console.log('map quantity: ' + quantity);
                const productExists = await productService.getProductById(pid);     // ID product validation
                if(!productExists.length) {
                    throw new Error('Product ID not found. Please verify and try again');
                }
                
                const pIndex = cart.products.findIndex(cart => cart.product.equals(pid)); // Finding index product in cart
                if(pIndex !== -1) {                             // Product exists -> update quantity
                    cart.products[pIndex].quantity += quantity;
                }
                else {
                    cart.products.push({product: pid, quantity: quantity});         // Product does not exists -> add Product
                }
            });
            await Promise.all(updateProducts);
            const cartUpdated = await CartModel.updateOne({_id: _id}, cart);
           
            return await this.getCartById(_id);

        } catch (error) {
            throw new Error('CartService.updateCartProducts: ' + error);
        }
    }

    async updateProductQuantity( cid, pid, quantity ) {     // Update product quantity
        try {
            const cart = await this.validateCartProduct(cid, pid);
            
            const pIndex = cart.products.findIndex(cart => cart.product.equals(pid));   // Finding index product in cart
            if(pIndex === -1) {
                throw new Error('Product not found');
            }
            cart.products[pIndex].quantity += quantity;
            cart.save();

            return await this.getCartById(cid);
            
        } catch (error) {
            throw new Error('CartService.updateCartProducts: ' + error);
        }
    }

    async removeCartProduct( cid, pid ) {       // Remove product from Cart
        try {
            const cart = await this.validateCartProduct(cid, pid);
            
            const pIndex = cart.products.findIndex(cart => cart.product.equals(pid)); // Finding index product in cart
            if(pIndex === -1) {
                throw new Error('Product not found');
            }
            cart.products.splice(pIndex, 1);
            await cart.save();

            return await this.getCartById(cid);
            
        } catch (error) {
            throw new Error('CartService.removeCartProduct: ' + error);
        }
    }
    async clearCart( _id ) {        // Empty Cart
        try {
            const cart = await CartModel.updateOne({ _id: _id }, { $set: { products: [] } }, { new: true });
        } catch (error) {
            throw new Error('CartService.clearCart: ' + error);
        }
    }
}