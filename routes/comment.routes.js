const express= require('express');
const router= express.Router();

const {generateComment,getCommentOfPost,getCommentById,updateComment,deleteComment}=require('./../controllers/comment.controller.js');
const verifyJWT = require('../middleware/auth.middleware.js');

router.post('/',verifyJWT,generateComment);

router.get('/',getCommentOfPost);   

router.get('/:id',getCommentById);

router.post('/:id',verifyJWT,updateComment);

router.delete('/:id',verifyJWT,deleteComment);



module.exports=router;