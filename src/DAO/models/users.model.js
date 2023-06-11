//@ts-check
import { Schema, model } from "mongoose";

const schemaUser = new Schema({
  firstName: { type: String, required: true, max: 100 },
  lastName: { type: String, required: true, max: 100 },
  email: { type: String, required: true, max: 100, unique:true },
});
export const UserModel = model("users", schemaUser);