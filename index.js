const express  = require('express');
const http  = require('http');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const app  = express();

const employee_entry = require('./routes/employee_entry');
const employee_exit = require('./routes/employee_exit');
const visitor_entry  = require('./routes/visitor_entry');
const visitor_exit  = require('./routes/visitor_exit');

const hostname  = 'localhost';
const port = 3333;

app.use(morgan('dev'));
app.use(bodyParser.json());

app.use('/employee/entry',employee_entry);
app.use('/employee/exit',employee_exit);
app.use('/visitor/entry',visitor_entry);
app.use('/visitor/exit',visitor_exit);



app.use(express.static(__dirname  + '/public'));


const server = http.createServer(app);

server.listen(port,hostname,()=>{
    console.log(`server is running at http://${hostname}:${port}`);
});
