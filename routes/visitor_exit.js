const express  = require('express');
const bodyParser = require('body-parser');
const path  = require('path');
const db = require('../db.js');
const visitor_exit  = express.Router();
const lib = require('../lib/lib.js');
const nodemailer = require('nodemailer');
visitor_exit.use(bodyParser.json());
const process = require('process');


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
         console.log(req.body.phone_no);
         await message_visitor(req.body.phone_no);

         
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

async function message_visitor(phone_no){
   try{
      let details={};
      let result = await db.getCheckInTime([phone_no]);
      if(result.status === 1){
         details.checkin_time = result.checkin_time;
         details.checkout_time = result.checkout_time;
         
         console.log(details);
         console.log(typeof(details.checkin_time));
         let result1 = await db.getVisitor([phone_no,result.checkin_time]);
         let result2  = await db.getHostVisited([phone_no,result.checkin_time]);
         if(result1.status === 1 && result2.status === 1){
            details.email = result1.email;
            details.name = result1.first_name + ' ' + result1.last_name;
            details.host_name = result2.first_name + ' ' + result2.last_name;
            details.address_visited = result2.cabin_address;
            console.log(details);
         }
      }
   }
   catch(err){
      console.log(err);
   }
}



async function mail(details) {
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
         to:`${details.email}`,
         subject:"Visit Summary",
         text:`hello ${details.name},
Here is your visit details..
   Checkin Time : ${details.checkin_time},
   Checkout Time : ${details.checkout_time},
   Host Name : ${details.host_name},
   Phone_no : ${details.phone_no}      
Have a nice day...`
      };
      await transporter.sendMail(mailoptions);
      console.log('mail sent successfully');
   }
   catch(err) {
      console.log(err);
   }
}

module.exports = visitor_exit;