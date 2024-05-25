import Customer from "../models/Customers.js";
import dotenv from "dotenv";
dotenv.config();

const getCustomers = async (req, res) => {
  try {
    const userId = req.id;
    let customerList = await Customer.findById({ user: userId });
    res.status(200).send(customerList);
  } catch (e) {
    res.status(500).send("Internal server error occured");
  }
};

const createCustomer = async (req, res) => {
  try {
    const userId = req.id;
    const customer = new Customer(req.body);
    customer.user = userId;
    await customer.save();
    res.status(201).send(customer);
  } catch (e) {
    res.status(500).send("Internal server error occured");
  }
};

const editCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndUpdate(req.params.id, req.body);
    res.status(200).send(customer);
  } catch (e) {
    res.status(500).send("Internal server error occured");
  }
};

const deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    res.status(200).send(customer);
  } catch (e) {
    res.status(500).send("Internal server error occured");
  }
};
export { getCustomers, createCustomer, editCustomer, deleteCustomer };
