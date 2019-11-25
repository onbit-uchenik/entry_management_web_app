#!usr/bin/node


    const {Client} = require('pg');
    
    const client = new Client({
        user : "on_bit_syn",
        password:"123",
        host:"localhost",
        port : 5432,
        database:"entry_management"
    });

    function getQuery(text,value){

        return query_promise = client.query(text,value)
    
    }
    
    function disconnect(){
        return client.end();
    }

    function insert_history(values) {
        return connection_promise = client.connect()   
        .then(function(){
            let text = 'INSERT INTO history(phone_no,entry_gate,isemployee,checkin_time) VALUES($1,$2,$3,$4) RETURNING *';
            return getQuery(text,values);
        })
    }

    function update_history(values) {
        let connection_promise = client.connect();
        connection_promise.then(function(){
            console.log('connected to data successfully...');
            let text = 'UPDATE history SET checkout_time=$1,exit_gate=$2 WHERE phone_no=$3'
            return getQuery(text,values);
        });
        connection_promise.catch(function(){
            console.log('ERROR WHILE CONNECTING...\n'+ err);
            console.log('diconnected from database ...');
            client.end();
            return 0;
        });
    }

    function get_employees() {
        let connection_promise = client.connect();
        connection_promise.then(function(){
            console.log('connected to data successfully...');
            let text = 'SELECT emp_id,first_name,last_name,designation FROM emp;';
            return getQuery(text);
        });
        connection_promise.catch(function(){
            console.log('ERROR WHILE CONNECTING...\n'+ err);
            console.log('diconnected from database ...');
            client.end();
            return 0;
        });
    }

    function get_employee(values){
        let connection_promise = client.connect();
        connection_promise.then(function(){
            console.log('connected to data successfully...');
            let text = 'SELECT phone_no FROM emp WHERE emp_id=$1';
            return getQuery(text,value);
        });
        connection_promise.catch(function(){
            console.log('ERROR WHILE CONNECTING...\n'+ err);
            console.log('diconnected from database ...');
            client.end();
            return 0;
        });
    }

    module.exports.insert_history = insert_history;
    module.exports.update_history = update_history;
    module.exports.disconnect = disconnect;    