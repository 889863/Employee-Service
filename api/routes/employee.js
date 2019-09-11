const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const Employee = require('../models/employee');

/*This is to get all the employees list and we customized sent only selected values*/
router.get('/', (req, res, next) => {
    Employee.find()
        .select('emp_id first_name last_name email job_type status')
        .exec()
        .then(result => {
            const response = {
                employee_count: result.length,
                employee_list: result
            }
            res.status(200).json({
                responseBody: response
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })

});

/*Global Employee Search*/
router.get('/search', (req, res, next) => {
    let searchParam = {};
    if (req.query && req.query.option && req.query.value) {
        console.log(req.query.option);
        switch (req.query.option) {
            case 'User Id':
                searchParam = { emp_id: req.query.value };
                break;
            case 'Email':
                searchParam = { email: req.query.value };
                break;
            case 'First Name':
                searchParam = { first_name: req.query.value };
                break;
            case '"Last Name':
                searchParam = { last_name: req.query.value };
                break;
            default:
        }
        console.log("searchParam: " ,searchParam);
        Employee.find(searchParam)
            .exec()
            .then(result => {
                const response = {
                    employee_count: result.length,
                    employee_list: result
                }
                res.status(200).json(result)
            })
            .catch(err => {
                res.status(500).json({
                    error: err
                })
            })
    }
});

/*Retrive employee information by Employee Id*/
router.get('/byEmpId/:empId', (req, res, next) => {
    const empId = req.params.empId;
    Employee.find({ emp_id: empId })
        //.select('emp_id first_name last_name email job_type status')
        .exec()
        .then(result => {
            const response = {
                employee_count: result.length,
                employee_list: result
            }
            res.status(200).json({
                responseBody: response
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })

});

router.get('/lastRecord', (req, res, next) => {
    const empId = req.params.empId;
    Employee.find().limit(1).sort({ $natural: -1 })
        //.select('emp_id first_name last_name email job_type status')
        .exec()
        .then(result => {
            const response = {
                employee_count: result.length,
                employee_list: result
            }
            res.status(200).json({
                responseBody: response
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })

});

/*Retrive employee information by Email Id*/
router.get('/byEmailId/:emailId', (req, res, next) => {
    const empId = req.params.emailId;
    Employee.find({ email: empId })
        .select('emp_id first_name last_name email job_type status')
        .exec()
        .then(result => {
            const response = {
                employee_count: result.length,
                employee_list: result
            }
            res.status(200).json({
                responseBody: response
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })

});


/*Inserting new employee details*/
router.post('/', (req, res, next) => {
    Employee.find({ email: req.body.email.toUpperCase() })
        .exec()
        .then(result => {
            if (result.length > 0) {
                res.statusMessage = "Email Address Already Exists!!";
                //res.statusText = 'Email Address :'+req.body.email.toUpperCase()+' already exists. Please choose different email address';
                res.status(404).end();
            } else {
                Employee.find().limit(1).sort({ $natural: -1 })
                    .exec()
                    .then(result => {
                        if (result[0].emp_id) {
                            const employee = new Employee({
                                _id: new mongoose.Types.ObjectId,
                                emp_id: (parseInt(result[0].emp_id) + 1).toString(),
                                first_name: req.body.first_name.toUpperCase(),
                                last_name: req.body.last_name.toUpperCase(),
                                email: req.body.email.toUpperCase(),
                                phone: req.body.phone,
                                grade: req.body.grade,
                                role: req.body.role.toUpperCase(),
                                reporting_manager: req.body.reporting_manager.toUpperCase(),
                                joining_date: req.body.joining_date,
                                job_type: req.body.job_type,
                                status: req.body.status
                            })
                            employee.save()
                                .then(result => {
                                    res.status(201).json(result);
                                })
                                .catch(err => {
                                    res.status(500).json({
                                        error: err
                                    })
                                })
                        }
                    })
                    .catch(err => {
                        res.status(500).json({
                            error: err
                        })
                    })
            }
        })

});

/* Update the user details*/
router.patch('/:empId', (req, res, next) => {
    const empId = req.params.empId;
    const updateOps = {};

    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }

    Employee.update({ emp_id: empId }, { $set: updateOps })
        .exec()
        .then(result => {
            res.status(200).json({
                product: result
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })

});
/* Delete the user entry*/
router.delete('/:empId', (req, res, next) => {
    const empId = req.params.empId;
    Employee.remove({ emp_id: empId })
        .exec()
        .then(result => {
            res.status(200).json({ response: result });
        })
        .catch(err => {
            res.status(500).json({ error: err })
        })
});

module.exports = router;