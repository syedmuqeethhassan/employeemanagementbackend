var express = require('express');
var router = express.Router();
var tasks = require("../models/tasks");
router.get('/', function (req, res, next) {
    tasks.find({},null,{sort:{updateddate:-1}},function (err, task) {
      if (err) {
        res.json(err);
      }
      res.type('json');
      res.json(task);
    }
    );
  });


  router.post('/add-task', function (req, res, next) {
      taskObject={
            "taskname" : req.body.taskname,
               "taskstatus" : req.body.taskstatus,
               "assignto" : req.body.assignto,
               "taskdescription" : req.body.taskdescription,
               "createdby" : req.body.createdby,
               "date" : req.body.date,
               "updateddate" : req.body.updateddate,
               "id" : req.body.id
       }
    tasks.create(taskObject,function (err, task) {
      if (err) {
        res.json({message:'Error ,task not created',code:400});
      }
      else{
      res.json({message:'Task created',code:200});
    }
  });
  });
router.put('/update-task/:id', async function(req,res,next){

updateDoc={
  $set:{
    taskname:req.body.taskname,
    taskstatus:req.body.taskstatus,
    assignto:req.body.assignto,
    createdby:req.body.createdby,
    date:req.body.date,
    updateddate:req.body.updateddate,
  }
}
tasks.updateOne({_id:req.params.id},updateDoc,async (error,data)=>{
  if(error){
    res.json({message:'Update not done',code:400})
  }
  else{
    res.json({message:'Update successful',code:200})
  }
}).clone()
})




router.delete('/delete-task/:id',async function (req,res){
tasks.remove({_id:req.params.id},(err,result)=>{
    if(err){
      res.json({message:'Delete unsuccessful',code:400})
    }
    else{
      res.json({message:'Delete succesful',code:200})
    }
  }).clone()
})


module.exports = router;