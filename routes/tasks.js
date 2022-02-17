var express = require('express');
var router = express.Router();
var tasks = require("../models/tasks");
router.get('/', function (req, res, next) {
    tasks.find(function (err, task) {
      if (err) {
        res.json(err);
      }
      res.type('json');
      res.status(200).json(task);
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
        res.json(err);
      }
      res.status(200).json(task);
    }
    );
  });
router.put('/update-task', async function(req,res,next){

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
let update= await tasks.updateOne({_id:req.body.id},updateDoc,async (error,data)=>{
  if(error){
    res.json('update not done')
  }
  else{
    res.json('update successful')
  }
}).clone()
})




router.delete('/delete-task/:id',async function (req,res){
  let deletetask=await tasks.remove({_id:req.params.id},(err,result)=>{
    if(err){
      res.json('delete unsuccessful')
    }
    else{
      res.json('delete succesful')
    }
  }).clone()
})


module.exports = router;