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


// function auth(req,res,next) {
//     let authHeader = req.headers.authorization;
//     if(!authHeader) {
//         let err  =  new Error('you are not authenticated!');
//         res.setHeader('WWW-Authenticate','Basic');
//         err.status = 401;
//         return next(err);
//     }
//     let auth  =  new Buffer.alloc(authHeader.split(' ')[1],'base64').toString().split(':');
//     let username = auth[0];
//     let password = auth[1];
//     if(username==='admin' && password === 'ilovemyindia'){
//         next();
//     }
//     else{
//         let err  =  new Error('you are not authenticated!');
//         res.setHeader('WWW-Authenticate','Basic');
//         err.status = 401;
//         return next(err);
//     }
// }


// app.use(auth);

app.use(express.static(path.join(__dirname  + '/public')));
app.use('/employee/entry',employee_entry);
app.use('/employee/exit',employee_exit);
app.use('/visitor/entry',visitor_entry);
app.use('/visitor/exit',visitor_exit);
app.use('/suggestion',suggestion);





const hostname  = 'localhost';
const port = 3333;

const server = http.createServer(app);

server.listen(port,hostname,()=>{
    console.log(`server is running at http://${hostname}:${port} with process is ${process.pid} `);
});






// async function shutdown(signal) {
//     try{
//         console.log(`Received ${signal}`);
//         await db.stop();
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
