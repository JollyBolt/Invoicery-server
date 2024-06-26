import Invoice from "../models/Invoice.js"
import dotenv from "dotenv"
dotenv.config()

const getAllInvoices = async (req, res) => {
  try {
    const userId = req.id
    let invoiceList = await Invoice.find({ userId: userId })
    res.status(200).send(invoiceList)
  } catch (e) {
    console.log({
      msg: "Error occured in getAllInvoices",
      error: e.message,
    })
    res.status(500).send({
      msg: "Internal server error occured",
      error: e.message,
    })
  }
}

const getSingleInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
    res.status(200).send(invoice)
  } catch (e) {
    console.log({
      msg: "Error occured in getSingleInvoice",
      error: e.message,
    })
    res.status(500).send({
      msg: "Internal server error occured",
      error: e.message,
    })
  }
}

const createInvoice = async (req, res) => {
  try {
    const userId = req.id
    const invoice = new Invoice(req.body)
    invoice.userId = userId
    await invoice.save()
    res.status(201).send(invoice)
  } catch (e) {
    console.log({
      msg: "Error occured in createInvoice",
      error: e.message,
    })
    res.status(500).send({
      msg: "Internal server error occured",
      error: e.message,
    })
  }
}

const editInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndUpdate(req.params.id, req.body)
    res.status(200).send(invoice)
  } catch (e) {
    console.log({
      msg: "Error occured in editInvoice",
      error: e.message,
    })
    res.status(500).send({
      msg: "Internal server error occured",
      error: e.message,
    })
  }
}

const deleteInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndDelete(req.params.id)
    res.status(200).send(invoice)
  } catch (e) {
    console.log({
      msg: "Error occured in deleteInvoice",
      error: e.message,
    })
    res.status(500).send({
      msg: "Internal server error occured",
      error: e.message,
    })
  }
}
export { getAllInvoices, createInvoice, editInvoice, deleteInvoice, getSingleInvoice }
