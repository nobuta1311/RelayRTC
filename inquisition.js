//テスト用にここに記述
var ConnectionStateURL="./ConnectionState.php?";
var IDURL = "./ID.php?";
function inquiry_tables(){
    //ID一覧を取得   
    var response =id_exchange("all",4,false);
    //参加しているIDを一覧表示
    var new_peerTable = JSON.parse(response);
    isasync = arguments[0];
    //サーバにアクセスしてID一覧と接続状態一覧を更新するのがメイン
    //peerTableとConnectionTableで
        //writeLog("Get Tables.");
        Object.keys(new_peerTable).forEach(function(key1){
            if(peerTable[key1]===undefined){  //新しいやつならば
                peerTable[key1] = new_peerTable[key1];
                var div = $("<button type=\"button\" id=\"connect-"+key1+"\">"+key1+"</button>");//disabledにできる
                makeListener(key1);

                //ConnectionTableを埋める．Falseにする．
                Object.keys(peerTable).forEach(function(key2){
                    if(key1!=key2){
                        noticeConnect(key1,key2,0);
                        noticeConnect(key2,key1,0);
                    }
                });
                $("#connect-buttons").append(div);
            }
        });
        //接続状況更新
        response = noticeConnect("","",5); 
        connectionTable = JSON.parse(response);
       //writeLog(connectionTable);
       // $("#connection-table").text("");
        var tableText = "<table border=1><tr><th></th>";//<tr><th></th><th>列-A</th><th>列-B</th></tr>
        Object.keys(peerTable).forEach(function(key){
                tableText+="<th>"+key+"</th>";
        });
        tableText+="<th>Connect</th><th>ConnectedBy</th></tr>";
        Object.keys(connectionTable).forEach(function(key1){
            var ar2 = connectionTable[key1];
            ar2[key1]="＼";
            tableText+="<tr><td>"+key1+"</td>";
            Object.keys(ar2).forEach(function(key2){
             //   if(key2!="counter"&&key2!="connected")
            //    $("#connection-table").append(key1+" "+key2+"  "+connectionTable[key1][key2]+"   ");
                if(connectionTable[key1][key2]===true)
                    tableText+="<td>"+"→"+"</td>";
                else if (key2!="counter" && key2!="connected" &&  connectionTable[key2][key1]===true)
                    tableText+="<td>"+"←"+"</td>";
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
}
function inquiry_roop(){
    inquiry_tables(false);
    setInterval(function loop(){
        inquiry_tables(true);

    },1000);
}

function id_exchange(command_str,mode,isasync){
    var mode_str="";
    var result;
    switch(mode){
        case 0: //genuine-num登録
            mode_str = "peerid";
            break;
        case 1: //num-genuine参照
            mode_str = "myid";
            break;
        case 2: //genuine-num参照
            mode_str = "genuineid";
            break;
        case 3: //終了するIDを伝える。
            mode_str = "exit";
            break;
        case 4: //partで参加人数 allで参加者全員
            mode_str = "refer";
            break;
        case 5:
            mode_str = "clear";
            break;
    }
    var accessurl =IDURL+mode_str+"="+command_str; 
    $.ajax({
        async:isasync,
        url: accessurl,
            type: "GET",
            dataType: "html"
    }).done(function(res) {
        result=res;
    });
    return result;
}

function noticeConnect(from_parameter,to_parameter,mode){
    var isasync = false;
    if(mode===0){
        isasync=true;
    }
    var url = "";
    var result ="false";
        switch(mode){
            case 6: //fromユーザのすべてをfalseにする
                url = "from="+from_parameter+"&mode="+mode;
                break;
            case 0: //特定の関係を参照
                url = "from="+from_parameter+"&to="+to_parameter+"&mode="+mode;
                break;
            case 1: //fromとtoを参照してtrueにする
                 url = "from="+from_parameter+"&to="+to_parameter+"&mode="+mode;
                break;
            case 2: //fromとtoを指定してfalseにする
                url = "from="+from_parameter+"&to="+to_parameter+"&mode="+mode;
                break;
            case 3: //fromを指定して接続相手をすべて表示
                url = "from="+from_parameter+"&mode"+mode;
                break;
            case 4:
                url = "clear=all";
                break;
            default://全て参照
                break;
        }
        $.ajax({
            async:isasync,
            url:ConnectionStateURL+url,
            type:"get",
            datatype:"html",
        }).done(function(res){
            result = res;
        })  ;  
        return result;
}
