let dictionary = [null,null,null,null,null];
let name="";
let emp_id=0;
$('#person_to_visit').keypress(function(event) {
    if(event.which === 8) {
        name = name.substring(0,name.length - 1);
        console.log("nwefnoifewiowf " + name );
    }
    else {
        console.log(event.key);
        name += event.key
    }
    let data = {"name":name};
    $.post("/suggestion",data,
            function (res, textStatus, jqXHR) {
                console.log(res);
                let i;
                for(i=0;i<res.length && 5 ;i++) {
                    console.log(res[i]);
                    $(`#${i}`).text(`${res[i].name},${res[i].designation}`).css("display","block");
                    dictionary[i] = res[i];
                }
                for(;i<5;i++){
                    $(`#${i}`).css("display","none");
                }
                $('#0').on('click',function(event){
                    $('#person_to_visit').val(dictionary[0].name);
                    emp_id = dictionary[0].emp_id; 
                })

                $('#1').on('click',function(event){
                    $('#person_to_visit').val(dictionary[0].name);
                    emp_id = dictionary[1].emp_id; 
                })

                $('#2').on('click',function(event){
                    $('#person_to_visit').val(dictionary[0].name);
                    emp_id = dictionary[2].emp_id; 
                })

                $('#3').on('click',function(event){
                    $('#person_to_visit').val(dictionary[0].name);
                    emp_id = dictionary[3].emp_id; 
                })

                $('#4').on('click',function(event){
                    $('#person_to_visit').val(dictionary[0].name);
                    emp_id = dictionary[4].emp_id; 
                })
            });
});




$('#submit').on('click',function(event) {
    let data = {};
    let flag =1;
    let phone_no = $('#phone_no').val();
    if(phone_no === '') flag=0;
    let purpose_of_visit = $('#purpose_of_visit').val()
    if(purpose_of_visit === '') flag = 0;
    let email = $('#email').val();
    if(email === '') flag  = 0;
    let first_name = $('#first_name').val();
    if(first_name === '') flag = 0;
    let last_name = $('#last_name').val();
    if(last_name === '') flag=0;
    let sex = $('#sex').val();
    if(sex === '') flag = 0;
    if(!flag) {
        let ref = $('ul').append(`<li>Enter complete details </li>`);
        setTimeout(function(){
            ref[0].children[1].remove();
        },2000);
    }
    else{
        data.phone_no = phone_no;
        data.person_to_visit = emp_id;
        data.purpose_of_visit = purpose_of_visit;
        data.email = email;
        data.first_name = first_name;
        data.last_name = last_name;
        data.sex = sex;
        data.entry_gate = 3;
        data.isemployee = '0';

        $.post('/visitor/entry',data,
        function (res, textStatus, jqXHR){
            if(res.status === 1){
                let ref = $('ul').append(`<li>You can enter redirecting to homepage </li>`);
                setTimeout(function(){
                    ref[0].children[1].remove();
                    setTimeout(function(){
                        window.history.back();
                    },2000); 
                },2000);
            }
            else if(res.status === 2){
                let ref = $('ul').append(`<li>You are trying to enter before exit</li>`);
                setTimeout(function(){
                    ref[0].children[1].remove();
                },2000);
            }
            else if(res.status === 4) {
                let ref = $('ul').append(`<li> Employee does not exist</li>`);
                setTimeout(function(){
                    ref[0].children[1].remove();
                },2000);
            }
            else if(res.status === 5) {
                let ref = $('ul').append(`<li> Employee is absent</li>`);
                setTimeout(function(){
                    ref[0].children[1].remove();
                },2000);                
            }
            else {
                let ref = $('ul').append(`<li> Enter valid input</li>`);
                setTimeout(function(){
                    ref[0].children[1].remove();
                },2000);                
            }
        },
        "json"
        );
    }
    event.stopPropagation();
});