import mongoose from 'mongoose';
import { Schema } from "mongoose";

const UserSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    org:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },

})

const User = mongoose.model('user',UserSchema)

export default User