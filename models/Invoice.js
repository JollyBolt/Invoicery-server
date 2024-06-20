import mongoose from "mongoose";
import { Schema } from "mongoose";

const InvoiceSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "userAuth",
  },
  template: {
    type: String,
    required: true
  },
  invoiceNumber: {
    type: String,
    required: true,
    unique: true
  },
  invoiceDate: {
    day: {
      type: String,
      required: true,
    },
    month: {
      type: Number,
      required: true,
    },
    year: {
      type: String,
      required: true,
    },

  },
  customer: {
    name: {
      type: String,
      required: true,
    },
    gstin: {
      type: String,
      required: true,
    },
    contactPerson: {
      type: String,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      billing: [
        {
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
        }

      ],
      shipping: [
        {
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
        }
      ]
    }
  },
  products: [
    {
      name: {
        type: String,
        required: true,
      },
      hsnCode: {
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
      discount: {
        value: {
          type: Number,
          required: false,
        },
        type: {
          type: String,
          required: false,
        },
      },
    },
  ],
  amount: {
    type: Number,
    required: true,
  },
  taxes: {
    igst: {
      type: Number,
      required: false,
    },
    cgst: {
      type: Number,
      required: false,
    },
    sgst: {
      type: Number,
      required: false,
    },
  }, termsNConditions: [
    { tnc: { type: String, required: false } }
  ]
});

const Invoice = mongoose.model("invoice", InvoiceSchema);

export default Invoice;
