import mongoose from "mongoose"
import { Schema } from "mongoose"

const StatSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "userAuth",
  },
  totalInvoices: {
    type: Number,
    default: 0,
  },
  totalRevenue: {
    type: Number,
    default: 0,
  },
  totalInvoices: {
    type: Number,
    default: 0,
  },
  totalProducts: {
    type: Number,
    default: 0,
  },
})

const Stat = mongoose.model("stat", StatSchema)

export default Stat
