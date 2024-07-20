import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET

const verifyToken = async(req,res,next) => {

    // const token = req.headers.authorization.split(" ")[1]
    const token = req.cookies.authToken
    // console.log(token)
    if(!token) res.status(401).send("Access Denied")
    try{
        const payload = jwt.verify(token,secret)
        req.id = payload.id  //this id is _id of user
        next()
    } catch (e) {
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

export { verifyToken }