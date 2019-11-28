                    Entry Management Web Application


A simple and beautiful web application for Entry Management in offices . It uses Postgresql Database in Backend , which is The World's Most Advanced Open Source Relational Database, along with nodejs and express.

Database Contain 4 Tables :-

                        
                    Table Name : public.history
                    
Column Name     Type                             Constraints
id              bigint                        not null primary key
phone_no        character(10)                 not null
checkin_time    timestamp without time zone   not null
checkout_time   timestamp without time zone   
entry_gate      integer                       not null
exit_gate       integer                       
isemployee      boolean                       not null  


                         Table "public.emp"
   Column            Type                        Constraints
 emp_id       integer                           not null  primary key
 first_name   character varying(80)             not null  
 last_name    character varying(80)             not null  
 email        character varying(80)             not null  
 phone_no     character(10)                     not null  
 designation  character varying(30)             not null  
