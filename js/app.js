/*global $ */
/*global document */
/*global window */


$(document).ready(function ($) {

	var index = 0;
	
	//	AnimateCss
	$.fn.extend({
    animateCss: function (animationName) {
        var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
        $(this).addClass('animated ' + animationName).one(animationEnd, function() {
            $(this).removeClass('animated ' + animationName);
        });
    }
	});

	//Trigger search button when pressing enter button
	$('#query').bind('keypress', function (event) {
		if (event.keyCode == 13) {
			$('.search').trigger('click');
		}
	});

	$(document).ready(function () {
		$(".drawer").drawer();
	});

	/* ========================================================================
	 * To get your own token you need first create vk application at https://vk.com/editapp?act=create
	 * Then  get your APP_ID and CLIENT_SECRET at application settings
	 * Now open this url from your logined to vk browser, this will redirect to blank.html with your token:
	 * https://oauth.vk.com/authorize?client_id=APP_ID&client_secret=CLIENT_SECRET&scope=audio,offline&response_type=token
	 *======================================================================== */

//	====== List of access tokens =======
//	Public VKDL Token 1
//		accessToken: "ccd09c5c990069316002d28ab7f0e0ba5841fbcdc626c0524afbe4faea92451ea43a4240cab3de8eda4df",
//	Public VKDL Token 2
//		accessToken: "f41e76716a5dd6d0f33f95d34e0c24ee20164e78f7660cf7bfd375f5f8ea65dc63a6a3f99d2035b9df1d3",
//	Public VKDL Token 3
//		accessToken: "061b3cb52f205e981d3e74fe52a49b404710789e79c46550393af78ab1bac8c02c0b677accd014f269e4d",
//	First, Old token (Alashow one)
//		accessToken: "4d45c6ebef3b05a910071c948bb1374015c9e47ad953fba2f631d8bc1fca425a0a0bffcb4955d3af90c07",

	//Config for vk audio.search api
	var vkConfig = {
		url: "https://api.vk.com/method/audio.search",
		sort: 2,
		autoComplete: 0,
		accessToken: "f41e76716a5dd6d0f33f95d34e0c24ee20164e78f7660cf7bfd375f5f8ea65dc63a6a3f99d2035b9df1d3", // Public Vkdl 2
		count: 300
	};
	window.vkConfig = vkConfig;

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
		$('.input-group').animateCss('pulse');
		if (query == ""){
			$('.input-group').animateCss('shake');
			$('#result').animateCss('fadeOut');
			setTimeout(function(){
    		$('#result > .list-group').html("");
			window.location.hash = "";
		
			}, 280);
			
			return; // return if query empty
						};
		search(query, null, null);
	});

	$(document).ready(function ($) {

		var hash = window.location.hash;
		//For sharing search playlists directly from the url, like http://vkdl.stereostance.com/#https://my.mixtape.moe/mqrrio.txt
		if (hash.length > 1) {
			if (hash.indexOf("http") > -1) {

				loadURLplaylist();

			} else {
				//For sharing search links, like http://vkdl.stereostance.com/#fkj
				hash = hash.substring(1, hash.length).split('+').join(' '); //remove hash from query
				search(hash, null, null, true);
				$('#query').val(hash);
			}
		} else {
			// space intentionally left blank, for no hash being included
		}
	});


	//needed for later to change icons
	function changeicons() {
		for (var i = 0; i < 300; i++) {

			$('#playaddicon').addClass('glyphicon-plus').removeClass('glyphicon-play');
			$('#playaddicon').removeAttr('id');
		}
	}



	//Append Error To List
	function prependError(error) {
		$('#result > .list-group').html("");
		$('#result > .list-group').prepend('<li class="list-group-item list-group-item-danger">' + error + '</li>');
		$('#loading').hide();
	}
		// To make function Global 
		window.prependError =  prependError;

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
		}
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

				if (msg.response == 0) {
					prependError('<i class="fa fa-exclamation-triangle"></i>' + " Sorry, our team of trained monkeys couldn't find anything for this search query.");
					return;
				}

				var entityMap = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': '&quot;',
    "'": '&#39;',
    "/": '&#x2F;'
					};
				
								function escapeHtml(string) {
						return String(string).replace(/[&<>"'\/]/g, function (s) {
								return entityMap[s];
						});
				}
				
				// build search result list  
				$('#result > .list-group').html("");
				for (var i = 1; i < msg.response.length; i++) {
					
					var artist = escapeHtml(msg.response[i].artist);
					var title = escapeHtml(msg.response[i].title);
					var url =  msg.response[i].url;
					var duration = msg.response[i].duration.toTime();					
//					var uploaddate = moment(msg.response[i].date * 100).format('LL');
					var uploaddate = "Not yet implemented" ;
					var genres = [
						"Rock","Pop","Rap & Hip-Hop","Easy Listening","Dance & House","Instrumental","Metal","Dubstep","9","Drum & Bass","Trance","Chanson","Ethnic","Acoustic & Vocal","Reggae","Classical", "Indie Pop","Other","Speech","20","Alternative","Electropop & Disco"
						];
					var genrenumber = msg.response[i].genre;
					var genre = genres[genrenumber];
					var titleartist = title + ' - ' + artist;
					var savebutton = '<span class="badge download hint--top hint--rounded nomobile" data-hint="Save as ..."><a class="glyphicon glyphicon-cloud-download" href="' + url + '" download="' + artist + ' - ' + title + '.mp3"></a></span>';
					var songlength = '<span class="badge hint--top hint--rounded nomobile" data-hint="Song length">' + duration + '</span>';
					var playbutton = '<span class="badge play hint--top hint--rounded" data-hint="Add to player" data-url="'+url+'" data-titleartist="'+titleartist+'"><span class="glyphicon glyphicon-play" id="playaddicon"></span></span>';
					
					var link = '<a class="song" data-title="' + title + '" data-artist="' + artist + '" data-duration="' + duration + '" data-url="'+ url +'" data-genre="'+ genre +'">'+ titleartist +'</a>';
					
					$('#result > .list-group').append('<li class="list-group-item">'+link +savebutton+playbutton+songlength+'</li>');
					
					$('#result > .list-group').animateCss('fadeInUp');
					
				}


				$('.play').on('click', function (event) {

					if (index == 0) {

						//Change source of audio, show then play
						$("#jp_audio_0").attr('src', $(this).attr('data-url'));

						$("#jp_audio_0")[0].play();
						updatebuffer();
						songendlistener();


						var a = document.createElement("a");
						var ulist = document.getElementById("playlist-item");
						var newItem = document.createElement("li");

								a.textContent = $(this).attr('data-titleartist');
								a.setAttribute('href', $(this).attr('data-url'));
								a.setAttribute('download', a.textContent);
								newItem.innerHTML = newItem.innerHTML + '<i></i>';
								newItem.innerHTML = newItem.innerHTML + '<img id="equalizer-icon" src="images/google-equalizer-white.gif">';
								newItem.appendChild(a);
								newItem.innerHTML = newItem.innerHTML + '<span class="fa-li fa fa-times"></span>'; // delete icon
								newItem.innerHTML = newItem.innerHTML + '<span class="fa-li fa fa-cloud-download nomobile"><a class="fakelink hint--top hint--rounded " data-hint="Save as ..." target="_blank" href="' + $(this).attr('data-url') + '" download="' + a.textContent + '.mp3"></a></span>'; // download link
								newItem.innerHTML = newItem.innerHTML + '<span class="fa-li fa fa-sort nomobile"></span>'; //sorting icon
								ulist.appendChild(newItem);
					
						

						index++;
						var _playlist = document.getElementById("playlist-item");

						changeicons();
						document.title = $(this).parent().text().slice(7);

						$('.sortable').sortable();
						$('.sortable').disableSelection();
						$("#playlist-item li").addClass("selected");


					} else {
						//add song to list only

								var a = document.createElement("a");
								var ulist = document.getElementById("playlist-item");
								var newItem = document.createElement("li");

								a.textContent = $(this).attr('data-titleartist');
								a.setAttribute('href', $(this).attr('data-url'));
								a.setAttribute('download', a.textContent);
								newItem.innerHTML = newItem.innerHTML + '<i class="fa-li fa fa-angle-right"></i>';
								newItem.appendChild(a);
								newItem.innerHTML = newItem.innerHTML + '<span class="fa-li fa fa-times"></span>'; // delete icon
								newItem.innerHTML = newItem.innerHTML + '<span class="fa-li fa fa-cloud-download nomobile"><a class="fakelink hint--top hint--rounded " data-hint="Save as ..." target="_blank" href="' + $(this).attr('data-url') + '" download="' + a.textContent + '.mp3"></a></span>'; // download link
								newItem.innerHTML = newItem.innerHTML + '<span class="fa-li fa fa-sort nomobile"></span>'; //sorting icon

								ulist.appendChild(newItem);

								var _playlist = document.getElementById("playlist-item");

								
								document.title = $(this).attr('data-titleartist');

								$('.sortable').sortable();
								$('.sortable').disableSelection();

					}

				});



				$('#loading').hide();

			}
		});
	}




	//Sec To Time
	Number.prototype.toTime = function () {
		var sec_num = parseInt(this, 10);
		var hours = Math.floor(sec_num / 3600);
		var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
		var seconds = sec_num - (hours * 3600) - (minutes * 60);

		if (hours < 1) {
			hours = "";
		} else {
			hours = hours + ':';
		}
		if (minutes < 10) {
			minutes = "0" + minutes;
		}
		if (seconds < 10) {
			seconds = "0" + seconds;
		}
		var time = hours + minutes + ':' + seconds;
		return time;
	};

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
			}
		});
	}

});

