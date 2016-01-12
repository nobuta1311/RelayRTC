$("#save-cap").click(function(){
        if($(this).text()=="Save"){
        $(this).text("Stop");
        if($("#my-video").length){
            saveCapture("my-video");
        }else{
            saveCapture("peer-video");
        }
        }else{
            saveCapture("STOP");
            $(this).text("Save");
        }
});

function saveCapture(videoid){
    if(videoid=="STOP"){
        saving=false;
    }else{
    videoElement = document.getElementById(videoid);
    canvasElement = document.getElementById("canvas");
    canvasElement2 = document.getElementById("canvas2");
    canvasContext = canvasElement.getContext("2d");
    canvasContext2 = canvasElement2.getContext("2d");
    canvasElement.width = 640;canvasElement2.width=640;
    canvasElement.height = 500;canvasElement2.height=500;
    count = 0;
   // canvasContext.lineWidth = 10;
   // canvasContext.font="bold 30px sans-serif";
   // canvasContext.fillStyle="black";
    date_obj = new Date();
    setTimeout(saveFunc,calcWaitingTime(10),videoid);
    }
}
function saveFunc(videoid){
        date_obj = new Date();
        e.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        var now_text = date_obj.getMinutes()+""+date_obj.getSeconds()+""+date_obj.getMilliseconds();
        canvasContext2.drawImage(videoElement,0,0);
        var imageData = canvasContext2.getImageData(0,0,canvasElement.width, canvasElement.height);
        canvasContext.putImageData(imageData, 0, 0);
       // canvasContext.drawImage(canvasContext2);
       // canvasContext.drawImage(canvasContext2,0,0);
       // canvasContext.fillText(now_text,100,100);
        var btn= document.getElementById("btn-download");
        btn.href = canvasElement.toDataURL('image/bmp');
        btn.download = myID+"-"+now_text+'.bmp';
        btn.dispatchEvent(e);
        if(saving){
            setTimeout(saveFunc,calcWaitingTime(10),videoid);
        }
}
function calcWaitingTime(t){//秒
    //alert(performance.now());
    date_obj = new Date();
   // date_obj = performance.now();
    return ((t-date_obj.getSeconds()%10)*1000-date_obj.getMilliseconds());
}

