const express  = require('express');
const bodyParser = require('body-parser');
const suggestion  = express.Router();
const lib = require('../lib/suggestion_engine.js');
const index = require('../index.js');
const root = index.root;
const details = index.details;
suggestion.use(bodyParser.json());
suggestion.use(bodyParser.urlencoded({extended:true}));


suggestion.route('/')
.post(function(req,res,next){
    console.log(root);
    console.log(details);
    let ans = [];
    lib.suggest(req.body.name,0,root,ans);
    console.log(ans);
});


module.exports = suggestion;