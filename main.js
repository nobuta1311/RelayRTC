var peerTable = Array();
//参加したときはそれぞれが更新
//消えるときもそれぞれが更新
//inquiryで照会
var connectionTable = Array();
//配信者がサーバに設定
//inquiryで照会
var streams = Array();
//自分の保持するstreamをここに記録する。

var IDURL="./ID.php";
var partURL="./Participants.php";
//var connURL = "./ConnectionState.php";
var commanderURL ="./Commander.php";


//接続されたらどうする？
//とりあえず全員表示する
//相手のIDとかはログに適当に表示

//接続
var peer = new Peer({ key: '2e8076d1-e14c-46d4-a001-53637dfee5a4', debug: 3});
peer.on('open', function(){
    $("#my-id").text(peer.id);
    $.ajax({
        url: "./ID.php?peerid="+peer.id,
            type: "GET",
            dataType: "html"
    }).done(function(res) {
        $('#my-number').text(res);
    });
});
peer.on('call', function(call){ //かかってきたとき
    calledDo(call);
});
peer.on('connection',function(conn){    //接続されたとき
    connectedDo(conn);
});
$(function() {  //能動的に動く部分
    navigator.getUserMedia({audio: false, video: true}, function(stream){
       // localStream = stream;
        var url = URL.createObjectURL(stream);
        //$('#my-video').prop('src', url);

    }, function() { alert("Error!"); });
    $('#call-start').click(function(){  //コネクションボタン押した
        //connectedNum++;
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
function calledDo(){ //コネクションした後のやりとり
        $("#peer-num").text(connectedNum);
        $("#peer-id"+connectedNum).text(connectedCall[connectedNum].peer);
        connectedCall[connectedNum].on('stream', function(stream){//callのリスナ
            var url = URL.createObjectURL(stream);
            $('#peer-video'+connectedNum).prop('src', url);
        });
}
