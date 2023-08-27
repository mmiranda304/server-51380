import { cartService } from "../services/cart.service.js";
import { UsersDTO } from "../models/dtos/user.dto.js";
import { ticketsService } from "../services/tickets.service.js";

class CartController {

    async getCarts(req, res) {
        try {
            const carts = await cartService.getCarts();

            return res.status(200).json({
                status: "success",
                payload: carts, 
            });
        } catch (error) {
            req.logger.error('Error in CartController.getCarts:', error);
            return res.status(400).json({
                status: 'error',
                error: 'cart.controller - An error occurred while getting carts',
            });
        }
    }

    async getCartById(req, res) {
        try {
            const id = req.params.id;
            const cart = await cartService.getCartById(id);
        
            if(!cart) {
                req.logger.info(`cart id '${id}' not found`);
                return res.status(404).json({
                    status: 'error',
                    error: `cart id '${id}' not found`,
                });
            }
            return res.status(200).json({
                status: "success",
                payload: cart, 
            });
        } catch (error) {
            req.logger.error('Error in CartController.getCartById:', error);
            return res.status(400).json({
                status: 'error',
                error: 'cart.controller - An error occurred while getting cart',
            });
        }
    }

    async getUserCart (req, res) {
        try {
            const id = req.params.id;
            const {firstName, email, password, isAdmin} = req.session;
            const user = {firstName, email, password, isAdmin, role: 'user'};
            const cart = await cartService.getCartById(id);
            
            if(!cart) {
                req.logger.info(`cart id '${id}' not found`);
                return res.status(404).json({error: `cart id '${id}' not found`});
            }
            const simplifiedProducts = cart.products.map((item) => {
                return {
                    title: item.product.title,
                    price: item.product.price,
                    thumbnail: item.product.thumbnail,
                    quantity: item.quantity,
                };
            });
            const simplifiedCart = {
                _id: cart._id,
                products: simplifiedProducts,
            };
            return res.status(200).render('cart', {user: user, cart: simplifiedCart});
        } catch (error) {
            req.logger.error('Error in ViewsController.getCart:', error);
            return res.status(400).json({
                status: 'error',
                error: 'views.controller - Error get cart view',
            });
        }
    }

    async addCart(req, res) {
        try {
            const cartCreated = await cartService.addCart();
        
            return res.status(201).json({
                status: "success",
                msg: 'Cart created',
                payload: cartCreated,
            });
        } catch (error) {
            req.logger.error('Error in CartController.addCart:', error);
            return res.status(400).json({
                status: 'error',
                error: 'cart.controller - An error occurred while adding cart',
            });
        }
    }

    async addCartProduct(req, res) {
        try {
            const cid = req.params.cid;
            const pid = req.params.pid; 
            const productAdded = await cartService.addCartProduct(cid, pid);
            
            return res.status(201).json({
                status: "success", 
                msg: `Product ${pid} added to cart ${cid}`,
                payload: productAdded,
            });
        } catch (error) {
            req.logger.error('Error in CartController.addCartProduct:', error);
            return res.status(400).json({
                status: 'error',
                error: 'cart.controller - An error occurred while adding product to cart',
            });
        }
    }

    async addCartProducts(req, res) {
        try {
            const { cid } = req.params;
            const products  = req.body;  
            const cart = await cartService.addCartProducts(cid, products);
            
            return res.status(201).json({
                status: "success", 
                msg: 'Products added to cart',
                payload: cart,
            });
        } catch (error) {
            req.logger.error('Error in CartController.updateCartProducts:', error);
            return res.status(400).json({
                status: 'error',
                error: 'cart.controller - An error occurred while updating products in cart',
            });
        }
    }

    async updateProductQuantity(req, res) {
        try {
            const { cid, pid } = req.params;
            const { quantity } = req.body;  
            const cart = await cartService.updateProductQuantity(cid, pid, quantity);
            
            return res.status(200).json({
                status: "success", 
                msg: `Product ${pid} updated`,
                payload: cart,
            });
        } catch (error) {
            req.logger.error('Error in CartController.updateProductQuantity:', error);
            return res.status(400).json({
                status: 'error',
                error: 'cart.controller - An error occurred while updating quantity products in cart',
            });
        }
    }

    async removeCartProduct(req, res) {
        try {
            const { cid, pid } = req.params;      
            const cart = await cartService.removeCartProduct(cid, pid);
            
            return res.status(201).json({
                status: "success", 
                msg: `Product ${pid} deleted`,
                payload: cart,
            });
        } catch (error) {
            req.logger.error('Error in CartController.addCartProduct:', error);
            return res.status(400).json({
                status: 'error',
                error: 'cart.controller - An error occurred while removing product from cart',
            });
        }
    }

    async clearCart(req, res) {
        try {
            const { cid } =  req.params;
            await cartService.clearCart(cid);

            return res.status(201).json({
                status: "success", 
                msg: 'Cart cleared',
                payload: `id: '${cid}'`,
            });
        } catch (error) {
            req.logger.error('Error in CartController.clearCart:', error);
            return res.status(400).json({
                status: 'error',
                error: 'cart.controller - An error occurred while clearing cart',
            });
        }
    }

    async purchaseCart(req, res) {
        try {
            const { cid } =  req.params;
            const cartList = req.body;
            const user = new UsersDTO(req.session.user);
            const ticket = await ticketsService.purchaseCart(cid, cartList, user.email);
            return res.status(201).json({
                status: "success", 
                msg: 'Cart purchased',
                payload: ticket,
            });
        } catch (error) {
            req.logger.error('Error in CartController.purchaseCart:', error);
            return res.status(400).json({
                status: 'error',
                error: 'cart.controller - An error occurred while purchasing cart',
            });
        }
    }

    async getTicketById(req, res) {
        try {
            const { tid } =  req.params;
            const ticket = await ticketsService.getTicketById(tid);
            if(!ticket) {
                return res.status(404).json({
                    status: 'error',
                    error: `ticket id '${tid}' not found`,
                });
            }
            const user = req.session.user;
            
            return res.render('ticket', { ticket: ticket, user: req.session.user } );
        } catch (error) {
            req.logger.error('Error in CartController.getTicketById:', error);
            return res.status(400).json({
                status: 'error',
                error: 'cart.controller - Error get ticket',
            });
        }
    }
}
export const cartController = new CartController();


