const mongoose=require("mongoose");
const {Schema}=mongoose;

const trekSchema=new Schema({
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
    fullDesc:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        required:true,
        default:Date.now
    }
})

module.exports=mongoose.model('treks',trekSchema);