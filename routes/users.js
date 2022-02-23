var express = require('express');
const req = require('express/lib/request');
const res = require('express/lib/response');
var router = express.Router();
var users = require("../models/users");
var mongodb = require("mongodb")
var ObjectID = require('mongodb').ObjectID;
const bcrypt = require("bcrypt");

/* GET users listing. */

router.get('/users', function (req, res, next) {
  users.find(function (err, users) {
    if (err) {
      res.json(err);
    }
    res.type('json');
    res.json(users);
  }
  );
});
router.post('/login',async function (req, res, next) {
  
  users.findOne({ username: req.body.username },async (error, data) => {
    if (error){
      res.json({ 'error': error, code: 500 });
    }
    else{
      console.log('login else statement')
      console.log(data)
      console.log(req.body.password)
      const validPassword = await bcrypt.compare(req.body.password, data.password);
    if(validPassword){
      console.log(data,'data')
      res.json(data)
    }
    else{
      res.json({message:"usuccessful login"})
    }
    } 
  })
});

//add user api
router.post('/add-user', async function (req, res) {
  console.log('control is coming to post')
  const salt = await bcrypt.genSalt(10);
  userObject = {
    'username': req.body.username,
    'phonenumber': req.body.phonenumber,
    'password':req.body.password,
    'name': req.body.name,
    'gender': req.body.gender,
    'age': req.body.age,
    'role': req.body.role
  }
 let numberStr=req.body.phonenumber.toString()
 var patternNumber = new RegExp("^[0-9]{10}$");
 let usernameTest = /^[a-zA-Z]+$/.test(req.body.username);
 console.log("number in string",numberStr)
  if(!patternNumber.test(numberStr))
{
  res.json({message:"number is incorrect",code:400})
}
else{
  if(!usernameTest){
    res.json({message:"incorrect username",code:400})
  }
  else{
  userObject.password = await bcrypt.hash(userObject.password, salt);
  try {
    userExists = await users.findOne({ username: req.body.username });
  }
  catch (error) {
    res.json({message:error,code:400});
  }
  if (userExists) {
    res.json({message: "user already exists", code:400})
  } else {
      users.create(userObject, (err, data) => {
        if(err){
          res.json({ message: err,code:400});
        } else{
          res.json({message: "user created ", code:200})
        }
        
      })
  }
}
}



})
router.delete('/delete/:id', async function (req, res) {
  let id = req.params.id
  console.log(id)
  result = await users.remove({ _id: id });
  if (result) {
    res.json({message:"user removed"})
  }
  else {
    res.json({message:"error, user not removed"})
  }
})


router.put('/update/:id', async function (req, res) {
  let updatedDoc = {
    $set: {
      username: req.body.username,
      password: req.body.password,
      phonenumber: req.body.phonenumber,
      name: req.body.name,
      gender: req.body.gender,
      age: req.body.age,
      role: req.body.role
    }
  };
  console.log(req.body,'req body')
  users.updateOne({ _id: req.params.id }, updatedDoc, (error, data) =>{
    if(error){
      res.json({message:'update not working'})
    }
    else{
      res.json({message:'working'})
  }
  }).clone()

})



router.get('/get-users',function (req,res){
  users.find({}, {name:1,_id:0 },(error,data)=>{
    if(error){
      res.json({message:'cannot find users'})
    }
    else{
      let users = data.map(a => a.name);
      res.json(users)
    }
  })
})

router.post('/change-password/:id',async function (req,res){
  currentPassword=req.body.currentPassword,
  newPassword=req.body.newPassword,
  confirmPassword=req.body.confirmPassword
  const salt = await bcrypt.genSalt(10);

  confirmPassword = await bcrypt.hash(confirmPassword, salt);
  updateDoc={
    $set:{
      password:confirmPassword
    }
  }
  
  users.find({password:currentPassword,_id:req.params.id},function(err,result){
    if(err){
      res.status(400).json('password does not exist')
    }
    else{
      users.update({_id:req.params.id},updateDoc,function(err,result){
        if(err){
          res.status(401).json('error in chaning password')
        }
        else{
          res.json('password changed')
        }
      })
    }
  })
})
module.exports = router;
