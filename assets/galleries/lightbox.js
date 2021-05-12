if (window.lightbox === undefined) {
	window.lightbox = true;

	var mySwipeIt;

	'use strict'; var _extends = Object.assign || function (a) { for (var b, c = 1; c < arguments.length; c++)for (var d in b = arguments[c], b) Object.prototype.hasOwnProperty.call(b, d) && (a[d] = b[d]); return a }, SwipeListener = function (a, b) { if (a) { 'undefined' != typeof window && function () { function a(a, b) { b = b || { bubbles: !1, cancelable: !1, detail: void 0 }; var c = document.createEvent('CustomEvent'); return c.initCustomEvent(a, b.bubbles, b.cancelable, b.detail), c } return 'function' != typeof window.CustomEvent && void (a.prototype = window.Event.prototype, window.CustomEvent = a) }(); b || (b = {}), b = _extends({}, { minHorizontal: 10, minVertical: 10, deltaHorizontal: 3, deltaVertical: 5, preventScroll: !1, lockAxis: !0 }, b); var c = [], d = !1, e = function () { d = !0 }; a.addEventListener('mousedown', e); var f = function (a) { d = !1, h(a) }; a.addEventListener('mouseup', f); var g = function (a) { d && (a.changedTouches = [{ clientX: a.clientX, clientY: a.clientY }], i(a)) }; a.addEventListener('mousemove', g); var h = function (d) { var e = Math.abs, f = Math.max, g = Math.min; if (c.length) { for (var h = d instanceof TouchEvent, j = [], k = [], l = { top: !1, right: !1, bottom: !1, left: !1 }, m = 0; m < c.length; m++)j.push(c[m].x), k.push(c[m].y); var i = j[0], n = j[j.length - 1], o = k[0], p = k[k.length - 1], q = { x: [i, n], y: [o, p] }; if (1 < c.length) { var r = { detail: _extends({ touch: h }, q) }, s = new CustomEvent('swiperelease', r); a.dispatchEvent(s) } var t = j[0] - j[j.length - 1], u = 'none'; u = 0 < t ? 'left' : 'right'; var v, w = g.apply(Math, j), x = f.apply(Math, j); if (e(t) >= b.minHorizontal && ('left' == u ? (v = e(w - j[j.length - 1]), v <= b.deltaHorizontal && (l.left = !0)) : 'right' == u ? (v = e(x - j[j.length - 1]), v <= b.deltaHorizontal && (l.right = !0)) : void 0), t = k[0] - k[k.length - 1], u = 'none', u = 0 < t ? 'top' : 'bottom', w = g.apply(Math, k), x = f.apply(Math, k), e(t) >= b.minVertical && ('top' == u ? (v = e(w - k[k.length - 1]), v <= b.deltaVertical && (l.top = !0)) : 'bottom' == u ? (v = e(x - k[k.length - 1]), v <= b.deltaVertical && (l.bottom = !0)) : void 0), (c = [], l.top || l.right || l.bottom || l.left)) { b.lockAxis && ((l.left || l.right) && e(i - n) > e(o - p) ? l.top = l.bottom = !1 : (l.top || l.bottom) && e(i - n) < e(o - p) && (l.left = l.right = !1)); var y = { detail: _extends({ directions: l, touch: h }, q) }, z = new CustomEvent('swipe', y); a.dispatchEvent(z) } else { var A = new CustomEvent('swipecancel', { detail: _extends({ touch: h }, q) }); a.dispatchEvent(A) } } }, i = function (d) { b.preventScroll && d.preventDefault(); var e = d.changedTouches[0]; if (c.push({ x: e.clientX, y: e.clientY }), 1 < c.length) { var f = c[0].x, g = c[c.length - 1].x, h = c[0].y, i = c[c.length - 1].y, j = { detail: { x: [f, g], y: [h, i], touch: d instanceof TouchEvent } }, k = new CustomEvent('swiping', j); a.dispatchEvent(k) } }, j = !1; try { var k = Object.defineProperty({}, 'passive', { get: function () { j = { passive: !b.preventScroll } } }); window.addEventListener('testPassive', null, k), window.removeEventListener('testPassive', null, k) } catch (a) { } return a.addEventListener('touchmove', i, j), a.addEventListener('touchend', h), { off: function () { a.removeEventListener('touchmove', i, j), a.removeEventListener('touchend', h), a.removeEventListener('mousedown', e), a.removeEventListener('mouseup', f), a.removeEventListener('mousemove', g) } } } }; 'undefined' != typeof module && 'undefined' != typeof module.exports ? module.exports = SwipeListener : 'function' == typeof define && define.amd ? define([], function () { return SwipeListener }) : window.SwipeListener = SwipeListener;

	/*===========================
	Swipe-it v1.4.1
	An event listener for swiping gestures with vanilla js.
	https://github.com/tri613/swipe-it#readme
		
	@Create 2016/09/22
	@Update 2017/08/11
	@Author Trina Lu
	===========================*/

	/*
			"use strict"; var _slicedToArray = function () { function n(n, t) { var e = [], i = !0, o = !1, r = void 0; try { for (var u, c = n[Symbol.iterator](); !(i = (u = c.next()).done) && (e.push(u.value), !t || e.length !== t); i = !0); } catch (n) { o = !0, r = n } finally { try { !i && c.return && c.return() } finally { if (o) throw r } } return e } return function (t, e) { if (Array.isArray(t)) return t; if (Symbol.iterator in Object(t)) return n(t, e); throw new TypeError("Invalid attempt to destructure non-iterable instance") } }(); !function (n, t, e) { function i(n) { function e() { o("touchstart", m, w), o("touchmove", d, w), o("touchend", p, w), E.mouseEvent && o("mousedown", s, w) } function i() { y = !1, D = !1, A = !1, b = !1, a = !1 } function s(n) { a = this, y = n.clientX, D = n.clientY, o("mousemove", l, v), o("mouseup", h, v) } function l(n) { n.preventDefault(), y && D && (A = n.clientX, b = n.clientY) } function h(n) { r("mousemove", l, v), r("mouseup", h, v), p(n) } function m(n) { a = this, y = n.touches[0].clientX, D = n.touches[0].clientY } function d(n) { A = n.touches[0].clientX, b = n.touches[0].clientY } function p(n) { if (y && D && A && b) { var t = y - A, e = D - b, o = [t, e].map(Math.abs), r = _slicedToArray(o, 2), c = r[0], s = r[1], v = E.minDistance; if (c > v) { var f = y < A ? "swipeRight" : "swipeLeft"; u(f, a, { distance: t, start: y, end: A }) } if (s > v) { var l = D > b ? "swipeUp" : "swipeDown"; u(l, a, { distance: e, start: D, end: b }) } (c > v || s > v) && u("swipe", a) } i() } var E = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}, w = c(t.querySelectorAll(n)), y = void 0, D = void 0, A = void 0, b = void 0; E.mouseEvent = void 0 === E.mouseEvent ? f.mouseEvent : E.mouseEvent, E.minDistance = void 0 === E.minDistance ? f.minDistance : E.minDistance, i(), e(), this.on = function (n, t) { return o(n, t, w), this } } function o(n, t, e) { s(e).forEach(function (e) { return e.addEventListener(n, t) }) } function r(n, t, e) { s(e).forEach(function (e) { return e.removeEventListener(n, t) }) } function u(n, e) { var i = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {}, o = t.createEvent("Event"); o.initEvent(n, !0, !0), o.swipe = i, s(e).forEach(function (n) { return n.dispatchEvent(o) }) } function c(n) { for (var t = [], e = 0; e < n.length; e++)t.push(n[e]); return t } function s(n) { return Array.isArray(n) ? n : [n] } var a = !1, v = [n], f = { mouseEvent: !0, minDistance: 30 }; n[e] = i }(window, document, "SwipeIt");
	*/
	var swipeListener;
	function initSwipe() {
		if (window.swipeListener) {
			swipeListener.off();
		}
		var container = document.querySelector('.lightbox');
		swipeListener = SwipeListener(container);
		container.addEventListener('swipe', function (e) {
			var directions = e.detail.directions;
			var x = e.detail.x;
			var y = e.detail.y;

			if (directions.left) {
				console.log('Swiped left.');
				if ($('.lightbox').length > 0) {
					$("#next").click();
				}
			}

			if (directions.right) {
				console.log('Swiped right.');
				if ($('.lightbox').length > 0) {
					$("#prev").click();
				}
			}
		});


		/*
		if (!window.mySwipeIt) {
			mySwipeIt = new SwipeIt('body');
			mySwipeIt.on('swipeLeft', function (e) {
				//check if lightbox is present
				if ($('.lightbox').length > 0) {
					$("#next").click();
				}
			}).on('swipeRight', function (e) {
				//check if lightbox is present
				if ($('.lightbox').length > 0) {
					$("#prev").click();
				}
			});
		}
		*/
	}


	function is_youtubelink(url) {
		var p = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
		return (url.match(p)) ? RegExp.$1 : false;
	}
	function is_imagelink(url) {
		var p = /([a-z\-_0-9\/\:\.]*\.(jpg|jpeg|png|gif))/i;
		return (url.match(p)) ? true : false;
	}
	function is_vimeolink(url, el) {
		var id = false;
		$.ajax({
			url: 'https://vimeo.com/api/oembed.json?url=' + url,
			async: true,
			success: function (response) {
				if (response.video_id) {
					id = response.video_id;
					$(el).addClass('lightbox-vimeo').attr('data-id', id);
				}
			}
		});
	}

	$(document).ready(function () {
		//add classes to links to be able to initiate lightboxes
		$("a").each(function () {
			var url = $(this).attr('href');
			if (url) {
				if (url.indexOf('vimeo') !== -1 && !$(this).hasClass('no-lightbox')) is_vimeolink(url, $(this));
				if (is_youtubelink(url) && !$(this).hasClass('no-lightbox')) $(this).addClass('lightbox-youtube').attr('data-id', is_youtubelink(url));
				if (is_imagelink(url) && !$(this).hasClass('no-lightbox')) {
					$(this).addClass('lightbox-image');
					var href = $(this).attr('href');
					var filename = href.split('/').pop();
					var split = filename.split(".");
					var name = split[0];
					/*				
					$(this).attr('title',name);
					*/
					if ($(this).attr('title') == "") {
						$(this).attr('title', "");
					}

				}
			}
		});
		//remove the clicked lightbox
		$("body").on("click", ".lightbox", function (event) {
			if ($(this).hasClass('gallery')) {

				$(this).remove();

				if ($(event.target).attr('id') == 'next') {
					//next item
					if ($("a.gallery.current").nextAll("a.gallery:first").length) $("a.gallery.current").nextAll("a.gallery:first").click();
					else $("a.gallery.current").parent().find("a.gallery").first().click();
				}
				else if ($(event.target).attr('id') == 'prev') {
					//prev item
					if ($("a.gallery.current").prevAll("a.gallery:first").length) $("a.gallery.current").prevAll("a.gallery:first").click();
					else $("a.gallery.current").parent().find("a.gallery").last().click();
				}
				else {
					$("a.gallery").removeClass('gallery');
				}
			}
			else $(this).remove();
		});
		//prevent image from being draggable (for swipe)
		$("body").on('dragstart', ".lightbox img", function (event) { event.preventDefault(); });
		//add the youtube lightbox on click
		$("a.lightbox-youtube").click(function (event) {
			event.preventDefault();
			$('<div class="lightbox"><a id="close"></a><a id="next">&rsaquo;</a><a id="prev">&lsaquo;</a><div class="videoWrapperContainer"><div class="videoWrapper"><iframe src="https://www.youtube.com/embed/' + $(this).attr('data-id') + '?autoplay=1&showinfo=0&rel=0"></iframe></div></div></div>').appendTo('body');
			initSwipe();
		});
		//add the image lightbox on click
		$("a.lightbox-image").click(function (event) {
			event.preventDefault();
			$('<div class="lightbox"><a id="close"></a><a id="next">&rsaquo;</a><a id="prev">&lsaquo;</a><div class="img" style="background: url(' + $(this).attr('href').replace(/ /g, "%20") + ') center center / contain no-repeat;" title="' + $(this).attr('title') + '" ><img src="' + $(this).attr('href') + '" alt="' + $(this).attr('title') + '" /></div><span>' + $(this).attr('title') + '</span></div>').appendTo('body');
			initSwipe();
		});
		//add the vimeo lightbox on click
		$("body").on("click", "a.lightbox-vimeo", function (event) {
			event.preventDefault();
			$('<div class="lightbox"><a id="close"></a><a id="next">&rsaquo;</a><a id="prev">&lsaquo;</a><div class="videoWrapperContainer"><div class="videoWrapper"><iframe src="https://player.vimeo.com/video/' + $(this).attr('data-id') + '/?autoplay=1&byline=0&title=0&portrait=0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe></div></div></div>').appendTo('body');
			initSwipe();
		});

		$("body").on("click", "a[class*='lightbox-']", function () {
			var link_elements = $(this).parent().find("a[class*='lightbox-']");
			$(link_elements).removeClass('current');
			for (var i = 0; i < link_elements.length; i++) {
				if ($(this).attr('href') == $(link_elements[i]).attr('href')) {
					$(link_elements[i]).addClass('current');
				}
			}
			if (link_elements.length > 1) {
				$('.lightbox').addClass('gallery');
				$(link_elements).addClass('gallery');
			}
		});


	});

	$(document).keydown(function (e) {
		switch (e.which) {
			case 37: // left
				$("#prev").click();
				break;
			case 39: // right
				$("#next").click();
				break;
			case 27: // esc
				$("#close").click();
				break;
			default: return; // exit this handler for other keys
		}
		e.preventDefault(); // prevent the default action (scroll / move caret)
	});
}