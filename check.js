const lib = require('./lib/lib.js')

let date = new Date();
console.log(date.getCompleteDate());
setTimeout(function(){
    console.log(date.getCompleteDate());
},2000)
