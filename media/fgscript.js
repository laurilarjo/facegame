/*var skippable = true;*/
var mute = true;
var switchtooltip = false;
var gamemode = 'face';

jQuery.preloadImages = function()
{
	for(var i = 0; i<arguments.length; i++)
	{
		jQuery("<img>").attr("src", arguments[i]);   
	} 
}

$('html').ajaxSend(function(event, xhr, settings) {
    function getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
    if (!(/^http:.*/.test(settings.url) || /^https:.*/.test(settings.url))) {
        // Only send the token to relative URLs i.e. locally.
        xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
    }
});

$(document).ready(function()
{
	$.preloadImages("/facegame/static/images/loader.gif", "/facegame/static/images/muteon.png");

	soundHandle1 = document.getElementById('soundHandle1');
	soundHandle2 = document.getElementById('soundHandle2');
	$("#soundHandle1").attr('preload', 'auto');
	$("#soundHandle2").attr('preload', 'auto');
	soundHandle1.src = '/facegame/static/sounds/correct.ogg';

	soundHandle2.src = '/facegame/static/sounds/wrong.ogg';

	$('.muteimg').bind("click", function(event)
	{
		if (mute == true)
		{
			mute = false;
			$('.muteimg').attr('src', '/facegame/static/images/muteoff.png');
		} else
		{
			mute = true;
			$('.muteimg').attr('src', '/facegame/static/images/muteon.png');
		}
	});

	/*$('.switchimg').bind("click", function(event)
	{
		var answer = "SWITCH";
		$.post('/updatestats/?ajax=true&random='+Math.random(), {csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(), 'answer': answer}, function(data)
		{
			$(".switchimg").animate({"width": "+=6px", "height": "+=6px"}, 300, function()
				{
					$(".switchimg").animate({"width": "-=6px", "height": "-=6px"}, 350);					
				});
			$.get('/jsonform/?ajax=true&random='+Math.random(), function(form)
			{
				$('#face').fadeOut(400);
				$('#output').css("display", "none");
				$('#output').html(form.jsonform);
				rnCheck();
				initialize();
			});
			return false;
		});
	});*/

	$('.correctimg').tipsy();
	$('.wrongimg').tipsy();
	$('.rowimg').tipsy();
	/*$('.skipimg').tipsy();*/
	$('.muteimg').tipsy();
	$('.logoimg').tipsy();
	$('.resetimg').tipsy();
	$('.switchimg').tipsy({html: true, trigger: 'manual'});

	$('.switchimg').bind("click", function(event)
	{
		if (switchtooltip == true)
		{
			switchtooltip = false;
			$('.switchimg').tipsy("hide");
		} else {
			switchtooltip = true;
			$('.switchimg').tipsy("show");
		}
	});

	initialize();
});

function response(responseText)
{
	$('#face').fadeOut(400, function()
	{
		$('#output').css("display", "none");
		$('#output').html(responseText);
		rnCheck();
		initialize();
	});
}

function rnCheck()
{
	skippable = true;
	$('#nameform').fadeIn(700);
	$('#face').fadeIn(700);
}	

function deteleconfirm()
{
	var confirmanswer = confirm("You are about to reset your stats. Are you sure?")
	if (confirmanswer)
	{
		var answer = "RESET";
		$.post('/updatestats/?ajax=true&random='+Math.random(), {csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(), 'answer': answer}, function(data)
		{
			$('#correctnum').html(data.correctAnswers);
			$('#wrongnum').html(data.wrongAnswers);
			$('#rownum').html(data.currentStreak + ", " + data.highestStreak);
			/*$('#skipnum').html(data.skips);*/
			return false;
		});
		return false;
	}
	return false;
}

