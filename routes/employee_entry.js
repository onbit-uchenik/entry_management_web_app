const express  = require('express');
const bodyParser = require('body-parser');
const path  = require('path');
const db = require('../db.js');
const employee_entry  = express.Router();
const lib = require('../lib/lib.js');

employee_entry.use(bodyParser.json());


employee_entry.route('/')
.all(function(req,res,next){
   res.setHeader('Content-Type','application/json');
   next();
})
.get(function(req,res,next){
   let path_to_directory =  path.dirname(__dirname);
   res.sendFile(path_to_directory + '/public/employee/entry.html');
})

.post(function(req,res,next) {
   let date = new Date();
   let values=[req.body.phone_no, date.getCompleteDate(),req.body.entry_gate, req.body.isemployee];
   (async function(){
         try{
            let result = await db.entry(values);
            res.statusCode = 200;
            res.json(result);

         }
         catch(err){
            res.statusCode = 500;
            res.json({"status":0});
            console.log(__filename + err);   
         }
         res.end();
   })(); 
})
.put(function(req,res,next){
    res.statusCode = 500;
    res.json({"status":0});
    res.end();
})
.delete(function(req,res,next){
   res.statusCode = 500;
   res.json({"status":0});
   res.end();
});


module.exports = employee_entry;