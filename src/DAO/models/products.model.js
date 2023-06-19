import { Schema, model } from "mongoose";
import monsoosePaginate from 'mongoose-paginate-v2';

const schemaProduct = new Schema({
    title: { 
      type: String, 
      max: 100 
    },
    description: { 
      type: String, 
      max: 100 
    },
    price: { 
      type: Number, 
      min: 0 
    },
    thumbnail: { 
      type: String, 
      max: 200
    },
    code: { 
      type: String, 
      max: 100 
    },
    status: { 
      type: Boolean, 
      default: true 
    },
    stock: { 
      type: Number, 
      min: 0 
    },
    category: {
      type: String,
      enum: ['cards', 'strategy', 'family', 'party'],
    }
  },
  {
    versionKey: false
  });
  schemaProduct.plugin(monsoosePaginate);
  export const ProductModel = model("products", schemaProduct);