const mongoose=require("mongoose");
const {Schema}=mongoose;

const imageSchema=new Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'admins'
    },
    image:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:Date.now
    }
})

module.exports=mongoose.model('gallery',imageSchema);