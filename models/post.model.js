const  mongoose= require("mongoose");

const postSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true,
        unique:true
    },
    content:{ 
        type:String,
        required:true
    },
    author_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
},{timestamps:true});

const POST=mongoose.model('Post',postSchema);
module.exports = POST;
