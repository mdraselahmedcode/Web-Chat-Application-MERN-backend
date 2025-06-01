// userController.js

import { Error } from "mongoose";
import bcrypt from "bcryptjs";
import { User } from "../models/userModel.js";
import sendToken from "../utils/jwtToken.js";


// Register a user
export const register = async (req, res) => {
    try {
        const { fullName, username, password, confirmPassword, gender } = req.body;

        if (!fullName || !username || !password || !confirmPassword || !gender) {
            return res.status(400).json({
                message: "All fields are required"
            })
        }

        if(password != confirmPassword){
            return res.status(400).json({
                message: "Password do not match"
            })
        }

        const userExists  = await User.findOne({username});
        if(userExists ){
            return res.status(400).json({
                message: "User already exist"
            })
        }


        // profilephoto
        // const maleProfilePhoto = `https://avatar.iran.liara.run/public/boy?username=${username}`;
        // const femaleProfilePhoto = `https://avatar.iran.liara.run/public/girl?username=${username}`;

        const maleProfilePhoto = `https://ui-avatars.com/api/?name=${fullName}`;
        const femaleProfilePhoto = `https://ui-avatars.com/api/?name=${fullName}`;
        // https://ui-avatars.com/api/?name=John+Doe

        // strong the information
        const user = await User.create({
            fullName,
            username,
            password,
            profilePhoto: gender=="male" ? maleProfilePhoto : femaleProfilePhoto,
            gender
        });

        if(!user){
            throw new Error("User creation failed");
        }
       
        const msg = "Registration Successful"
        // send token to the cookie
        return sendToken(user, 201, res, msg);

    } catch (error) {
        console.error("Error during registration:", error);
        res.status(500).json({ message: 'Server error' });
    }
};







// Log in a user
export const login = async (req, res) =>{   
    try {
        const{username, password} = req.body;

        if(!username || !password){
            return res.status(400).json({
                message: "All fields are required",
                success: false
            })
        }
    
        const user = await User.findOne({username}).select("+password");
        if(!user){
            return res.status(400).json({
                message: "User not found",
                success: false
            })
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if(!isPasswordMatch){
            return res.status(400).json({
                message: "Incorrect username or password",
                success: false
            })
        }

        const msg = "Logged in successfully"

        return sendToken(user, 200, res, msg);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error' });
    }
}



// logout a user
export const logout = (req, res) => {
    try {
        return res.status(200).cookie("token","",{maxAge: 0}).json({
            message: "logged out successfully.",
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}



// get other users
export const getOtherUsers = async (req, res) => {
    try {
        const loggedInUserId = req.id;
        // console.log(loggedInUserId);
        const otherUsers = await User.find({_id: {$ne: loggedInUserId}});
        return res.status(200).json(otherUsers);
    } catch (error) {
        console.log(error);
    }
}





