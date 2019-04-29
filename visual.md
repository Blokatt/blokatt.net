---
layout: page
title: Visual
sidebar_link: true
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
}

</style>


<div class="row"> 
{% for item in site.visuals %}
  
  <p>
  <section><div class="visual-thumbnail"><a href="{{ item.url }}"><img src="{{ item.thumbnail }}"></a></div></section> 
  <section><div class="visual-thumbnail"><a href="{{ item.url }}"><img src="{{ item.thumbnail }}"></a></div></section>  
  <section><div class="visual-thumbnail"><a href="{{ item.url }}"><img src="{{ item.thumbnail }}"></a></div></section>  
  <section><div class="visual-thumbnail"><a href="{{ item.url }}"><img src="{{ item.thumbnail }}"></a></div></section>  
  <section><div class="visual-thumbnail"><a href="{{ item.url }}"><img src="{{ item.thumbnail }}"></a></div></section>  
  <section><div class="visual-thumbnail"><a href="{{ item.url }}"><img src="{{ item.thumbnail }}"></a></div></section>  
  </p>


{% endfor %}

</div>

<div class="row"> 
  <section><div class="visual-thumbnail"><a href=""><img src="https://loremflickr.com/145/145/"></a></div></section>
  <section><div class="visual-thumbnail"><a href=""><img src="https://loremflickr.com/256/145/"></a></div></section>
  <section><div class="visual-thumbnail"><a href=""><img src="https://loremflickr.com/145/145/"></a></div></section>
  <section><div class="visual-thumbnail"><a href=""><img src="https://loremflickr.com/145/145/"></a></div></section>
  <section><div class="visual-thumbnail"><a href=""><img src="https://loremflickr.com/145/145/"></a></div></section>
  <section><div class="visual-thumbnail"><a href=""><img src="https://loremflickr.com/145/145/"></a></div></section>
  <section><div class="visual-thumbnail"><a href=""><img src="https://loremflickr.com/145/145/"></a></div></section>
  <section><div class="visual-thumbnail"><a href=""><img src="https://loremflickr.com/256/256/"></a></div></section>
  <section><div class="visual-thumbnail"><a href=""><img src="https://loremflickr.com/145/145/"></a></div></section>
  <section><div class="visual-thumbnail"><a href=""><img src="https://loremflickr.com/145/145/"></a></div></section>
  <section><div class="visual-thumbnail"><a href=""><img src="https://loremflickr.com/145/145/"></a></div></section>
  <section><div class="visual-thumbnail"><a href=""><img src="https://loremflickr.com/145/145/"></a></div></section>
  <section><div class="visual-thumbnail"><a href=""><img src="https://loremflickr.com/145/145/"></a></div></section>
  <section><div class="visual-thumbnail"><a href=""><img src="https://loremflickr.com/145/145/"></a></div></section>
</div>



This is the base Jekyll theme. You can find out more info about customizing your Jekyll theme, as well as basic Jekyll usage documentation at [jekyllrb.com](https://jekyllrb.com/)

You can find the source code for Minima at GitHub:
[jekyll][jekyll-organization] /
[minima](https://github.com/jekyll/minima)

You can find the source code for Jekyll at GitHub:
[jekyll][jekyll-organization] /
[jekyll](https://github.com/jekyll/jekyll)


[jekyll-organization]: https://github.com/jekyll
