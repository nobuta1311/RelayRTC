function writeLog(logstr){
    console.log(logstr);
    $("#log-space").prepend(logstr+"<br>");
}

function showNortify(str1,str2) {
    var nortify = window.Notification || window.mozNotification || window.webkitNotification;
    nortify.requestPermission(function(permission){
    });
    var nortifyins = new nortify(str1,
               {
                body:str2,
                icon:"logo_color.png",
                autoClose: 1000,
            }
    );
}
