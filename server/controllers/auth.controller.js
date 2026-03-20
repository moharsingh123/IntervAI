

import User from "../models/user.model.js";
import getToken from "../config/token.js";
// frentend  se data leke  ana ha
// create user
//  to check the current user

// creat a token  AND  store it the cookies
export const googleAuth= async(req, res)=>{
    try {
        const {name , email}= req.body; 
        // check if the user already exists in the database
        let user= await User.findOne({email});
        if(!user){
            user = await User.create({name , email})
        }
        // create a token
        const token = await getToken(user._id); // 
        
        // store the token in the cookies
        res.cookie("token" ,token ,
            {
                httpOnly:true,
                secure:true, // in production it should be true
                sameSite:"none",
                maxAge:7*24*60*60*1000  // 7 days 

            }
        )
        return res.status(200).json({
            user,
            success:true,
            message:"User authenticated successfully  or User registered successfully ",
            token
        })
        


    } catch (error) {
        console.log("Google Auth Error:", error);
        return  res.status(500).json({
            success:false,
            message:`"Google Auth  server error: ${error.message}"`
        })

    }
}


export  const logOut= async(req, res)=>{
    try {
        res.clearCookie("token");
        return res.status(200).json({
            success:true,
            message:"User logged out successfully"
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:`"Logout  server error: ${error.message}"`
        })
    }
}

