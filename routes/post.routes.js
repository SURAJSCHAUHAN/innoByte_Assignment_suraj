const express= require('express');
const router= express.Router();
const verifyJWT=require('../middleware/auth.middleware.js')

const {generatePost,getAllPosts,getPostById,updatePost,deletePost}=require('../controllers/post.controller');


router.get('/',getAllPosts);

router.get('/:id',getPostById);

//secured routes
router.post('/',verifyJWT,generatePost);

router.post('/:id',verifyJWT,updatePost);

router.delete('/:id',verifyJWT,deletePost);


module.exports=router;