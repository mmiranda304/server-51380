import { productsService } from "../services/products.service.js";

class ProductsController {
    async getProducts(req, res) { 
        try {
            const products = await productsService.getProducts();

            req.logger.info("Getting Products");
            return res.status(200).json({
                status: 'success',
                payload: products,
            }); 
        } catch (error) {
            req.logger.error('Error in ProductController.getProducts:', error);
            return res.status(400).json({
                status: 'error',
                error: 'products.controller - An error occurred while getting products',
            });
        }
    }

    async getProductById(req, res) { 
        try {
            const id = req.params.id;
            const product = await productsService.getProductById(id);

            if(!product) {
                req.logger.info(`Product id '${id}' not found`);
                return res.status(404).json({
                    status: 'error',
                    payload: `Product id '${id}' not found`,
                });
            }
            req.logger.info(`Getting product '${id}`);
            return res.status(200).json({
                status: 'success',
                payload: product,
            }); 
        } catch (error) {
            req.logger.error('Error in ProductController.getProductById:', error);
            return res.status(400).json({
                status: 'error',
                error: 'products.controller - An error occurred while getting the product',
            });
        }
    }

    async getUserProduct (req, res) {
        try {
            const id = req.params.id;
            const {firstName, email, password, isAdmin} = req.session;
            const user = {firstName, email, password, isAdmin, role: 'user'};
            const product = await productsService.getProductById(id);
            
            if(!product) {
                req.logger.info(`Product id '${id}' not found`);
                return res.status(404).json({
                    status: 'error',
                    error: `Product id '${id}' not found`,
                });
            }
            const Simplifiedproduct = {
                _id: product._id.toString(),
                title: product.title,
                description: product.description,
                price: product.price,
                thumbnail: product.thumbnail,
                category: product.category,
            };
            
            return res.status(200).render('product', {user: user, product: Simplifiedproduct});
        } catch (error) {
            req.logger.error('Error in ProductController.getProduct:', error);
            return res.status(400).json({
                status: 'error',
                error: 'views.controller - Error get product view',
            });
        }
    }

    async getViewProducts (req, res) {
        try {
            const { limit = 10, page = 1, sort, query } = req.query;
            const queryParams = { limit, page, sort, query };
            const {firstName, email, password, isAdmin} = req.session;
            const user = {firstName, email, password, isAdmin, role: 'user'};

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
            req.logger.error('Error in ProductController.getProducts:', error);
            return res.status(400).json({
                status: 'error',
                error: 'views.controller - Error get products view',
            });
        }
    }
    async addProduct(req, res, next) { 
        try {
            const product = req.body;
            if(req.session.role == 'premium') {
                product.owner = req.session.email;
            }
            product.owner = 'admin';

            const productCreated = await productsService.addProduct(product);
            return res.status(201).json({
                status: 'success',
                payload: productCreated,
            });
        } catch (error) {
            req.logger.error('Error in ProductController.addProduct:', error);
            return res.status(400).json({
                status: 'error',
                error: 'products.controller - An error occurred while adding product',
            });
        }
    }

    async updateProduct(req, res) { 
        try {
            const id = req.params.id;
            const productUpdate = req.body;
            
            const productExists = await productsService.getProductById(id);
            if(!productExists) {
                return res.status(404).json({
                    status: 'error',
                    payload: `Product id '${id}' not found`,
                });
            }
            
            const product = await productsService.updateProduct(id, productUpdate);
            if(!product) {
                req.logger.info(`The product could not be updated. Plase verify and try again`);
                res.status(400).json({
                    status: 'error',
                    payload: 'The product could not be updated. Plase verify and try again',
                });
            }
            return res.status(201).json({
                status: "success", 
                payload: product,
            });            
        } catch (error) {
            req.logger.error('Error in ProductController.updateProduct:', error);
            return res.status(400).json({
                status: 'error',
                error: 'products.controller - An error occurred while updating product',
            });
        }   
    }
    
    async deleteProduct(req, res) { 
        try {
            const id = req.params.id;

            const productExists = await productsService.getProductById(id);
            if(!productExists) {
                req.logger.info(`Deleting Product - Product id '${id}' not found`);
                return res.status(404).json({
                    status: 'error',
                    error: `Product id '${id}' not found`,
                });
            }
            if( ( req.session.role != 'admin' ) && ( req.session.email != productExists.owner ) ) {
                return res.status(404).json({
                    status: 'error',
                    error: `The user does not have permissions to delete this product`,
                });
            }
            
            await productsService.deleteProduct(id);
            return res.status(201).json({
                status: "success", 
                payload: `id: '${id}'`,
            });
        } catch (error) {
            req.logger.error('Error in ProductController.deleteProduct:', error);
            return res.status(400).json({
                status: 'error',
                error: 'products.controller - An error occurred while deleting product',
            });
        }
    }

    async realTimeProducts (req, res) {
        try {
            const products = await productsService.getProducts();
            return res.status(200).render('realTimeProducts', {products} ); 
        } catch (error) {
            req.logger.error('Error in ProductController.realTimeProducts:', error);
            return res.status(400).json({
                status: 'error',
                error: 'views.controller - Error get realTimeProducts view',
            });
        }
    }
}
export const productsController = new ProductsController();
