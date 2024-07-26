import jwt from "jsonwebtoken"
import { generateAccessToken } from "./generateAccessToken.js"
import dotenv from "dotenv"
dotenv.config()
const secret = process.env.JWT_SECRET
const verifyRefreshToken = (req, res, next) => {
    try {
        const payload = jwt.verify(req.cookies.refreshToken, secret)
        req.id = payload.id //this id is _id of userAuth

        //if Refresh Token is valid, then new access token is issued
        const newToken = generateAccessToken( req.id)

        req.headers.authorization = `Bearer ${newToken}`
        //New token is sent to frontend with every request where it will be stored in redux store.
        next()
    } catch (err) {
            //if refresh token is expired
            console.log({
                msg: "Error occured in verifyRefreshToken",
                error: err.message,
            })
            console.log(req.headers.authorization)
            res.status(200).send({token:null}) //send null to frontend to sake as token and accordingly show login page
        
    }
}

export { verifyRefreshToken }