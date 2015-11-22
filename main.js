navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

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
//$(function() {  グローバルにしたくない部分
var peer = new Peer({ key: '2e8076d1-e14c-46d4-a001-53637dfee5a4', debug: 3});
peer.on('open', function(){ //回線を開く
});
peer.on('call', function(call){ //かかってきたとき
   writeLog("Connected by "+id_exchange(call.peer,2));
    call.answer(localStream);  //何も返さないようにしておく。
    calledDo(call);
});


$(function (){
$('#joinProvider').click(function(){
    if($(this).text()=="exit"){
        id_exchange(myID,3);
        $(this).text("Join as a Provider");
    }else{
        writeLog("You've joined as a provider");
        id_exchange("all",5);
        initialize();
        $(this).text("exit");
    }
});
$('#joinReceiver').click(function(){
    if($(this).text()=="exit"){
        id_exchange(myID,3);
        $(this).text("Join as a Receiver");
    }else{
        writeLog("You've joined as a receiver");
        initialize();        
        $(this).text("exit");
    }
});

navigator.getUserMedia({ video: true,audio: false}, function(stream){
     localStream = stream;
     $('#my-video').prop('src', window.URL.createObjectURL(localStream));
     //$('#my-video').src = window.URL.createObjectURL(stream);
    },function() { alert("Error!"); 
});
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
    noticeConnect("","",4);
    noticeConnect(myID,"",3);
    inquiry_roop();
    dataConnectAll();
    console.log(peerTable);
    writeLog("Your peer is opened by peerID:"+peer.id);
    $("#my-id").text(peer.id);
    $('#my-number').text(myID);
    writeLog("Your id is "+myID);    
}


function calledDo(call){ //コネクションした後のやりとり
    //genuineIDはcall.peerなので
        var pid = id_exchange(call.peer,2);
        if(pid=="false"){
            writeLog("Connection Failed");
            return false;   //失敗したらfalse返す
        }
        connectedCall[pid]=call;
        //$("#peer-num").text(connectedNum);//相手のID表示
        //$("#peer-id"+connectedNum).text(connectedCall[connectedNum].peer);
        call.on('stream', function(stream){//callのリスナ
            var url = URL.createObjectURL(stream);
            writeLog("Get Stream by "+pid+" : "+url);
            streams[pid]=url;   //urlを保管
            //url変換したものを格納し、したの行のように表示させる。
            var div = $("<video id=\"peer-video"+pid+"\" style=\"width: 300px;\" autoplay=\"1\"></video>");//disabledにできる
                   // <!--<video id="peer-video" style="width: 300px;" autoplay="1"></video>-->
            $("#videos").append(div);
            $('#peer-video'+pid).prop('src', url);
        });
}
function writeLog(logstr){
    console.log(logstr);
    $("#log-space").prepend(logstr+"<br>");
}
