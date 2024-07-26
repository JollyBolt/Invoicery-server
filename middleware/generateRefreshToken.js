import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()
const secret = process.env.JWT_SECRET
const generateRefreshToken = (res, userId) => {
  // Generate a refresh token here
  try {
    const refreshToken = jwt.sign({ id: userId }, secret, { expiresIn: "30d" });
    const refreshExpiresIn = new Date() 
    refreshExpiresIn.setDate(new Date().getDate() + 30) //set expire date to 30 day later
    res.cookie("refreshToken", refreshToken, {
      expires: refreshExpiresIn,
      httpOnly: true,
      sameSite: "None",
      secure: true,
      domain: process.env.NODE_ENV == "production" ? "ishansen.in" : null,
    })
  } catch (error) {
    console.log({
      msg: "Error occured in login",
      error: error.message,
    })
  }
}

export { generateRefreshToken }