const express= require('express');
const router= express.Router();
const verifyJWT=require('../middleware/auth.middleware.js')

const {registerUser,loginUser,logOutUser,refreshAccessToken} = require('../controllers/user.controller.js');


router.post('/register',registerUser);

router.post('/login',loginUser);

//secured routes
router.post('/logout',verifyJWT, logOutUser);

router.post('/refresh-token',refreshAccessToken);

module.exports=router;