// find the id from the token 

import jwt  from "jsonwebtoken"


const isAuth= async(req , res, next)=>{
    try {
        const {token}= req.cookies

        if(!token){
            return res.status(401).json({
                success:false,
                message:"user do not have token Please login to get token  "
            })
        }

        // agar mil jate ha then we will verify the token and get the user id from the token
        const veriftToken= jwt.verify(token , process.env.JWT_SECRET)
        if(!veriftToken){
            return res.status(401).json({
                success:false,
                message:"user does not have a valid token  "
            })
        }
         // fetch the user id from the token and store it in the request object for further use in the controllers
        req.userId= veriftToken.userId
        next() 
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:`"IsAuth server error: ${error.message}"`
        })
    }
}
export default isAuth;