const express  = require('express');
const bodyParser = require('body-parser');
const path  = require('path');
const db = require('../db.js');
const employee_exit  = express.Router();
const lib = require('../lib/lib.js');

employee_exit.use(bodyParser.json());
employee_exit.use(bodyParser.urlencoded({extended:true}));

employee_exit.route('/')

.get(function(req,res,next){  
   let path_to_directory =  path.dirname(__dirname);
   res.sendFile(path_to_directory + '/public/employee/exit.html');
})
.post(function(req,res,next){
      let date = new Date();
      let timestamp = date.getCompleteDate();
      
      (async function(){
         try{
            let values = [req.body.emp_id];
            let result = await db.getEmp(values);
            if(result.status === 1) {
               // successful in getting emp details
               // exit nicely....
               await make_exit(req,res,result.phone_no,timestamp);
            }
            else if(result.status === 4){
               //employee with emp id do not exist...
               console.log("employee does not exist...")
               res.statusCode = 404;
               res.json(result);
               res.end();
            }
            else{
               // error while getting emp details..
               res.statusCode = 500;;
               res.join(result);
               res.end();
            }
         }
         catch(err){
            res.statusCode = 500;
            res.json({"status":0});
            console.log(__filename + err);
            res.end();
         }         
      
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

async function make_exit(req,res,phone_no,timestamp){
   try{
      let values=[phone_no,timestamp,req.body.exit_gate];
      let result = await db.exit(values);
      res.statusCode = 200;
      res.json(result);
   }
   catch(err) {
      res.statusCode = 500;
      res.json({"status":0});
      console.log(__filename + err);                         
   }
   res.end();

}

module.exports = employee_exit;