//@ts-check
import { Schema, model } from "mongoose";

const schemaTicket = new Schema({
  code: { 
    type: String, 
    required: true, 
    unique: true 
  },
  purchase_datetime: { 
    type: Date, 
    required: true 
  },
  amount: { 
    type: Number, 
    default: Date.now(), 
    required: true 
  },
  purchaser: { 
    type: String, 
    required: true, 
    default: 'Anonymous:API' 
  },
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
export const TicketModel = model("tickets", schemaTicket);