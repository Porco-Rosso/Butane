window.downloadFile = function (sUrl,name) {
//console.log("name"+name);
//iOS devices do not support downloading. We have to inform user about this.
if (/(iP)/g.test(navigator.userAgent)) {
alert('Your device does not support files downloading. Please try again in desktop browser.');
return false;
}

//If in Chrome or Safari - download via virtual link click
if (window.downloadFile.isChrome || window.downloadFile.isSafari) {
    //Creating new link node.
    var link = document.createElement('a');
    link.href = sUrl;

    if (link.download !== undefined) {
        //Set HTML5 download attribute. This will prevent file from opening if supported.
        console.log("setting file name");
      //  var fileName = sUrl.substring(sUrl.lastIndexOf('/') + 1, sUrl.length);
        link.download = name;
    }

    //Dispatching click event.
    if (document.createEvent) {
        var e = document.createEvent('MouseEvents');
        e.initEvent('click', true, true);
        link.dispatchEvent(e);
        return true;
    }
}else{//other than chrome and safari
     var link = document.createElement('a');
     link.href = sUrl;

     if (link.download !== undefined) {
         //Set HTML5 download attribute. This will prevent file from opening if supported.
        console.log("setting file name");
         //var fileName = sUrl.substring(sUrl.lastIndexOf('/') + 1, sUrl.length);
         link.download = name+".mp3";
     }

     //Dispatching click event.
     if (document.createEvent) {
         var e = document.createEvent('MouseEvents');
         e.initEvent('click', true, true);
         link.dispatchEvent(e);
         return true;
     }
}

// Force file download (whether supported by server).
if (sUrl.indexOf('?') === -1) {
    sUrl += '?download';
}

window.open(sUrl, '_self');
return true;
}

window.downloadFile.isChrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
window.downloadFile.isSafari = navigator.userAgent.toLowerCase().indexOf('safari') > -1;


$(document).on("click", '.glyphicon-cloud-download', function () {
    
        var nameofthedownload = $(this).parent().parent().parent().find('a').attr('download');
        var urltodownload = $(this).parent().parent().parent().find('a').attr('link');
       
        console.log(urltodownload);
        console.log(nameofthedownload);
        
    downloadFile(urltodownload,nameofthedownload);
        
});