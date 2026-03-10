import jwt from 'jsonwebtoken';
import config from '../config.js';

function userMiddleware(req,res,next){
    const authHeader=req.headers.authorization;

    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return res.status(401).json({ errors:" No token provided"});
    }
    const token=authHeader.split(" ")[1];

    if(!token){
        return res.status(401).json({ errors:" No token provided"});
    }

    try{
        const decoded=jwt.verify(token,config.JWT_USER_PASSWORD);
        console.log( decoded);
        req.userId = decoded.id;

        next();
    }catch(error){
        console.error("Invalid token or expired token:", error);
        return res.status(401).json({ errors:" Invalid token or expired token"});
    }
}
export default userMiddleware;