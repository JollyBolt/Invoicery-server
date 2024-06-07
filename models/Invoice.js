import mongoose from "mongoose";
import { Schema } from "mongoose";

const InvoiceSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  customer: {
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
  },
  products: [
    {
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
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
  amount: {
    type: Number,
    required: true,
  },
  discount: {
    value: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
  },
  taxes: {
    igst: {
      type: Number,
      required: true,
    },
    cgst: {
      type: Number,
      required: true,
    },
    sgst: {
      type: Number,
      required: true,
    },
  },
});

const Invoice = mongoose.model("invoice", InvoiceSchema);

export default Invoice;
