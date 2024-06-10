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
    required: true,
  },
  googleLogin: {
    type: Boolean,
    default: false,
  },
  googleCredentials: {
    type: String,
    required: true,
    unique: true,
  }
})

const UserAuth = mongoose.model("userAuth", UserAuthSchema)

export default UserAuth
