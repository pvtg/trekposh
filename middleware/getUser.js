const jwt=require('jsonwebtoken');
const dotenv=require("dotenv")
dotenv.config({path:'../config.env'})
const mysign=process.env.MYSIGN

const getuser=(req,res,next)=>{
    const token=req.header('authToken');
    if(!token){
        res.status(401).json({"Status":"Invalid Token! Please try again"});
    }
    try{
        const data=jwt.verify(token,mysign);
        req.user=data.user;
        next();
    }
    catch(error){
        res.status(401).json({"Status":"Invalid Token! Please try again"});
    }

}

module.exports=getuser;