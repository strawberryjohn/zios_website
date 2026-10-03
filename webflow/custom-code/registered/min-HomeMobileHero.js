(function () {
if (window.matchMedia('(max-width: 767px)').matches) {
var bottom = document.querySelector('.hero_sec .hero_bottom');
var wrap = document.querySelector('.hero_gsap_trigger_wr');
if (bottom && wrap) {
var box = document.createElement('div');
box.className = 'u-container hero_bottom_mob';
box.appendChild(bottom);
wrap.appendChild(box);
}
}
var n = 0;
(function st() {
if (window.ScrollTrigger) ScrollTrigger.config({ ignoreMobileResize: true });
else if (n++ < 40) setTimeout(st, 100);
})();
})();