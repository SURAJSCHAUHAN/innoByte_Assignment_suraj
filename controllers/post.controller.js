const POST=require('../models/post.model.js');

const generatePost=async(req,res)=>{
    const body=req.body;
    if(!body.title || !body.content) return res.status(400).json({error:"required fields missing!"});
    const result=await POST.create({
        title:body.title,
        content:body.content,
        author_id:req.user._id // assuming user is logged in and req.user has _id property
    })
    return res.json({success:"post created successfully",data:result});
}

const getAllPosts=async(req,res)=>{
    const posts=await POST.find({});
    return res.status(200).json({status:200,data:posts});
}

const getPostById=async(req,res)=>{
    const _id=req.params.id;
    const result=await POST.findOne({_id});
    res.status(200).json({status:200,'post':result});
}

const updatePost=async(req,res)=>{
    const _id=req.params.id;
    const updatedData=req.body;
    const post= await POST.findById(_id).select('-title -content');
    if(post.author_id.toString() !== req.user._id.toString()){
        return res.status(401).json({error:"Unauthorized request"});
    }
    const updatedResult=await POST.findByIdAndUpdate(_id,updatedData,{new:true});
    return res.json({'post':updatedResult});
    
}

const deletePost=async(req,res)=>{
    const _id=req.params.id;
    const post= await POST.findById(_id).select('-title -content');
    if(post.author_id.toString() !== req.user._id.toString()){
        return res.status(401).json({error:"Unauthorized request"});
    }
    await POST.findByIdAndDelete(_id);
    return res.json({success:"post deleted successfully"});
}

module.exports={generatePost,getAllPosts,getPostById,updatePost,deletePost};