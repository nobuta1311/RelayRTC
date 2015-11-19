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
        //console.log(response);
        var new_peerTable = JSON.parse(response);
        //$("#connect-buttons").empty();
        Object.keys(new_peerTable).forEach(function(key){
            //console.log(peerTable[key]);
            if(peerTable[key]===undefined){  //新しいやつならば
                peerTable[key] = new_peerTable[key];
                //alert(peerTable[key]);
                var div = $("<button type=\"button\" id=\"connect-"+key+"\">"+key+"</button>");//disabledにできる
                $("#connect-buttons").append(div);
            }
        });
        makeListener();
        //接続状況を一覧表示
        response = noticeConnect("",0); 
        //console.log(response);
        connectionTable = JSON.parse(response);
        $("#connection-table").text("");
        Object.keys(connectionTable).forEach(function(key){
            var ar2 = connectionTable[key];
            Object.keys(ar2).forEach(function(key2){
                if(key2!="counter")
                $("#connection-table").append(key+" "+key2+"  "+connectionTable[key][key2]+"   ");
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

function noticeConnect(from_parameter,parameter){
    var url = "";
    var result ="false";
        switch(parameter){
            case 0: //全部参照
                break;
            case 1: //fromだけ指定してつながっている相手
                url = "from="+from_parameter;
                break;
            default: //fromとtoを指定して、つなげるもしくはつながっているか知る
                url = "from="+from_parameter+"&to="+parameter;
                break;
        }
        $.ajax({
            async:false,
            url:ConnectionStateURL,
            type:"get",
            datatype:"json",
        }).done(function(res){
            result = res;
        })  ;  
        return result;
}

//aとbをつなげる　?from=a&to=b boolean
//aとbがつながっているか知る boolean
//aの接続相手を知る ?from=a json 1
//すべての接続状態をまとめて json 0
