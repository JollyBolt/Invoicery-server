import UserAuth from "../models/UserAuth.js"
import { validationResult } from "express-validator"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()

const secret = process.env.JWT_SECRET

const login = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array()[0].msg })
  }
  try {
    const { mode, email } = req.body
    const user = await UserAuth.findOne({ email: email }) //get required user based on entered email
    if (mode === "password") {
      const { password } = req.body
      if (!user) {
        //if user doesn't exist
        return res.status(401).send("User with this email does not exist.")
      }
      if (!user.passwordLogin)
        return res.status(401).send("You did not sign up using password.")
      const passwordCompare = await bcrypt.compare(password, user.password) //comparing password(1st arg) entered and password hash stored in db(2nd arg)
      if (!passwordCompare) {
        //if user exists but password is wrong
        return res.status(401).send("Wrong Password.")
      }
    } else if (mode === "google") {
      if (!user.googleLogin)
        return res.status(401).send("You did not sign up using google.")
      if (user.googleCredentials !== googleCredentials)
        return res.status(401).send("Wrong Credentials.")
    }

    //if both email and password are correct and user is successfully retrieved
    const token = jwt.sign(
      {
        id: user._id, //setting the of document id of obtained user as payload
      },
      secret,
      { expiresIn: "1d" }
    )
    const expiresIn = new Date()
    expiresIn.setDate(new Date().getDate() + 1) //set expire date to 1 day later
    res.cookie("authToken", token, {
      expires: expiresIn,
      httpOnly: false,
      sameSite: "none",
      secure: true,
    }) //send the token as cookie to frontend (cookie exipires 2 days later)
    res.status(200).json({ token }) //jwt auth token is returned as json
  } catch (error) {
    //if error related to request occurs
    console.log({
      msg: "Error occured in login",
      error: e.message,
    })
    res.status(500).send({
      msg: "Internal server error occured",
      error: e.message,
    })
  }
}

const test = async (req, res) => {
  const expiresIn = new Date()
  expiresIn.setDate(new Date().getDate() + 1) //set expire date to 1 day later
  res.cookie("authToken", "token", {
    expires: expiresIn,
    httpOnly: false,
    sameSite: "none",
    secure: true,
  }) //send the token as cookie to frontend (cookie exipires 2 days later)
  res.status(200).send("cookie set") //jwt auth token is returned as json
}

const signup = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    //error occurs due to invalid input
    return res.status(400).json({ errors: errors.array()[0].msg })
  }
  try {
    let user = await UserAuth.findOne({ email: req.body.email }) //checking if user with email already exists

    if (user) {
      //handling if user with email already exists
      return res
        .status(400)
        .json({ error: "Sorry, UserAuth with email already exists" }) //return is used so if this runs,it doesn't reach underlying code
    }
    //create new user

    const { mode } = req.body

    if (mode === "password") {
      const salt = await bcrypt.genSalt(10) //creating salt
      const secPass = await bcrypt.hash(req.body.password, salt) //creating secure password by combining user entered paas with salt and then hashed
      user = new UserAuth({ ...req.body, password: secPass, passwordLogin: true }) //create new user from input based on UserAuth model
    } else if (mode === "google") {
      user = new UserAuth({ ...req.body, googleLogin: true }) //create new user from input based on UserAuth model
    } else if (mode === "otp") {
      user = new UserAuth({ ...req.body }) //create new user from input based on UserAuth model
    }
    await user.save() //save new user document to collection in DB
    const token = jwt.sign(
      //creating authtoken
      {
        id: user._id, //setting the of document id of obtained user as payload
      },
      secret,
      { expiresIn: "1d" }
    )
    const expiresIn = new Date()
    expiresIn.setDate(new Date().getDate() + 1) //set expire date to 1 day later
    res.cookie("authToken", token, {
      expires: expiresIn,
      httpOnly: false,
      sameSite: "none",
      secure: true,
    }) //send the token as cookie to frontend (cookie exipires 2 days later)
    res.status(201).json({ token, user })
  } catch (error) {
    //if error related to request occurs
    console.log({
      msg: "Error occured in signup",
      error: e.message,
    })
    res.status(500).send({
      msg: "Internal server error occured",
      error: e.message,
    })
  }
}

export { login, signup, test }
