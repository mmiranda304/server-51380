//@ts-check
import { Schema, model } from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';

const schemaUser = new Schema({
  firstName: { 
    type: String, 
    required: false, 
    max: 100 
  },
  lastName: { 
    type: String, 
    required: false, 
    max: 100 
  },
  email: { 
    type: String, 
    required: true, 
    max: 100, 
    unique:true 
  },
  age: {
    type: Number,
    require: false,
    min: 18,
    max: 110
  },
  password: {
    type: String,
    required: true,
    max: 100,
  },
  isAdmin: {
    type: Boolean,
    required: true,
    default: false,
  },
  cart : {
    type: String,
    require: false,
  },
  role: {
    type: String,
    enum: ['user', 'premium', 'admin'],
    require: true,
    default: 'user',
  },
  lastActivity: {
    type: Date,
    default: Date.now,
  }
},
{
  versionKey: false
});
schemaUser.plugin(mongoosePaginate);
export const UserModel = model("users", schemaUser);