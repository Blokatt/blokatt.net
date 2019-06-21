---
layout: page
title: Graphics
permalink: /gfx/
sidebar_link: true
sidebar_sort_order: 0
---
Here are some things I've made that somehow relate to computer graphics, generative art, creative coding or *whatever
you wanna call it*! My main focus has always been real-time rendering, so that's mostly what you'll find here!
<div markdown="0">
  <script>
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
    requestAnimationFrame(visualTitleUpdate);

    var $win = $(window);

    function typeResize() {
      var w = $(".content").width();
      $(".visual-title").css("font-size", (w * .035));
    }

    $win.on('resize', typeResize);

  </script>
  <p>
    <div class="dashed-border visual-thumbnail-wide" data-title="If it ain't broke, break it!">
      <div class="visual-thumbnail-wide-image right">
        <img src="\assets\visual_previews\thumbnail_bktglich.jpg">
        <div class="visual-thumbnail-wide-title right">
          bktGlitch
        </div>
      </div>      
      <div class="visual-thumbnail-wide-description right">
<div markdown="1">
## bktGlitch
_A glitch shader for GameMaker: Studio._
</div>
      </div>
<a href="/gfx/bktglitch/" class="div-link"></a>
    </div>
  </p>

<div markdown="0">
<div class="subsection">
    <div class="visual-title-wrapper">
      <h4 class="visual-title noauto">&gt;</h4>
    </div>
      <div class="visual-row">
        {% assign sorted = site.visuals | sort: 'date' | reverse %}
        {% assign lastYear = time.date | date: '%Y' %}
        {% for item in sorted %}
          {% assign curYear = item.date | date: '%Y' %}
          <!--
  {% if curYear != lastYear %}
  {% assign lastYear = curYear %}
  </p></div><h2>{{curYear}}</h2><hr style = "margin-top: 5px"><div class="visual-row"><p>
  {% endif %}!-->
          <div class="visual-section">
            <div class="visual-thumbnail" data-title="{{ item.title }}">
              <a href="{{ item.url }}">

                <div class="visual-video">
                  <video class="visual-video-image" playsinline muted loop preload="metadata"
                    poster="{{ item.thumbnail }}.png">
                    <source src="{{ item.thumbnail }}.webm" type="video/webm">
                    <source src="{{ item.thumbnail }}.mp4" type="video/mp4">
                    <source src="{{ item.thumbnail }}.ogv" type="video/ogg">
                  </video>
                  <img class="visual-video-image visual-video-static" src="{{ item.thumbnail }}.png">
                </div>
                <!--<  img src="{{ item.thumbnail }}">!-->
              </a>
            </div>
          </div>
        {% endfor %}
  </div>
  <hr style="margin-top: 10px; margin-bottom: 5px;">
  </div>

<div class="dashed-border visual-thumbnail-wide" data-title="Relatively decipherable.">
      <div class="visual-thumbnail-wide-image left">
        <img src="\assets\visual_previews\thumbnail_tweetcarts.png">
        <div class="visual-thumbnail-wide-title left">
          PICO-8 Tweetcarts
        </div>
      </div>
      <div class="visual-thumbnail-wide-description left">
<div markdown="1">
## PICO-8 Tweetcarts
_Various PICO-8 experiments that fit in a single tweet!_
</div>
      </div>
<a href="https://twitter.com/i/moments/900699332286050306" target="_blank" class="div-link"></a>  
    </div>