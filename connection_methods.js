/*
 * 実際の接続を行うファイル
 *
*/
//用意する変数
var Branch = Array(1,1,1,1,1,1,1,1,1,1,1);
var peerNum;
function routing(partnerID){
    //1つのピアからの接続可能人数を指定
    //1ならば直線状につながる
    console.log(connectionTable);
    if(connectionTable[myID]["counter"]<Branch[0]){
        //自分から直接つなげる
       writeLog("Routing: direct to "+partnerID);
       connectionTable[myID]["counter"]++;
       connect(partnerID,localStream);
    }else{  //リレー式につなげる場合。
        writeLog("Routing: relay-connect to "+partnerID);
        connect_func(myID,partnerID,0);
           //繋げ元から余裕があればそこから繋げる
           //そうでなければすでに繋がっているところを見つける
    }
    //次に自分の映像を持っている他のピアから直接つなげるかどうか
   
}
function connect_func(fromID,toID,count){
    writeLog("Connect-Func "+fromID+" to "+toID+" "+count);
    //相手が見つかるならば接続させる
    //なお初回は絶対に引っかからない
    if(connectionTable[fromID]["counter"]<Branch[count++]){
        writeLog("letConnect "+fromID+" "+toID);
        letConnect(fromID,toID);
        return 0;
    }
    //fromIDがすでに接続している相手をみつける
    //複数いる場合はその相手が接続している数が少ないほう
    var min = 100; var new_from;
    Object.keys(connectionTable[fromID]).forEach(function(key){
        if(connectionTable[fromID][key]==true){//接続できているところをたどる
            if(min>connectionTable[key]["counter"]){
                min =connectionTable[key]["counter"];
                new_from = key;
                //接続数最小のものを決める
            }
        }
    });
    //fromIDとnew_fromは既につながっているからその先を確かめる
    return connect_func(new_from,toID,count);
}
function connect(to_id,send_stream){  //コネクションボタン押した
    var call = peer.call(id_exchange(to_id,1),send_stream);
    connectedNum++; //どこでつかうかわからんけど接続数
    //writeLog(call);
    noticeConnect(myID,to_id,1);
    calledDo(call);
  //connectedDo(); //接続したあとにデータのやりとり
};
function disconnect(to_id){
    connectedNum--;
        //connectedCall[selected].close();        //connectedConn[selected].close();
    to_id.destroy();
}

function letConnect(fromID,toID){
    sendText(fromID,"0,"+toID+","+myID);
}
