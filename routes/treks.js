const express=require('express');
const router=express.Router();
const Treks=require('../models/Treks');
const {body,validationResult}=require('express-validator');
const getuser = require('../middleware/getUser');

// Getting all treks route
router.get('/get-treks',async(req,res)=>{
    try{
        const treks=await Treks.find();
        res.json({treks})
    }
    catch(error){
        console.log(error);
        res.status(500).json({'success':false,'Status':'Server Error!'});
    }
})



// Adding a trek route
router.post('/addtrek',getuser,[
    body('title','Title is too short!').isLength({min:3}),
    body('description','Description is too short!').isLength({min:5}),
    body('fullDesc','Description is too short!').isLength({min:5}),
    body('image','Image cannot be empty!').isLength({min:1}),
],async(req,res)=>{
    let success=false;
    const {title,description,fullDesc,image,date}=req.body;
    const error=validationResult(req);
    if(!error.isEmpty()){
       return res.status(400).json({success,'Status':'Please try again!'})
    }
    try{
        const trek=new Treks({user:req.user.id,title,description,fullDesc,image,date})
        const savedTrek=await trek.save();
        success=true;
        res.json({success,savedTrek,"Status":"Trek has been addded successfully!"})
    }
    catch(error){
        console.log(error);
        res.status(500).json({'success':false,'Status':'Server Error!'});
    }
})

//Updating a trek route

router.put('/update-trek/:id',getuser,async(req,res)=>{
    let success=false;
    const error=validationResult(req);
    if(!error.isEmpty()){
       return res.status(400).json({success,'Status':'Please try again!'});
    }
    try{
        const {title,description,fullDesc,image,date}=req.body;
        let trek=await Treks.findById(req.params.id);
        if(!trek)return res.status(404).json({success,'Status':'Not Found!'});
        if(trek.user.toString()!==req.user.id)return res.status(401).json({success,"Status":"Not Allowed!"});
        const newTrek={};
        if(title)newTrek.title=title;
        if(description)newTrek.description=description;
        if(fullDesc)newTrek.fullDesc=fullDesc;
        if(image)newTrek.image=image;
        if(date)newTrek.date=date;
        
        trek=await Treks.findByIdAndUpdate(req.params.id,{$set:newTrek},{new:true});
        success=true;
        res.json({'Status':"Updated Successfully!",success,trek});
    }
    catch(error){
        console.log(error);
        res.status(500).json({'success':false,'Status':'Server Error!'});
    }
})

//Deleting a trek route

router.delete('/deletetrek/:id',getuser,async(req,res)=>{
    try{
    let success=false;
    let trek=await Treks.findById(req.params.id);
    if(!trek)return res.status(404).json({success,'Status':'Not Found!'});
    if(trek.user.toString()!==req.user.id)return res.status(401).json({success,'Status':'You are not authorised to delete this Trek!'})
    trek.remove();
    success=true;
    res.json({success,'Status':'Trek has been deleted succesfully!'})
    }
    catch(error){
        console.log(error);
        res.status(500).json({'success':false,'Status':'Server Error!'});
    }
})

module.exports=router;