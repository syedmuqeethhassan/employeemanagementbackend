var express = require('express');
var router = express.Router();
var leave = require("../models/leaves");

router.post('/add-leave',function (req,res){
    leaveObject={
        startDate:req.body.startDate,
        endDate:req.body.endDate,
        updatedDate:req.body.updatedDate,
        createdDate:req.body.createdDate,
        createdBy:req.body.createdBy,
        approved:req.body.approved,
        manager:req.body.manager,
        reason:req.body.reason
    }
leave.create(leaveObject,(err,result)=>{
    if(err){
        console.log('error',err)
    }
    else{
        res.json({message:'success',data:result})
    }
})
})
router.get('/leaves',function(req,res){
    leave.find({},(err,result)=>{
        if(err){
            res.json({message:'not fetched leaves',code:400})
        }
        else{
            res.json({message:'success',data:result})
        }
    })
})
module.exports = router;
