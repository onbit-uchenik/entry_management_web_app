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
.get(function(req,res,next){
   res.setHeader('Content-Type')
})
.post(function(req,res,next) { 
   let date = new Date();
   let timestamp = date.getCompleteDate();
   (async function() {
      try{
         let host = await host(req);
         let result =  await db.check_entry([host.phone_no]);
         if(result === null){
            await mail(host,req);
            await talk_to_database(req,res,date,timestamp)
         }
         else{
            res.statusCode = 500;
            res.json({"status":0});
            console.log(__filename + err);            
         }
      }
      catch(err){
         console.log(__filename + err);
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

async function talk_to_database(req,res,date,timestamp){
   
   try{
      let values = [req.body.phone_no,timestamp,req.body.person_to_visit,req.body.purpose_of_visit];
      await db.visit_summary(values);
      values = [req.body.phone_no,req.body.email,req.body.firstname,req.body.lastname,req.body.sex];
      await db.visitor(values);
      values = [req.body.phone_no,timestamp,req.body.entry_gate,req.body.isemployee];
      let result = await db.entry(values);
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

async function host(req){
   try{
      let result = await db.getEmp([req.body.person_to_visit]);
      console.log(result);
      return result;
   }
   catch(err){
    //  res.statusCode = 500;
      console.log(__filename + err);
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