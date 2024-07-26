import jwt from "jsonwebtoken"
import { verifyRefreshToken } from "./verifyRefreshToken.js"
import dotenv from "dotenv"
dotenv.config()
const secret = process.env.JWT_SECRET

const verifyToken = async (req, res, next) => {
  // const token = req.cookies.authToken
  const token = req.headers.authorization.split(" ")[1]
  // if (!token) res.status(401).send("Access Denied")
  try {
    const payload = jwt.verify(token, secret)
    req.id = payload.id //this id is _id of user
    next()
  } catch (e) {
    if (e.name === "TokenExpiredError" || token === "undefined") {
      //check if refresh token is expired
      // console.log(token)
      console.log({
        msg: "Error occured in verifyToken",
        error: e.message,
      })
      verifyRefreshToken(req, res, next)
    } else {
      console.log(req.headers.authorization)
      console.log({
        msg: "Error occured in verifyToken",
        error: e.message,
      })
      res.status(500).send({
        msg: "Internal server error occured",
        error: e.message,
      })
    }
  }
}

export { verifyToken }