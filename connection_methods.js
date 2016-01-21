/*
 * 実際の接続を行うファイル
 *
*/
//用意する変数
var Branch = Array(2,2,2,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1);
var peerNum;
function routing(partnerID){
    //inquiry_tables();
    //1つのピアからの接続可能人数を指定
    //1ならば直線状につながる
    console.log(connectionTable);
    if(connectionTable[myID]["counter"]<Branch[0]){
        //自分から直接つなげる
       writeLog("DIRECT CONNECT : "+partnerID);
      // connectionTable[myID]["counter"]++;
       connect(partnerID,localStream);
    }else{  //リレー式につなげる場合。
        writeLog("RELAYLY CONNECT : "+partnerID);
        var checked = Array();
        checked[0]=false;
        connect_func(myID,partnerID,0,checked);
           //繋げ元から余裕があればそこから繋げる
           //そうでなければすでに繋がっているところを見つける
    }
    //次に自分の映像を持っている他のピアから直接つなげるかどうか
   
}
function connect_func(fromID,toID,count,checked){
    //自分の余裕があれば直接接続する
    if(connectionTable[fromID]["counter"]<Branch[count++]){
        writeLog("LET CONNECT : "+fromID+" "+toID);
        letConnect(fromID,toID);
        return 0;
    }
    //fromIDがすでに接続している相手をみつける
    //複数いる場合はその相手が接続している数が少ないほう
    var min = 100; var new_from=undefined;

    Object.keys(connectionTable[fromID]).forEach(function(key){
        var cState = connectionTable[fromID][key];

        if(key!="counter" && key!="connected" && cState==true && checked[key]===undefined){//接続できているところをたどる
            checked[key]=false;
            if(min>connectionTable[key]['counter']){
                min =connectionTable[key]['counter'];
                new_from = key;
                //接続数最小のものを決める
            }else{
                if(new_from==undefined){new_from = key;}
            }
        }
    });
    //fromIDとnew_fromは既につながっているからその先を確かめる
    return connect_func(new_from,toID,count,checked);
}
function connect(to_id,send_stream){  //コネクションボタン押した
    var call = peer.call(id_exchange(to_id,1,false),send_stream); //send_stream
    connectedCall[to_id]=call;
    writeLog("CONNECT : "+to_id);
    noticeConnect(myID,to_id,1);
    Object.keys(peerTable).forEach(function(key){
        sendText(key,"4,"+myID+","+to_id);
    });
    calledDo(to_id);
}
function disconnect(to_id){
    to_id.destroy();
}

function letConnect(fromID,toID){
    showNortify("配信者からの通知",fromID+"と"+toID+"を接続します");
    if(connectionTable[fromID][toID]==false)
        sendText(fromID,"0,"+toID+","+myID);
}
