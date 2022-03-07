var mongoose = require('mongoose');
const schema = mongoose.Schema;

var leavesSchema = new schema({
        startDate:Date,
        endDate:Date,
        updatedDate:Date,
        createddate:Date,
        createdBy:String,
        approved:String,
        managerApproval:String,
        reason:String
})

var leavesSchema = mongoose.model('leave', leavesSchema);

module.exports = leavesSchema;