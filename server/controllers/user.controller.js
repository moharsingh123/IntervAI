import User from "../models/user.model.js"



export const getCurrentUser= async(req , res)=>{
    try {
        const userId= req.userId  // find the user id from the request object which is set in the isAuth middleware

        // check  if the user exist in the database
        const user= await User.findById(userId)

        if(!user){
            return res.status(404).json({
                success:false,
                message:"Current user is not found in the database  "
            })
        }
        res.status(200).json({
            user,
            message:"Current user found successfully "
        })

        
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:` failed to get Current user in the server side  ${error.message}`
        })
    }
}