var peerTable = Array();
//参加したときはそれぞれが更新
//消えるときもそれぞれが更新
//inquiryで照会
var connectionTable = Array();
//配信者がサーバに設定
//inquiryで照会
var localStream;
var streams = Array();
var connectedNum;
var connectedCall = Array();
var connectedConn = Array();
//自分の保持するstreamのURLをここに記録する。

var IDURL="./ID.php?";
var partURL="./Participants.php?";
var connURL = "./ConnectionState.php";
var commanderURL ="./Commander.php?";


//接続されたらどうする？
//とりあえず全員表示する
//相手のIDとかはログに適当に表示

//接続
var peer = new Peer({ key: '2e8076d1-e14c-46d4-a001-53637dfee5a4', debug: 3});
peer.on('open', function(){
    writeLog("Your peer is opened by peerID:"+peer.id);
    $("#my-id").text(peer.id);
    var res = id_exchange(peer.id,0);
    $('#my-number').text(res);
    writeLog("Your id is ".res);
});
peer.on('call', function(call){ //かかってきたとき
    call.answer(localStream);
    calledDo(call);
});
peer.on('connection',function(conn){    //接続されたとき
    connectedDo(conn);
});
$(function() {  //能動的に動く部分
    navigator.getUserMedia({audio: false, video: true}, function(stream){
    localStream = stream;
    
    var url = URL.createObjectURL(stream);
        //$('#my-video').prop('src', url);

    }, function() { alert("Error!"); });
    $('#call-start').click(function(){  //コネクションボタン押した
        connectedNum++; //どこでつかうかわからんけど接続数
        //var peer_id = $('#peer-id-input').val(); //相手のID
        //connectedCall[connectedNum] = peer.call(peer_id, localStream);//これで接続
        //connectedConn[connectedNum] = peer.connect(peer_id);//これでデータコネクション接続
       // connectedCall=call; connectedConn=conn; //グローバル変数に記録
        calledDo();
        connectedDo(); //接続したあとにデータのやりとり
    });
    $("#sender").click(function(){ //送信
        var selected = $("input[name=submitNum]:checked").val();
        //connectedConn[selected].send($("#send-data").val());
    });
    $('#call-end').click(function(){ //終了
        var selected = $("input[name=closeNum]:checked").val();
        //connectedCall[selected].close();
        //connectedConn[selected].close();
        //connectedNum--;
        $("#peer-id"+connectedNum).text("");
    });
});
function connectedDo(conn){ //データのやりとり
        conn.on("data",function(data){//data受信リスナ
                $("#data-received").text(data+"\n"+$("#data-received").val()); //テキストとして受信データを表示
        });
}
function calledDo(call){ //コネクションした後のやりとり
    //genuineIDはcall.peerなので
        var pid = id_exchange(call.peer,2);
        if(pid=="false")return false;   //失敗したらfalse返す
        connectedCall[pid]=call;
        $("#peer-num").text(connectedNum);//相手のID表示
        $("#peer-id"+connectedNum).text(connectedCall[connectedNum].peer);
        
        call.on('stream', function(stream){//callのリスナ
            var url = URL.createObjectURL(stream);
            streams[url]=url;
            //url変換したものを格納し、したの行のように表示させる。
           // $('#peer-video'+connectedNum).prop('src', url);
        });
}
function writeLog(logstr){
    console.log(logstr);
    $("#log-space").text(logstr);
}
