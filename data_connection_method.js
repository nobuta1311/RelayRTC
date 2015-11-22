/*
data_connection_method.js
データコネクションを確立したり切断するための関数群である。
peerTableが最新のものになっていることを前提としており、
connectionTableのデータコネクション部分は、この関数群で更新する。
*/
function dataConnectAll(){
    writeLog("dataconnectall");
    //writeLog(Object.keys(peerTable)[52]);
    console.log(peerTable);
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
        var genuineID = id_exchange(partnerID,1);
        connectedConn[partnerID] = peer.connect(genuineID);
        console.log(connectedConn[partnerID]);
        //writeLog("DataConnected to "+partnerID+" "+genuineID+"result ");
        return true;
}

function connectedDo(conn){ //データのやりとり
 //       writeLog("Waiting datas");
        conn.on("data",function(data){//data受信リスナ
                writeLog("Received Data: "+data); //テキストとして受信データを表示
                commandByPeers(data);
        });
}

peer.on('connection',function(conn){    //接続されたとき
    writeLog("DataConnected by "+id_exchange(conn.peer,2));
    connectedConn[id_exchange(conn.peer,2)]=conn;
    alert(connectedConn[id_exchange(conn.peer,2)].peer);

    connectedDo(conn);
});


function dataDisconnect(partnerID){
        connectedConn[partnerID].close();
        return true;
}
function commandByPeers(data){
    var commands = data.split(",");
    var mode =parseInt(commands[0]);
    switch (mode){
        case 0 :    //接続命令  0,送る相手,送るストリーム  
        writeLog("Command: connect to "+commands[2]);
        connect(commands[1],streams[commands[2]]);
        break;
        case 1 :    //切断 1,相手
        writeLog("Command: disconnect to "+commands[1]);
        disconnect(commands[1]);
        break; 
        case 2 : //配信要求 2,相手
        writeLog("Request: provide your video to "+commands[1]);
        routing(commands[1]);
        break;
        default:
        writeLog("Bad Request");
        break;
    }
}
function sendText(peerid,data){
    connectedConn[peerid].send(data+"");
}
