<?php
date_default_timezone_set("Asia/Tokyo");
        $textUpload = "rogu\n";
    $filesource= $_FILES["image"]["tmp_name"];
    //$filesource= $_POST["pic"];
$textUpload.=$filesource."\n";
$textUpload.=$_FILES["image"]["name"];
        if(isset($filesource)){
                $uploadfile=__DIR__."/image/".$_FILES["image"]["name"];
                $textUpload .= "ファイル有り";
        if (move_uploaded_file($filesource,$uploadfile)) {
              $textUpload.= "File is uploaded";
              } else {
              $textUplaod.= "Upload fail";
              }
        //upload("test",$uploadfile);
        }
        file_put_contents(__DIR__."/image/log.txt",$textUpload);
?>
