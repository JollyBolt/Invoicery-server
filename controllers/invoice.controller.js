import Invoice from "../models/Invoice";
import dotenv from "dotenv";
dotenv.config();

const getAllInvoices = async (req, res) => {
  try {
    const userId = req.id;
    let invoiceList = await Invoice.find({ userId: userId });
    res.status(200).send(invoiceList.toArray());
  } catch (e) {
    res.status(500).send("Internal server error occured");
  }
};

const createInvoice = async (req, res) => {
  try {
    const userId = req.id;
    const invoice = new Invoice(req.body);
    invoice.userId = userId;
    await invoice.save();
    res.status(201).send(invoice);
  } catch (e) {
    res.status(500).send("Internal server error occured");
  }
};

const editInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndUpdate(req.params.id, req.body);
    res.status(200).send(invoice);
  } catch (e) {
    res.status(500).send("Internal server error occured");
  }
};

const deleteInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndDelete(req.params.id);
    res.status(200).send(invoice);
  } catch (e) {
    res.status(500).send("Internal server error occured");
  }
};
export { getAllInvoices, createInvoice, editInvoice, deleteInvoice };