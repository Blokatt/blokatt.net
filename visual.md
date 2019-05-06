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

@media only screen and (max-width: 600px) {
  section {
    display: flex;
    overflow: hidden;    
    padding: 5px;
    flex: 0 1 33%;    
  }
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

  
-webkit-transition: all 300ms cubic-bezier(0.345, 0, 0.245, 0.750); /* older webkit */
-webkit-transition: all 300ms cubic-bezier(0.345, -0.245, 0.245, 0.750); 
   -moz-transition: all 300ms cubic-bezier(0.345, -0.245, 0.245, 0.750); 
     -o-transition: all 300ms cubic-bezier(0.345, -0.245, 0.245, 0.750); 
        transition: all 300ms cubic-bezier(0.345, -0.245, 0.245, 0.750); /* custom */

-webkit-transition-timing-function: cubic-bezier(0.345, 0, 0.245, 0.750); /* older webkit */
-webkit-transition-timing-function: cubic-bezier(0.345, -0.245, 0.245, 0.750); 
   -moz-transition-timing-function: cubic-bezier(0.345, -0.245, 0.245, 0.750); 
     -o-transition-timing-function: cubic-bezier(0.345, -0.245, 0.245, 0.750); 
        transition-timing-function: cubic-bezier(0.345, -0.245, 0.245, 0.750); /* custom */

  outline-style: dashed;


  outline-color: rgba(100, 20, 255, 0.25);
  outline-width: 2px;
  outline-offset: 3px;
}

.visual-thumbnail:hover {  
-webkit-transition: all 100ms cubic-bezier(1.000, 0.005, 0.680, 1); /* older webkit */
-webkit-transition: all 100ms cubic-bezier(1.000, 0.005, 0.680, 1.005); 
   -moz-transition: all 100ms cubic-bezier(1.000, 0.005, 0.680, 1.005); 
     -o-transition: all 100ms cubic-bezier(1.000, 0.005, 0.680, 1.005); 
        transition: all 100ms cubic-bezier(1.000, 0.005, 0.680, 1.005); /* custom */

-webkit-transition-timing-function: cubic-bezier(1.000, 0.005, 0.680, 1); /* older webkit */
-webkit-transition-timing-function: cubic-bezier(1.000, 0.005, 0.680, 1.005); 
   -moz-transition-timing-function: cubic-bezier(1.000, 0.005, 0.680, 1.005); 
     -o-transition-timing-function: cubic-bezier(1.000, 0.005, 0.680, 1.005); 
        transition-timing-function: cubic-bezier(1.000, 0.005, 0.680, 1.005); /* custom */
        
    outline-color: rgba(100, 0, 155, 0.0);
  outline-width: 2px;
  outline-offset: -10px;  
}

.visual-video {
  width:100%;
  height:140px;
  overflow: hidden;
}

.visual-video video {
  /*object-fit: contain;*/
/*       object-fit: fill; */
  filter: sepia(100%) hue-rotate(220deg) contrast(100%);
  -webkit-transition: filter 0.3s; /* Safari */
  transition: filter 0.3s;
  transition-timing-function: ease-out;
  -webkit-transition-timing-function: ease-out;

  object-fit: cover;
  width:100%;
  height:100%;
}

.visual-video video:hover {
  filter: sepia(0%) hue-rotate(360deg) contrast(100%);
  -webkit-transition: filter 0.1s; /* Safari */
  transition: filter 0.1s;
}

video::-webkit-media-controls {
  display:none !important;
}

</style>

<h3>Experiments</h3>
<hr style = "margin-top: 5px; margin-bottom: 10px;">
<div class="row"> 
{% assign sorted = (site.visuals | sort: 'date') | reverse %}
{% assign lastYear = time.date | date: '%Y' %}
{% for item in sorted %}


<p>
  
{% assign curYear = item.date | date: '%Y' %}
<!--
{% if curYear != lastYear %}
{% assign lastYear = curYear %}
</p>
</div>    
<h2>{{curYear}}</h2>
<hr style = "margin-top: 5px">
<div class="row"> 
<p>
{% endif %}
!-->
  <section>
  <div class="visual-thumbnail">
  <a href="{{ item.url }}" title="{{ item.title }}" >

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

/*
$(".visual-video video").each(function(i, obj) {
  var fade = Math.pow(i * .5, 1.2);
  $(obj).css('filter', 'sepia(100%) hue-rotate(220deg) contrast(' + (100 + fade).toString() + '%) brightness(' + (Math.max(0, 100 - fade)).toString() + '%');
});

$(".visual-video video").hover(function() {
    $(this).css('filter','sepia(0%) hue-rotate(0deg) contrast(100%)');
});
*/

function hoverVideo(e) {      
    $('video', this).get(0).play(); 
}

function hideVideo(e) {
    $('video', this).get(0).currentTime = 0; 
    $('video', this).get(0).pause(); 
}
</script>