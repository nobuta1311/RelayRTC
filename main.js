var peerTable = Array();
//参加したときはそれぞれが更新
//消えるときもそれぞれが更新
//inquiryで照会
var connectionTable = Array();
//配信者がサーバに設定
//inquiryで照会
var localStream;
var streams = Array();  //自分の保持するstreamのURLをここに記録する。
var connectedNum;   //接続数
var connectedCall = Array();
var connectedConn = Array();
var myID;
var IDURL="./ID.php?";
var partURL="./Participants.php?";
var connURL = "./ConnectionState.php";
var commanderURL ="./Commander.php?";
//$(function() {  グローバルにしたくない部分
var peer = new Peer({ key: '2e8076d1-e14c-46d4-a001-53637dfee5a4', debug: 3});

$('#join-provider').click(function(){
    writeLog("You've joined as a provider");
    initialize();
});
$('#join-receiver').click(function(){
    writeLog("You've joined as a receiver");
    initialize();
});

peer.on('open', function(){ //回線を開く
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
     localStream = URL.createObjectURL(stream);
        //$('#my-video').prop('src', url);
    },function() { alert("Error!"); 
});
function initialize(){
    inquiry_tables();
    writeLog("Your peer is opened by peerID:"+peer.id);
    $("#my-id").text(peer.id);
    myID = id_exchange(peer.id,0);
    $('#my-number').text(myID);
    writeLog("Your id is "+myID);    
}

function connectedDo(conn){ //データのやりとり
        conn.on("data",function(data){//data受信リスナ
                writeLog("受信データ : "+data); //テキストとして受信データを表示
                commandByPeers(data);
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
            streams[pid]=url;   //urlを保管
            //url変換したものを格納し、したの行のように表示させる。
           // $('#peer-video'+connectedNum).prop('src', url);
        });
}
function writeLog(logstr){
    console.log(logstr);
    $("#log-space").append(logstr+"<br>");
}
