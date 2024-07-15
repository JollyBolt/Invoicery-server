import { Router } from "express"
import {
  editInvoice,
  getAllInvoices,
  getSingleInvoice, 
  createInvoice, 
  deleteInvoice,
  getCustomerDetailData,
  getDashboardChartData,
} from "../controllers/invoice.controller.js"
import { verifyToken } from "../middleware/verifyToken.js"

const router = Router()

//Fetch all invoices
router.get("/getallinvoices", verifyToken, getAllInvoices)

//Fetch single invoice
router.get("/getinvoice/:id", verifyToken, getSingleInvoice)

router.get("/getcustomerdetaildata", verifyToken, getCustomerDetailData)
router.get("/getdashboardchartdata", verifyToken, getDashboardChartData)

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
