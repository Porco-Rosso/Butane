/*global $ */
/*global document */

$(function () {

	$('.switch').change(function () {

		if ($(".switch").hasClass("checked")) {
			$(this).toggleClass('checked');
			$("script[src='js/particles.js']").remove();
			$("#particles-js").remove();

			document.cookie = "visualizer-off";


		} else {

			$(this).toggleClass('checked');

			$("<div id='particles-js'></div>").insertBefore("#wrapper-container");

			var headID = document.getElementsByTagName("head")[0];
			var newScript = document.createElement('script');
			newScript.type = 'text/javascript';
			newScript.src = 'js/particles.js';
			headID.appendChild(newScript);

			document.cookie = "visualizer-on";
		}

	});

});

$(document).ready(function () {

	var cookie = document.cookie;
	if (cookie == "visualizer-on") {

		$('.switch').click();
	}

});