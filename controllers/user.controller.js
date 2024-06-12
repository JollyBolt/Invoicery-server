import User from "../models/User.js"
import { validationResult } from "express-validator"
import dotenv from "dotenv"
dotenv.config()

const getUser = async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.id })
    res.send(user)
  } catch (e) {
    console.log(e.message)
  }
}

const createUser = async (req, res) => { 
  try {
    const userId = req.id
    const user = new User(req.body)
    user.userId = userId
    await user.save()
    res.status(201).json(user)
  } catch (error) {
    console.log(error.message)
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

export { updateUser, getUser, createUser }
