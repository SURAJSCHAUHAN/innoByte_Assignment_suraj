
const mongoose=require('mongoose');
require('dotenv').config()

const dbconnect=async()=>{
        try {
            const result=await mongoose.connect(`${process.env.MONGODB_URI}`);
            console.log("Connected to MongoDB");
        } catch (error) {
            console.error("Error in DB connection",error)
        }
}

module.exports = dbconnect;