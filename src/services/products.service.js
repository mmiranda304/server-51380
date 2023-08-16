import { productsDAO } from '../models/daos/products.dao.js';
import CustomError from './errors/customError.js';
import EErrors from './errors/enums.js';
import { customErrorMsg } from './errors/info.js';

class ProductsService {

  async validateProduct(product) {
    try {
      if (
      !product.title || 
      !product.description || 
      !product.price || product.price < 0 ||
      !product.thumbnail || 
      !product.code || 
      !product.category || 
      !product.stock || product.stock < 0 ||
      product.status === undefined
      ) {
        // console.log('validation error: Please try again completing all the fields correctly.');
        // throw new Error('validation error: Please try again completing all the fields correctly.');
        return undefined;
      }

      const codeExists = await productsDAO.verifyCode(product);
      if(codeExists) {
        console.log('validation error: The code already exists. Please try again with a new code.');
        throw new Error('validation error: The code already exists. Please try again with a new code.');
      }
    } catch (error) {
      //throw new Error('ProductsService.validateProduct: ' + error);
      // CustomError.createError({
      //   name: "Validation product error",
      //   cause: customErrorMsg(product),
      //   message: "Error trying to validate product",
      //   code: EErrors.INVALID_TYPES_ERROR,  
      // });
    }
  }

  async validateUpdateProduct(_id, product) {
    try {
      if (
      (product.price && product.price < 0) ||
      (product.stock || product.stock < 0) ||
      (product.status && product.status === undefined)
      ) {
        console.log('validation error: Please try again completing the fields correctly.');
        throw new Error('validation error: Please try again completing the fields correctly.');
        // CustomError.createError({
        //   name: "Validation product error",
        //   cause: customErrorMsg(product),
        //   message: "Error trying to validate product",
        //   code: EErrors.INVALID_TYPES_ERROR,  
        // });
      }
      if(product.code) {
        const codeExists = await productsDAO.verifyCode(product);
        if(codeExists && codeExists._id != _id) {                                         // Only if the code belong to another product
          console.log('validation error: The code already exists. Please try again with a new code.');
          throw new Error('validation error: The code already exists. Please try again with a new code.');
        }
      }
    } catch (error) {
      throw new Error('ProductsService.validateUpdateProduct: ' + error);
      // CustomError.createError({
      //   name: "Validation product error",
      //   cause: customErrorMsg(product),
      //   message: "Error trying to validate product",
      //   code: EErrors.INVALID_TYPES_ERROR,  
      // });
    }
  }

  async getProducts() { 
    try {
      const products = await productsDAO.getProducts();

      return products;
    } catch (error) {
      throw new Error('ProductsService.getProducts: ' + error);
    }
  }

  async getProductsView(queryParams) {
    try {
      const { limit = 10, page = 1, sort, query } = queryParams;
      const filter = {};

      if (query) {                // Filter config
        filter.$or = [
          {category: query},
          {availability: query},  // Avalability -> stock != 0
        ];
      }

      const options = {           // Paginate options config
          page: parseInt(page),
          limit: parseInt(limit),
          sort: sort === "desc" ? "-price" : "price",
      };

      const products = await productsDAO.paginate(filter, options);

      const productsSimplified = products.docs.map((item) => {
        return {
          _id: item._id.toString(),
          title: item.title,
          description: item.description,
          price: item.price,
          thumbnail: item.thumbnail,
          category: item.category,
        };
      });
      const response = {
        status: "success",
        payload: productsSimplified,
        totalPages: products.totalPages,
        prevPage: products.hasPrevPage ? products.prevPage : null,
        nextPage: products.hasNextPage ? products.nextPage : null,
        page: products.page,
        hasPrevPage: products.hasPrevPage,
        hasNextPage: products.hasNextPage,
        prevLink: products.hasPrevPage ? `/products?limit=${limit}&page=${products.prevPage}` : null,
        nextLink: products.hasNextPage ? `/products?limit=${limit}&page=${products.nextPage}` : null,
      };

      return response;
    } catch (error) {
      throw new Error('ProductsService.getProductsPage: ' + error);
    }   
  }

  async getProductById(_id) {
    try {
      const product = await productsDAO.getProductById(_id);
      return product;
    } catch (error) {
      throw new Error('ProductsService.getProductById: ' + error);
    }
    
  }

  async addProduct(product) {
    try {
      const validateProduct = await this.validateProduct(product);
      if(!validateProduct) {
        return CustomError.createError({
          name: "Validation product error",
          message: "Error trying to validate product",
          code: EErrors.INVALID_TYPES_ERROR,  
          cause: customErrorMsg.generateProductErrorInfo(product),
        });
      }

      const productCreated = await productsDAO.addProduct(product);

      return productCreated;
    } catch (error) {
      throw new Error('ProductsService.addProduct: ' + error);
    }
  }

  async deleteProduct(_id) {
    try {
      const productDeleted = await productsDAO.deleteProduct(_id);

      return productDeleted;
    } catch (error) {
      throw new Error('ProductsService.deleteProduct: ' + error);
    }
  }

  async updateProduct(_id, product) {
    try {
      await this.validateUpdateProduct(_id, product);
      const productUptaded = await productsDAO.updateProduct(_id, product);

      return await this.getProductById(_id);
    } catch (error) {
      throw new Error('ProductsService.updateProduct: ' + error);
    }
  }
}
export const productsService = new ProductsService();