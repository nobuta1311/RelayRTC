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
var myID;
var myDataID;
var IDURL="./ID.php?";
var partURL="./Participants.php?";
var connURL = "./ConnectionState.php";
var commanderURL ="./Commander.php?";


//接続されたらどうする？
//とりあえず全員表示する
//相手のIDとかはログに適当に表示

//接続
var peer = new Peer({ key: '2e8076d1-e14c-46d4-a001-53637dfee5a4', debug: 3});

//$(function() {  //能動的に動く部分

peer.on('open', function(){
    writeLog("Your peer is opened by peerID:"+myid);
    $("#my-id").text(peer.id);
    myID = id_exchange(peer.id,0);
    $('#my-number').text(myID);
    writeLog("Your id is "+myID);
});
peer.on('call', function(call){ //かかってきたとき
    //call.answer(localStream);//返すものはなんでもいい
    call.answer();  //何も返さないようにしておく。
    calledDo(call);
});


peer.on('connection',function(conn){    //接続されたとき
    connectedDo(conn);
});


navigator.getUserMedia({audio: false, video: true}, function(stream){
    var localStream = URL.createObjectURL(stream);
        //$('#my-video').prop('src', url);
    },function() { alert("Error!"); 
});




function connectedDo(conn){ //データのやりとり
        conn.on("data",function(data){//data受信リスナ
                writeLog("受信データ : "+data); //テキストとして受信データを表示
        });
}
function sendText(peerid,data){
    connectedConn[peerid].send(data);
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
            streams[pid]=url;   //urlを保管
            //url変換したものを格納し、したの行のように表示させる。
           // $('#peer-video'+connectedNum).prop('src', url);
        });
}
function writeLog(logstr){
    console.log(logstr);
    $("#log-space").append(logstr+"<br>");
}