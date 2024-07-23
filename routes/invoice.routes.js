import { Router } from "express"
import {
  editInvoice,
  getAllInvoices,
  getSingleInvoice,
  createInvoice,
  deleteInvoice,
  getCustomerDetailData,
  getDashboardYearlyChartData,
  getDashboardMonthlyChartData,
} from "../controllers/invoice.controller.js"
import { verifyToken } from "../middleware/verifyToken.js"

const router = Router()

//Fetch all invoices
router.get("/getallinvoices", verifyToken, getAllInvoices)

//Fetch single invoice
router.get("/getinvoice/:id", verifyToken, getSingleInvoice)

router.get("/getcustomerdetaildata", verifyToken, getCustomerDetailData)
router.get(
  "/getdashboardyearlychartdata",
  verifyToken,
  getDashboardYearlyChartData
)
router.get(
  "/getdashboardmonthlychartdata",
  verifyToken,
  getDashboardMonthlyChartData
)

//Add Invoice
router.route("/createinvoice").post(
  // body("email", "Enter a valid Email").isEmail(),
  verifyToken,
  createInvoice
)

// Edit Invoice
router.put("/editinvoice/:id", verifyToken, editInvoice);

//Delete invoice
router.delete("/deleteinvoice/:id", verifyToken, deleteInvoice)

export default router
