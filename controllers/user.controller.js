import User from "../models/User.js"
import { validationResult } from "express-validator"
import dotenv from "dotenv"
dotenv.config()

const getUser = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.id })
    res.send(user)
  } catch (e) {
    console.log(e.message)
  }
}

const updateUser = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    //error occurs due to invalid input
    return res.status(400).json({ errors: errors.array()[0].msg })
  }
  try {
    const user = await User.findByIdAndUpdate(req.id, req.body) //we use req.id here instead of req.params.id because in case of user both will be same
    res.status(200).send(user)
  } catch (e) {
    res.status(500).send("Internal server error occured")
  }
}

export { updateUser, getUser }
