import Product from "../models/Product.js"
import dotenv from "dotenv"
dotenv.config()

const getAllProducts = async (req, res) => {
  try {
    const userId = req.id
    const search = req.query.search
    const page = req.query.page
    const limit = req.query.limit
    let productList = await Product.find({
      userId: userId,
      name: { $regex: search, $options: "i" },
    })
      .skip(page * limit)
      .limit(limit)

    res.status(200).send(productList)
  } catch (e) {
    console.log({
      msg: "Error occured in getAllProducts",
      error: e.message,
    })
    res.status(500).send({
      msg: "Internal server error occured",
      error: e.message,
    })
  }
}

const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    res.status(200).send(product)
  } catch (e) {
    console.log({
      msg: "Error occured in getProduct",
      error: e.message,
    })
    res.status(500).send({
      msg: "Internal server error occured",
      error: e.message,
    })
  }
}

const createProduct = async (req, res) => {
  try {
    const userId = req.id
    const product = new Product(req.body)
    product.userId = userId
    await product.save()
    res.status(201).json(product)
  } catch (e) {
    console.log({
      msg: "Error occured in createProduct",
      error: e.message,
    })
    res.status(500).send({
      msg: "Internal server error occured",
      error: e.message,
    })
  }
}

const editProduct = async (req, res) => {
  try {
    const userId = req.id
    const product = await Product.findByIdAndUpdate(req.params.id, {...req.body,userId})
    res.status(200).send(product)
  } catch (e) {
    console.log({
      msg: "Error occured in editProduct",
      error: e.message,
    })
    res.status(500).send({
      msg: "Internal server error occured",
      error: e.message,
    })
  }
}

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id)
    res.status(200).send(product)
  } catch (e) {
    console.log({
      msg: "Error occured in deleteProduct",
      error: e.message,
    })
    res.status(500).send({
      msg: "Internal server error occured",
      error: e.message,
    })
  }
}
export { getAllProducts, createProduct, editProduct, deleteProduct, getProduct }
