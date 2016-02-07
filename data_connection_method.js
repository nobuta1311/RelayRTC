function dataConnectAll(){
    writeLog("CONNECT TO ALL");
    Object.keys(peerTable).forEach(function(key){
        if(key!=myID){
            dataConnect(key);
        } 
    });
    return true;
}
function dataDisconnectAll(){
    Object.keys(peerTable).forEach(function(key){
        if(key!=myID){
            dataDisconnect(key);
        }
    });
    return true;
}
function dataConnect(partnerID){
        var genuineID = id_exchange(partnerID,1,false);
        connectedConn[partnerID] = peer.connect(genuineID,{label:myID+""});
        connectedDo(connectedConn[partnerID]);
        return true;
}

function connectedDo(conn){ //データのやりとり
        conn.on("data",function(data){//data受信リスナ
                writeLog("RECEIVED: "+data); //テキストとして受信データを表示
                commandByPeers(data);
        });
        conn.on('close',function(){
            //閉じた閉じられた両方に送られるがその後操作できるのは閉じられた側のみ
            var tempid=id_exchange(conn.peer,2,false);
            writeLog(tempid+"'s connection has closed.");
            Object.keys(peerTable).forEach(function(key){
                if(connectionTable[key][tempid]===true){
                    connectionTable[key]["counter"]--;
                    connectionTable[tempid]["connected"]--;
                    connectionTable[key][tempid]=false;
                }
                if(connectionTable[tempid][key]===true){
                    connectionTable[key]["connected"]--;
                    connectionTable[tempid]["counter"]--;
                    connectionTable[tempid][key]=false;
                    if(myID==0){
                        routing(key);
                    }
                }
                delete connectionTable[key][tempid]
            });
            if($('#joinProvider').text()=="exit" || $('#joinReceiver').text()=="exit"){
                delete peerTable[tempid];
                delete connectionTable[tempid];
                renewTable();
            }
            /*
            if(myID!=tempid && connectionTable[tempID][myID]==true){
                //直接の被接続者であれば
                //再接続を要求し，さらに下のピアと切断する．
                //MediaConnectionだけを切りたい
                sendText(0,"2,"+tempid);//接続要求
                writeLog("RECONNECT : "+tempid);
            }
            */
        });
}

peer.on('connection',function(conn){    //接続されたとき
    var connectedid = conn.label;
    connectedConn[connectedid]=conn;
    peerTable[connectedid] = conn.peer;//peerTable更新
    connectedDo(conn);
    writeLog("DATA-CONNECTED:"+connectedid);
    //ConnectionTableを埋める 自分に関係するところを全部falseにして値リセット
    //noticeConnect(myID,"",3);
    connectionTable[connectedid]=[];
    connectionTable[connectedid]["counter"]=0;
    connectionTable[connectedid]["connected"]=0;
    Object.keys(peerTable).forEach(function(key){
        connectionTable[key][connectedid]=false;
        connectionTable[connectedid][key]=false;
    });
    renewTable();
    if(myID==0){
     //   peer.call(conn.peer,localAudio); //send_stream
        routing(connectedid);
    }

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
        //接続準備完了してから
        //var delay =0;
        //if(connectionTable[myID]["connected"]==0)delay=1000;
        //window.setTimeout(function(){    
        connect(commands[1],streams[commands[2]]);  //streams[commands[2]
        //},delay);
        break;
        case 1 :    //切断 1,相手
        writeLog("COMMAND:DISCONNECT: "+commands[1]);
        disconnect(commands[1]);
        break; 
        case 2 : //配信要求 2,相手
            writeLog("REQUEST VIDEO :"+commands[1]);
            routing(commands[1]);
        break;
        case 3: //
        //
        break;
        case 4: //どこかで接続が起きたことを知らせる
        if(commands[1]!=myID&&commands[2]!=myID){
        writeLog(commands[1]+" CALL TO "+commands[2]);
        connectionTable[commands[1]][commands[2]]=true;
        connectionTable[commands[1]]["counter"]++;
        connectionTable[commands[2]]["connected"]++;
        renewTable();
        }
        break;
        case 5:
            writeLog("JOINNING "+commands[2]+" AS "+commands[1]);
            peerTable[commands[1]]=peerTable[commands[2]];
            //renewTable(); //表示して確認したいが表示欄が今のところ存在しない
        break;
        default:
        writeLog("BAD REQUEST");
        break;
    }
}
function sendText(peerid,data){
    if(peerid==myID)return;
    writeLog("SEND \""+data+"\" TO "+peerid);
    connectedConn[peerid].send(data);
}
