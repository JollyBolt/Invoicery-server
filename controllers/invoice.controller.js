import Invoice from "../models/Invoice.js"
import Stat from "../models/Stat.js"
import dotenv from "dotenv"
dotenv.config()

const getAllInvoices = async (req, res) => {
  try {
    const userId = req.id
    const search = req.query.search || ""
    const page = parseInt(req.query.page) || 0
    const limit = parseInt(req.query.limit) || 10
    const pageCount = Math.ceil(
      (await Invoice.find({
        userId: userId,
        $or: [
          { "customer.name": { $regex: search, $options: "i" } },
          { invoiceNumber: { $regex: search, $options: "i" } },
        ],
      }).countDocuments()) / limit
    )
    let invoiceList = await Invoice.find({
      userId: userId,
      $or: [
        { "customer.name": { $regex: search, $options: "i" } },
        { invoiceNumber: { $regex: search, $options: "i" } },
      ],
    })
      .skip(page * limit)
      .limit(limit)
    res.status(200).send({ pageCount, invoices: invoiceList })
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
    //creating invoice in DB
    const userId = req.id
    const invoice = new Invoice(req.body)
    invoice.userId = userId
    await invoice.save()

    //Editing Stats associated to user
    const total = req.body.totalAmount
    const stats = await Stat.findOneAndUpdate(
      { userId },
      { $inc: { totalRevenue: total, totalInvoices: 1 } },
    )
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

    //Editing Stats associated to user
    const prevTotal = invoice.totalAmount
    const afterTotal = req.body.totalAmount
    const stats = await Stat.findOneAndUpdate(
      { userId: req.id },
      { $inc: { totalRevenue: afterTotal - prevTotal } },
    )
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

    //Editing Stats associated to user
    const total = invoice.totalAmount
    const stats = await Stat.findOneAndUpdate(
      { userId: req.id },
      { $inc: { totalRevenue: -total, totalInvoices: -1 } },
    )
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
