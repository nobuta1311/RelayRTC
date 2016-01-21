//テスト用にここに記述
var ConnectionStateURL="./ConnectionState.php?";
var IDURL = "./ID.php?";
function inquiry_tables(){
    //参加者一覧をポーリング
    var response =id_exchange("all",4,false);
    var new_peerTable = JSON.parse(response);
    writeLog(new_peerTable);
    //isasync = arguments[0];
    //古いピアテーブルを比較し，新しいピアならばボタンを設置したりconnectionTableを整備する．
    //これはデータコネクションが来た時にできるよね？
        Object.keys(new_peerTable).forEach(function(key1){
            if(peerTable[key1]===undefined){  //新しいやつならば
                peerTable[key1] = new_peerTable[key1];
                if(key1==0){
                    //0ならばボタンを追加する．しかし0がくるときには，からっぽのはずだよね
                    var div = $("<button type=\"button\" id=\"connect-"+key1+"\">"+"Connect to "+key1+"</button>");//disabledにできる
                    makeListener(key1);
                    $("#connect-buttons").append(div);
                }
                //ConnectionTableを埋める．Falseにする．
                Object.keys(peerTable).forEach(function(key2){
                    if(key1!=key2){
                        noticeConnect(key1,key2,0);
                        noticeConnect(key2,key1,0);
                    }
                });
                
            }
        });
        //接続状況ポーリング
        response = noticeConnect("","",5); 
        connectionTable = JSON.parse(response);
        //テーブル更新
        
        renewTable();
        
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
