var express = require('express');
const req = require('express/lib/request');
const res = require('express/lib/response');
var router = express.Router();
var users = require("../models/users");
var mongodb = require("mongodb")
var ObjectID = require('mongodb').ObjectID;
const bcrypt = require("bcrypt");






router.post('/add-user', async function (req, res) {
  console.log('control is coming to post')
  const salt = await bcrypt.genSalt(10);
  userObject = {
    'username': req.body.username,
    'password': req.body.password,
    'phonenumber': req.body.phonenumber,
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
  res.send("number is incorrect")
}
else{
  if(!usernameTest){
    res.send("incorrect username")
  }
  else{
  userObject.password = await bcrypt.hash(userObject.password, salt);
  try {
    userExists = await users.findOne({ username: req.body.username });
  }
  catch (error) {
    res.send(error);
  }
  if (userExists) {
    res.send('user already exist')
  } else {
    try {
      users.create(userObject, (err, data) => {
        if(err){
          res.send({ err: err});
        } else{
          res.send("user created")
        }
        
      })
    } catch (e) {
      res.send({ err: e })
    }
    // res.status(200).json('inserted')
  }
}
}






/* GET users listing. */
router.get('/', function (req, res, next) {
  users.find(function (err, users) {
    if (err) {
      res.json(err);
    }
    res.type('json');
    res.status(200).json(users);
  }
  );
});
//login api below
// router.post('/login', function (req, res, next) {
//   users.find({ username: req.body.username }, (error, data) => {
//     if (error) res.send({ 'error': error, code: 500 });
//     if (login) {
//       if (req.body.password == data[0].password) {
//         res.json({ data: data, code: 200 })
//       }
//     } else {
//       res.json({ error: 'error', code: 400 })
//     }
//   })

// });

//add user api



  // if (userExists != null) {
  //   res.status(200).json('user exists')
  // }
  // else {
  //   users.create(userObject, { runValidators: true })
  //   res.status(200).json('inserted')
  // }
})
//issue with param and hexadecimal,string
// router.delete('/delete/:id', async function (req, res) {
//   let id = req.params.id
//   console.log(id)
//   result = await users.remove({ _id: id });
//   if (result) {
//     res.json("success")
//   }
//   else {
//     res.json("error")
//   }
// })

//update-same issue of params and hexadecimal,string
// router.put('/update', async function (req, res) {
//   let updatedDoc = {
//     $set: {
//       username: req.body.username,
//       password: req.body.password,
//       phonenumber: req.body.phonenumber,
//       name: req.body.name,
//       gender: req.body.gender,
//       age: req.body.age,
//       role: req.body.role
//     }
//   };

//   updated = await users.updateOne({ _id: "6203c3e74298ca89918851ff" }, updatedDoc)
//   if (updated) {
//     res.json("success")
//   }
//   else {
//     res.json()
//   }
// })

module.exports = router;
