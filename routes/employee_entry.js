const express  = require('express');
const bodyParser = require('body-parser');
const path  = require('path');
const db = require('./db.js');
const employee_entry  = express.Router();
const lib = require('./lib.js');

employee_entry.use(bodyParser.json());


employee_entry.route('/')

.get(function(req,res,next){
   let path_to_directory =  path.dirname(__dirname);
   res.sendFile(path_to_directory + '/public/employee/entry.html');
})

.post(function(req,res,next) {
   let date = new Date();
   let value=[req.body.phone_no, req.body.entry_gate, req.body.isemployee, date.getCompleteDate()];
   let db_promise = db.insert_history(value)
   .then(function(result){
       console.log('query is completed successfully');
       console.log(result);
       res.statusCode = 200;
   })
   .catch(function(err){
       console.log('query not completed successfully');
       console.log(err);
       res.statusCode  =500;
   })
   .then(function() {
      db.disconnect();
   })
   .then(function(){
      console.log('disconnected from the database');
      res.end();
   })
   .catch(function(err) {

      console.log("error while disconnecting\n" + err);
   })
});


module.exports = employee_entry;