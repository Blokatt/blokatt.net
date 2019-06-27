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
  thumbnail="bktglitch.jpg"
  url="/gfx/bktglitch/"
  hover="If it ain't broke, break it!"
  description="
_A glitch shader for GameMaker: Studio._
  "
%} 
{% include wide-link.html  
  align="left"
  title="Convolution visualiser (WIP)"
  thumbnail="convolution.png"
  url="/gfx/convolution/"
  hover="No, not that Matrix."
  description="
_Hardware-accelerated convolution kernel visualiser with a shader exporter._
  "
%} 

</div>

<div markdown="0">
<div class="subsection">
    <div class="visual-title-wrapper">
      <h4 class="visual-title noauto">&gt; Loading stuff...</h4>
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
  target="_blank"
  title="PICO-8 Tweetcarts"
  thumbnail="tweetcarts.png"
  url="https://twitter.com/i/moments/900699332286050306/"
  hover="Relatively decipherable."
  description="
_Various PICO-8 experiments that fit in a single tweet!_
  "
%}

<script defer>
$(document).ready(function () {    
  requestAnimationFrame(visualTitleUpdate);
  var $win = $(window);
  $win.on('resize', typeResize);
});
</script>
