/*
data_connection_method.js
データコネクションを確立したり切断するための関数群である。
peerTableが最新のものになっていることを前提としており、
connectionTableのデータコネクション部分は、この関数群で更新する。
*/
function dataConnectAll(){
    for(var pid in peerTable){
        if(pid==myID){break;}
        result_connections = dataConnect(pid);
        if(result_connections===false){
            return false;
        }
    }
    return true;
}
function dataDisconnectAll(){
    for(var pid in peerTable){
        if(pid==myID){break;}
        result_disconnections =dataDisconnect(pid);
        if(result_disconnections===false){
            peer.destroy();
            return false;
        }
    }
    peer.destroy();
    return True;
}
function dataConnect(partnerID){
        genuineID = inquiryID(partnerID);
        if(genuineID=="ERROR NO GENUINE ID"){return false;}
        if(myID<partnerID){
        connectionTable[myID][partnerID][0]=peer.connect(genuineID);
        connectionTable[myID][partnerID][1]=false;
        }else{
        connectionTable[partnerID][myID][0]=peer.connect(genuineID);
        connectionTable[partnerID][myID][1]=false;
        }
        commandByPeers();
        return true;
}
function dataDisconnect(partnerID){
        if(myID<partnerID){
        connectionTable[myID][partnerID][0].close();
        connectionTable[myID][partnerID][0]=false;
        connectionTable[myID][partnerID][1]=false;
        }else{
        connectionTable[partnerID][myID][0].close();
        connectionTable[partnerID][myID][0]=false;
        connectionTable[partnerID][myID][1]=false;
        }
        return true;
}
