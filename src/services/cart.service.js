import { cartDAO } from "../models/daos/cart.dao.js";
import { productsService } from "../services/products.service.js";


export class CartService {

    async validateCartProduct(cid, pid) {               // Cart and Product IDs validatión
        try {
            const cartExists = await cartDAO.getCartById(cid);
            const productExists = await productsService.getProductById(pid);

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
            return await cartDAO.getCarts();
        } catch (error) {
            throw new Error('CartService.getCart: ' + error); 
        }
    }

    async getCartById(_id) {        // Get Cart by ID
        try {
            return await cartDAO.getCartById(_id);
        } catch (error) {
            throw new Error('CartService.getCartById: ' + error); 
        }
    }

    async addCart() {           // Add new Cart
        try {
            return await cartDAO.addCart();           
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
            const cartUpdated = cartDAO.UpdateCart(cid, cart);
            return await this.getCartById(cid);     

        } catch (error) {
            throw new Error('CartService.addCartProduct: ' + error); 
        }
    }
    
    async addCartProducts( _id, products ) {         // Add several products to Cart
        try {
            const cart = await cartDAO.getCartById(_id);     // ID cart validation
            if(!cart) {
                throw new Error('Cart not found');
            }
        
            const updateProducts = products.map(async (product) => {
                const { pid, quantity } = product;
                const productExists = await productsService.getProductById(pid);     // ID product validation
                if(!productExists) {
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

            const cartUpdated = cartDAO.UpdateCart(cid, cart);
           
            return await this.getCartById(_id);

        } catch (error) {
            throw new Error('CartService.updateCartProducts: ' + error);
        }
    }

    async updateProductQuantity( cid, pid, quantity ) {     // Update product quantity
        try {
            return cartDAO.updateProductQuantity(cid, pid, quantity);            
        } catch (error) {
            throw new Error('CartService.updateCartProducts: ' + error);
        }
    }

    async removeCartProduct( cid, pid ) {       // Remove product from Cart
        try {         
            return cartDAO.removeCartProduct(cid, pid);            
        } catch (error) {
            throw new Error('CartService.removeCartProduct: ' + error);
        }
    }
    
    async clearCart( _id ) {        // Empty Cart
        try {
            const cart = await cartDAO.clearCart(_id);
        } catch (error) {
            throw new Error('CartService.clearCart: ' + error);
        }
    }
}
export const cartService = new CartService();