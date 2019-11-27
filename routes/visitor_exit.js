const express  = require('express');
const bodyParser = require('body-parser');
const path  = require('path');
const db = require('../db.js');
const visitor_exit  = express.Router();
const lib = require('../lib/lib.js');
const nodemailer = require('nodemailer');
visitor_exit.use(bodyParser.json());


visitor_exit.route('/')
.get(function(req,res,next){
   let path_to_directory =  path.dirname(__dirname);
   res.sendFile(path_to_directory + '/public/visitor/exit.html');
})
.post(function(req,res,next){
   let date = new Date();
   let timestamp = date.getCompleteDate();
   (async function (){
      try{
         await make_exit(req,res,req.body.phone_no,timestamp);

         
      }
      catch(err){
         res.statusCode = 500;
         res.json({"status":0});
         console.log(__filename + err);
         res.end();
      }


   })();

})
.put(function(req,res,next) {
   res.statusCode = 500;
   res.json({"status":0});
   console.log(__filename + err);            

})
.delete(function(req,res,next) {
   res.statusCode = 500;
   res.json({"status":0});
   console.log(__filename + err);            
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

module.exports = visitor_exit;