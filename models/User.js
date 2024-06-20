import mongoose from "mongoose";
import { Schema } from "mongoose";

const UserSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "userAuth",
  },
  name: {
    type: String,
    required: true,
  },
  org: {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    gstin: {
      type: String,
      required: true,
    },
    address: {
      streetAddress: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      zip: {
        type: String,
        required: true,
      }
    }
  },
  // email: {
  //   type: String,
  //   required: true,
  //   unique: true,
  // },
  phone: {
    type: String,
    required: true,
  },
  banking: {
    bankName: {
      type: String,
    },
    branch: {
      type: String,
    },
    accountNumber: {
      type: String,
    },
    ifsc: {
      type: String,
    },
  },
})

const User = mongoose.model("user", UserSchema);

export default User;
