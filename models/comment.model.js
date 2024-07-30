const mongoose=require("mongoose");

const commentSchema=new mongoose.Schema({
    post_id:{
        type:String,
        required:true
    },
    content:{
        type:String,
        required:true
    },
    author_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
},{timestamps:true});

const Comment= mongoose.model('Comment',commentSchema);
module.exports=Comment;