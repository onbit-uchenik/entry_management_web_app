const express  = require('express');
const bodyParser = require('body-parser');
const path  = require('path');
const employee_entry  = express.Router();

employee_entry.use(bodyParser.json());


employee_entry.route('/')
.get(function(req,res,next){
   let path_to_directory =  path.dirname(__dirname);
   res.sendFile(path_to_directory + '/public/visitor/exit.html');
});

module.exports = employee_entry;