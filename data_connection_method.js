/*
data_connection_method.js
データコネクションを確立したり切断するための関数群である。
peerTableが最新のものになっていることを前提としており、
connectionTableのデータコネクション部分は、この関数群で更新する。
*/
function dataConnectAll(){
    writeLog("dataconnectall");
   Object.keys(peerTable).forEach(function(key){
   //    writeLog(pid);
        //if(pid==myID){continue;}
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
        var genuineID = id_exchange(partnerID,0);
        connectedConn[partnerID] = peer.connect(genuineID);
        writeLog("DataConnected to "+partnerID+" "+genuineID);
        return true;
}
function dataDisconnect(partnerID){
        connectedConn[partnerID].close();
        return true;
}
function commandByPeers(data){
    var commands = data.split(",");
    var mode =commands[0];
    switch (mode){
        case 0 :    //接続命令  0,送る相手,送るストリーム  
        connect(commands[1],streams[commands[2]]);
        break;
        case 1 :    //切断
        disconnect(commands[1]);
        default:
        break;
        case 2 : //配信要求
        routing(commands[1]);
        break;
    }
}
function sendText(peerid,data){
    connectedConn[peerid].send(data);
}