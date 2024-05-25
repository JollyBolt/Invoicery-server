import Product from '../models/Product.js'
import dotenv from "dotenv";
dotenv.config();

const getAllProducts = async (req, res) => {
    try {
      const userId = req.id;
      let ProductList = await Product.find({ userId: userId });
      res.status(200).send(ProductList.toArray());
    } catch (e) {
      res.status(500).send("Internal server error occured");
    }
  };
  
  const getProduct = async (req, res) => {
    try {
      const Product = await Product.findById(req.params.id);
      res.status(200).send(Product);
    } catch (e) {
      res.status(500).send("Internal server error occured");
    }
  };
  
  const createProduct = async (req, res) => {
    try {
      const userId = req.id;
      const Product = new Product(req.body);
      Product.userId = userId;
      await Product.save();
      res.status(201).send(Product);
    } catch (e) {
      res.status(500).send("Internal server error occured");
    }
  };
  
  const editProduct = async (req, res) => {
    try {
      const Product = await Product.findByIdAndUpdate(req.params.id, req.body);
      res.status(200).send(Product);
    } catch (e) {
      res.status(500).send("Internal server error occured");
    }
  };
  
  const deleteProduct = async (req, res) => {
    try {
      const Product = await Product.findByIdAndDelete(req.params.id);
      res.status(200).send(Product);
    } catch (e) {
      res.status(500).send("Internal server error occured");
    }
  };
  export {
    getAllProducts,
    createProduct,
    editProduct,
    deleteProduct,
    getProduct,
  };
  