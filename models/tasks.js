var mongoose = require('mongoose');
const schema = mongoose.Schema;

var taskSchema = new schema({
    taskname : String,
    taskstatus : String,
    assignto : String,
    taskdescription : String,
    createdby : String,
    date : Date,
    updateddate : Date,
    id : Number
})

var taskSchema = mongoose.model('Task', taskSchema);

module.exports = taskSchema;