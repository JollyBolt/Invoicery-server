import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET

const verifyToken = async(req,res,next) => {

    const token = req.header('authToken') 
    if(!token) res.status(401).send("Access Denied")

    try{
        const id = jwt.verify(token,secret)
        req.id = id  //this id is _id of user
        next()
    }catch (error) {
        res.status(401).send("Access Denied");   
    }
    
}

export { verifyToken }