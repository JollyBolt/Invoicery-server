import { Router } from "express";
import { getCustomers } from "../controllers/customer.controller.js";
import { createCustomer } from "../controllers/customer.controller.js";
import { editCustomer } from "../controllers/customer.controller.js";
import { deleteCustomer } from "../controllers/customer.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = Router();

//Fetch all customers
router.get("/getcustomers", verifyToken, getCustomers);

//Add customer
router.post("/createcustomer", verifyToken, createCustomer);

//edit customer
router.put("/editcustomer/:id", verifyToken, editCustomer);

//delete customer
router.delete("/deletecustomer/:id", verifyToken, deleteCustomer);

export default router;
