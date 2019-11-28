
$('input').keypress(function(event){
    if(event.which === 13) {
        let str =  $(this).val();
        $(this).val('');
        let data = {
            "phone_no":str,
            "exit_gate":3,
        };
        
        $.post("/visitor/exit",data,
            function (res, textStatus, jqXHR) {
                if(res.status === 1){
                    let ref = $('ul').append(`<li>You can exit redirecting to homepage... </li>`);
                    setTimeout(function(){
                        ref[0].children[1].remove();

                        setTimeout(function(){
                            window.history.back();
                        },2000);
                    },2000);
                    
                }
                else if(res.status === 3){
                    let ref = $('ul').append(`<li>You are trying to exit before enter</li>`);
                    setTimeout(function(){
                        ref[0].children[1].remove();
                    },2000);
                }
            },
            "json"
        );
        
    }
});