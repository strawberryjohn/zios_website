(function () {
var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function bar(cls) {
var d = document.createElement('div');
d.className = cls;
d.innerHTML = '<div class="m-nav_bar"><div class="m-nav_fill"></div></div>';
return d;
}
function arrow(dir, label) {
return '<button type="button" class="m-nav_btn is-' + dir + '" aria-label="' + label +
'"><svg viewBox="0 0 32 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2 8h27M23 2l6 6-6 6"/></svg></button>';
}
function timer(sw, fill) {
if (reduce) { fill.style.width = '100%'; return; }
var t0 = performance.now(), held = 0, seen = 1;
sw.on('slideChange', function () { t0 = performance.now(); });
sw.on('touchStart', function () { held = 1; });
sw.on('touchEnd', function () { held = 0; });
new IntersectionObserver(function (e) { seen = e[0].isIntersecting; }).observe(sw.el);
(function tick(now) {
if (held || !seen) t0 = now;
var p = Math.min(1, (now - t0) / 6000);
fill.style.width = p * 100 + '%';
if (p >= 1) { t0 = now; if (sw.isEnd) sw.slideTo(0); else sw.slideNext(); }
requestAnimationFrame(tick);
})(performance.now());
}
window.zMobSlider = { bar: bar, arrow: arrow, timer: timer };
})();