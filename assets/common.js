var activeLink;
var activeLinkLetters;
$(document).ready(responsiveElements);
$(window).resize(responsiveElements);
function responsiveElements() {
    if ($(window).width() < 790) {
        activeLink = $('.page-title');
        $('.visual-full').attr('controls', '');
    } else {
        if (activeLinkLetters) {
            if (activeLinkLetters[0] == '>') activeLinkLetters = activeLinkLetters.slice(2, activeLinkLetters.length);
            activeLinkLetters = activeLinkLetters.join("");
            //alert(activeLinkLetters);
            $('.page-title').text(activeLinkLetters);
        }

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
function sidebarAnimation() {
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
    /*
    var hue = Math.sin(time / 3000) * 5;
    var valA = Math.sin(time / 1000) * .2 + 1;
    var valB = Math.cos(time / 1000) * .2 + 1;
    $('body').css('background-image', 'linear-gradient(to bottom, hsla(' + (258 + hue).toString() + ', 29%, ' + (49 * valA).toString() + '%, 1), hsla(' + (257 + hue).toString() + ', 29%, ' + (35 * valB).toString() + '%, 1)');
    */
    window.requestAnimationFrame(sidebarAnimation);
}
window.requestAnimationFrame(sidebarAnimation);

$('.container').bind('scroll', positionStripe);

function positionStripe() {
    var scrollAmount = - ($('.container').scrollTop()) * .1;
    console.log(scrollAmount);

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
    $('video', this).get(0).play();
}

function hideVideo(e) {
    $('video', this).get(0).currentTime = 0;
    $('video', this).get(0).pause();
}

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

if ($(window).width() < 790) {
    $(".visual-thumbnail-wide").hover(wideHide, wideShow);
} else {
    $(".visual-thumbnail-wide").hover(wideShow, wideHide);
}

$(document).ready(function () {
    if ($(window).width() < 790) {
        wideFilterSwapped = true;
        $(".visual-thumbnail-wide").each(wideShow);
    }
    changeTitle(titleDefault);
    typeResize();
});

