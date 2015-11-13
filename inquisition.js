//テスト用にここに記述
var ID_URL="./ID.php";
var ConnectionStateURL="ConnectionState.php";
var peerTable = new Array();
var connectionTable = new Array();


inquiry();
function inquiry(){
    //サーバにアクセスして各種情報を更新するのがメイン
    //接続命令などはオプション（実装はあと）
    //peerTableとConnectionTableで
    setInterval(function loop(){
        $.ajax({
            async:false,
            url:ID_URL,
            type:"get",
            datatype:"json",
            data:{refer:"all"},//自分のIDを渡す
            success: function(response){
            //参加しているIDを一覧表示
                console.log(response);
                peerTable = JSON.parse(response);
                Object.keys(peerTable).forEach(function(key){
                    $("div.box").append(key+"  "+peerTable[key]+"<br>");
                });
            }
        });        
        $.ajax({
            async:false,
            url:ConnectionStateURL,
            type:"get",
            datatype:"json",
            success: function(response){
            //全ての接続状態を表示
                console.log(response);
                connectionTable = JSON.parse(response);
                Object.keys(connectionTable).forEach(function(key){
                    var ar2 = connectionTable[key];
                    Object.keys(ar2).forEach(function(key2){
                    $("div.box").append(key+" "+key2+"  "+connectionTable[key][key2]+"<br>");
                    });
                });
            }
        });

    },1000);
}
