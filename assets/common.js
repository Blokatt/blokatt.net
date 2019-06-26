var activeLink;
var activeLinkLetters;
$(document).ready(init);

var glitchyTitles = [];


window.onload = function () {
    // in case something breaks
    //$(".visual-video").css("width", "100%");
    //$(".visual-video-image").css("opacity", "1.0");
    /*
    $(".visual-video-image").each(function () {
        if ($(this).css("opacity") < 1.0) {
            $(this).css("opacity", "1.0");
        }    
    });
    $(".visual-video").css("width", "100%");
    */
};

function responsiveElements() {
    if ($(window).width() < 790) {
        activeLink = $('.page-title');
        $('.visual-full').attr('controls', '');
        // $('.header-frame').height = 100;
        $('.visual-video-static').each(function () {
            let name = $(this).attr("src");
            $(this).attr("src", name.replace(/\/thumbnail_/, '\/colour_thumbnail_'));
        });
    } else {
        if (activeLinkLetters) {
            if (activeLinkLetters[0] == '>') activeLinkLetters = activeLinkLetters.slice(2, activeLinkLetters.length);
            activeLinkLetters = activeLinkLetters.join("");
            //alert(activeLinkLetters);
            $('.page-title').text(activeLinkLetters);
        }
        //$('.header-frame').height = 200;    
        activeLink = $('.page-link.active');
        $('.visual-full').removeAttr('controls');
    }
    if (activeLink) {
        activeLinkLetters = activeLink.text().split("");
        activeLink.html("");
        activeLinkLetters.forEach(function (currentValue) {
            activeLink.append("<span class=\"page-link-char\">" + currentValue);
        });
    }
    positionStripe();
}
/*
    if ($(window).width() < 790) {
        $('.visual-full').attr('controls', '');
    } else {
        $('.visual-full').removeAttr('controls');
    }
    */
var time = 0;
var timePrev = 0;
var linkCharFade = 0.0;

String.prototype.replaceAt = function (index, replacement) {
    return this.substr(0, index) + replacement + this.substr(index + replacement.length);
}

function randChar() {
    return String.fromCharCode(33 + Math.round(Math.random() * 93));
}

function mainAnimation() {
    if (timePrev != 0) {
        time += (Date.now() - timePrev);
    }
    timePrev = Date.now();
    linkCharFade = Math.min(1., time / 200.0);
    //$('.page-link.active').css('letter-spacing', (.05 + Math.sin(time / 1000) * 0.05).toString() + 'rem');          
    $('.page-link-char').each(function (index) {
        $(this).css('font-weight', (2000 + Math.sin(index * .5 + time / 200) * 2000.).toString());
        $(this).css('opacity', (.75 + Math.sin(index * .5 + time / 200) * .25).toString());
        $(this).css('letter-spacing', (linkCharFade * (.08 + Math.sin(index * .5 + time / 100.0) * 0.04)).toString() + 'rem');
        //$(this).css('padding-right', (0.2 + Math.sin(index * .5 + time / 100) * 0.1).toString() + "rem");
    });

    var viewHeight = $('.container').height();

    glitchyTitles.forEach(function (item) {
        //item.text("test");
        let currentText = item.text();
        let originalText = item.originalText;
        let fromTop = $('.container').scrollTop();
        let scrollOffset = Math.max(0, Math.abs(viewHeight / 2 - item.position().top) - viewHeight / 2.25);


        //titleGlitchProbability = Math.max(0.1, titleGlitchProbability - .025);
        //let typeUnderscoreOpacity = (Math.sin(Date.now() * .02) * .5 + .5);
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
        //console.log(item.originalText);
    });

    /*
    var hue = Math.sin(time / 3000) * 5;
    var valA = Math.sin(time / 1000) * .2 + 1;
    var valB = Math.cos(time / 1000) * .2 + 1;
    $('body').css('background-image', 'linear-gradient(to bottom, hsla(' + (258 + hue).toString() + ', 29%, ' + (49 * valA).toString() + '%, 1), hsla(' + (257 + hue).toString() + ', 29%, ' + (35 * valB).toString() + '%, 1)');
    */
    //$(".visual-video").css("-webkit-filter", "url(#visual-duotone)");
    window.requestAnimationFrame(mainAnimation);
}
window.requestAnimationFrame(mainAnimation);

