const express=require('express');
const router=express.Router();
const Articles=require('../models/Articles');
const {body,validationResult}=require('express-validator');
const getuser = require('../middleware/getUser');

// Getting all articles route
router.get('/get-articles',async(req,res)=>{
    try{
        const articles=await Articles.find();
        res.json({articles})
    }
    catch(error){
        console.log(error);
        res.status(500).json({'success':false,'Status':'Server Error!'});
    }
})



// Adding an article route
router.post('/addArticle',getuser,[
    body('title','Title is too short!').isLength({min:3}),
    body('description','Description is too short!').isLength({min:5})
],async(req,res)=>{
    let success=false;
    const {title,description}=req.body;
    const error=validationResult(req);
    if(!error.isEmpty()){
       return res.status(400).json({success,'Status':'Please try again!'})
    }
    try{
        const article=new Articles({user:req.user.id,title,description})
        const savedArticle=await article.save();
        success=true;
        res.json({success,savedArticle,"Status":"Article has been addded successfully!"})
    }
    catch(error){
        console.log(error);
        res.status(500).json({'success':false,'Status':'Server Error!'});
    }
})

//Updating an article route

router.put('/update-article/:id',getuser,async(req,res)=>{
    let success=false;
    const error=validationResult(req);
    if(!error.isEmpty()){
       return res.status(400).json({success,'Status':'Please try again!'});
    }
    try{
        const {title,description}=req.body;
        let article=await Articles.findById(req.params.id);
        if(!article)return res.status(404).json({success,'Status':'Not Found!'});
        if(article.user.toString()!==req.user.id)return res.status(401).json({success,"Status":"Not Allowed!"});
        const newArticle={};
        if(title)newArticle.title=title;
        if(description)newArticle.description=description;
        
        article=await Articles.findByIdAndUpdate(req.params.id,{$set:newArticle},{new:true});
        success=true;
        res.json({'Status':"Updated Successfully!",success,article});
    }
    catch(error){
        console.log(error);
        res.status(500).json({'success':false,'Status':'Server Error!'});
    }
})

//Deleting an article route

router.delete('/deletearticle/:id',getuser,async(req,res)=>{
    try{
    let success=false;
    let article=await Articles.findById(req.params.id);
    if(!article)return res.status(404).json({success,'Status':'Not Found!'});
    if(article.user.toString()!==req.user.id)return res.status(401).json({success,'Status':'You are not authorised to delete this Article!'})
    article.remove();
    success=true;
    res.json({success,'Status':'Article has been deleted succesfully!'})
    }
    catch(error){
        console.log(error);
        res.status(500).json({'success':false,'Status':'Server Error!'});
    }
})

module.exports=router;