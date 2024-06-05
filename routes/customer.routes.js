import { Router } from "express";
import { getAllCustomers } from "../controllers/customer.controller.js";
import { getCustomer } from "../controllers/customer.controller.js";
import { createCustomer } from "../controllers/customer.controller.js";
import { editCustomer } from "../controllers/customer.controller.js";
import { deleteCustomer } from "../controllers/customer.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { body } from "express-validator";
const router = Router();

//Fetch all customers
router.get("/getallcustomers", verifyToken, getAllCustomers);

//Fetch single customer
router.get("/getcustomer/:id", verifyToken, getCustomer);

//Add customer
router
  .route("/createcustomer")
  .post(
    body("email", "Enter a valid Email").isEmail(),
    verifyToken,
    createCustomer
  );

//edit customer
router.put("/editcustomer/:id", verifyToken, editCustomer);

//delete customer
router.delete("/deletecustomer/:id", verifyToken, deleteCustomer);

export default router;
