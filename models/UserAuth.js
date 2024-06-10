import mongoose from "mongoose"
import { Schema } from "mongoose"

const UserAuthSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  passwordLogin: {
    type: Boolean,
    default: false,
  },
  password: {
    type: String,
    default: "null",
  },
  googleLogin: {
    type: Boolean,
    default: false,
  },
  googleCredentials: {
    type: String,
    unique: true,
    default: "null",
  },
})

const UserAuth = mongoose.model("userAuth", UserAuthSchema)

export default UserAuth
