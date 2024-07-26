import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()
const secret = process.env.JWT_SECRET

const generateAccessToken = (userId) => {
    try{
        const token = jwt.sign(
            {
                id: userId, //setting the of document id of obtained user as payload
            },
            secret,
            { expiresIn: 15 }
        )
        // const expiresIn = new Date()
        // expiresIn.setDate(new Date().getDate() + 7) //set expire date to 7 day later
        // res.cookie("authToken", token, {
        //     expires: expiresIn,
        //     // maxAge:1500,
        //     httpOnly: false,
        //     sameSite: "None",
        //     secure: true,
        //     domain: process.env.NODE_ENV == "production" ? "ishansen.in" : null,
        // }) //send the token as cookie to frontend (cookie exipires 7 days later)
        
        return token
    }catch (e) {
        console.log({
            msg: "Error occured in generateAccessToken",
            error: e.message,
        })
    }
    }

export { generateAccessToken }