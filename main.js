navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

var peerTable = Array();
//参加したときはそれぞれが更新
//消えるときもそれぞれが更新
//inquiryで照会
var connectionTable = Array();
//配信者がサーバに設定
//inquiryで照会
var masterStream=undefined;
var localStream;
var streams = Array();  //自分の保持するstreamのURLをここに記録する。
var connectedNum;   //接続数
var connectedCall = Array();
var connectedConn = Array();
var myID;
//$(function() {  グローバルにしたくない部分
var peer = new Peer({ key: '2e8076d1-e14c-46d4-a001-53637dfee5a4', debug: 3});
peer.on('open', function(){ //回線を開く
});
peer.on('call', function(call){ //かかってきたとき
   var pid = id_exchange(call.peer,2);
   writeLog("Connected by "+pid);
    call.answer();  //何も返さないようにしておく。
    connectedCall[pid]=call;
    calledDo(pid);
});


$(function (){
$('#joinProvider').click(function(){
    if($(this).text()=="exit"){
        id_exchange(myID,3);
        $(this).text("Join as a Provider");
        Object.keys(peerTable).forEach(function(key1){
            connectedConn[key1].close();
            connectedCall[key1].close();
        });
    }else{
        writeLog("You've joined as a provider");
        noticeConnect("","",4);
        id_exchange("all",5);
        initialize();
        $(this).text("exit");
    }
});
$('#joinReceiver').click(function(){
    if($(this).text()=="exit"){
        id_exchange(myID,3);
        $(this).text("Join as a Receiver");
        Object.keys(peerTable).forEach(function(key1){
            connectedConn[key1].close();
            connectedCall[key1].close();
        });

    }else{
        writeLog("You've joined as a receiver");
        initialize();        
        $(this).text("exit");
    }
});
var constraints = {
    "mandatory": {"aspectRatio": 1.3333}, 
    "optional": [{"width": {"min": 640}},
                 {"height": {"max": 400}}]
};
navigator.getUserMedia({ video: constraints,audio: true}, function(stream){
     localStream = stream;
 //    $('#my-video').prop('src', window.URL.createObjectURL(localStream));
     //$('#my-video').src = window.URL.createObjectURL(stream);
    },function() { alert("Error!");});
});


function makeListener(key){
    //if(myID==key) return;
    $("#connect-buttons").on( 
        'click',"#connect-"+key,
        function(){
            writeLog("Request the video to "+key);
            sendText(key,"2,"+myID);//接続要求
        }
    );
}
function initialize(){
    myID = id_exchange(peer.id,0);
    noticeConnect(myID,"",3);
    inquiry_roop();
    dataConnectAll();
    console.log(peerTable);
    writeLog("Your peer is opened by peerID:"+peer.id);
    $("#my-id").text(peer.id);
    $('#my-number').text(myID);
    writeLog("Your id is "+myID);    
}


function calledDo(pid){ //コネクションした後のやりとり
        writeLog("CalledDo()"+pid);
        connectedCall[pid].on('stream', function(stream){//callのリスナ
            masterStream = stream;
            streams[pid]=stream;
            var url = URL.createObjectURL(stream);
            //url変換したものを格納し、したの行のように表示させる。
            var div = $("<video id=\"peer-video"+pid+"\" style=\"width: 1000px;\" autoplay=\"1\"></video>");//disabledにできる
            $("#videos").append(div);
            $('#peer-video'+pid).prop('src', url);
        });
}
function writeLog(logstr){
    console.log(logstr);
    $("#log-space").prepend(logstr+"<br>");
}
