

(function(){
      
   const express  = require('express');
   const bodyParser = require('body-parser');
   const path  = require('path');
   const db = require('../db.js');
   const employee_entry  = express.Router();
   const lib = require('../lib/lib.js');

   employee_entry.use(bodyParser.json());
   employee_entry.use(bodyParser.urlencoded({extended:true}));


   employee_entry.route('/')
   .get(function(req,res,next){
      res.statusCode = 200;
      let path_to_directory =  path.dirname(__dirname);
      res.sendFile(path_to_directory + '/public/employee/entry.html');
   })

   .post(function(req,res,next) {
      let date = new Date();
      let timestamp = date.getCompleteDate();
      // try to get the emp phone_no...
      // if successfull run enter function...
      (async function(){
         try{
            let values = [req.body.emp_id];
            let result = await db.getEmp(values);
            console.log(result);
            if(result.status === 1) {
               // successful in getting emp details
               // enter nicely....
               await enter(req,res,result.phone_no,timestamp);
            }
            else if(result.status === 4){
               //employee with emp id do not exist...
               console.log("employee does not exist...")
               res.statusCode = 200;
               res.json(result);
               res.end();
            }
            else{
               // error while getting emp details..
               res.statusCode = 200;;
               res.json(result);
               res.end();
            }
         }
         catch(err){
            res.statusCode = 500;
            console.log(__filename + err);
            res.json({"status":0});
         }  
      })(); 
   })
   .put(function(req,res,next){
      res.statusCode = 404;
      res.end();
   })
   .delete(function(req,res,next){
      res.statusCode = 404;
      res.end();
   });

   // enters the employee....
   // on success update the history table.....
   async function enter(req,res,phone_no,timestamp){
      try{
         let values=[phone_no, timestamp,req.body.entry_gate, req.body.isemployee];
         let result = await db.entry(values);
         res.statusCode = 200;
         res.json(result);
         res.end();
      }
      catch(err){
         res.statusCode = 500;
         res.json({"status":0});
         res.end();
      }
   }



   module.exports = employee_entry;


})();