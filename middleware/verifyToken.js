import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET

const verifyToken = async(req,res,next) => {

    const token = req.header('authToken') 
    if(!token) res.status(401).send("Access Denied")

    try{
        const email = jwt.verify(token,secret)
        req.email = email
        next()
    }catch (error) {
        res.status(401).send("Access Denied");   
    }
    
}

export { verifyToken }