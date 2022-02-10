var mongoose = require('mongoose');
const schema = mongoose.Schema;

var userSchema = new schema({
        username: String,
        password: String,
        phonenumber: Number,
        name: String,
        gender: String,
        age: Number,
        role: []
})

var userSchema = mongoose.model('User', userSchema);

module.exports = userSchema;