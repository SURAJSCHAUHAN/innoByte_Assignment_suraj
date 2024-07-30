const express= require('express');
const dbconnect = require('./db/dbConnection.js');
const postUrl=require('./routes/post.routes.js')
const userUrl=require('./routes/user.routes.js');
const commentUrl= require('./routes/comment.routes.js');
const cookieParser = require('cookie-parser');

const app = express();

require('dotenv').config()

dbconnect();
app.use(express.json());
app.use(cookieParser());

app.use('/user',userUrl);
app.use('/post',postUrl);
app.use('/comments',commentUrl);



app.get('/',(req,res)=>res.send('Hello Suraj'));

app.listen(process.env.PORT, () => console.log(`http://localhost:${process.env.PORT}`));