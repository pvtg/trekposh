const mongoose=require('mongoose')
const dotenv=require("dotenv")
dotenv.config({path:'./config.env'})
const mongoURI=process.env.DATABASE;

const connectToMongo=()=>{
    mongoose.connect(mongoURI,()=>{
        console.log("Connected to trekposh");
    });
}
module.exports=connectToMongo;