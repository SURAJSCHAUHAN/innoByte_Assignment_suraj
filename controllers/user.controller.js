const USER=require('../models/user.model.js')
const jwt=require('jsonwebtoken')

const generateAccessAndRefreshTokens=async(userId)=>{
 try {
    const user=await USER.findById(userId);
    const accessToken=user.generateAccessToken();
    const refreshToken=user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({validateBeforeSave:false});
    return {accessToken, refreshToken};    

 } catch (error) {
    return res.status(500).json({error:"Something went wrong!"});
 }
}

const registerUser=async(req,res)=>{
    const {fullName,email,password}=req.body;
    if([fullName,email,password].some((field)=>field?.trim()==="")){
        return res.status(400).json({error:"All fields are required!"});
    }
    const userExists=await USER.findOne({email});
    if(userExists) return res.status(409).json({error:"User already exists"});

    const user=await USER.create({fullName,email,password});

    return res.status(200).json({status:200,message: "User created successfully",data:user._id});
}

const loginUser=async(req,res)=>{
    const {email,password}=req.body;
    if([email,password].some((field)=>field?.trim()==="")){
        return res.status(400).json({error:"All fields are required!"});
    }
    const user = await USER.findOne({email});
    if(!user){
        return res.status(404).json({error:"User not found!"});
    }

    const isPasswordValid= await user.isPasswordCorrect(password);
    if(!isPasswordValid){
        return res.status(401).json({error:"Invalid credentials!"});
    }

    const {accessToken, refreshToken} =await generateAccessAndRefreshTokens(user._id);

    const loggedUser=await USER.findById(user._id).select("-password -refreshToken");

    const options={
        httpOnly: true,
        secure:true,
    }

    return  res
            .status(200)
            .cookie("accessToken",accessToken,options)
            .cookie("refreshToken",refreshToken,options)
            .json({status:200, message: "User logged in successfully", user:{loggedUser,accessToken,refreshToken}});

}

const logOutUser=async(req, res) => {
    await USER.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                refreshToken: undefined,
            }
        },
        {
            new: true
        }
    )

    const options={
        httpOnly: true,
        secure:true,
    }

    return  res
            .status(200)
            .clearCookie("accessToken",options)
            .clearCookie("refreshToken",options)
            .json({status:200, message: "User logged out successfully"});
}

const refreshAccessToken=async(req,res)=>{
    const incomingRefreshToken= req.cookies.refreshToken;

    if(!incomingRefreshToken){
        return res.status(401).json({status:401, error:"Unauthorized request"});
    }
    
    try {
        const decodedToken = jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET);
    
        const user= await USER.findById(decodedToken?._id);
    
        if(!user){
            return res.status(401).json({status:401, error:"Invalid Refresh Token"});
        }
    
        if(incomingRefreshToken !== user?.refreshToken){
            return res.status(401).json({status:401, error:"Refresh Token is expired"});
        }
    
        const options={
            httpOnly: true,
            secure:true,
        }
    
        const {accessToken, newRefreshToken}=await generateAccessAndRefreshTokens(user?._id);
    
        return  res
                .status(200)
                .cookie("accessToken", accessToken, options)
                .cookie("refreshToken", newRefreshToken, options)
                .json({status:200, message: "User's access token refreshed successfully", accessToken, refreshToken: newRefreshToken});
    } catch (error) {
        return res.status(401).json({error:error.message||"Invalid Refresh Token"});
    }

}


module.exports={registerUser,loginUser,logOutUser,refreshAccessToken}