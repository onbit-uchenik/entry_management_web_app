const {Client} = require('pg');

const client = new Client({
    "user": "on_bit_syn",
    "password":"123",
    "host":"localhost",
    "port":5432,
    "database":"entry_management"
});


async function start(){
    try{
        await client.connect();
        console.log('successfully connecteed to database entry_management');
    }
    catch(err){
        console.log(__filename + ' on line number 17' + err);
    }
}


async function stop(){
    try{
        await client.end();
        console.log('successfully disconnectd from database');
    }
    catch(err){
        console.log(__filename + ' on line number 29' + err);
    }
}


async function entry(values){
    try{
        let result = await check_entry([values[0]]);
        if(result!==0){
            if(result !== null ) {
                let text = 'INSERT INTO history(phone_no,checkin_time,entry_gate,isemployee) VALUES($1,$2,$3,$4)';
                await client.query(text,values);
                console.log('successful');
                return {"status":1};
            }
            else{
                console.log('entry before exit');
                return {"status":2};
            }
        }
        else {
            console.log('error');
            return {"status":0};
        } 
    }
    catch(err){
        console.log(__filename + ' hfwhefewo on line number 54' + err);
        return {"status":0};
    }
}

async function check_entry(values){
    try{
        let id = await getMaxId(values);
        console.log(id);
        if(id!==0){
            if(id !== null) {
                let text=`SELECT checkout_time FROM history WHERE id=${id}`;
                let result = await client.query(text);
                console.log(result.rows[0].checkout_time);
                return result.rows[0].checkout_time;
            }
            else{
                console.log("here");
                return 1;
            }
        }
        else {
            console.log('error  occured while getting max_id at line 77');
            return 0;
        }

    }
    catch(err){
        console.log(__filename + ' on line number 83' + err);
        return 0;
    }
}
async function getMaxId(values){
    try{
        let text = `SELECT MAX(id) FROM history WHERE phone_no=$1`;
        let result = await client.query(text,values);
        return result.rows[0].max;
    }
    catch(err){
        console.log(__filename + ' on line number 91' + err);
        return 0;
    }
}

async function exit(values){
    try{
        let result = await check_exit([values[0]]);
        if(result!==0){
            if(result[0] === null ) {
                let text = 'UPDATE history SET checkout_time=$2,exit_gate=$3 WHERE id=$1';
                values[0] = result[1];
                await client.query(text,values);
                console.log('successful for exit');
                return {"status":1};
            }
            else{
                console.log('exit before entry');
                return {"status":3};
            }
        }
        else {
            console.log('error');
            return {"status":0};
        }   
    }
    catch(err){
        console.log(__filename + ' on line number 121' + err.stack);
        return {"status":0};
    }
}

async function check_exit(values){
    try{
        let id = await getMaxId(values);
        console.log(id);
        if(id!==0){
            if(id !== null) {
                let text=`SELECT checkout_time FROM history WHERE id=${id}`;
                let result = await client.query(text);
                console.log(result.rows[0].checkout_time);
                return [result.rows[0].checkout_time,id];
            }
            else{
                console.log("here");
                return 1;
            }
        }
        else{
            console.log('error  occured while getting max_id at line 143');
            return 0;
        }

    }
    catch(err){
        console.log(__filename + ' on line number 149' + err);
        return 0;
    }
}


async function visitor(values){
    try{
        let text = 'INSERT INTO visitor VALUES($1,$2,$3,$4,$5,$6)';
        await client.query(text,values);
        return {"status":1};
    }
    catch(err){
        console.log(__filename + ' on line number 162' + err);
        return {"status":0};
    }
}

async function visit_summary(values){
    try{
        let text = 'INSERT INTO visit_summary VALUES($1,$2,$3,$4)';
        await client.query(text,values);
        return {"status":1};
    }
    catch(err) {
        console.log(__filename + ' on line number 152' + err);
        return {"status":0};
    }
}


async function getEmp(emp_id){
    try{
        let text = 'SELECT * FROM emp WHERE emp_id=$1';
        let result = await client.query(text,emp_id);
        if(result.rowCount !== 0){
            result.rows[0].status = 1;
            return result.rows[0];
        }
        else{
            console.log(`employee with emp_id ${emp_id[0]} does not exist...`);
            return {"status":4};
        }
    }
    catch(err){
        console.log(__filename + ' on line number 189' + err);
        return {"status":0};
    }
}


async function isPresent(values) {
    try{
        let result =  await check_entry([values[0]]);
        if(result !== 0){
            if(result === null) {
                console.log('employee is present in office');
                return {"status":1};
            }
            else{
                console.log('employee is absent');
                return {"status":5};
            }
        }
        else {
            console.log('error on line number 213');
            return {"status":0};
        }
    }
    catch(err){
        console.log(__filename + ' on line number 220' + err);
        return {"status":0};
    }
}

async function getAllEmp() {
    try{
        let result = await client.query('SELECT emp_id,first_name,last_name,designation FROM emp')
        return result.rows;
    }
    catch(err){
        console.log(__filename + ' on line number 220' + err);
        return [];
        
    }
}


async function getCheckInTime(values){
    try{
        let id = await getMaxId([values[0]]);
        if(id !== 0) {
            if(id !== null) {
                let text  = 'SELECT checkin_time,checkout_time FROM history WHERE id=$1';
                let result = await client.query(text,[id]);
                console.log('GET CHECKIN TIME');
                console.log(result);
                result.rows[0].status = 1;
                
                return result.rows[0];
            }
            else{
                console.log('no such visitor exist');
                return {"status":0};
            }
        }
        else{
            console.log('error while getting maxid');
            return {"status":0};
        }
    }
    catch(err){
        console.log(__filename + err);
        return {"status":0};
    }
}


async function getHostVisited(values){
    try{
        let text = 'SELECT person_to_visit FROM visit_summary WHERE phone_no=$1 AND checkin_time=$2';
        let result = await client.query(text,values);
        result = await getEmp([result.rows[0].person_to_visit]);
        return result;
    }
    catch(err){
        console.log(__filename + err);
        return {"status":0}
    }
}

async function getVisitor(values){
    try{
        let text = 'SELECT first_name,last_name,email FROM visitor WHERE phone_no=$1 AND checkin_time=$2';
        let result  = await client.query(text,values);
        console.log('GET VISITOR');
        console.log(result);
        result.rows[0].status  = 1;
        return result.rows[0];
    }
    catch(err){
        console.log(__filename + err);
        return {"status":0}
    }
}
//  start();

//  (async function () {
//      let res =  await getCheckInTime(['5556666777']);
//      console.log(res); 
//  })();

module.exports.start = start;
module.exports.stop = stop;
module.exports.entry = entry;
module.exports.exit = exit;
module.exports.visit_summary = visit_summary;
module.exports.visitor = visitor;
module.exports.getEmp = getEmp;
module.exports.isPresent = isPresent;
module.exports.getAllEmp = getAllEmp;
module.exports.getCheckInTime = getCheckInTime;
module.exports.getHostVisited = getHostVisited;
module.exports.getVisitor = getVisitor;