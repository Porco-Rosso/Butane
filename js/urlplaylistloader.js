$(document).ready(function ($) {

	var hash = window.location.hash;
    //For sharing search playlists directly from the url, like http://vkdl.stereostance.com/#https://my.mixtape.moe/mqrrio.txt
    if (hash.length > 1) {
		if (hash.indexOf("http") > -1){
			
			
			playlistURL = "https://jsonp.afeld.me/?url=" + hash.substring(1, hash.length)
			$.get(playlistURL, function(playlistURLdata){
				alert(playlistURLdata);
  			});		
		
		}
		else
		//For sharing search links, like http://vkdl.stereostance.com/#fkj
        hash = hash.substring(1, hash.length).split('+').join(' '); //remove hash from query
        search(hash, null, null, true);
        $('#query').val(hash);
    } else {
        // space intentionally left blank
    }
	
	
});