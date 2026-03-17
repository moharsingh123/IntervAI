
import jwt  from 'jsonwebtoken';
// create a token 

const getToken = async (userId)=>{
    try {
            const token = jwt.sign({userId} , process.env.JWT_SECRET , {expiresIn: '7d'})
            return token ;
    } catch (error) {
        console.log( "Token is not generated please check the token.js file :  ",error);
    }

}
export default getToken;