$('.container').bind('scroll', positionStripe);

function positionStripe() {
    let scrollAmount = - ($('.container').scrollTop()) * .1;
    $("#sidebar-stripe").css("background-position", "right " + scrollAmount.toString() + "px")
        .css("opacity", "0.75");
}


var figure = $(".visual-video").hover(hoverVideo, hideVideo);
var wideFilterSwapped = false;

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


$(".visual-thumbnail").hover(function () {
    changeTitle($(this).data('title'));
});

$(".visual-thumbnail").mouseleave(function () {
    changeTitle(titleDefault);
});

function hoverVideo(e) {
    $('video', this).get(0).currentTime = 0;
    $('video', this).get(0).play();
}

function hideVideo(e) {
    $('video', this).get(0).pause();
}

/*
$(".visual-section").each(function() {
    $(this).ready(function() {
        console.log($(this));
        $(this).css("opacity", "1.0");
    });
   //$(this).css("opacity", "1.0");
});
*/

/*
if ($(window).width() < 790) {
*/

function wideShow(e) {
    $(this).children('.visual-thumbnail-wide-image')
        .css("width", "25%")
        .css("-webkit-filter", (!wideFilterSwapped) ? "url(#visual-duotone)" : "none")
        .css(".filter", (!wideFilterSwapped) ? "url(#visual-duotone)" : "none")
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
        .css("-webkit-filter", (!wideFilterSwapped) ? "none" : "url(#visual-duotone)")
        .css(".filter", (!wideFilterSwapped) ? "none" : "url(#visual-duotone)")
        .css("-webkit-transition", "all 200ms ease-in")
        .css("border-width", "0px");
    $(this).children('.visual-thumbnail-wide-description').css("opacity", "0.0");
    $(this).children('.visual-thumbnail-wide-image').children('.visual-thumbnail-wide-title')
        .css("padding-right", "16px")
        .css("opacity", "1.0");
    changeTitle(titleDefault);
}


var charsTyped = 0;
var titleDefault = "";
var titleCurrent = "Loading stuff...";
var titleTo = titleCurrent;
var typeClock = 0;
var typeUnderscoreOpacity = 0.0;
var titleGlitchProbability = 0;

function changeTitle(title) {
    titleGlitchProbability = 1;
    titleTo = title;
}

function typeResize() {
    var w = $(".content").width();
    $(".visual-title").css("font-size", (w * .035));
}

function visualTitleUpdate() {
    // * (titleTo == titleDefault || titleCurrent != titleTo)
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



function init() {
    $(".visual-title").each(function () {
        var current = $(this);
        if (current.hasClass("noauto")) return; // I realise this is an awful, awful hack.
        current.originalText = current.text();
        glitchyTitles.push(current);
    });

    glitchyTitles.forEach(function (item) {
        console.log(item.originalText);
    });
    responsiveElements();

    if ($(window).width() < 790) {
        wideFilterSwapped = true;
        $(".visual-thumbnail-wide").each(wideShow);
    }
    changeTitle(titleDefault);
    typeResize();
    console.log("ready");
    console.log($(".visual-video-image"));
    $(".visual-video-image").on("load", function () {
        console.log($(this));
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

    $(".visual-video").bind("load", function () {
        //  $(this).parent().css("width", "100%");
    });

    if ($(window).width() < 790) {
        $(".visual-thumbnail-wide").hover(wideHide, wideShow);
    } else {
        $(".visual-thumbnail-wide").hover(wideShow, wideHide);
    }
    $(window).resize(responsiveElements);
    //$(".visual-video-image").bind("load", function () { console.log("ready"); $(this).css("opacity", "1.0"); });

    //$(".visual-video-image").bind("load", function () { console.log("ready"); $(this).css("opacity", "1.0"); });

}
