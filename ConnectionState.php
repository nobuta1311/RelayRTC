<?php
$past =file_get_contents("./connection.txt");
$database=unserialize($past);
if($database=="")$database=array();
//aとbをつなげる　?from=a&to=b boolean
//aとbがつながっているか知る boolean
//aの接続相手を知る ?from=a json
//すべての接続状態をまとめて json
if(isset($_GET["from"])&& isset($_GET["to"]) && isset($_GET["mode"])){
    $a = $_GET["from"]; $b=$_GET["to"];
    if(!isset($database[$a]))$database[$a]["counter"]=0;
    if(!isset($database[$b]))$database[$b]["counter"]=0;
    if($_GET["mode"]==0){//参照
        if(isset($database[$a][$b]))echo $database[$a][$b];
        else{   //セットされてない
            $database[$a][$b]=false;
            $database[$b][$a]=false;
            echo false;
        }
    }else if($_GET["mode"]==1){//1ならばtrueにする
        $database[$a][$b]=true;
        $database[$b][$a]=true;
        $database[$a]["counter"]++;
        $database[$b]["counter"]++;
        //接続通知
        echo true;
    }else{//2ならばfalseにする
        $database[$a][$b]=false;
        $database[$b[$a]]=false;
        $database[$a]["counter"]--;
        $database[$b]["counter"]--;
        echo true;
    }
}else if(isset($_GET["from"])){
    if(isset($database[$_GET["from"]]))
        echo json_encode($database[$_GET["from"]]);
    else{
        $database[$_GET["from"]]["counter"]=0;
        echo true;
    }
}else if(isset($_GET["clear"])){
    $database="";
}else{
    //すべての接続状態をまとめて
    echo json_encode($database);
}
file_put_contents("./connection.txt",serialize($database));
