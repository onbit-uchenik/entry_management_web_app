const express  = require('express');
const bodyParser = require('body-parser');
const suggestion  = express.Router();
const lib = require('../lib/suggestion_engine.js');
const db = require('../db.js');
let root = null;
let details = null;''
suggestion.use(bodyParser.json());
suggestion.use(bodyParser.urlencoded({extended:true}));



suggestion.route('/')
.post(function(req,res,next){
    let ans = [];
    lib.suggest(req.body.name,0,root,ans);
    let result = [];
    for(let i = 0;i < ans.length;i++ ) {
        result.push(details[ans[i]]);
    }
    console.log(result);
    res.json(result);
    res.end();
});


async function init() {
    details = await getData();
    root = new lib.Node;
    root.init();

    for(let i=0;i<details.length;i++) {
        lib.insert(details[i].name,0,root,i);
    }
    console.log(root);
}

async function getData(){
     let result  = await  db.getAllEmp();
     return result;
}

module.exports = suggestion;
module.exports.init = init;




