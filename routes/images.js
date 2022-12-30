const express=require('express');
const router=express.Router();
const Images=require('../models/Images');
const {body,validationResult}=require('express-validator');
const getuser = require('../middleware/getUser');

// Getting all images route
router.get('/get-images',async(req,res)=>{
    try{
        const images=await Images.find();
        res.json({images})
    }
    catch(error){
        console.log(error);
        res.status(500).json({'success':false,'Status':'Server Error!'});
    }
})



// Adding a image route
router.post('/addimage',getuser,[
    body('image','Image cannot be empty!').isLength({min:1}),
],async(req,res)=>{
    let success=false;
    const {image}=req.body;
    const error=validationResult(req);
    if(!error.isEmpty()){
       return res.status(400).json({success,'Status':'Please try again!'})
    }
    try{
        const img=new Images({user:req.user.id,image})
        const savedImage=await img.save();
        success=true;
        res.json({success,savedImage,"Status":"Image has been addded successfully!"})
    }
    catch(error){
        console.log(error);
        res.status(500).json({'success':false,'Status':'Server Error!'});
    }
})

//Updating a image route

router.put('/update-image/:id',getuser,async(req,res)=>{
    let success=false;
    const error=validationResult(req);
    if(!error.isEmpty()){
       return res.status(400).json({success,'Status':'Please try again!'});
    }
    try{
        const {image}=req.body;
        let img=await Images.findById(req.params.id);
        if(!img)return res.status(404).json({success,'Status':'Not Found!'});
        if(img.user.toString()!==req.user.id)return res.status(401).json({success,"Status":"Not Allowed!"});
        const newImage={};
        if(image)newImage.image=image;
        img=await Images.findByIdAndUpdate(req.params.id,{$set:newImage},{new:true});
        success=true;
        res.json({'Status':"Updated Successfully!",success,img});
    }
    catch(error){
        console.log(error);
        res.status(500).json({'success':false,'Status':'Server Error!'});
    }
})

//Deleting a image route

router.delete('/deleteimage/:id',getuser,async(req,res)=>{
    try{
    let success=false;
    let img=await Images.findById(req.params.id);
    if(!img)return res.status(404).json({success,'Status':'Not Found!'});
    if(img.user.toString()!==req.user.id)return res.status(401).json({success,'Status':'You are not authorised to delete this Image!'})
    img.remove();
    success=true;
    res.json({success,'Status':'Image has been deleted succesfully!'})
    }
    catch(error){
        console.log(error);
        res.status(500).json({'success':false,'Status':'Server Error!'});
    }
})

module.exports=router;