const Comment=require('../models/comment.model.js');
const POST = require('../models/post.model.js');

const generateComment=async(req,res)=>{
    const {post_id,content}=req.body;
    if(!post_id ||!content) return res.status(400).json({error:"required fields missing!"});
    const result=await Comment.create({post_id,content,author_id:req.user._id});
    return res.json({success:"comment created successfully",comment:result});
}

const getCommentOfPost=async(req,res)=>{
    const post_id=req.query.post_id;
    const result=await Comment.find({post_id});
    if(!result) return res.status(404).json({error:"post has no comment!"});
    return res.status(200).json({status:200,postComments:result});
}

const getCommentById=async(req,res)=>{
    const _id=req.params.id;
    const comment=await Comment.find({_id});
    if(!comment) return res.status(404).json({error:"no comment found!"});
    return res.status(200).json({status:200,comment:comment});
}

const updateComment=async(req,res)=>{
    const _id=req.params.id;
    const updatedData=req.body;
    const comment= await Comment.findById(_id).select('-post_id -content');
    if(comment.author_id.toString() !== req.user._id.toString()){
        return res.status(401).json({error:"Unauthorized request"});
    }
    const updatedResult=await Comment.findByIdAndUpdate(_id,updatedData,{new:true});
    return res.status(200).json({status:200,'post':updatedResult});
}

const deleteComment=async(req,res)=>{
    const _id=req.params.id;
    const comment= await Comment.findById(_id).select('-content');
    const post_author=await POST.findById({_id:comment.post_id}).select('-_id -title -content');
    if(comment.author_id.toString() == req.user._id.toString()  || post_author.author_id.toString() == req.user._id.toString()){
        await Comment.findByIdAndDelete(_id);
        return res.status(200).json({status:200,success:"comment deleted successfully"});
    }
    return res.status(401).json({error:"Unauthorized request",post_author:post_author.author_id});
}


module.exports ={generateComment,getCommentOfPost,getCommentById,updateComment,deleteComment};