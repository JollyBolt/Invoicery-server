import User from "../models/User.js";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const secret = process.env.JWT_SECRET;

const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array()[0].msg });
  }
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email }); //get required user based on entered email
    if (!user)
      //if user doesn't exist
      return res.status(401).send("User with this email does not exist.");
    if (user.password !== password)
      //if user exists but password is wrong
      return res.status(401).send("Wrong Password.");

    //if both email and password are correct and user is successfully retrieved
    const token = jwt.sign(
      {
        id: user._id, //setting the of document id of obtained user as payload
      },
      secret,
      { expiresIn: "1d" }
    );
    res.cookie("authToken", token, { expires: new Date().getDate() + 2 }); //send the token as cookie to frontend (cookie exipires 2 days later)
    // res.status(200).json({ token: token }); //jwt auth token is returned as json
  } catch (error) {
    //if error related to request occurs
    console.log(error);
    res.status(500).send("Internal error occuredd");
  }
};

const createUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    //error occurs due to invalid input
    return res.status(400).json({ errors: errors.array()[0].msg });
  }
  try {
    const user = new User(req.body); //create new user from input based on User model
    await user.save(); //save new user document to collection in DB
    res.status(201).send("User created successfully");
  } catch (error) {
    //if error related to request occurs
    res.status(500).send("Internal error occured");
  }
};
const updateUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    //error occurs due to invalid input
    return res.status(400).json({ errors: errors.array()[0].msg });
  }
  try {
    const user = await User.findByIdAndUpdate(req.id, req.body); //we use req.id here instead of req.params.id because in case of user both will be same
    res.status(200).send(user);
  } catch (e) {
    res.status(500).send("Internal server error occured");
  }
};

export { login, createUser, updateUser };
