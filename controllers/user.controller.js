import User from "../models/User.js"
import Stat from "../models/Stat.js"
import mongoose from "mongoose"
import { validationResult } from "express-validator"
import dotenv from "dotenv"
dotenv.config()

const getUser = async (req, res) => {
  try {
    const user = await User.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(req.id),
        },
      },
      {
        $lookup: {
          from: "userauths",
          localField: "userId",
          foreignField: "_id",
          as: "email",
        },
      },
      {
        $addFields: {
          email: {
            $arrayElemAt: ["$email", 0],
          },
        },
      },
      {
        $addFields: {
          email: "$email.email",
        },
      },
    ])
    res.send(user[0])
  } catch (e) {
    console.log({
      msg: "Error occured in getUser",
      error: e.message,
    })
    res.status(500).send({
      msg: "Internal server error occured",
      error: e.message,
    })
  }
}

const createUser = async (req, res) => {
  try {
    const userId = req.id
    const user = new User(req.body)
    user.userId = userId
    await user.save()
    const stats = new Stat()
    stats.userId = userId
    await stats.save()
    res.status(201).json(user)
  } catch (error) {
    console.log({
      msg: "Error occured in createUser",
      error: e.message,
    })
    res.status(500).send({
      msg: "Internal server error occured",
      error: e.message,
    })
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
    console.log({
      msg: "Error occured in updateUser",
      error: e.message,
    })
    res.status(500).send({
      msg: "Internal server error occured",
      error: e.message,
    })
  }
}

export { updateUser, getUser, createUser }
