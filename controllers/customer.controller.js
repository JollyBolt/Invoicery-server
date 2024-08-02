import Customer from "../models/Customer.js"
import Stat from "../models/Stat.js"
import dotenv from "dotenv"
dotenv.config()

const getAllCustomers = async (req, res) => {
  try {
    const userId = req.id
    const search = req.query.search
    const page = parseInt(req.query.page) || 0
    const limit = parseInt(req.query.limit) || 10
    const pageCount = Math.ceil(
      (await Customer.find({
        userId: userId,
        client: { $regex: search, $options: "i" },
      }).countDocuments()) / limit
    )
    let customerList = await Customer.find({
      userId: userId,
      client: { $regex: search, $options: "i" },
    })
      .sort({ _id: -1 })
      .skip(page * limit)
      .limit(limit)
    res.status(200).send({ data: { pageCount, customers: customerList }, token: req.headers.authorization.split(" ")[1] })
  } catch (e) {
    console.log({
      msg: "Error occured in getAllCustomers",
      error: e.message,
    })
    res.status(500).send({
      msg: "Internal server error occured",
      error: e.message,
    })
  }
}

const getCustomer = async (req, res) => {
  try {
    const customer = await Customer.find({ _id: req.query.id })
    res.status(200).send({ data: { pageCount: 1, customers: customer }, token: req.headers.authorization.split(" ")[1] })
  } catch (e) {
    console.log({
      msg: "Error occured in getCustomer",
      error: e.message,
    })
    res.status(500).send({
      msg: "Internal server error occured",
      error: e.message,
    })
  }
}

const createCustomer = async (req, res) => {
  try {
    //creating customer in DB
    const userId = req.id
    const customer = new Customer(req.body)
    customer.userId = userId
    await customer.save()

    //Editing Stats associated to user
    const stats = await Stat.findOneAndUpdate(
      { userId },
      { $inc: { totalCustomers: 1 } },
    )

    res.status(201).json({ data: { customer }, token: req.headers.authorization.split(" ")[1] })
  } catch (e) {
    console.log({
      msg: "Error occured in createCustomers",
      error: e.message,
    })
    res.status(500).send({
      msg: "Internal server error occured",
      error: e.message,
    })
  }
}

const editCustomer = async (req, res) => {
  try {
    const userId = req.id
    const customer = await Customer.findByIdAndUpdate(req.params.id, { ...req.body, userId })
    res.status(200).send({ data: customer, token: req.headers.authorization.split(" ")[1] })
  } catch (e) {
    console.log({
      msg: "Error occured in editCustomers",
      error: e.message,
    })
    res.status(500).send({
      msg: "Internal server error occured",
      error: e.message,
    })
  }
}

const deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id)

    //Editing Stats associated to user
    const stats = await Stat.findOneAndUpdate(
      { userId: req.id },
      { $inc: { totalCustomers: -1 } },
    )
    res.status(200).send({ data: customer, token: req.headers.authorization.split(" ")[1] })
  } catch (e) {
    console.log({
      msg: "Error occured in deleteCustomers",
      error: e.message,
    })
    res.status(500).send({
      msg: "Internal server error occured",
      error: e.message,
    })
  }
}
export {
  getAllCustomers,
  createCustomer,
  editCustomer,
  deleteCustomer,
  getCustomer,
}
