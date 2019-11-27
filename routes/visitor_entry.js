const express  = require('express');
const bodyParser = require('body-parser');
const path  = require('path');
const db = require('../db.js');
const visitor_entry  = express.Router();
const lib = require('../lib/lib.js');
const nodemailer = require('nodemailer');

visitor_entry.use(bodyParser.json());


visitor_entry.route('/')
.get(function(req,res,next){
   let path_to_directory =  path.dirname(__dirname);
   res.sendFile(path_to_directory + '/public/visitor/entry.html');
})
.post(function(req,res,next) { 
   let date = new Date();
   let timestamp = date.getCompleteDate();
   (async function() {
      try{
         let values = [req.body.person_to_visit];
         let result = await db.getEmp(values);
         if(result.status === 1) {
            // successful in getting emp details
            // check employee is present or absent....
            await check_emp_present([result.phone_no],req,res,timestamp,result);
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
            res.json(result);
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

async function check_emp_present(values,req,res,timestamp,host){
   try{
      let result  = await db.isPresent(values);
      if(result.status === 1){
         //employee is present...
         let a = await enter(req,res,req.body.phone_no,timestamp);
         let b = await addVisitor(req,res,req.body.phone_no);
         let c = await addVisitorSummary(req,res,req.body.phone_no,timestamp);
         await mail(host,req);
         if(a&&b&&c) {
            res.statusCode= 200;
            res.json({"status":1});
         }
         else {
            res.statusCode = 500;
            res.json({"status":0});   
         } 
      }
      else if(result.status === 5){
         //employee is absent.....
         res.statusCode = 404;
         console.log(result);
         res.json(result);
      }
      else if(result.status === 0) {
         res.statusCode = 500;
         res.json({"status":0});
         console.log(__filename + err);
        // res.end();   
      }
   }
   catch(err){
      res.statusCode = 500;
      res.json({"status":0});
      console.log(__filename + " on line number 87 " + err);
      //res.end();
   }
   res.end();
}


async function enter(req,res,phone_no,timestamp){
   try{
      let values=[phone_no, timestamp,req.body.entry_gate, req.body.isemployee];
      let result = await db.entry(values);
      return result.status;

   }
   catch(err){
      console.log(__filename + err);   
      return 0;
   }
}


async function addVisitor(req,res,phone_no){
   try{
      let values = [phone_no,req.body.email,req.body.first_name,req.body.last_name,req.body.sex];
      console.log(values);
      let result = await db.visitor(values);
      return result.status;
   }
   catch(err){
      console.log(__filename + err);
   }
}  

async function addVisitorSummary(req,res,phone_no,timestamp){
   try{
      let values = [phone_no,timestamp,req.body.person_to_visit,req.body.purpose_of_visit];
      let result = await db.visit_summary(values);
      return result.status;
   }
   catch(err){
      console.log(__filename + err);
      return 0;
   }
}


async function mail(details,req) {
   try{
      let transporter =    nodemailer.createTransport({
         service : "gmail",
         auth :{
            user :"onbitsyn@gmail.com",
            pass :"{onbit#love4code}"
         }
      });
      let mailoptions = {
         from : "onbitsyn@gmail.com",
         to:`${req.body.email}`,
         subject:"Visitor Detail",
         text:`hello ${details.first_name + ' ' + details.last_name},
Respected ${req.body.firstname + ' ' + req.body.lastname} is coming to meet you.
         
Have a nice meeting...`
      };
      await transporter.sendMail(mailoptions);
      console.log('mail sent successfully');
   }
   catch(err) {
      console.log(err);
   }
}



module.exports = visitor_entry;



/*
{"phone_no":"0123456789","person_to_visit":1,"purpose_of_visit":"for query","email":"vatsanu1999@gmail.com","fist_name":"rishabh","last_name":"garg","sex":"male","entry_gate":3,"isemployee":"0"}

*/