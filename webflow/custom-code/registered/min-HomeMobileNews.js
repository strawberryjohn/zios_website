(function () {
if (!window.matchMedia('(max-width: 991px)').matches) return;
window.addEventListener('load', function () {
var z = window.zMobSlider;
if (!z) return;
(function news(tries) {
var el = document.querySelector('.news_slider_component .swiper');
var ns = el && el.swiper;
if (!ns) { if (el && tries) setTimeout(function () { news(tries - 1); }, 300); return; }
var navEl = document.querySelector('.news_swiper_nav') || el;
if (!(ns.params.navigation && ns.params.navigation.nextEl)) {
var p = navEl.querySelector('.swiper-button.prev'), q = navEl.querySelector('.swiper-button.next');
if (p) p.addEventListener('click', function () { ns.slidePrev(); });
if (q) q.addEventListener('click', function () { ns.slideNext(); });
}
var b = z.bar('news_timer');
navEl.parentNode.insertBefore(b, navEl.nextSibling);
z.timer(ns, b.querySelector('.m-nav_fill'));
})(10);
});
})();