function saveTextAsFile() {
    //	var textToWrite = document.getElementById("inputTextToSave").value;
    var textToWrite = $("#playlist-item").text();

    // build the blob from the tracks    
    var csv = [];
    $.each($("#playlist-item li"), function () {
        csv.push($(this).text());
    });
    var output = csv.join('\r\n');


    // convert the blob into the text file for saving
    var textFileAsBlob = new Blob([output], {
        type: 'text/plain'
    });

    var fileNameToSaveAs = document.getElementById("inputFileNameToSaveAs").value;

    var downloadLink = document.createElement("a");
    downloadLink.download = fileNameToSaveAs;
    downloadLink.innerHTML = "Download File";
    if (window.URL != null) {
        // Chrome allows the link to be clicked
        // without actually adding it to the DOM.
        downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
    } else {
        // Firefox requires the link to be added to the DOM
        // before it can be clicked.
        downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
        downloadLink.onclick = destroyClickedElement;
        downloadLink.style.display = "none";
        document.body.appendChild(downloadLink);
    }

    downloadLink.click();
}

function destroyClickedElement(event) {
    document.body.removeChild(event.target);
}


//load playlist into player

function loadFileAsText() {
    var fileToLoad = document.getElementById("fileToLoad").files[0];

    var fileReader = new FileReader();
    fileReader.onload = function (fileLoadedEvent) {
        var textFromFileLoaded = fileLoadedEvent.target.result;
        document.getElementById("inputTextToSave").value = textFromFileLoaded;

        var playlistarray = [];
        var playlistarray = textFromFileLoaded.split("\n");
        window.playlistarray = playlistarray;

        //// array fixer/////
        var playlistObject = {};
        for (var i = 0, max = playlistarray.length; i < max; i += 1) {
            playlistObject[i] = playlistarray[i];
        }
        // not sure if the below is needed, but I'm going to keep it
        var correctplaylistarray = [playlistObject];
        window.correctplaylistarray = correctplaylistarray;

        FitToContent(inputTextToSave, 2000)


        //insert code to make the playlist search and add here




        //Main function for search, edited to fit the playlist builder
        function searchforplaylist(playlistarray, captcha_sid, captcha_key) {

            //  Uncomment the line below if you would like the URL hash to change once the tracks are loaded 
            //    window.location.hash = correctplaylistarray[0][0].slice(0,-1);
            var data = {
                q: playlistarray,
                sort: vkConfig.sort,
                auto_complete: vkConfig.autoComplete,
                access_token: vkConfig.accessToken,
                count: vkConfig.count
            };
            if (captcha_sid != null && captcha_key != null) {
                data.captcha_sid = captcha_sid;
                data.captcha_key = captcha_key;
            };
            $.ajax({
                url: vkConfig.url,
                data: data,
                type: "GET",
                dataType: "jsonp",
                beforeSend: function () {
                },
                // error handling (Doesn't work in loading playlists because the search results are not actually displayed, keeping it anyway.
                error: function () {
                    appendError('Internet error...');
                },
                success: function (msg) {
                    if (msg.error) {
                        if (msg.error.error_code == 5) {
                            appendError("Access Token error, contact me");
                        } else {
                            appendError("Oops, something went wrong : " + msg.error.error_msg);
                        }
                        if (msg.error.error_code == 14) {
                            showCaptcha(msg.error.captcha_sid, msg.error.captcha_img);
                        };
                        return;
                    };

                    if (msg.response == 0) {
                        appendError("Sorry, Something went wrong building your playlist :( ");
                        return;
                    };
                

                    // build playlist using results  
                    $('#playlist-item').append('<li><i class="fa-li fa fa-angle-right"></i><a href="' + msg.response[1].url + '">' + msg.response[1].artist + ' - ' + msg.response[1].title + '</a><span class="fa-li fa fa-times"></span><span class="fa-li fa fa-cloud-download"><a class="fakelink" target="_blank" href="' + msg.response[1].url + '" download="' +  msg.response[1].artist + ' - ' + msg.response[1].title + '.mp3"></a></span><span class="fa-li fa fa-sort"></span></li>');

                }
            });
        }
        // Not sure if neccessary 
        window.searchforplaylist = searchforplaylist;


        //super annoying async list loading function, solved ~ well enough        
        var i = 0;

        function forloop() {
            if (i < playlistarray.length) {
                // actions on last item loaded
                if (i == playlistarray.length - 1) {
                    window.searchforplaylist(window.correctplaylistarray[0][i], null, null);
                    i++;
                    setTimeout(forloop, 300);
                    // uncomment below to make playlist start playing on load
                    //             $('#playlist-item > li:nth-child(1)').trigger('click'); 

                    // uncomment below to automatically close the drawer on load
                    //             $('.drawer').drawer('close');

                } else {
                    // actions for every playlist item
                    window.searchforplaylist(window.correctplaylistarray[0][i], null, null);
                    i++;
                    setTimeout(forloop, 300);
                }
            }
        }
        forloop();

    };
    fileReader.readAsText(fileToLoad, "UTF-8");


}


//text-box resizer:

function FitToContent(id, maxHeight) {
    var text = id && id.style ? id : document.getElementById(id);
    if (!text)
        return;

    /* Accounts for rows being deleted, pixel value may need adjusting */
    if (text.clientHeight == text.scrollHeight) {
        text.style.height = "30px";
    }

    var adjustedHeight = text.clientHeight;
    if (!maxHeight || maxHeight > adjustedHeight) {
        adjustedHeight = Math.max(text.scrollHeight, adjustedHeight);
        if (maxHeight)
            adjustedHeight = Math.min(maxHeight, adjustedHeight);
        if (adjustedHeight > text.clientHeight)
            text.style.height = adjustedHeight + "px";
    }
}