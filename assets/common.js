var activeLink;
var activeLinkLetters;
var glitchyTitles = [];
var time = 0;
var timePrev = 0;
var linkCharFade = 0.0;


$(document).ready(init);

String.prototype.replaceAt = function (index, replacement) {
	return this.substr(0, index) + replacement + this.substr(index + replacement.length);
}

var mobileLayoutActive = false;

function doResponsiveElements(layoutIsMobile) {
	if (layoutIsMobile) {
		activeLink = $('.page-title');
		$('.visual-full').attr('controls', '');
		$('.visual-video-static').each(function () {
			let name = $(this).attr("src");
			$(this).attr("src", name.replace(/\/thumbnail_/, '\/colour_thumbnail_'));
		});
		$(".visual-thumbnail-wide").unbind('mouseenter mouseleave');

		mobileLayoutActive = true;
	} else {
		if (mobileLayoutActive) {
			// Restore desktop layout.
			$('.visual-full').removeAttr('controls');
			$('.visual-video-static').each(function () {
				let name = $(this).attr("src");
				$(this).attr("src", name.replace(/\/colour_thumbnail_/, '\/thumbnail_'));
			});
			
			$('video.visual-full').each(function () {
				$(this)[0].play();;
			});

			mobileLayoutActive = false;
		}

		if (activeLinkLetters) {
			if (activeLinkLetters[0] == '>') activeLinkLetters = activeLinkLetters.slice(2, activeLinkLetters.length);
			activeLinkLetters = activeLinkLetters.join("");
			$('.page-title').text(activeLinkLetters);
		}
		activeLink = $('.page-link.active');
		$(".visual-thumbnail-wide").hover(wideShow, wideHide);
	}
	if (activeLink) {
		activeLinkLetters = activeLink.text().split("");
		activeLink.html("");
		activeLinkLetters.forEach(function (currentValue) {
			activeLink.append("<span class=\"page-link-char\">" + currentValue);
		});
	}
}

function init() {
	$(".visual-title").each(function () {
		var current = $(this);
		if (current.hasClass("noauto")) return; // I realise this is an awful, awful hack.
		current.originalText = current.text();
		glitchyTitles.push(current);
	});

	doResponsiveElements();
	changeTitle(titleDefault);

	$(".visual-video-image").on("load", function () {
		$(this).css("opacity", "1.0");
		$(this).prev().css("opacity", "1.0");
		$(this).prev().css("width", "100%");
		$(this).css("width", "100%");
		$(this).closest(".visual-video").css("width", "100%");
	}).each(function () {
		if (this.complete) {
			$(this).trigger('load');
		}
	});
	
	// TODO: DRY violation, see $large-breakpoint in SASS
	const mediaQuery = '(max-width: 49rem)';
	const mediaQueryList = window.matchMedia(mediaQuery);
	mediaQueryList.addEventListener("change", (e) => {
		doResponsiveElements(e.matches);
	});
	doResponsiveElements(mediaQueryList.matches);

	window.requestAnimationFrame(mainAnimation);
}

function mainAnimation() {
    // Active category link animation

    if (timePrev != 0) {
        time += (Date.now() - timePrev);
    }
    timePrev = Date.now();
    linkCharFade = Math.min(1., time / 200.0);
    $('.page-link-char').each(function (index) {
        $(this).css('font-weight', (2000 + Math.sin(index * .5 + time / 200) * 2000.).toString());
        $(this).css('opacity', (.75 + Math.sin(index * .5 + time / 200) * .25).toString());
        $(this).css('letter-spacing', (linkCharFade * (.08 + Math.sin(index * .5 + time / 100.0) * 0.04)).toString() + 'rem');
    });

    var viewHeight = $('.container').height();

    glitchyTitles.forEach(function (item) {
        let currentText = item.text();
        let originalText = item.originalText;
        let fromTop = $('.container').scrollTop();
        let scrollOffset = Math.max(0, Math.abs(viewHeight / 2 - item.position().top) - viewHeight / 2.25);

        if (Math.random() <= 0.05 + scrollOffset * .05) {
            currentText = currentText.replaceAt(Math.random() * currentText.length, randChar());
            currentText = currentText.replaceAt(Math.random() * currentText.length, randChar());
        }
        for (var j = 0; j < 1 + Math.round(Math.random() * 1.0); ++j) {
            for (var i = 0; i < Math.min(currentText.length, originalText.length); ++i) {
                if (originalText[i] != currentText[i] && Math.random() < .5) {
                    currentText = currentText.replaceAt(i, originalText[i].toString());
                    break;
                }
            }
        }
        item.text(currentText);
	});
	
    window.requestAnimationFrame(mainAnimation);
}

