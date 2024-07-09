import Stat from "../models/Stat.js"
import dotenv from "dotenv"
dotenv.config()

const getStats = async (req, res) => {
  try {
    const userId = req.id
    const stats = await Stat.findOne({ userId })
    return res.status(200).json({ stats })
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