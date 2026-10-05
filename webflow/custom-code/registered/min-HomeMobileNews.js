(function () {
if (!window.matchMedia('(max-width: 991px)').matches) return;
window.addEventListener('load', function () {
var z = window.zMobSlider;
if (!z) return;
(function news(tries) {
var el = document.querySelector('.news_slider_component .swiper');
var ns = el && el.swiper;
if (!ns) { if (el && tries) setTimeout(function () { news(tries - 1); }, 300); return; }
var nav = z.bar('m-nav');
nav.insertAdjacentHTML('afterbegin', z.arrow('prev', 'Zurück'));
nav.insertAdjacentHTML('beforeend', z.arrow('next', 'Weiter'));
el.parentNode.appendChild(nav);
nav.querySelector('.is-prev').addEventListener('click', function () { ns.slidePrev(); });
nav.querySelector('.is-next').addEventListener('click', function () { if (ns.isEnd) ns.slideTo(0); else ns.slideNext(); });
z.timer(ns, nav.querySelector('.m-nav_fill'));
})(10);
});
})();