import { productsService } from "../services/products.service.js";
import { usersService } from "../services/users.service.js";
import { createHash, isValidPassword } from '../utils.js';

class SessionsController {

    async getHome (req, res) {
        try {
            const user = req.session.user;
            const { limit = 10, page = 1, sort, query } = req.query;
            const queryParams = { limit, page, sort, query };

            const {
                payload: products,
                totalPages,
                payload,
                prevPage,
                nextPage,
                page: currentPage,
                hasPrevPage,
                hasNextPage,
                prevLink,
                nextLink,
            } = await productsService.getProductsView(queryParams);

            return res.render('products', {
                user: user,
                products: payload,
                totalPages,
                prevPage,
                nextPage,
                currentPage,
                hasPrevPage,
                hasNextPage,
                prevLink,
                nextLink
            });
        } catch (error) {
            req.logger('Error in ViewsController.getHome:', error);
            return res.status(400).json({
                status: 'error',
                error: 'sessions.controller - Error get home view',
            });
        }
    }
    
    async getHome2 (req, res) {
        try {
            const products = await productsService.getProducts();
            
            return res.status(200).render('home', {products} ); 
        } catch (error) {
            req.logger('Error in sessionsController.getHome2:', error);
            return res.status(400).json({
                status: 'error',
                error: 'sessions.controller - Error get home2 view',
            });
        }
    }

    async getLogin (req, res) {
        try {
            return res.render('login', {} );
        } catch (error) {
            req.logger('Error in sessionsController.getLogin:', error);
            return res.status(400).json({
                status: 'error',
                error: 'sessions.controller - Error get login view',
            });
        }
    }

    async postLogin (req, res) {
        try {
            if (!req.user) {
                req.logger.info("PostLogin - Complete all the fields correctly");
                return res.status(400).render("error", { 
                    error: 'Complete all the fields correctly'
                });
            }
   
            req.session.user = {
                _id: req.user._id,
                firstName: req.user.firstName,
                lastName: req.user.lastName,
                email: req.user.email,
                isAdmin: req.user.isAdmin,
                age: req.user.age,
                role: req.user.role,
                cart: req.user.cart,
            };

            usersService.updateActivity(req.user._id);      //Update user activity

            return res.redirect("/");   
        } catch (error) {
            req.logger('Error in sessionsController.postLogin:', error);
            return res.status(400).json({
                status: 'error',
                error: 'sessions.controller - Error post login view',
            });
        }
    }

    async loginFailed (req, res) {
        try {
            return res.render('login-failed', {} );
        } catch (error) {
            req.logger('Error in sessionsController.loginFailed:', error);
            return res.status(400).json({
                status: 'error',
                error: 'sessions.controller - Error get loginfailed view',
            });
        }
    }

    async getRegister (req, res) {
        try {
            return res.render('register', {} );
        } catch (error) {
            req.logger('Error in sessionsController.getRegister:', error);
            return res.status(400).json({
                status: 'error',
                error: 'sessions.controller - Error get register view',
            });
        }
    }

    async postRegister (req, res) {
        try {
            if (!req.user) {
                req.logger.info("postRegister - Complete all the fields correctly");
                return res.status(400).render("error", { 
                    error: 'Complete all the fields correctly'
                });
            }
            req.session.user = {
                _id: req.user._id,
                firstName: req.user.firstName,
                lastName: req.user.lastName,
                email: req.user.email,
                isAdmin: req.user.isAdmin,
                age: req.user.age,
                role: req.user.role,
                cart: req.user.cart,
            };
            
            usersService.updateActivity(req.user._id);      //Update user activity

            return res.redirect("/");
        } catch (error) {
            req.logger('Error in sessionsController.postRegister:', error);
            return res.status(400).json({
                status: 'error',
                error: 'sessions.controller - Error post register view',
            });
        }
    }

    async registerFailed (req, res) {
        try {
            return res.render('register-failed', {} );
        } catch (error) {
            req.logger('Error in sessionsController.registerFailed:', error);
            return res.status(400).json({
                status: 'error',
                error: 'sessions.controller - Error get registerfailed view',
            });
        }
    }

    async getProfile (req, res) {
        try {
            const role = req.session.role === 'admin' ? true : false;
            return res.render('profile', {
                user: req.session.user
            });
        } catch (error) {
            req.logger('Error in sessionsController.getProfile:', error);
            return res.status(400).json({
                status: 'error',
                error: 'sessions.controller - Error get profile view',
            });
        }
    }

    async getLogout (req, res) {
        try {
            req.session.destroy((err) => {
                if (err) {
                    req.logger.info("getLogout - Cannot finish the session");
                  return res.status(500).render('error', {error: 'Cannot finish the session'});
                }
                res.redirect('/login');
            });
        } catch (error) {
            req.logger('Error in sessionsController.getLogout:', error);
            return res.status(400).json({
                status: 'error',
                error: 'sessions.controller - Error get logout view',
            });
        }
    }

    UpdateUser (req, res) {
        req.session.user = req.user;
        res.redirect('/');
    }

    sendSession (req, res) {
        return res.send(JSON.stringify(req.session));
    }
}
export const sessionsController = new SessionsController();