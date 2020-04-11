---
layout: post
title: 'RenderDoc + GMS2, now sorta doable.'
date: 2020-04-10 20:00:00+2
image: /assets/graph_image/og_renderdoc-gms2-kit.png
excerpt_separator:  <!--more-->
---
<div class="subsection">
If gamedev is your thing, you might welcome the fact that I wrote a tiny script that makes it _virtually_ painless to debug [GameMaker: Studio 2](https://www.yoyogames.com/gamemaker){:target="_blank"} projects in [RenderDoc](https://renderdoc.org/){:target="_blank"}.    

<!--more-->

A couple days ago, making this tool work with the GMS2 workflow came up in a Discord conversation. Due to the way the engine works, normally this would require building the release executable and some manual setup. This takes time and effort, which is obviously a problem. Thankfully, there's nothing a few lines of PowerShell can't solve!    

To an extent, at least.

Even if you're learning graphics programming solely in the GML realm, RenderDoc can still help you a bunch. And it's pretty easy to use, too! At SCS, I rely on it on a daily basis!

*[PowerShell]: Currently working as of April 2020.

## [Quick, click here to get to the repo!](https://github.com/Blokatt/renderdoc-gms2-kit){:target="_blank"}
</div>

<div class="subsection">
<h4 class="visual-title">&gt; Pics</h4>

[![](/assets/img/renderdoc-gms2-kit/preview0.png){: .center-image }](/assets/img/renderdoc-gms2-kit/preview0.png "It's alive!")

[![](/assets/img/renderdoc-gms2-kit/preview1.png){: .center-image }](/assets/img/renderdoc-gms2-kit/preview1.png "That's a lot of draw calls!")

</div>

{% include lightbox.html %}