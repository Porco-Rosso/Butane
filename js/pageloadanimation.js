/*global $ */
/*global document */

$(document).ready(function ($) {
	
	$('.navbar').addClass('animated bounceInDown');	
	$('#footer').addClass('animated bounceInUp');
	
	$('.wrapper').hide();
	setTimeout(function(){
	$('.wrapper').show();
    $('.wrapper').addClass('animated fadeInUp');
}, 400);
	
	
});