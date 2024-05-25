import mongoose from "mongoose";
import { Schema } from "mongoose";

const CustomerSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  name: {
    type: String,
    required: true,
  },
  org: {
    type: String,
    required: true,
  },
  gstin: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  contact: {
    type: String,
    required: true,
  },
  street_address: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  }, 
  state_code: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  zip: {
    type: String,
    required: true,
  },
});

const User = mongoose.model("customer", CustomerSchema);

export default User;
