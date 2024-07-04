import Customer from "../models/Customer.js"
import dotenv from "dotenv"
dotenv.config()

const getAllCustomers = async (req, res) => {
  try {
    const userId = req.id
    const search = req.query.search
    const page = req.query.page
    const limit = req.query.limit
    const pageCount = Math.ceil((await Customer.find().count())/limit)
    let customerList = await Customer.find({
      userId: userId,
      client: { $regex: search, $options: "i" },
    })
      .skip(page * limit)
      .limit(limit)

    res.status(200).send({pageCount,customers:customerList})
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
    res.status(200).send(customer)
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
    const userId = req.id
    const customer = new Customer(req.body)
    customer.userId = userId
    await customer.save()
    res.status(201).json(customer)
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
    const customer = await Customer.findByIdAndUpdate(req.params.id, {...req.body,userId})
    res.status(200).send(customer)
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
    res.status(200).send(customer)
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
