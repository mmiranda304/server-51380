import { productsService } from "../services/products.service.js";
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
            console.error('Error in ViewsController.getHome:', error);
            return res.status(400).json({
                status: 'error',
                error: 'views.controller - Error get home view',
            });
        }
    }
    
    async getHome2 (req, res) {
        try {
            const products = await productsService.getProducts();
            
            return res.status(200).render('home', {products} ); 
        } catch (error) {
            console.error('Error in ViewsController.getHome2:', error);
            return res.status(400).json({
                status: 'error',
                error: 'views.controller - Error get home2 view',
            });
        }
    }

    async getLogin (req, res) {
        try {
            return res.render('login', {} );
        } catch (error) {
            console.error('Error in ViewsController.getLogin:', error);
            return res.status(400).json({
                status: 'error',
                error: 'views.controller - Error get login view',
            });
        }
    }

    async postLogin (req, res) {
        try {
            if (!req.user) {
                return res.status(400).render("error", { 
                    error: 'Completar todos los campos correctamente'
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
            return res.redirect("/");   
        } catch (error) {
            console.error('Error in ViewsController.postLogin:', error);
            return res.status(400).json({
                status: 'error',
                error: 'views.controller - Error post login view',
            });
        }
    }

    async getRegister (req, res) {
        try {
            return res.render('register', {} );
        } catch (error) {
            console.error('Error in ViewsController.getRegister:', error);
            return res.status(400).json({
                status: 'error',
                error: 'views.controller - Error get register view',
            });
        }
    }

    async postRegister (req, res) {
        try {
            if (!req.user) {
                return res.status(400).render("error", { 
                    error: 'Completar todos los campos correctamente'
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
            return res.redirect("/");
        } catch (error) {
            console.error('Error in ViewsController.postRegister:', error);
            return res.status(400).json({
                status: 'error',
                error: 'views.controller - Error post register view',
            });
        }
    }
    async getProfile (req, res) {
        try {
            const role = req.session.role === 'admin' ? true : false;
            console.log(req.session.user);
            return res.render('profile', {
                user: req.session.user
            });
        } catch (error) {
            console.error('Error in ViewsController.getProfile:', error);
            return res.status(400).json({
                status: 'error',
                error: 'views.controller - Error get profile view',
            });
        }
    }

    async getLogout (req, res) {
        try {
            req.session.destroy((err) => {
                if (err) {
                  return res.status(500).render('error', {error: 'No se pudo cerrar la sesión'});
                }
                res.redirect('/login');
            });
        } catch (error) {
            console.error('Error in ViewsController.getLogout:', error);
            return res.status(400).json({
                status: 'error',
                error: 'views.controller - Error get logout view',
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