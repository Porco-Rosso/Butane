$(document).ready(function ($) {

    //    //load audio.js
    //    audiojs.events.ready(function() {
    //    var as = audiojs.createAll();
    //    });

    var index = 0;

    //Trigger search button when pressing enter button
    $('#query').bind('keypress', function (event) {
        if (event.keyCode == 13) {
            $('.search').trigger('click');
        };
    });
    
    $(document).ready(function() {
        $(".drawer").drawer();
    });

    /* ========================================================================
     * To get your own token you need first create vk application at https://vk.com/editapp?act=create
     * Then  get your APP_ID and CLIENT_SECRET at application settings
     * Now open this url from your logined to vk browser, this will redirect to blank.html with your token:
     * https://oauth.vk.com/authorize?client_id=APP_ID&client_secret=CLIENT_SECRET&scope=audio,offline&response_type=token
     *======================================================================== */

    //Config for vk audio.search api
    var vkConfig = {
        url: "https://api.vk.com/method/audio.search",
        sort: 2,
        autoComplete: 0,
        accessToken: "4d45c6ebef3b05a910071c948bb1374015c9e47ad953fba2f631d8bc1fca425a0a0bffcb4955d3af90c07",
        count: 300
    };


    //Config for LastFm Artist Search Api
    var lastFmConfig = {
        url: "http://ws.audioscrobbler.com/2.0/",
        method: "artist.search",
        apiKey: "8b7af513f19366e766af02c85879b0ac",
        format: "json",
        limit: 10
    };

    //        //Autocomplete for search input
    //        $("#query").autocomplete({
    //            source: function(request, response) {
    //                $.get(lastFmConfig.url, {
    //                    method: lastFmConfig.method,
    //                    api_key: lastFmConfig.apiKey,
    //                    format: lastFmConfig.format,
    //                    limit: lastFmConfig.limit,
    //                    artist: request.term
    //                }, function(data) {
    //                    var array = [];
    //                    //If Artist not empty
    //                    if (data.results.artistmatches.artist != undefined) {
    //                        //Adding to array artist names
    //                        for (var i = 0; i < data.results.artistmatches.artist.length; i++) {
    //                            array.push(data.results.artistmatches.artist[i].name);
    //                        }
    //                        //Showing autocomplete
    //                        response(array);
    //                    }
    //                });
    //            },
    //            minLength: 2,
    //            select: function(event, ui) {
    //                $('.search').trigger('click'); //trigger search button after select from autocomplete
    //            }
    //        });

    $('.search').on('click touchstart', function (event) {
        query = $('#query').val();
        if (query == "") return; // return if query empty
        search(query, null, null);
    });

var hash = window.location.hash;
    //For sharing search links, like http://vkdl.stereostance.com/#fkj
    if (hash.length > 1) {
        hash = hash.substring(1, hash.length).split('+').join(' '); //remove hash from query
        search(hash, null, null, true);
        $('#query').val(hash);
    } else {
        // space intentionally left blank
    }


    //needed for later to change icons
    function changeicons() {
        for (var i = 0; i < 300; i++) {

            $('#playaddicon').addClass('glyphicon-plus').removeClass('glyphicon-play');
            $('#playaddicon').removeAttr('id');
        };
    }



    //Append Error To List
    function appendError(error) {
        $('#result > .list-group').append('<li class="list-group-item list-group-item-danger">' + error + '</li>');
        $('#loading').hide();
    }

    //Main function for search
    function search(_query, captcha_sid, captcha_key) {
        window.location.hash = _query.split(' ').join('+');
        var data = {
            q: _query,
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
                $('#loading').show();
            },
            // error handling
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
                    appendError("Sorry, our trained team of monkeys couldn't find anything for this search query.");
                    return;
                };


                // build search result list  
                $('#result > .list-group').html("");
                for (var i = 1; i < msg.response.length; i++) {
//                    $('#result > .list-group').append('<li class="list-group-item"> <span class="badge download" ><a class="glyphicon glyphicon-cloud-download" onclick="downloadthissong()" href="' + msg.response[i].url + '" download="' + msg.response[i].artist + ' - ' + msg.response[i].title + '.mp3"></a></span> <span class="badge">' + msg.response[i].duration.toTime() + '</span><span class="badge play"><span class="glyphicon glyphicon-play" id="playaddicon"></span></span><a target="_blank" href="' + msg.response[i].url + '"  download="' + msg.response[i].artist + ' - ' + msg.response[i].title + '.mp3">' + msg.response[i].artist + ' - ' + msg.response[i].title + '</a></li>');
                    
                    $('#result > .list-group').append('<li class="list-group-item"> <span class="badge download" ><a class="glyphicon glyphicon-cloud-download" link="' + msg.response[i].url + '" download="' + msg.response[i].artist + ' - ' + msg.response[i].title + '.mp3"></a></span> <span class="badge">' + msg.response[i].duration.toTime() + '</span><span class="badge play"><span class="glyphicon glyphicon-play" id="playaddicon"></span></span><a target="_blank" href="' + msg.response[i].url + '"  download="' + msg.response[i].artist + ' - ' + msg.response[i].title + '.mp3">' + msg.response[i].artist + ' - ' + msg.response[i].title + '</a></li>');

                };


                $('.play').on('click', function (event) {

                    if (index == 0) {

                        //Change source of audio, show then play
                        $('.navbar-audio').attr('src', $(this).parent().find('a').attr('href'));
                        $('.navbar-audio').attr('style', '');
                        var audio = document.getElementById("navbar-audio");

                        audio.play();


                        var a = document.createElement("a");
                        var i = document.createElement("i");
                        var span = document.createElement("span");
                        var span2 = document.createElement("span");
                        var ulist = document.getElementById("playlist-item");
                        var newItem = document.createElement("li");


                        a.textContent = $(this).parent().text().slice(7);
                        a.setAttribute('href', $(this).parent().find('a').attr('href'));
                        newItem.appendChild(i);
                        newItem.appendChild(a);
                        newItem.appendChild(span);
                        newItem.appendChild(span2);
                        ulist.appendChild(newItem);

                        index++;
                        var _player = document.getElementById("navbar-audio"),
                            _playlist = document.getElementById("playlist-item");

                        changeicons();
                        document.title = $(this).parent().text().slice(7);

                        $("#playlist-item i").addClass("fa-li fa fa-angle-right");
                        $("#playlist-item span:odd").addClass("fa-li fa fa-sort");
                        $("#playlist-item span:even").addClass("fa-li fa fa-times");
                        $('.sortable').sortable();
                        $('.sortable').disableSelection();
                        $("#playlist-item li").addClass("selected");
                        

                    } else {
                        //add song to list only

                        var a = document.createElement("a");
                        var i = document.createElement("i");
                        var span = document.createElement("span");
                        var span2 = document.createElement("span");
                        var ulist = document.getElementById("playlist-item");
                        var newItem = document.createElement("li");

                        a.textContent = $(this).parent().text().slice(7);
                        a.setAttribute('href', $(this).parent().find('a').attr('href'));
                        newItem.appendChild(i);
                        newItem.appendChild(a);
                        newItem.appendChild(span);
                        newItem.appendChild(span2);
                        ulist.appendChild(newItem);

                        var _player = document.getElementById("navbar-audio"),
                            _playlist = document.getElementById("playlist-item");

                        changeicons();
                        document.title = $(this).parent().text().slice(7);

                        $("#playlist-item i").addClass("fa-li fa fa-angle-right");
                        $("#playlist-item span:odd").addClass("fa-li fa fa-sort");
                        $("#playlist-item span:even").addClass("fa-li fa fa-times");
                        $('.sortable').sortable();
                        $('.sortable').disableSelection();

                    }

                });



                $('#loading').hide();

            }
        });
    };



    
    //Sec To Time
    Number.prototype.toTime = function () {
        var sec_num = parseInt(this, 10);
        var hours = Math.floor(sec_num / 3600);
        var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
        var seconds = sec_num - (hours * 3600) - (minutes * 60);

        if (minutes < 10) {
            minutes = "0" + minutes;
        }
        if (seconds < 10) {
            seconds = "0" + seconds;
        }
        var time = minutes + ':' + seconds;
        return time;
    }
    
        // captcha script //
    function showCaptcha(captchaSid, captchaImage) {
        //Tracking captchas
        try {
            ga('send', 'event', 'captcha');
        } catch (e) {}
        $('#captchaModal').modal("show");
        $('#captchaImage').attr('src', captchaImage);
        //refresh captcha onclick
        $('#captchaImage').on('click', function (event) {
            $(this).attr('src', captchaImage);
        });
        
        //Searching with old query and captcha
        $('#captchaSend').on('click', function () {
            $('#captchaModal').modal("hide");
            search($('#query').val(), captchaSid, $('#captchaKey').val());
        });
        
        //trigger send click after pressing enter button
        $('#captchaKey').bind('keypress', function (event) {
            if (event.keyCode == 13) {
                $('#captchaSend').trigger('click');
            };
        });
    }
    
});

