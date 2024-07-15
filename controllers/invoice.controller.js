import mongoose from "mongoose"
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
      .sort({ invoiceNumber: -1 })
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
      { $inc: { totalRevenue: total, totalInvoices: 1 } }
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
      { $inc: { totalRevenue: afterTotal - prevTotal } }
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
      { $inc: { totalRevenue: -total, totalInvoices: -1 } }
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

const getCustomerDetailData = async (req, res) => {
  try {
    const userId = req.id
    const year = req.query.year || new Date().getFullYear().toString()
    const month = parseInt(req.query.month) || new Date().getMonth()
    const customer = req.query.customer || null
    const revenueTillDate = await Invoice.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          "customer.name": customer,
        },
      },
      {
        $group: {
          _id: null,
          revenue: {
            $sum: "$totalAmount",
          },
        },
      },
    ])
    const revenueThisYear = await Invoice.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          "customer.name": customer,
          "invoiceDate.year": year,
        },
      },
      {
        $group: {
          _id: null,
          revenue: {
            $sum: "$totalAmount",
          },
        },
      },
    ])
    const revenueThisMonth = await Invoice.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          "customer.name": customer,
          "invoiceDate.year": year,
          "invoiceDate.month": month,
        },
      },
      {
        $group: {
          _id: null,
          revenue: {
            $sum: "$totalAmount",
          },
        },
      },
    ])

    const revenueForChart = await Invoice.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          "invoiceDate.year": year,
          "customer.name": customer,
        },
      },
      {
        $group: {
          _id: "$invoiceDate.month",
          revenue: {
            $sum: "$totalAmount",
          },
        },
      },
    ])
    res.status(200).send({
      revenueForChart: revenueForChart,
      revenueTillDate:
        revenueTillDate.length > 0 ? revenueTillDate[0].revenue : 0,
      revenueThisYear:
        revenueThisYear.length > 0 ? revenueThisYear[0].revenue : 0,
      revenueThisMonth:
        revenueThisMonth.length > 0 ? revenueThisMonth[0].revenue : 0,
    })
  } catch (e) {
    console.log({
      msg: "Error occured in getYearlyRevenue",
      error: e.message,
    })
    res.status(500).send({
      msg: "Internal server error occured",
      error: e.message,
    })
  }
}

const getDashboardChartData = async (req, res) => {
  try {
    const userId = req.id
    const year = req.query.year || new Date().getFullYear().toString()
    const month = parseInt(req.query.month) || new Date().getMonth()
    const revenueForMonthlyChart = await Invoice.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          "invoiceDate.year": year,
          "invoiceDate.month": month,
        },
      },
      {
        $group: {
          _id: "$customer.name",
          invoices: {
            $sum: 1,
          },
        },
      },
    ])

    const revenueForYearlyChart = await Invoice.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          "invoiceDate.year": year,
        },
      },
      {
        $group: {
          _id: "$invoiceDate.month",
          revenue: {
            $sum: "$totalAmount",
          },
        },
      },
    ])

    res.status(200).send({
      revenueForYearlyChart: revenueForYearlyChart,
      revenueForMonthlyChart: revenueForMonthlyChart,
    })
  } catch (e) {
    console.log({
      msg: "Error occured in getYearlyRevenue",
      error: e.message,
    })
    res.status(500).send({
      msg: "Internal server error occured",
      error: e.message,
    })
  }
}

export {
  getAllInvoices,
  createInvoice,
  editInvoice,
  deleteInvoice,
  getSingleInvoice,
  getCustomerDetailData,
  getDashboardChartData,
}
