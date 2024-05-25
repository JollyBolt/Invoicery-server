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
  address: {
    streetAddress: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    stateCode: {
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
  },
});

const Customer = mongoose.model("customer", CustomerSchema);

export default Customer;
