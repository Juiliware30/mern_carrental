import jwt from 'jsonwebtoken';
import User from '../models/User.js';


export const protech  = async(req , res , next) =>{
    const token  =  req.headers.authorization;

    if(!token){
        return res.json({success :false, message :"not authorized - no token"})
    }
    
    // Check if token starts with Bearer
    if (!token.startsWith('Bearer ')) {
        return res.json({success :false, message :"not authorized - invalid token format"})
    }
    
    try{
        // Extract the token (remove 'Bearer ' prefix)
        const tokenPart = token.slice(7);
        
        // Verify the token
        const decoded = jwt.verify(tokenPart, process.env.JWT_SECRET);
        
        if(!decoded) {
         return res.json({success :false, message :"not authorized - invalid token"})
        }
        
        // Check if decoded has id property
        if (!decoded.id) {
            return res.json({success :false, message :"not authorized - invalid token payload"})
        }
        
        // Find user by ID and attach to request
        const user = await User.findById(decoded.id).select("-password")
        
        if(!user) {
            return res.json({success :false, message :"not authorized - user not found"})
        }
        
        req.user = user;
        next();
    }catch(error){
        console.error('Auth error:', error.message);
        return res.json({success :false, message :"not authorized - " + error.message})
    }

}