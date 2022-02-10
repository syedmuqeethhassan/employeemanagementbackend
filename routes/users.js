var express = require('express');
const req = require('express/lib/request');
const res = require('express/lib/response');
var router = express.Router();
var users = require("../models/users");
var mongodb= require("mongodb")
var ObjectID = require('mongodb').ObjectID;

/* GET users listing. */
router.get('/', function(req, res, next) {
  users.find(function(err, users) {
    if (err) {
      res.json(err);
    }
    res.type('json')
    res.status(200.).json(users);
  }
  );
});
//login api below
router.post('/user', function(req, res, next) {
  let login=users.find({
    usernameRequired:req.body.username,
    passwordRequired:req.body.password
  })
    if(login){
      res.json('success')
    }
    else{
      res.json('error')
    }
  });

//add user api
router.post('/add-user', function(req,res){
  console.log('control is coming to post')
  userObject={
  'username':req.body.username,
  'password':req.body.password,
  'phonenumber': req.body.phonenumber,
  'name': req.body.name,
  'gender': req.body.gender,
  'id':req.body.id,
  'age': req.body.age,
  'role':req.body.role
  }
users.create(userObject,function(err,result){
  if(err){
    console.log('this is an error')
    res.json('no success')
  }
  res.json('success')
})
})
//issue with param and hexadecimal,string
router.delete('/delete',async function(req,res){

  
  result=await users.remove({_id:"62042235cc2891ff68c5f74b"});
    if(result){
      res.json("success")
    }
    else{
      res.json("error")
    }
  })

  //update-same issue of params and hexadecimal,string
router.put('/update',async function(req,res){
  let updatedDoc={
    $set:{
          username:req.body.username,
          password:req.body.password,
          phonenumber: req.body.phonenumber,
          name: req.body.name,
          gender: req.body.gender,
          age: req.body.age,
          role:req.body.role
         }
  };
  
updated=await users.updateOne({_id:"6203c3e74298ca89918851ff"},updatedDoc)
  if(updated){
    res.json("success")
  }
  else{
    res.json()
  }
})

module.exports = router;
