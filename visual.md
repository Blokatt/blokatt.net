---
layout: page
title: Graphics
sidebar_link: true
sidebar_sort_order: 0
---
Here are some things I've made that somehow relate to computer graphics, generative art, creative coding or *whatever you wanna call it*! My main focus has always been real-time rendering, so that's mostly what you'll find here!
<div markdown="0">
<script>
  var charsTyped = 0;
  var titleDefault = "";
  var titleCurrent = "Loading stuff...";
  var titleTo = titleCurrent;
  var typeClock = 0;
  var typeUnderscoreOpacity = 0.0;

  String.prototype.replaceAt = function (index, replacement) {
    return this.substr(0, index) + replacement + this.substr(index + replacement.length);
  }

  function randChar() {
    return String.fromCharCode(33 + Math.round(Math.random() * 93));
  }

  function visualTitleUpdate() {
    // * (titleTo == titleDefault || titleCurrent != titleTo)
    typeUnderscoreOpacity = (Math.sin(Date.now() * .02) * .5 + .5);
    if (Math.random() <= .15) {
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
  requestAnimationFrame(visualTitleUpdate);

  var $win = $(window);

  function typeResize() {
    var w = $(".content").width();
    $(".visual-title").css("font-size", (w * .03));
  }
  $(document).ready(function () {
    titleTo = titleDefault;
    typeResize();
  });
  $win.on('resize', typeResize);

</script>

<p>

<div class="visual-thumbnail-wide" onclick="location.href='https://blokatt.itch.io/bktglitch';" data-title="If it ain't broke, break it!">
  <div class="visual-thumbnail-wide-image">    
    <img src = "\assets\visual_previews\thumbnail_bktglich.jpg">    
    <div class="visual-thumbnail-wide-title">
    bktGlitch
    </div>
  </div>  
  <div class="visual-thumbnail-wide-description">  
<div markdown="1">
## bktGlitch
_A glitch shader for GameMaker: Studio._
</div>    
  </div>  
</div>


</p>

<div class="visual-title-wrapper">
  <hr style="margin-top: 5px; margin-bottom: 5px;">
  <h4 class="visual-title">&gt;</h4>
  <hr style="margin-top: 5px; margin-bottom: 10px;">
</div>
<div class="visual-row">
  {% assign sorted = site.visuals | sort: 'date' | reverse %}
  {% assign lastYear = time.date | date: '%Y' %}
  {% for item in sorted %}
  <p>  
  {% assign curYear = item.date | date: '%Y' %}
  <!--
  {% if curYear != lastYear %}
  {% assign lastYear = curYear %}
  </p></div><h2>{{curYear}}</h2><hr style = "margin-top: 5px"><div class="visual-row"><p>
  {% endif %}!-->
  <section class="visual-section">
    <div class="visual-thumbnail" data-title="{{ item.title }}">
      <a href="{{ item.url }}">

        <div class="visual-video">          
          <video class="visual-video-image" playsinline muted loop preload="metadata" poster="{{ item.thumbnail }}.png">
            <source src="{{ item.thumbnail }}.webm" type="video/webm">
            <source src="{{ item.thumbnail }}.mp4" type="video/mp4">            
            <source src="{{ item.thumbnail }}.ogv" type="video/ogg">
          </video>          
          <img class="visual-video-image" src="{{ item.thumbnail }}.png">
        </div>
        <!--<  img src="{{ item.thumbnail }}">!-->
      </a>
    </div>
  </section>
</p>

{% endfor %}

</div>

<script>
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


  $(".visual-thumbnail").hover(function () {
    titleTo = $(this).data('title');
    //$(this).css('filter','sepia(0%) hue-rotate(0deg) contrast(100%)');
    //$(this).css('filter','sepia(0%) hue-rotate(0deg) contrast(100%)');
  });


  $(".visual-thumbnail").mouseleave(function () {
    titleTo = titleDefault;
    //$(this).css('filter','sepia(0%) hue-rotate(0deg) contrast(100%)');
    //$(this).css('filter','sepia(0%) hue-rotate(0deg) contrast(100%)');
  });

  function hoverVideo(e) {
    $('video', this).get(0).play();
  }

  function hideVideo(e) {
    $('video', this).get(0).currentTime = 0;
    $('video', this).get(0).pause();
  }

  $(".visual-thumbnail-wide").hover( function() {
    $(this).children('.visual-thumbnail-wide-image')
      .css("width", "25%")
      .css("-webkit-filter", "url(#visual-duotone)")
      .css("filter", "url(#visual-duotone)")
      .css("-webkit-transition", "all 200ms ease-out")
      .css("border-width", "2px");
    $(this).children('.visual-thumbnail-wide-description').css("opacity", "1.0");
    $(this).children('.visual-thumbnail-wide-image').children('.visual-thumbnail-wide-title')
      .css("padding-right", "1000px")
      .css("opacity", "0.0");
    titleTo = $(this).data('title');
  }, function() {
    $(this).children('.visual-thumbnail-wide-image')
      .css("width", "100%")
      .css("-webkit-filter", "none")
      .css("filter", "none")    
      .css("-webkit-transition", "all 200ms ease-in")
      .css("border-width", "0px");    
    $(this).children('.visual-thumbnail-wide-description').css("opacity", "0.0");
    $(this).children('.visual-thumbnail-wide-image').children('.visual-thumbnail-wide-title')
      .css("padding-right", "16px")
      .css("opacity", "1.0");  
    titleTo = titleDefault;
  });
</script>

</div>