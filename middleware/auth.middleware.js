const jwt=require('jsonwebtoken');
const USER=require('../models/user.model.js')

const verifyJWT=async(req,res,next)=>{
    try {
        const token= req.cookies.accessToken;
    
        if(!token) return res.status(401).json({error:"Unauthorized request"});
    
        const decodedToken= jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    
        const user= await USER.findById(decodedToken?._id).select('-password -refreshToken');
        if(!user) return res.status(401).json({error:"Unauthorized token"});
    
        req.user=user;
        next();
    } catch (error) {
        return res.status(401).json({error:error?message:"Invalid token"});
    }

}

module.exports=verifyJWT;