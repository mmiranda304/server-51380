import { ProductModel } from '../DAO/models/products.model.js';


export class ProductService {

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
        console.log('validation error: Please try again completing all the fields correctly.');
        throw new Error('validation error: Please try again completing all the fields correctly.');
      }

      const codeExists = await ProductModel.exists({code: product.code});
      if(codeExists) {
        console.log('validation error: The code already exists. Please try again with a new code.');
        throw new Error('validation error: The code already exists. Please try again with a new code.');
      }
    } catch (error) {
      throw new Error('ProductService.clearCart: ' + error);
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
      }
      if(product.code) {
        const codeExists = await ProductModel.exists({code: product.code});
        if(codeExists && codeExists._id != _id) {                                         // Only if the code belong to another product
          console.log('validation error: The code already exists. Please try again with a new code.');
          throw new Error('validation error: The code already exists. Please try again with a new code.');
        }
      }
    } catch (error) {
      throw new Error('ProductService.validateUpdateProduct: ' + error);
    }
  }

  async getProducts() { 
    try {
      const products = await ProductModel.find({}).lean();

      return products;
    } catch (error) {
      throw new Error('ProductService.getProducts: ' + error);
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

      const products = await ProductModel.paginate(filter, options);

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
      throw new Error('ProductService.getProductsPage: ' + error);
    }   
  }

  async getProductById(_id) {
    try {
      const product = await ProductModel.find({ _id: _id }).lean().exec();

      return product;
    } catch (error) {
      throw new Error('ProductService.getProductById: ' + error);
    }
    
  }

  async addProduct(product) {
    try {
      await this.validateProduct(product);
      const productCreated = await ProductModel.create( product );

      return productCreated;
    } catch (error) {
      throw new Error('ProductService.addProduct: ' + error);
    }
  }

  async deleteProduct(_id) {
    try {
      const productDeleted = await ProductModel.deleteOne({ _id: _id });

      return productDeleted;
    } catch (error) {
      throw new Error('ProductService.deleteProduct: ' + error);
    }
  }

  async updateProduct(_id, product) {
    try {
      await this.validateUpdateProduct(_id, product);
      const productUptaded = await ProductModel.updateOne({ _id: _id }, { $set: product }, { new: true });

      return await this.getProductById(_id);
    } catch (error) {
      throw new Error('ProductService.updateProduct: ' + error);
    }
  }
}