// end of on document script  


// globals for playlists
var _playlist = document.getElementById("playlist-item");


// functions for playlists
function playlistItemClick(clickedElement) {
	var selected = _playlist.querySelector(".selected");
	if (selected) {
		selected.classList.remove("selected");
	}
	clickedElement.classList.add("selected");
	var clickedelementlink = clickedElement.getElementsByTagName('a')[0];
	$("#jp_audio_0").attr('src', clickedelementlink.getAttribute("href"));
	$("#jp_audio_0")[0].play();
	updatebuffer();
	document.title = $('.selected').text();
	$("#equalizer-icon").remove();
	$("#playlist-item li i").addClass("fa-li fa fa-angle-right");
	$("#playlist-item li.selected i").removeClass("fa-li fa fa-angle-right");
	$("#playlist-item li.selected").prepend('<img id="equalizer-icon" src="images/google-equalizer-white.gif">');
	
	

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
function songendlistener() {
	$("#jp_audio_0")[0].addEventListener('ended', playNext);
	_playlist.addEventListener("click", function (e) {
		if (e.target && e.target.nodeName === "LI") {
			playlistItemClick(e.target);
		}
	});
}
songendlistener();

//help button + modal

$(document).on("click", '#info-button', function (e) {
	bootbox.dialog({

		message: '<ul><li>To download a song, right click the <span class="glyphicon glyphicon-cloud-download"></span> button and Save as...</li><li>Make sure to "Save as..." to preserve the filename.</li><li>Click the  <i class="fa fa-bars" aria-hidden="true"> </i> icon to save and import playlists as a .txt file</li><li>Click the <i class="fa fa-toggle-on" aria-hidden="true"></i> to enable the visulaizer</li><li>It is your responsability to respect copyrite law <i class="fa fa-copyright" aria-hidden="true"></i> !</li></ul><br>I hope you find this tool as kick-ass as I do. <a href="https://github.com/Porco-Rosso/vkdl/issues/new?title=Bug%20or%20Suggestion">Open an issue</a> if you run into any problems or have a suggestion, I am still working on this and developing new features.<br><br>If you find this webapp useful, please give us a like on  <a href="http://facebook.com/stereostance" class="btn" style="background-color: #3b5998; color:#FFF; padding: 0px 5px; "> Facbook <span class="glyphicon glyphicon-thumbs-up"></span></a>',
		title: 'Just some tips... <span class="glyphicon glyphicon-heart"></span>',
		buttons: {
			success: {
				label: "<span class='glyphicon glyphicon-music'></span> Let's get Jammin'! <span class='glyphicon glyphicon-music'></span>",
				className: "btn-success",
				callback: function () {
					console.log("Closed info-box");
				}
			}
		}
	});
});

// clear palylist script
$(document).on("click", '#clear-button', function (e) {
	$('#playlist-item').animateCss('fadeOut');	
	
	setTimeout(function(){
    $('#playlist-item').empty();
						 }, 500);
	
	index = 0;
});

// clear palylist item script
$(document).on("click", '#playlist-item span.fa-li.fa.fa-times', function (e) {
	var that = this;
	$(this).parent().animateCss('fadeOut');		
	setTimeout(function(){
    $(that).parent().remove();
						 }, 200);
	index--;
});

//scroll back to top script

$(document).ready(function () {
	$(window).scroll(function () {
		var ScrollTop = parseInt($(window).scrollTop());
		//            console.log(ScrollTop);

		if (ScrollTop > 600) {
			$('span.logo-text').text('Scroll back to top ↑');
		} else {
			$('span.logo-text').text('Butane');
		}

	});
});

function freezeequalizer() {
if($('#jp_container_1 > div.jp-controls > a.jp-play').css('display') == 'inline')
{
	$("#equalizer-icon").attr("src", "images/google-equalizer-white.gif");
}
else
{
    $("#equalizer-icon").attr("src", "images/google-equalizer-white-paused.gif");
}
}

// hotkeys script

function playorpause() {
	var audio = $("#jp_audio_0");
	freezeequalizer();
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
	} else { //right arrow next song →
		if (e.keyCode == 39 && e.target == document.body) {
			e.preventDefault();
			playNext();
		} else { // left arrow next song ←
			if (e.keyCode == 37 && e.target == document.body) {
				e.preventDefault();
				playPrevious();
			}
		}

	}
};

//Initialize jplayer
$(document).ready(function () {

	$("#jquery_jplayer_1").jPlayer({
		ready: function (event) {
			$(this).jPlayer("setMedia", {
				mp3: "#"
			});
		},
		swfPath: "js/jplayer-custom/js",
		supplied: "mp3",
		wmode: "window",
		smoothPlayBar: true,
		keyEnabled: true,
		remainingDuration: true,
		toggleDuration: true,
		volume: 1
	});
});

// get buffered amount
function updatebuffer() {
	var audio4buffer = document.getElementById('jp_audio_0');
	var tracktime = audio4buffer.currentTime;
	var trackduration = audio4buffer.duration;
	var trackplaypercentage = (tracktime / trackduration).toFixed(3) * 100 + "%";
	try {
		var trackbuffered = audio4buffer.buffered.end(audio4buffer.buffered.length - 1);
		var trackbufferedpercentage = (trackbuffered / trackduration).toFixed(3) * 100 + "%";
		$(".jp-buffer-bar").css("width", trackbufferedpercentage);
	} catch (e) {}
	setTimeout(updatebuffer, 150);
}