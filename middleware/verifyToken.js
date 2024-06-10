import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET

const verifyToken = async(req,res,next) => {

    const token = req.header('Authorization').split(' ')[1]
    if(!token) res.status(401).send("Access Denied")

    try{
        const payload = jwt.verify(token,secret)
        req.id = payload.id  //this id is _id of user
        next()
    }catch (error) {
        res.status(401).send("Access Denied");   
    }
    
}

export { verifyToken }