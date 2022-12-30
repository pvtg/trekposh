const mongoose=require("mongoose");
const {Schema}=mongoose;

const articleSchema=new Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'admins'
    },
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:Date.now
    }
})

module.exports=mongoose.model('articles',articleSchema);