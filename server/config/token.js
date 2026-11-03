
import jwt  from 'jsonwebtoken';
// create a token 

const getToken = (userId)=>{
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not configured");
    }

    return jwt.sign({userId} , process.env.JWT_SECRET , {expiresIn: '7d'});
}
export default getToken;