/*global $ */
/*global document */

$(document).ready(function ($) {

	$(function () {
		$('.hidden-on-load').removeClass('hidden-on-load');
	});

	$('.navbar').addClass('animated bounceInDown');
	$('#footer').addClass('animated bounceInUp');

	$('.wrapper').hide();
	setTimeout(function () {
		$('.wrapper').show();
		$('.wrapper').addClass('animated fadeIn');
	}, 600);


});