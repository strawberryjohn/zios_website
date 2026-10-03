(function () {
var mob = window.matchMedia('(max-width: 767px)').matches;
if (mob) {
var bottom = document.querySelector('.hero_sec .hero_bottom');
var wrap = document.querySelector('.hero_gsap_trigger_wr');
if (bottom && wrap) {
var box = document.createElement('div');
box.className = 'u-container hero_bottom_mob';
box.appendChild(bottom);
wrap.appendChild(box);
}
}
var n = 0, cfg = 0;
(function st() {
var S = window.ScrollTrigger;
if (S && !cfg) { S.config({ ignoreMobileResize: true }); cfg = 1; }
if (S && !mob) return;
var h = S && S.getAll().filter(function (t) {
return t.trigger && t.trigger.classList && t.trigger.classList.contains('hero_sec') && t.pin;
})[0];
if (h) { h.vars.end = '+=75%'; S.refresh(); }
else if (n++ < 200) setTimeout(st, 100);
})();
})();