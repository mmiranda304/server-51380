import { ProductModel } from "../models/products.model.js";

class ProductsDAO {

    async verifyCode(product) {
        try {
            return await ProductModel.exists({code: product.code});
        } catch (error) {
            throw new Error('ProductsDAO.verifyCode: ' + error);
        }
    }

    async getProducts(){
        try {
            return await ProductModel.find({}).lean();
        } catch (error) {
            throw new Error('ProductsDAO.getProducts: ' + error);
        }
    }

    async getProductById(_id){
        try {
            return await ProductModel.findOne({ _id: _id }).lean().exec();
        } catch (error) {
            throw new Error('ProductsDAO.getProduct: ' + error);
        }
    }

    async addProduct(product){
        try {
            return await ProductModel.create(product);
        } catch (error) {
            throw new Error('ProductsDAO.addProduct: ' + error);
        }
    }

    async deleteProduct(_id){
        try {
            return await await ProductModel.deleteOne({ _id: _id });
        } catch (error) {
            throw new Error('ProductsDAO.deleteProduct: ' + error);
        }
    }

    async updateProduct(_id, product){
        try {
            return await await ProductModel.updateOne({ _id: _id }, { $set: product }, { new: true });
        } catch (error) {
            throw new Error('ProductsDAO.updateProduct: ' + error);
        }
    }
    async paginate(filter, options){
        try {
            return await ProductModel.paginate(filter, options);
        } catch (error) {
            throw new Error('ProductsDAO.paginate: ' + error);
        }
    }
}
export const productsDAO = new ProductsDAO();