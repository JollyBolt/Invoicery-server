import { Router } from "express";
import {
  getAllProducts,
  createProduct,
  editProduct,
  deleteProduct,
  getProduct,
} from "../controllers/product.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";
const router = Router();

//Fetch all products
router.get("/getallproducts", verifyToken, getAllProducts);

//Fetch single product
router.get("/getproduct/:id", verifyToken, getProduct);

//Add product
router.post("/createproduct", verifyToken, createProduct);

//edit product
router.put("/editproduct/:id", verifyToken, editProduct);

//delete product
router.delete("/deleteproduct/:id", verifyToken, deleteProduct);

export default router;
