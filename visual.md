---
layout: page
title: Visual
sidebar_link: true
sidebar_sort_order: 0
---

<style>

.row {
    padding: 0;
    margin: 0;
    list-style: none;
    display: -webkit-box;
    display: -moz-box;
    display: -ms-flexbox;
    display: -webkit-flex;
    display: flex;
    -webkit-flex-flow: row;
    flex-wrap: wrap;
    flex-direction: row;
    justify-content: flex-start;
    align-items: stretch;     
}

section {
    display: flex;
    overflow: hidden;    
    padding: 5px;
    flex: 0 1 20%;
    
   }
img {    
height: 140px;
width: 140px;
object-fit: cover;
}

.visual-thumbnail {
  -moz-border-radius:10px;
  -webkit-border-radius:10px;
  border-radius:10px;
  overflow:hidden;
  border: 2px black solid;
}

.visual-video {
  width:100%;
  height:140px;
  overflow: hidden;
}

.visual-video video {
  /*object-fit: contain;*/
/*       object-fit: fill; */
  object-fit: cover;
  width:100%;
  height:100%;
}

video::-webkit-media-controls {
  display:none !important;
}

</style>


<div class="row"> 
{% assign sorted = (site.visuals | sort: 'date') | reverse %}
{% assign lastYear = time.date | date: '%Y' %}
{% for item in sorted %}

  
  <p>
  {% assign curYear = item.date | date: '%Y' %}
  {% if curYear != lastYear %}
    {% assign lastYear = curYear %}
</p>
</div>    
<h2>{{curYear}}</h2>
<hr style = "margin-top: 5px">
<div class="row"> 
<p>

  {% endif %}

  <section>
  <div class="visual-thumbnail">
  <a href="{{ item.url }}" alt="{{ item.title }}" >

  <div class="visual-video">
  <video muted loop preload="metadata"> <source src="{{ item.thumbnail }}" type="video/webm"></video>

  </div>
  <!--<  img src="{{ item.thumbnail }}">!-->
  </a>
  </div></section>  
  </p>

{% endfor %}

</div>


<script>
var figure = $(".visual-video").hover( hoverVideo, hideVideo );

function hoverVideo(e) {      
    $('video', this).get(0).play(); 
}

function hideVideo(e) {
    $('video', this).get(0).currentTime = 0; 
    $('video', this).get(0).pause(); 
}
</script>

This is the base Jekyll theme. You can find out more info about customizing your Jekyll theme, as well as basic Jekyll usage documentation at [jekyllrb.com](https://jekyllrb.com/)

You can find the source code for Minima at GitHub:
[jekyll][jekyll-organization] /
[minima](https://github.com/jekyll/minima)

You can find the source code for Jekyll at GitHub:
[jekyll][jekyll-organization] /
[jekyll](https://github.com/jekyll/jekyll)


[jekyll-organization]: https://github.com/jekyll
