/*
 * 実際の接続を行うファイル
 *
*/
//ルーティングを行い他のピアに指示を出しサーバに通知する
//想定する木構造を満たすかどうかと相手の回線混雑具合を考慮
//partnerIDに向けてstreamを配信する
//
//
//用意する変数
var peerNum;
function routing(partnerID){
    //1つのピアからの接続可能人数を指定
    //1ならば直線状につながる
    const Branch = array(1,1,1,1,1,1,1,1,1,1,1);
    //まず自分から直接つなげるかどうか
    if(connectionTable[myID]["counter"]<Branch[0]){
        //自分から直接つなげる
       // peerTable.forEach(function(key){
         //   if(connectionTable[myID][key]=false /*かつ相手の余裕（今回は考慮しない）*/){
            //まだつなげてない相手なのでつなげる
           //     connect(key);
             //   break;
           // }
       // });
       connect(partnerID);
    }else{  //リレー式につなげる場合。
        connect_func(myID,partnerID,0);
           //繋げ元から余裕があればそこから繋げる
           //そうでなければすでに繋がっているところを見つける
    }
    //次に自分の映像を持っている他のピアから直接つなげるかどうか
   
}
function connect_func(fromID,toID,count){
    //相手が見つかるならば接続させる
    //なお初回は絶対に引っかからない
    if(connectionTable[fromID]["counter"]<Branch[count++]){
        letConnect(fromID,toID);
        return 0;
    }
    //fromIDがすでに接続している相手をみつける
    //複数いる場合はその相手が接続している数が少ないほう
    var min = 100; var new_from;
    Object.keys(connectionTable[fromID])(function(key){
        if(connectionTable[fromID][key]==true){//接続できている場合
            if(min>connectionTable[key]["count"]){
                min =connectionTable[key]["count"];
                new_from = key;
                //接続数最小のものを決める
            }
        }
    });
    letConnect(fromID,new_from);
    return connect_func(new_from,toID,count);
}

