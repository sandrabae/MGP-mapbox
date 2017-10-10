

update();

function update(){
    $.ajax({
            type : 'POST',
            data: {start: 0, end: 50},  //if you wanted to specify specific data you want you can pass info here to router
            dataType : 'json',
            url: '/ajax',
            success : function(response) {
                var content = response["data"];
                loadingMap(content);
            }
    });
}