$(document).bind('scroll', positionStripe);

function positionStripe() {
    var scrollAmount = - ($(document).scrollTop()) * .1;
    $("#sidebar-stripe-parallax").css("background-position", "right " + scrollAmount.toString() + "px");
}

var figure = $(".visual-video").hover(hoverVideo, hideVideo);

$(".visual-thumbnail").each(function (i, obj) {
    var fade = Math.pow(i * .5, 1.2);
    $(obj).css('transform', 'scale(.9)');
    $(obj).mouseleave(function () {
        $(this).css('transform', 'scale(.9)');
    });

    $(obj).mouseenter(function () {
        $(this).css('transform', 'scale(1) rotate(0deg)');
    });
});

function hoverVideo(e) {
    $('video', this).get(0).currentTime = 0;
    $('video', this).get(0).play();
}

function hideVideo(e) {
    $('video', this).get(0).pause();
}

// Wide thumbnails

function wideShow(e) {
    $(this).children('.visual-thumbnail-wide-image')
        .css("width", "15%")
        .css("-webkit-filter", (!mobileLayoutActive) ? "url(#visual-duotone)" : "none")
        .css(".filter", (!mobileLayoutActive) ? "url(#visual-duotone)" : "none")
        .css("-webkit-transition", "all 200ms ease-out")
        .css("border-width", "2px");
    $(this).children('.visual-thumbnail-wide-description').css("opacity", "1.0");
    $(this).children('.visual-thumbnail-wide-image').children('.visual-thumbnail-wide-title')
        .css("padding-right", "1000px")
        .css("opacity", "0.0");
    titleTo = $(this).data('title');
}

function wideHide(e) {
    $(this).children('.visual-thumbnail-wide-image')
        .css("width", "100%")
        .css("-webkit-filter", (!mobileLayoutActive) ? "none" : "url(#visual-duotone)")
        .css(".filter", (!mobileLayoutActive) ? "none" : "url(#visual-duotone)")
        .css("-webkit-transition", "all 200ms ease-in")
        .css("border-width", "0px");
    $(this).children('.visual-thumbnail-wide-description').css("opacity", "0.0");
    $(this).children('.visual-thumbnail-wide-image').children('.visual-thumbnail-wide-title')
        .css("padding-right", "16px")
        .css("opacity", "1.0");
    changeTitle(titleDefault);
}

// GFX title stuff
// TODO: move elsewhere
/////////

var charsTyped = 0;
var titleDefault = "";
var titleCurrent = "Loading stuff...";
var titleTo = titleCurrent;
var typeClock = 0;
var typeUnderscoreOpacity = 0.0;
var titleGlitchProbability = 0;

function randChar() {
    return String.fromCharCode(33 + Math.round(Math.random() * 93));
}

function changeTitle(title) {
    titleGlitchProbability = 1;
    titleTo = title;
}

$(".visual-thumbnail").hover(function () {
    changeTitle($(this).data('title'));
});

$(".visual-thumbnail").mouseleave(function () {
    changeTitle(titleDefault);
});

function visualTitleUpdate() {
    titleGlitchProbability = Math.max(0.1, titleGlitchProbability - .025);
    typeUnderscoreOpacity = (Math.sin(Date.now() * .02) * .5 + .5);
    if (Math.random() <= titleGlitchProbability) {
        titleCurrent = titleCurrent.replaceAt(Math.random() * titleCurrent.length, randChar());
        titleCurrent = titleCurrent.replaceAt(Math.random() * titleCurrent.length, randChar());
    }

    for (var j = 0; j < 1 + Math.round(Math.random() * 1.0); ++j) {
        if (titleCurrent.length < titleTo.length) {
            titleCurrent = titleCurrent + randChar();
        } else if (titleCurrent.length > titleTo.length) {
            titleCurrent = titleCurrent.substring(0, titleCurrent.length - 1);
        }

        for (var i = 0; i < Math.min(titleCurrent.length, titleTo.length); ++i) {
            if (titleTo[i] != titleCurrent[i] && Math.random() < .5) {
                titleCurrent = titleCurrent.replaceAt(i, titleTo[i].toString());
                break;
            }
        }
    }

    $(".visual-title").html("&gt; " + titleCurrent + "<span style = \'opacity: " + typeUnderscoreOpacity + ";\'>_</span>");
    requestAnimationFrame(visualTitleUpdate);
}

/////////
