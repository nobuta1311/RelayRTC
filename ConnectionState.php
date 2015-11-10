<?php
$past =file_get_contents("./connection.txt");
$database=unserialize($past);
if($database=="")$database=array();
//aとbをつなげる　?from=a&to=b boolean
//aとbがつながっているか知る boolean
//aの接続相手を知る ?from=a json
//すべての接続状態をまとめて json
if(isset($_GET["from"])&& isset($_GET["to"])){
    $a = $_GET["from"]; $b=$_GET["to"];
    if($database[$a][$b]==true)//既につながっているならば
        echo true;
    else if(isset($_GET["mode"]) && $_GET["mode"]==1){//1ならば接続する
        if(!isset($database[$a])){$database[$a]=array();}
        if(!isset($database[$b])){$database[$b]=array();}
        $database[$a][$b]=true;
        $database[$b][$a]=true;
        $database[$a]["counter"]++;
        $database[$b]["counter"]++;
        //接続通知
        echo true;
    }else{ //0ならば参照（つながってないのでfalse）
        echo false;
    }
}else if(isset($_GET["from"])){
    //接続先相手を知る
    //foreach($database[$_GET["from"]] as $fr => $t){
     //   if($t===true)
    // }
    echo json_encode($database[$_GET["from"]]);
}else{
    //すべての接続状態をまとめて
    echo json_encode($database);
}
file_put_contents("./connection.txt",serialize($database));
