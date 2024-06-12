import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET

const verifyToken = async(req,res,next) => {

    const token = req.headers.authorization.split(" ")[1]
    // console.log(token)
    if(!token) res.status(401).send("Access Denied")
    try{
        const payload = jwt.verify(token,secret)
        req.id = payload.id  //this id is _id of user
        next()
    } catch (error) {
        console.log(error)
        res.status(500).send(error);   
    }
    
}

export { verifyToken }