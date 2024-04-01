import User from "../models/Users.js";
import { validationResult } from 'express-validator';
import jwt from "jsonwebtoken";
import dotenv from 'dotenv'
dotenv.config()

const secret = process.env.JWT_SECRET

const login = async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array()[0].msg });
    }
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email: email })
        if (!user)
            return res.status(401).send("User with this email does not exist.")
        if (user.password !== password)
            return res.status(401).send("Wrong Password.")

        const token = jwt.sign({
            email: email
        }, secret, { expiresIn: '1d' })
        res.status(200).json({ token: token })
    } catch (error) {
        console.log(error)
        res.status(500).send("Internal error occuredd"); 
    }
}

const createUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array()[0].msg });
    }
    try {
        const user = new User(req.body)
        await user.save()
        res.status(201).send("User created successfully")
    } catch (error) {
        res.status(500).send("Internal error occured");
    }
}
const updateUser = async (req, res) => {

}

export { login, createUser, updateUser }