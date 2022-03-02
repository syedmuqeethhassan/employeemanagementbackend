var mongoose = require('mongoose');
const schema = mongoose.Schema;

var userSchema = new schema({
        username: String,
        password: String,
        phonenumber: {
                type:Number
        },
        name: String,
        gender: String,
        age: Number,
        role: [],
        createddate:Date,
        isdelete:Number
})

var userSchema = mongoose.model('User', userSchema);

module.exports = userSchema;