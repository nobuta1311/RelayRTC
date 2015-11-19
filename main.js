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
$(function (){
$('#joinProvider').click(function(){
    writeLog("You've joined as a provider");
    initialize();
});
$('#joinReceiver').click(function(){
    writeLog("You've joined as a receiver");
    initialize();
});
var buttons = Array();
for(var i=0;i<100;i++)
    buttons[i]="#connect-"+i;
$('#connect-buttons').on(
    'click',   // イベント名
    '.btn',    // 子要素セレクター
    '#connect-1',
    function() {
        alert($(this).attr("id"));
        sendText(i,myID+",2");
              $('<button class="btn">プラス</button>')
                .appendTo('#connect-buttons');
    }
  );
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
navigator.getUserMedia({ video: true,audio: true}, function(stream){
     localStream = window.URL.createObjectURL(stream);
     $('#my-video').prop('src', localStream);
     //$('#my-video').src = window.URL.createObjectURL(stream);
    },function() { alert("Error!"); 
});

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
            var div = $("<video id=\"peer-video\""+pid+" style=\"width: 300px; autoplay=\"1\></video>");//disabledにできる
            $("#videos").append(div);
            $('#peer-video'+pid).prop('src', url);
        });
}
function writeLog(logstr){
    console.log(logstr);
    $("#log-space").prepend(logstr+"<br>");
}
