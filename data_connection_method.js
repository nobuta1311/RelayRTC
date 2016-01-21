/*
data_connection_method.js
データコネクションを確立したり切断するための関数群である。
peerTableが最新のものになっていることを前提としており、
connectionTableのデータコネクション部分は、この関数群で更新する。
*/
function dataConnectAll(){

    writeLog("CONNECT TO ALL");
    Object.keys(peerTable).forEach(function(key){
        dataConnect(key);
    });
    return true;
}
function dataDisconnectAll(){
    for(var pid in peerTable){
        if(pid==myID){break;}
        dataDisconnect(pid);
    }
    return true;
}
function dataConnect(partnerID){
        var genuineID = id_exchange(partnerID,1,false);
        connectedConn[partnerID] = peer.connect(genuineID);
        connectedDo(connectedConn[partnerID]);
        return true;
}

function connectedDo(conn){ //データのやりとり
        conn.on('close',function(){
            var tempid=id_exchange(conn.peer,2,false);
            writeLog(tempid+"'s connection has closed.");
            if(connectionTable[tempid][myID]==true){
                sendText(0,"2,"+myID);//接続要求
                writeLog("RECONNECT : "+tempid);
            }
            //再要求する
        });
        conn.on("data",function(data){//data受信リスナ
                writeLog("RECEIVED: "+data); //テキストとして受信データを表示
                commandByPeers(data);
        });
}

peer.on('connection',function(conn){    //接続されたとき
    var connectedid = id_exchange(conn.peer,2,false);
    writeLog("DATA-CONNECTED:"+connectedid);
    peerTable[connectedid] = conn.peer;//peerTable更新
    //ConnectionTableを埋める 自分に関係するところを全部falseにして値リセット
    //noticeConnect(myID,"",3);
    connectionTable[connectedid]["counter"]=0;
    connectionTable[connectedid]["connected"]=0;
    Object.keys(peerTable).forEach(function(key){
        connectionTable[key][connectedid]=false;
        connectionTable[connectedid][key]=false;
    });
    renewTable();
    connectedConn[connectedid]=conn;
    connectedDo(conn);
});


function dataDisconnect(partnerID){
        connectedConn[partnerID].close();
        return true;
}
function commandByPeers(data){
    //inquiry_tables();
    var commands = data.split(",");
    var mode =parseInt(commands[0]);
    switch (mode){
        case 0 :    //接続命令  0,送る相手,送るストリーム  
        writeLog("COMMAND: CONNECT :"+commands[1]);
        connect(commands[1],streams[commands[2]]);  //streams[commands[2]
        break;
        case 1 :    //切断 1,相手
        writeLog("COMMAND:DISCONNECT: "+commands[1]);
        disconnect(commands[1]);
        break; 
        case 2 : //配信要求 2,相手
        writeLog("REQUEST VIDEO :"+commands[1]);
        routing(commands[1]);
        break;
        case 3:
        //writeLog("By "+commands[1]+" "+commands[2]);
        break;
        case 4:
        writeLog(commands[1]+" CALL TO "+commands[2]);
        connectionTable[commands[1]][commands[2]]=true;
        renewTable();
        break;
        default:
        writeLog("BAD REQUEST");
        break;
    }
}
function sendText(peerid,data){
    writeLog("SEND \""+data+"\" TO "+connectedConn[peerid].peer);
    connectedConn[peerid].send(data);
}
