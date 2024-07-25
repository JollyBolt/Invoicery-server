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

    let revenueForChart = await Invoice.aggregate([
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
      {
        $project: {
          _id: 0,
          month: "$_id",
          revenue: 1,
        },
      },
    ])

    let monthlyRevenue = [
      {
        month: "Jan",
        revenue: 0,
      },
      {
        month: "Feb",
        revenue: 0,
      },
      {
        month: "Mar",
        revenue: 0,
      },
      {
        month: "Apr",
        revenue: 0,
      },
      {
        month: "May",
        revenue: 0,
      },
      {
        month: "Jun",
        revenue: 0,
      },
      {
        month: "Jul",
        revenue: 0,
      },
      {
        month: "Aug",
        revenue: 0,
      },
      {
        month: "Sep",
        revenue: 0,
      },
      {
        month: "Oct",
        revenue: 0,
      },
      {
        month: "Nov",
        revenue: 0,
      },
      {
        month: "Dec",
        revenue: 0,
      },
    ]

    if (revenueForChart.length > 0) {
      let i
      for (i = 0; i < revenueForChart.length; i++) {
        monthlyRevenue[revenueForChart[i]?.month].revenue =
          revenueForChart[i].revenue
      }
    }
    revenueForChart = monthlyRevenue
    console.log(revenueForChart)

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

const getDashboardYearlyChartData = async (req, res) => {
  try {
    const userId = req.id
    const year = req.query.year || new Date().getFullYear().toString()

    const revenueForYearlyChart = await Invoice.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          "invoiceDate.year": year,
        },
      },
      {
        $facet: {
          overallStats: [
            {
              $group: {
                _id: null,
                invoiceCount: { $sum: 1 },
                highestInvoiceValue: { $max: "$totalAmount" },
                lowestInvoiceValue: { $min: "$totalAmount" },
                totalRevenue: { $sum: "$totalAmount" },
              },
            },
            {
              $project: {
                _id: 0,
                invoiceCount: 1,
                highestInvoiceValue: 1,
                lowestInvoiceValue: 1,
                totalRevenue: 1,
              },
            },
          ],
          monthlyRevenue: [
            {
              $group: {
                _id: "$invoiceDate.month",
                revenue: { $sum: "$totalAmount" },
              },
            },
            {
              $project: {
                _id: 0,
                month: "$_id",
                revenue: 1,
              },
            },
            {
              $sort: {
                month: 1, // Sorting by month in ascending order
              },
            },
          ],
        },
      },
    ])

    let monthlyRevenue = [
      {
        month: "Jan",
        revenue: 0,
      },
      {
        month: "Feb",
        revenue: 0,
      },
      {
        month: "Mar",
        revenue: 0,
      },
      {
        month: "Apr",
        revenue: 0,
      },
      {
        month: "May",
        revenue: 0,
      },
      {
        month: "Jun",
        revenue: 0,
      },
      {
        month: "Jul",
        revenue: 0,
      },
      {
        month: "Aug",
        revenue: 0,
      },
      {
        month: "Sep",
        revenue: 0,
      },
      {
        month: "Oct",
        revenue: 0,
      },
      {
        month: "Nov",
        revenue: 0,
      },
      {
        month: "Dec",
        revenue: 0,
      },
    ]
    if (revenueForYearlyChart[0].monthlyRevenue.length > 0) {
      let i
      for (i = 0; i < revenueForYearlyChart[0].monthlyRevenue.length; i++) {
        monthlyRevenue[
          revenueForYearlyChart[0]?.monthlyRevenue[i]?.month
        ].revenue = revenueForYearlyChart[0].monthlyRevenue[i].revenue
      }
    }
    revenueForYearlyChart[0].monthlyRevenue = monthlyRevenue

    res.status(200).send({
      revenueForYearlyChart: revenueForYearlyChart[0],
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

const getDashboardMonthlyChartData = async (req, res) => {
  try {
    const userId = req.id
    const year = req.query.year || new Date().getFullYear().toString()
    const month = parseInt(req.query.month)

    const monthlyChartData = await Invoice.aggregate([
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
          invoiceCount: {
            $sum: 1,
          },
          revenue: {
            $sum: "$totalAmount",
          },
        },
      },
      {
        $project: {
          _id: 0,
          customer: "$_id",
          invoiceCount: 1,
          revenue: 1,
        },
      },
    ])

    const monthlyStats = await Invoice.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          "invoiceDate.year": year,
          "invoiceDate.month": month,
        },
      },
      {
        $group: {
          _id: null,
          invoiceCount: { $sum: 1 },
          highestInvoiceValue: { $max: "$totalAmount" },
          lowestInvoiceValue: { $min: "$totalAmount" },
          totalRevenue: { $sum: "$totalAmount" },
        },
      },
      {
        $project: {
          _id: 0,
          invoiceCount: 1,
          highestInvoiceValue: 1,
          lowestInvoiceValue: 1,
          totalRevenue: 1,
        },
      },
    ])

    res.status(200).send({
      monthlyStats: monthlyStats,
      monthlyChartData: monthlyChartData,
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
  getDashboardYearlyChartData,
  getDashboardMonthlyChartData,
}
