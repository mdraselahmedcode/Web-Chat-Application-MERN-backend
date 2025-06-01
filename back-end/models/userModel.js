//userModel.js

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userModel = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, "Please Enter Your Full Name"],
    },
    username:{
        type: String,
        required: [true, "Please enter a user name"],
        unique: true
    },
    password:{
        type: String,
        required: [true, "Please enter your password"],
        select: false,
    },
    profilePhoto: {
        type: String,
        default: ""
    },
    gender:{
        type: String,
        enum: ["male", "female"],
        required: [true, "Please enter your gender type"],
    }
}, {timestamps: true});



// hash the password befor saving
userModel.pre("save", async function (next){
    if(!this.isModified("password")){
        next();
    }

    this.password = await bcrypt.hash(this.password, 10);
})


// jwt token
userModel.methods.getJWTToken = function (){
    const tokenData = {
        userId: this._id,
    }

    return jwt.sign(tokenData, process.env.JWT_SECRET_KEY,{
        expiresIn: process.env.JWT_EXPIRES_IN
    });
}






export const User = mongoose.model("User", userModel);


