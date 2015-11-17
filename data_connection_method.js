/*
data_connection_method.js
データコネクションを確立したり切断するための関数群である。
peerTableが最新のものになっていることを前提としており、
connectionTableのデータコネクション部分は、この関数群で更新する。
*/
function dataConnectAll(){
    for(var pid in peerTable){
        if(pid==myID){break;}
        dataConnect(pid);
    }
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
        return true;
}
function dataDisconnect(partnerID){
        var genuineID = id_exchange(partnerID,0);
        connectedConn[partnerID].close();
        return true;
}
