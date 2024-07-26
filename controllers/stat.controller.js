import Stat from "../models/Stat.js"
import dotenv from "dotenv"
dotenv.config()

const getStats = async (req, res) => {
  try {
    const userId = req.id
    const stats = await Stat.findOne({ userId })
    res.status(200).json({data: stats ,token:req.headers.authorization.split(" ")[1]})
  } catch (e) {
    console.log({
      msg: "Error occured in getStats",
      error: e.message,
    })
    res.status(500).send({
      msg: "Internal server error occured",
      error: e.message,
    })
  }
}

export { getStats }