---
layout: page
title: Graphics
permalink: /gfx/
sidebar_link: true
sidebar_sort_order: 0
---
<div class="subsection">
Here are some things I've made that somehow relate to computer graphics, generative art, creative coding or *whatever
you wanna call it*! My main focus has always been real-time rendering, so that's mostly what you'll find here!

{% include wide-link.html  
  title="bktGlitch"
  thumbnail="bktglich.jpg"
  url="/gfx/bktglitch/"
  hover="If it ain't broke, break it!"
  description="
_A glitch shader for GameMaker: Studio._
  "
%} 
</div>

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

{% include wide-link.html
  align="left"
  target="_blank"
  title="PICO-8 Tweetcarts"
  thumbnail="tweetcarts.png"
  url="https://twitter.com/i/moments/900699332286050306/"
  hover="Relatively decipherable."
  description="
_Various PICO-8 experiments that fit in a single tweet!_
  "
%}


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
