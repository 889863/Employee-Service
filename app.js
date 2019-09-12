const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();

const employeeRoutes = require('./api/routes/employee');

/*MongoD connection setup using Mongoose*/
mongoose.connect("mongodb+srv://subin:"+process.env.MONGO_ATLAS_PWD+"@rest-api-e6ldy.mongodb.net/test?retryWrites=true&w=majority", { useNewUrlParser: true } )

/*Morgan is used for logging purpose*/
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

/*This is for enabling CORS */
app.use((req, res, next)=>{
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-headers", "*");
    
    if(req.method === 'OPTIONS'){
        res.header("Access-Control-Allow-Methods", "PUT, POST, GET, PATCH, DELETE");
        return res.status(200).json({});
    }
    next();
});

/*We are sending to Employee routes based on the request*/
app.use('/employee', employeeRoutes);

/*This is general error handling , need to improve this*/
app.use((req, res, next)=>{
    const error = new Error('URL NOT FOUND');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next)=>{
   res.status(error.status || 500);
   res.json({
       error:{
           message:error.message
       }
   })
})

module.exports = app;