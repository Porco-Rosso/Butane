		if (hash.indexOf("http") > -1) {
			var playlistURL = "https://jsonp.afeld.me/?url=" + hash.substring(1, hash.length);
			$.get(playlistURL, function (playlistURLdata) {
				console.log(playlistURLdata);
				
		var playlistarray = [];
        var playlistarray = playlistURLdata.split("\n");
        window.playlistarray = playlistarray;
        //// array fixer/////
        var playlistObject = {};
        for (var i = 0, max = playlistarray.length; i < max; i += 1) {
            playlistObject[i] = playlistarray[i];
        }
		var correctplaylistarray = [playlistObject];
        window.correctplaylistarray = correctplaylistarray;

				
		function searchforplaylist(playlistarray, captcha_sid, captcha_key) {
            var vkConfig = {
                url: "https://api.vk.com/method/audio.search",
                sort: 2,
                autoComplete: 0,
                accessToken: "43105d78b7e5c79fd46e2623f541f39b7aa30889d55f47736e4cb94b4a0205c80f259ed2eb0e104cbf856",
                count: 5
            };
            //  Uncomment the line below if you would like the URL hash to change once the tracks are loaded 
            //    window.location.hash = correctplaylistarray[0][0].slice(0,-1);
            var data = {
                q: playlistarray,
                sort: vkConfig.sort,
                auto_complete: vkConfig.autoComplete,
                access_token: vkConfig.accessToken,
                count: vkConfig.count
            };
            if (captcha_sid !== null && captcha_key !== null) {
                data.captcha_sid = captcha_sid;
                data.captcha_key = captcha_key;
            }
            $.ajax({
                url: vkConfig.url,
                data: data,
                type: "GET",
                dataType: "jsonp",
                beforeSend: function () {
                },
                // error handling (Doesn't work in loading playlists because the search results are not actually displayed, keeping it anyway.
                error: function () {
                    prependError('Internet error...');
                },
                success: function (msg) {
                    if (msg.error) {
                        if (msg.error.error_code == 5) {
                            prependError("Access Token error, contact me");
                        } else {
                            prependError("Oops, something went wrong : " + msg.error.error_msg);
                        }
                        if (msg.error.error_code == 14) {
                            showCaptcha(msg.error.captcha_sid, msg.error.captcha_img);
                        }
                        return;
                    }

                    if (msg.response === 0) {
                        prependError("Sorry, Something went wrong building your playlist :( ");
                        return;
                    }
                

                    // build playlist using results  
                    $('#playlist-item').append('<li><i class="fa-li fa fa-angle-right"></i><a href="' + msg.response[1].url + '">' + msg.response[1].artist + ' - ' + msg.response[1].title + '</a><span class="fa-li fa fa-times"></span><span class="fa-li fa fa-cloud-download"><a class="fakelink" target="_blank" href="' + msg.response[1].url + '" download="' +  msg.response[1].artist + ' - ' + msg.response[1].title + '.mp3"></a></span><span class="fa-li fa fa-sort"></span></li>');

                }
            });
        }
		window.searchforplaylist = searchforplaylist;
		var i = 0;

        function forloop() {
            if (i < playlistarray.length) {
                // actions on last item loaded
                if (i == playlistarray.length - 1) {
                    window.searchforplaylist(window.correctplaylistarray[0][i], null, null);
                    i++;
                    setTimeout(forloop, 300);
                   
                } else {
                    // actions for every playlist item
                    window.searchforplaylist(window.correctplaylistarray[0][i], null, null);
                    i++;
                    setTimeout(forloop, 300);
                }
            }
        }
        forloop();		
				
				
			});