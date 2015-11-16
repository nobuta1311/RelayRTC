//テスト用にここに記述
var ID_URL="./ID.php";
var ConnectionStateURL="ConnectionState.php";
var peerTable = new Array();
var connectionTable = new Array();


inquiry();
function inquiry(){
    //サーバにアクセスしてID一覧と接続状態一覧を更新するのがメイン
    //接続命令などはオプション（実装はあと）
    //peerTableとConnectionTableで
    setInterval(function loop(){
        //ID一覧を取得   
        var response =id_exchange("all",4);
        
        //参加しているIDを一覧表示
        console.log(response);
        peerTable = JSON.parse(response);
        $("#connect-buttons").empty();
        Object.keys(peerTable).forEach(function(key){
            var div = $("<button type=\"button\" id=\"connect-\""+key+">"+key+"</button>");
            
            $("#connect-buttons").after(div);
            
        });
        //接続状況を一覧表示
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
                    $("#connection-table").text("");
                    Object.keys(ar2).forEach(function(key2){
                    $("#connection-table").append(key+" "+key2+"  "+connectionTable[key][key2]);
                    });
                    $("#connection-table").append("<br>");
                });
            }
        });

    },1000);
}
function id_exchange(command_str,mode){
    var mode_str=-1;
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
    }
    var accessurl =IDURL+mode_str+"="+command_str; 
    $.ajax({
        async:false,
        url: accessurl,
            type: "GET",
            dataType: "html"
    }).done(function(res) {
        result=res;
    });
    return result;
}