
$('input').keypress(function(event){
    if(event.which === 13) {
        let str =  $(this).val();
        $(this).val('');
        let data = {
            "emp_id":str,
            "entry_gate":1,
            "isemployee":'1',
        };
        
        $.post("/employee/entry",data,
            function (res, textStatus, jqXHR) {
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
                else{
                    let ref = $('ul').append(`<li> Enter valid emp id</li>`);
                    setTimeout(function(){
                        ref[0].children[1].remove();
                    },2000);
                }
            },
            "json"
        );
        
    }
});