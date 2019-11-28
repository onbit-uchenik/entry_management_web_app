const express  = require('express');
const http  = require('http');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const app  = express();
const db = require('./db.js');
const process = require('process');
const path = require('path');

const employee_entry = require('./routes/employee_entry');
const employee_exit = require('./routes/employee_exit');
const visitor_entry  = require('./routes/visitor_entry');
const visitor_exit  = require('./routes/visitor_exit');

process.stdin.resume();

(async function(){
    try{
        await db.start();
    }
    catch(err){
        console.log(__filename + 'on line number 16' + err);
    }
})();



app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));



app.use(express.static(path.join(__dirname  + '/public')));
app.use('/employee/entry',employee_entry);
app.use('/employee/exit',employee_exit);
app.use('/visitor/entry',visitor_entry);
app.use('/visitor/exit',visitor_exit);





const hostname  = 'localhost';
const port = 3333;

const server = http.createServer(app);

server.listen(port,hostname,()=>{
    console.log(`server is running at http://${hostname}:${port} with process is ${process.pid} `);
});




// async function shutdown(signal) {
//     try{
//         console.log(`Received ${signal}`);
//         //await db.stop();
//         await server.close();
//         await process.exit();        
//     }
//     catch(err){
//         console.log(__filename +'on line number : 61' + err);
//     }
// }


// process.on("SIGTERM",shutdown);

// process.on("SIGINT",function(){
//     console.log("Shut Me Down gracefully ....");
// });