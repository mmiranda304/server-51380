import mongoose from "mongoose";
import nodemailer from "nodemailer";
import { cartDAO } from "../models/daos/cart.dao.js";
import { productsDAO } from "../models/daos/products.dao.js";
import { ticketsDAO } from "../models/daos/tickets.dao.js";
import { cartService } from "./cart.service.js";

class TicketsService {
    async purchaseCart(cartId, cartList, userMail) {
        try {
            if (!Array.isArray(cartList)) {
                return {
                    status: 400,
                    result: {
                        status: 'error',
                        error: 'The cart list must be a valid array.',
                    },
                };
            }
    
            if (!cartList || cartList.length === 0) {
                return {
                    status: 400,
                    result: {
                        status: 'error',
                        error: `Cart list is empty.`,
                    },
                };
            }
    
            if (!mongoose.Types.ObjectId.isValid(cartId)) {
                return {
                    status: 400,
                    result: {
                        status: 'error',
                        error: `Invalid cart ID.`,
                    },
                };
            }
    
            const cartFiltered = await cartDAO.getCartById(cartId);
            if (!cartFiltered) {
                return {
                    status: 400,
                    result: {
                        status: 'error',
                        error: `Cart not found.`,
                    },
                };
            }
    
            const productsNotPurchased = [];      // List with products without quantity available
    
            const products = await Promise.all(
                cartList.map(async (product) => {
                    const productFiltered = await productsDAO.getProductById(product.id);
                    if (!productFiltered) {
                        return {
                            status: 400,
                            result: {
                                status: 'error',
                                error: `Product not found.`,
                            },
                        };
                    }
        
                    if (productFiltered.stock >= product.quantity) {    // Stock extists 
                        productFiltered.stock -= product.quantity;          // Discount quantity
                        await productFiltered.save();
                        return productFiltered;
                    } else {                                            // Stock doesn't extists
                        productsNotPurchased.push(product);                 // Update productsNotPurchased
                        return null;
                    }
                })
            );
    
            const productsFiltered = products.filter((product) => product !== null);  // Filter products without stock
            if (productsFiltered.length === 0) {
                return {
                    status: 400,
                    result: {
                        status: 'error',
                        error: `No products available.`,
                    },
                };
            }
    
            const totalAmount = cartList.reduce((acc, product) => {           // Total price to buy
                const productFiltered = productsFiltered.find((p) => p._id.equals(product.id));
                if (productFiltered) {
                    acc += productFiltered.price * product.quantity;
                }
                return acc;
            }, 0);
        
            const newOrder = {
                code: Math.floor(Math.random() * 1000000),
                purchase_datetime: new Date(),
                amount: +totalAmount,
                purchaser: userMail,
                products: productsFiltered.map((product) => ({
                    id: product._id,
                    quantity: cartList.find((p) => p.id === product._id.toString()).quantity,
                })),
            };  
            const orderCreated = await ticketsDAO.addTicket(newOrder);  // Create order

            
            if (productsFiltered.length > 0) {      // Remove products buyed from cart
                productsFiltered.map(async (product) => {
                    await cartService.removeCartProduct(cartId, product._id);
                });
                await cartService.clearCart(cartId);
            }
            
            if (productsNotPurchased.length > 0) {  //Add products without buy
                await cartService.addCartProducts(cartId, productsNotPurchased);
            }
            const sendTicket = this.sendTicketEmail(userMail, orderCreated)
            return orderCreated;
        } catch (error) {
            throw new Error('TicketsService.purchaseCart: ' + error);
        }
      }

      async sendTicketEmail(userMail, orderCreated) {
        try {
            const transport = nodemailer.createTransport({
                service: "gmail",
                port: 587,
                auth: {
                    user: process.env.GOOGLE_EMAIL,
                    pass: process.env.GOOGLE_PASS,
                },
            });

            const result = await transport.sendMail({
                from: process.env.GOOGLE_EMAIL,
                to: userMail,
                subject: `[MIM Games Store] Orden realizada [${orderCreated.code}]`,
                html: `
                        <div>
                        <h1>MIM Games Store</h1>
                        <p>Tu orden ha sido realizada</p>
                        <p>Codigo del ticket: <b>#${orderCreated.code}</b></p>
                        <p>Fecha y hora de la compra: ${orderCreated.purchase_datetime}</p>
                        <p><b>TOTAL ABONADO</b>: ${orderCreated.amount}</p>
                        </div>
                      `,
              });
            return result;
        } catch (error) {
            throw new Error('TicketsService.sendTicketEmail: ' + error);
        }
      }

      async getTicketById(id) {
        try {
          if (!mongoose.Types.ObjectId.isValid(id)) {
            return {
              status: 400,
              result: {
                status: 'error',
                error: `Invalid ticket ID.`,
              },
            };
          }
          const ticket = await ticketsDAO.getTicketById(id);
          console.log(ticket);
          if (!ticket) {
            return {
              status: 404,
              result: {
                status: 'error',
                error: `Ticket not found.`,
              },
            };
          }

          return ticket;
        } catch (error) {
            throw new Error('TicketsService.getTicketById: ' + error);
        }
      }
  }
export const ticketsService = new TicketsService();