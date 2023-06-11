import { ProductModel } from '../DAO/models/products.model.js';


export class ProductService {
  async validateProduct(product) {
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
  }
  async validateUpdateProduct(_id, product) {
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
  }
  async getProducts() {
    const products = await ProductModel.find({}).lean();
    return products;
  }
  async getProductById(_id) {
    const product = await ProductModel.find({ _id: _id }).lean();
    return product;
  }

  async addProduct(product) {
    await this.validateProduct(product);

    const productCreated = await ProductModel.create( product );
    return productCreated;
  }

  async deleteProduct(_id) {
    const productDeleted = await ProductModel.deleteOne({ _id: _id });
    return productDeleted;
  }

  async updateProduct(_id, product) {
    await this.validateUpdateProduct(_id, product);
    const productUptaded = await ProductModel.updateOne({ _id: _id }, { $set: product }, { new: true });
    return await this.getProductById(_id);
  }
}
