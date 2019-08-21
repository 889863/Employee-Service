const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const Employee = require('../models/employee');

/*This is to get all the employees list and we customized sent only selected values*/
router.get('/', (req, res,next) =>{
    Employee.find()
    .select('emp_id first_name last_name email job_type status')
    .exec()
    .then(result =>{
        const response = {
            employee_count:result.length,
            employee_list:result
        }
        res.status(200).json({
            responseBody:response
        })
    })
    .catch(err=>{
        res.status(500).json({
            error:err
        })
    })

});

/*Retrive employee information by Employee Id*/
router.get('/byEmpId/:empId', (req, res,next) =>{
    const empId = req.params.empId;
    Employee.find({emp_id:empId})
    //.select('emp_id first_name last_name email job_type status')
    .exec()
    .then(result =>{
        const response = {
            employee_count:result.length,
            employee_list:result
        }
        res.status(200).json({
            responseBody:response
        })
    })
    .catch(err=>{
        res.status(500).json({
            error:err
        })
    })

});

/*Retrive employee information by Email Id*/
router.get('/byEmailId/:emailId', (req, res,next) =>{
    const empId = req.params.emailId;
    Employee.find({email:empId})
    .select('emp_id first_name last_name email job_type status')
    .exec()
    .then(result =>{
        const response = {
            employee_count:result.length,
            employee_list:result
        }
        res.status(200).json({
            responseBody:response
        })
    })
    .catch(err=>{
        res.status(500).json({
            error:err
        })
    })

});

/*Inserting new employee details*/
router.post('/', (req, res,next) =>{
    const employee = new Employee({
        _id:new mongoose.Types.ObjectId,
        emp_id:req.body.emp_id,
        first_name:req.body.first_name,
        last_name:req.body.last_name,
        email:req.body.email,
        phone:req.body.phone,
        grade:req.body.grade,
        role:req.body.role,
        reporting_manager:req.body.reporting_manager,
        joining_date:req.body.joining_date,
        job_type:req.body.job_type,
        status:req.body.status       
    })
    employee.save()
    .then(result =>{
        res.status(201).json({employee:result});
    })
    .catch(err =>{
        res.status(500).json({
            error:err
        })
    })
});

/* Update the user details*/
router.patch('/:empId', (req, res, next)=>{
    const empId = req.params.empId;
    const updateOps = {};

    for(const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }

    Employee.update({emp_id:empId}, {$set:updateOps})
    .exec()
    .then(result=>{
        res.status(200).json({
            product:result
        })
    })
    .catch(err=>{
        res.status(500).json({
            error:err
        })
    })

});
/* Delete the user entry*/
router.delete('/:empId', (req, res, next)=>{
    const empId = req.params.empId;
    Employee.remove({emp_d:empId})
    .exec()
    .then(result =>{
        res.status(200).json({response:result});
    })
    .catch(err=>{
        res.status(500).json({error:err})
    })
});

module.exports = router;