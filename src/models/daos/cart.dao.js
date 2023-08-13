import { CartModel } from "../schemas/cart.schema.js";

class CartDAO {
    async getCarts() {
        try {
            return await CartModel.find();
        } catch (error) {
            throw new Error('CartDAO.getCarts: ' + error);
        }
    }

    async getCartById(_id) {        // Get Cart by ID
        try {
            return await CartModel.findOne({_id: _id}).populate('products.product');
        } catch (error) {
            throw new Error('CartDAO.getCartById: ' + error); 
        }
    }

    async addCart() {           // Add new Cart
        try {
            return await CartModel.create({});           
        } catch (error) {
            throw new Error('CartDAO.addCart: ' + error); 
        }
    }

    async addCartProduct( cid, cart ) {      // Add product to Cart
        try {
            return await CartModel.updateOne({_id: cid}, cart);
        } catch (error) {
            throw new Error('CartDAO.addCartProduct: ' + error); 
        }
    }
    
    async UpdateCart( _id, cart ) {         // Add several products to Cart
        try {
            return await CartModel.updateOne({_id: _id}, cart);
        } catch (error) {
            throw new Error('CartDAO.UpdateCart: ' + error);
        }
    }

    async updateProductQuantity( cid, pid, quantity ) {         // Update quantity products from Cart
        try {
            const cart = await this.getCartById(cid);
            
            const pIndex = cart.products.findIndex(cart => cart.product.equals(pid));   // Finding index product in cart
            if(pIndex === -1) {
                throw new Error('Product not found');
            }
            cart.products[pIndex].quantity += quantity;
            await cart.save();

            return await this.getCartById(cid);
        } catch (error) {
            throw new Error('CartDAO.updateProductQuantity: ' + error);
        }
    }

    async removeCartProduct( cid, pid ) {         // Remove product from Cart
        try {
            const cart = await this.getCartById(cid);

            const pIndex = cart.products.findIndex(cart => cart.product.equals(pid)); // Finding index product in cart
            if(pIndex === -1) {
                throw new Error(`Product ID "${pid}" not found`);
            }
            
            cart.products.splice(pIndex, 1);
            await cart.save();

            return await this.getCartById(cid);
        } catch (error) {
            throw new Error('CartDAO.removeCartProduct: ' + error);
        }
    }

    async clearCart( _id ) {        // Empty Cart
        try {
            return await CartModel.updateOne({ _id: _id }, { $set: { products: [] } }, { new: true });
        } catch (error) {
            throw new Error('CartDAO.clearCart: ' + error);
        }
    }
}
export const cartDAO = new CartDAO();