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
  users.find({},null,{sort:{createddate:-1}},(function (err, users) {
    if (err) {
      res.json(err);
    }
    res.type('json');
    res.json(users);
  }
  ))
  })
router.post('/login',async function (req, res, next) {
  
  users.findOne({ username: req.body.username },async (error, data) => {
    if (error){
      res.json({ 'error': error, code: 404 });
    }
    else{
      console.log('login else statement')
      console.log(data)
      console.log(req.body.password)
      const validPassword = await bcrypt.compare(req.body.password, data.password);
    if(validPassword){
      console.log(data,'data')
      res.json({message:'Login successful',code:200,data:data})
    }
    else{
      res.json({message:'Unsuccessful login',code:402})
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
    'role': req.body.role,
    'createddate':req.body.createddate,
    'isdelete':req.body.isdelete
  }
 let numberStr=req.body.phonenumber.toString()
 var patternNumber = new RegExp("^[0-9]{10}$");
 let usernameTest = /^[a-zA-Z]+$/.test(req.body.username);
 console.log("number in string",numberStr)
  if(!patternNumber.test(numberStr))
{
  res.json({message:"Number is incorrect",code:400})
}
else{
  if(!usernameTest){
    res.json({message:"Incorrect username",code:400})
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
    res.json({message: "User already exists", code:400})
  } else {
      users.create(userObject, (err, data) => {
        if(err){
          res.json({ message: err,code:400});
        } else{
          res.json({message: "User created ", code:200})
        }
        
      })
  }
}
}

 

})
router.delete('/delete/:id', async function (req, res) {
  let id = req.params.id
  console.log(id)
  result = await users.updateOne({ _id: id },{$set:{isdelete:1}});
  if (result) {
    res.json({message:"User removed"})
  }
  else {
    res.json({message:"Error, user not removed"})
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
  users.findOneAndUpdate({ _id: req.params.id }, updatedDoc,{ "new": true}, (error, data) =>{
    if(error){
      res.json({message:'Update not working'})
    }
    else{
      res.json({data:data,message:'Update successful'})
  }
  }).clone()

})



router.get('/get-users',function (req,res){
  users.find({}, {name:1,_id:0 },(error,data)=>{
    if(error){
      res.json({message:'Cannot find users'})
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
console.log(req.body.currentPassword,'currentpassword')
  confirmPassword = await bcrypt.hash(confirmPassword, salt);
  updateDoc={
    $set:{
      password:confirmPassword
    }
  }
  
  users.findOne({_id:req.params.id},async function(err,result){
    if(err) {
      res.json({message:'Error in process',code:402})
    } else {
      const validPassword = await bcrypt.compare(req.body.currentPassword, result.password);
      if(validPassword){
        users.updateOne({_id:req.params.id},{password:confirmPassword},function(err,result){
          if(err) {
            res.json({message:'Password not changed 1',code:401})
          } else {
            res.json({message:'Password changed',code:200})
          }
        })
     }
    else{
      res.json({message:'Password not changed 2',code:401})
    } }
  })
})
module.exports = router;
