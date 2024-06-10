import mongoose from "mongoose";
import { Schema } from "mongoose";

const ProductSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "userAuth",
  },
  name: {
    type: String,
    required: true,
  },
  hsn_code: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
  },
});

const Product = mongoose.model("product", ProductSchema);

export default Product;
