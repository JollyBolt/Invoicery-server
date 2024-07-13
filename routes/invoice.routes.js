import { Router } from "express"
import {
  getAllInvoices,
  getCustomerDetailData,
  getDashboardChartData,
} from "../controllers/invoice.controller.js"
import { getSingleInvoice } from "../controllers/invoice.controller.js"
import { createInvoice } from "../controllers/invoice.controller.js"
import { deleteInvoice } from "../controllers/invoice.controller.js"
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

//edit customer
// router.put("/editcustomer/:id", verifyToken, editCustomer);

//delete invoice
router.delete("/deleteinvoice/:id", verifyToken, deleteInvoice)

export default router
