//テスト用にここに記述
var ConnectionStateURL="./ConnectionState.php?";
var IDURL = "./ID.php?";
function inquiry_tables(){
    //サーバにアクセスしてID一覧と接続状態一覧を更新するのがメイン
    //接続命令などはオプション（実装はあと）
    //peerTableとConnectionTableで
        //writeLog("Get Tables.");
        //ID一覧を取得   
        var response =id_exchange("all",4);
        //参加しているIDを一覧表示
        var new_peerTable = JSON.parse(response);
        Object.keys(new_peerTable).forEach(function(key1){
            if(peerTable[key1]===undefined){  //新しいやつならば
                peerTable[key1] = new_peerTable[key1];
                /*
                Object.keys(peerTable).forEach(function(key2){
                    if(key1!=key2)
                        noticeConnect(key1,key2,0);
                });
                */
                var div = $("<button type=\"button\" id=\"connect-"+key1+"\">"+key1+"</button>");//disabledにできる
                $("#connect-buttons").append(div);
            }
        });
        makeListener();
        //接続状況更新
        //connectionTableを埋める
        Object.keys(peerTable).forEach(function(key1){
                Object.keys(peerTable).forEach(function(key2){
                    if(key1!=key2){
                        
                        noticeConnect(key1,key2,0);
                        }
                    });
        });
        response = noticeConnect("","",5); 
        connectionTable = JSON.parse(response);
       //writeLog(connectionTable);
        $("#connection-table").text("");
        Object.keys(connectionTable).forEach(function(key1){
                //alert(key1);
            var ar2 = connectionTable[key1];
            Object.keys(ar2).forEach(function(key2){
                if(key2!="counter")
                $("#connection-table").append(key1+" "+key2+"  "+connectionTable[key1][key2]+"   ");
                });
            $("#connection-table").append("<br>");
        });
}
function inquiry_roop(){
    inquiry_tables();
    setInterval(function loop(){
        inquiry_tables();
    },2000);
}

function id_exchange(command_str,mode){
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
        async:false,
        url: accessurl,
            type: "GET",
            dataType: "html"
    }).done(function(res) {
        result=res;
    });
    return result;
}

function noticeConnect(from_parameter,to_parameter,mode){
    var url = "";
    var result ="false";
        switch(mode){
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
                url = "from="+from_parameter;
                break;
            case 4:
                url = "clear=all";
                break;
            default://全て参照
                break;
        }
        $.ajax({
            async:false,
            url:ConnectionStateURL+url,
            type:"get",
            datatype:"html",
        }).done(function(res){
            result = res;
        })  ;  
        return result;
}