function initialize()
{
	/*$('.skipimg').fadeTo(500, 1.0);*/
	if( $.browser.opera ){
		$('#output').fadeIn(700);
		$('#nameform').attr("disabled", false);
	}
	$('#face').load(function()
	{
		$('#output').fadeIn(700);
		$('#nameform').attr("disabled", false);
	}).each(function()
	{
		if (this.complete)
		{
			$(this).trigger("load");
		}
	});

	$('li').mouseenter(function(event)
	{
		$(this).css("background-color", "#BFBAA4");
	}).mouseleave(function(event)
	{
		$(this).css("background-color", "#FFFFFF");
	});

	$('.thumbimg').mouseenter(function(event)
	{
		$(this).css("border", "1px solid black");
	}).mouseleave(function(event)
	{
		$(this).css("border", "0px solid black");
	});

	$('.thumbimg').click(function(event)
	{
		$(this).unbind('click');
		var answer = $(this).attr("value");
		$.post('/name/updatestats/?ajax=true&random='+Math.random(), {csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(), 'answer': answer}, function(data)
		{
			$('#correctnum').html(data.correctAnswers);
			$('#wrongnum').html(data.wrongAnswers);
			$('#rownum').html(data.currentStreak + ", " + data.highestStreak);
			if (data.valid == true)
			{
				if (mute == false)
				{
					soundHandle1.load();
					soundHandle1.play();
				}
				$(".thumbimg").unbind('click');
				$('#thumbnails').fadeOut(600);
				$('.names').fadeOut(600, function()
				{
					$(this).html('<img id="loader" src="/facegame/static/images/loader.gif">');
					$(this).fadeIn(400);
				});
				$(".correctimg").animate({"width": "+=6px", "height": "+=6px"}, 300, function()
				{
					$(".correctimg").animate({"width": "-=6px", "height": "-=6px"}, 350);					
				});
				$.get('/json_thumbnails/?ajax=true&random='+Math.random(), function(data)
				{
					/*$('#face').fadeOut(400);*/
					$('#thumbnails').css("display", "none");
					$('#thumbnails').html(data.json_thumbnails);
					$('#thumbnails').fadeIn(600);
					/*rnCheck();*/
					initialize();
				});
				return false;
			} else
			{
				if (mute == false)
				{
					soundHandle2.load();
					soundHandle2.play();
				}
				$(".thumbimg").find("value="+answer).fadeTo(700, 0.35);
				$(".wrongimg").animate({"width": "+=5px", "height": "+=5px"}, 300, function()
				{
					$(".wrongimg").animate({"width": "-=5px", "height": "-=5px"}, 350);
				});
				return false;
			}
		});
	});

	/*$('.skipimg').click(function(event)
	{
		var answer = "SKIPSKIP";
		$.post('/facegame/updatestats/?ajax=true&random='+Math.random(), {csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(), 'answer': answer}, function(data)
		{
			$('#skipnum').html(data.skips);
			$('.skipimg').fadeTo(500, 0.3).unbind('click');
			$('li').unbind('click');
			$('li').find("input[value=" + rnCorrect + "]").attr("checked", "checked");
			$('#nameform').fadeOut(600);
			$('#face').fadeOut(600, function()
			{
				$(this).attr('src', '/facegame/static/images/loader.gif');
				$(this).fadeIn(400);
			});
			$.get('/facegame/jsonform/?ajax=true&random='+Math.random(), function(form)
			{
				$('#face').fadeOut(400);
				$('#output').css("display", "none");
				$('#output').html(form.jsonform);
				rnCheck();
				initialize();
			});
			return false;
		});
	});*/

	$('li').click(function(event)
	{
		$(this).unbind('click');
		var answer = $(this).find("input[type=radio]").val();
		$.post('/updatestats/?ajax=true&random='+Math.random(), {csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(), 'answer': answer}, function(data)
		{
			$('#correctnum').html(data.correctAnswers);
			$('#wrongnum').html(data.wrongAnswers);
			$('#rownum').html(data.currentStreak + ", " + data.highestStreak);
			if (data.valid == true)
			{
				if (mute == false)
				{
					soundHandle1.load();
					soundHandle1.play();
				}
				$("li").unbind('click');
				/*$(".skipimg").fadeTo(500, 0.3).unbind('click');
				if (skippable == true)
				{
					skippable = false;
				}*/
				$(this).find("input[type=radio]").attr("checked", "checked");
				$('#nameform').fadeOut(600);
				$('#face').fadeOut(600, function()
				{
					$(this).attr('src', '/facegame/static/images/loader.gif');
					$(this).fadeIn(400);
				});
				$(".correctimg").animate({"width": "+=6px", "height": "+=6px"}, 300, function()
				{
					$(".correctimg").animate({"width": "-=6px", "height": "-=6px"}, 350);					
				});
				$.get('/jsonform/?ajax=true&random='+Math.random(), function(form)
				{
					$('#face').fadeOut(400);
					$('#output').css("display", "none");
					$('#output').html(form.jsonform);
					rnCheck();
					initialize();
				});
				return false;
			} else
			{
				if (mute == false)
				{
					soundHandle2.load();
					soundHandle2.play();
				}
				/*$(".skipimg").fadeTo(500, 0.3).unbind('click');
				if (skippable == true)
				{
					skippable = false;
				}*/
				$("li").find("input[value="+answer+"]").parent().fadeTo(700, 0.35);
				$(".wrongimg").animate({"width": "+=5px", "height": "+=5px"}, 300, function()
				{
					$(".wrongimg").animate({"width": "-=5px", "height": "-=5px"}, 350);
				});
				return false;
			}
		});
		return false;
		
	});

	/*var options = {target: '#output', success: response};
	$('#nameform').ajaxForm(options);*/
}