// end of on document script  


// globals for playlists
var _player = document.getElementById("navbar-audio"),
    _playlist = document.getElementById("playlist-item");


// functions for playlists
function playlistItemClick(clickedElement) {
    var selected = _playlist.querySelector(".selected");
    if (selected) {
        selected.classList.remove("selected");
    }
    clickedElement.classList.add("selected");
    var clickedelementlink = clickedElement.getElementsByTagName('a')[0];
    _player.src = clickedelementlink.getAttribute("href");
    _player.play();
    document.title = $('.selected').text();
    $("#playlist-item li i").removeClass("fa-li fa  fa-volume-up ");
    $("#playlist-item li i").addClass("fa-li fa fa-angle-right");
    $("#playlist-item li.selected i").removeClass("fa-li fa fa-angle-right");
    $("#playlist-item li.selected i").addClass("fa-li fa  fa-volume-up ");
    
    window.location.hash = $('.selected').text().split(' ').join('+');
}

function playNext() {
    var selected = _playlist.querySelector("li.selected");
    if (selected && selected.nextSibling) {
        playlistItemClick(selected.nextSibling);
    }
}

function playPrevious() {
    var selected = _playlist.querySelector("li.selected");
    if (selected && selected.previousSibling) {
        playlistItemClick(selected.previousSibling);
    }
}

