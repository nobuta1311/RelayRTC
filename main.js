navigator.getUserMedia  = navigator.getUserMedia    || navigator.webkitGetUserMedia || navigator.mozGetUserMedia|| navigator.msGetUserMedia;
/*変数定義*/
var peerTable = Array();
var date_obj;
var saving=true;
var connectionTable = Array();
var target=0;
var localStream;
var streams = Array();  //自分の保持するstreamのURLをここに記録する。
var connectedNum;   //接続数
var connectedCall = Array();
var connectedConn = Array();
var myID;
var canvasElement;
var canvasElement2;
var canvasContext;
var canvasContext2;
var videoElement;
var e = document.createEvent("MouseEvents");
var peer = new Peer({ key: '2e8076d1-e14c-46d4-a001-53637dfee5a4', debug: 3});

peer.on('open', function(){ //回線を開く
});
peer.on('call', function(call){ //かかってきたとき
   var pid = id_exchange(call.peer,2,false);
   showNortify(myID+"からの通知",pid+"から動画が届きました");
   writeLog("Connected by "+pid);
   call.answer(null);  //何も返さないようにしておく。
   connectedCall[pid]=call;
   calledDo(pid);
});
/*総合関数*/
$(function (){
    $('#joinProvider').click(function(){//配信者参加処理
    for(var i=0;i<9;i++)Branch[i]=$("[name=br"+i+"]").val();//分岐数取得
    $("#branch-selector").remove();//分岐数設定消去
    if($(this).text()=="exit"){
        //stopRecording(localRecorder);
        id_exchange(myID,3,false);//myIDをサーバに登録する
        $(this).text("Join as a Provider");
        Object.keys(peerTable).forEach(function(key1){
            //connectedConn[key1].close();
            if(connectedCall[key1]!=null)//配信してたら切る
                connectedCall[key1].close();
        });
        noticeConnect(myID,"",6);//去る
        dataDisconnectAll();//コネクションも切断
        writeLog("Finished Exitting");
    }else{
        writeLog("You've joined as a provider");
        noticeConnect("","",4);
        id_exchange("all",5,false);
        /*video : constraints*/
        navigator.getUserMedia({ video: true,audio:false}, function(stream){
            localStream = stream;
            var div = $("<video id=\"my-video\" style=\"width: 600px;\" autoplay=\"1\"></video>");//disabledにできる
            $("#videos").append(div);
            $('#my-video').prop('src', window.URL.createObjectURL(stream));
            },function() { alert("Error to getUserMedia.");
        });
        //startRecording(localStream);
        initialize();
        $(this).text("exit");
    }
});
$('#joinReceiver').click(function(){
    $("#branch-selector").remove();
    if($(this).text()=="exit"){
        id_exchange(myID,3,false);
        $(this).text("Join as a Receiver");
        Object.keys(peerTable).forEach(function(key1){
            connectedConn[key1].close();
            if(connectedCall[key1]!=null)
                connectedCall[key1].close();
        });
        noticeConnect(myID,"",6);
        dataDisconnectAll();
        writeLog("Finished Exitting");
    }else{
        writeLog("You've joined as a receiver");
        initialize();        
        $(this).text("exit");
    }
});
$("#save-cap").click(function(){
        if($(this).text()=="Save"){
        $(this).text("Stop");
        if($("#my-video").length){
            saveCapture("my-video");
        }else{
            saveCapture("peer-video");
        }
        }else{
            saveCapture("STOP");
            $(this).text("Save");
        }
});

function makeListener(key){
    $("#connect-buttons").on( 
        'click',"#connect-"+key,
        function(){
            target = key;
            writeLog("Request the video to "+key);
            sendText(key,"2,"+myID);//接続要求
        }
    );
}
function initialize(){
    myID = id_exchange(peer.id,0,false);
    inquiry_roop();
    dataConnectAll();
    console.log(peerTable);
    writeLog("Your peer is opened by peerID:"+peer.id);
    $("#my-id").text(peer.id);
    $('#my-number').text(myID);
    writeLog("Your id is "+myID);    
}


function calledDo(pid){ //コネクションした後のやりとり
        connectedCall[pid].on('stream', function(stream){//callのリスナ
            streams[target]=stream;
            var url = URL.createObjectURL(stream);
            //url変換したものを格納し、したの行のように表示させる。
            var div = $("<video id=\"peer-video"+"\" style=\"width: 600px;\" autoplay=\"1\"></video>");//disabledにできる
            $("#videos").append(div);
            $('#peer-video').prop('src', url);
        });
}

