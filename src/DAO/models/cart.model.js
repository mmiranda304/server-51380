import { Schema, model } from "mongoose";

const schemaCart = new Schema({
    products: {
      type: [
        {
          product: {
            type: Schema.Types.ObjectId,
            ref: 'products',
          },
          quantity: {
            type: Number,
            min: 1,
            default: 1
          }
        }
      ],
      default: []
    }
},
{
  versionKey: false
});
export const CartModel = model("carts", schemaCart);

// schemaCart.pre('findOne', function () {    // PRE POPULATION
//     this.populate('products.product');
// });
// schemaCart.pre('find', function () {  // PRE POPULATION
//     this.populate('products.product');
// });
