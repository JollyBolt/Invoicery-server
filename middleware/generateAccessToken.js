import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()
const secret = process.env.JWT_SECRET

const generateAccessToken = (userId) => {
    try {
        const token = jwt.sign(
            {
                id: userId, //setting the of document id of obtained user as payload
            },
            secret,
            { expiresIn: 60 * 30 }  //expires in 30 minutes
        )

        return token
    } catch (e) {
        console.log({
            msg: "Error occured in generateAccessToken",
            error: e.message,
        })
    }
}

export { generateAccessToken }