// event listeners

_player.addEventListener('ended', playNext);
_playlist.addEventListener("click", function (e) {
    if (e.target && e.target.nodeName === "LI") {
        playlistItemClick(e.target);
    }
});

//help button + modal

$(document).on("click", '#info-button', function (e) {
    bootbox.dialog({

        message: '<ul><li>Play a song by clicking the <span class="glyphicon glyphicon-play"><span> button</li><li>Add a song to the playlist by clicking the <span class="glyphicon glyphicon-plus"><span> button </li><li>Clicking the title of a song in the <b>playlist</b> will begin playback of that track</li><li>When a song finishes, the next track will start playing automatically</li><li>To download a song, right click the <span class="glyphicon glyphicon-cloud-download"></span> button and Save as..</li><br><li>To clear the playlist, click the "clear playlist" button </li><li>You can save playlists as a .txt file, and import them from the menu accessed through the "hamburger" icon (<b>NOT</b> working without Chrome)</li><li>Direct mp3 <b>links</b> are bound to your IP, so you can`t share them. However, feel free to share whatever you download</li><li>If you right click - Save As... the mp3 <i>should</i> be automatically renamed</li><li>Is this legal? shhh... lets just say it is your responsability to respect copyrite law</li></ul><br>I hope you find this tool as kick-ass as I do. Send me a message if you run into any problems or have suggestions, I am still working on this and developing new features.<br><br>If you find this webapp useful, please give us a like on  <a href="http://facebook.com/stereostance" class="btn" style="background-color: #3b5998; color:#FFF; padding: 0px 5px; "> Facbook <span class="glyphicon glyphicon-thumbs-up"></span></a>',
        title: 'Just some tips... <span class="glyphicon glyphicon-heart"></span>',
        buttons: {
            success: {
                label: "<span class='glyphicon glyphicon-music'></span> Let's get Jammin'! <span class='glyphicon glyphicon-music'></span>",
                className: "btn-success",
                callback: function () {
                    console.log("Alert Callback");
                }
            }
        }
    });
});

// clear palylist script
$(document).on("click", '#clear-button', function (e) {
        $('#playlist-item').empty();
        index = 0;
});

// clear palylist item script
$(document).on("click", '#playlist-item span.fa-li.fa.fa-times', function (e) {
        $(this).parent().remove();
        index--;
});

    //scroll back to top script

    $(document).ready(function () {
        $(window).scroll(function () {
            var ScrollTop = parseInt($(window).scrollTop());
//            console.log(ScrollTop);

            if (ScrollTop > 600) {
                $('span.logo-text').text('Scroll back to top');
            } else {
                $('span.logo-text').text('Music Downloader');
            }

        });
    });


// hotkeys script

function playorpause() {
    var audio = document.getElementById("navbar-audio");
            if (audio.paused) {
                audio.play();
            } else {
                audio.pause();
            }
            return false;
}

    //spacebar pause-play   
    window.onkeydown = function (e) {
        if (e.keyCode == 32 && e.target == document.body) {
            e.preventDefault();
            playorpause();
        }
            else { //right arrow next song →
                    if (e.keyCode == 39 && e.target == document.body) {
            e.preventDefault();
            playNext();
                        }
                else { // left arrow next song ←
                        if (e.keyCode == 37 && e.target == document.body) {
            e.preventDefault();
            playPrevious();
                            }
                }
        
            }   
    };
