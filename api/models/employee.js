const mongoose = require('mongoose');
const employeeSchema = mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    emp_id:{type:String, required:true},
    first_name:{type:String, required:true},    
    last_name:{type:String, required:true},
    email:{type:String, required:true},
    phone:{type:String, required:true},
    grade:{type:String, required:true},
    role:{type:String, required:false},
    reporting_manager:{type:String, required:false},
    joining_date:{type:String, required:true},
    job_type:{type:String, required:true},
    status:{type:String, required:true}
});

module.exports = mongoose.model('Employee', employeeSchema);