function writeLog(logstr){
    console.log(logstr);
    $("#log-space").prepend(logstr+"<br>");
}

function showNortify(str1,str2) {
    return; //今は使わないようにしておく
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
function renewTable(){  
    //コネクションテーブルを現時点保有している変数に従って更新　変化があったあとに使用
    var tableText = "<table border=1><tr><th></th>";
        Object.keys(peerTable).forEach(function(key){   //peerTableから１行目
                tableText+="<th>"+key+"</th>";
        });
        tableText+="<th>Connect</th><th>ConnectedBy</th></tr>"; //1行目右端
        Object.keys(connectionTable).forEach(function(key1){    //connectionTableから2行目以降
            var ar2 = connectionTable[key1];
            ar2[key1]="＼";
            tableText+="<tr><td>"+key1+"</td>";
            Object.keys(ar2).forEach(function(key2){
             //   if(key2!="counter"&&key2!="connected")
            //    $("#connection-table").append(key1+" "+key2+"  "+connectionTable[key1][key2]+"   ");
                if(connectionTable[key1][key2]===true)
                    tableText+="<td>"+"▶"+"</td>";
                else if (key2!="counter" && key2!="connected" &&  connectionTable[key2][key1]===true)
                    tableText+="<td>"+"◀"+"</td>";
                else if(connectionTable[key1][key2]===false)
                    tableText+="<td>"+"×"+"</td>";
                else
                    tableText+="<td>"+connectionTable[key1][key2]+"</td>";
                });
          //  $("#connection-table").append("sum"+connectionTable[key1]['counter']+"<br>");
            tableText+="</tr>";
        });
        tableText+="</table>";
       $("#connection-table").empty();
       $("#connection-table").append($(tableText));
       //テーブル更新完了
}