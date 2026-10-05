(function () {
var mob = window.matchMedia('(max-width: 767px)').matches;
var sec = document.querySelector('.hero_sec');
if (mob && sec) {
var bottom = sec.querySelector('.hero_bottom');
var wrap = document.querySelector('.hero_gsap_trigger_wr');
if (bottom && wrap) {
var box = document.createElement('div');
box.className = 'u-container hero_bottom_mob';
box.appendChild(bottom);
wrap.appendChild(box);
var fit = function () {
var p = document.querySelector('.partners_sec');
box.style.setProperty('--zp-h', (p ? p.offsetHeight : 0) + 'px');
};
fit();
window.addEventListener('load', fit);
window.addEventListener('resize', fit);
}
}
var n = 0, cfg = 0;
(function st() {
var S = window.ScrollTrigger;
if (S && !cfg) { S.config({ ignoreMobileResize: true }); cfg = 1; }
if (S && !mob) return;
var h = S && S.getAll().filter(function (t) { return t.trigger === sec && t.pin; })[0];
if (!h) { if (n++ < 200) setTimeout(st, 100); return; }
var tl = h.animation;
h.kill(true); // trigger first: killing the timeline first would leave the pin in place
if (tl) { tl.progress(0); tl.kill(); }
var L = function (k) { return sec.querySelector('.hero_layer.is-' + k); };
var all = ['1', '2', '3', '4', '5', 'ground'].map(L).filter(Boolean);
var top = [sec.querySelector('.hero_head'), sec.querySelector('.button-wr.is-hero')].filter(Boolean);
gsap.set(all.concat(top), { clearProps: 'transform,opacity,visibility' });
var lag = { 5: 0.5, 4: 0.35, 3: 0.25, 2: 0.15, ground: 0.15 };
var p = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: {
trigger: sec, start: 'top top', end: 'bottom top', scrub: true, invalidateOnRefresh: true } });
Object.keys(lag).forEach(function (k) {
if (L(k)) p.to(L(k), { y: function () { return sec.clientHeight * lag[k]; } }, 0);
});
S.refresh();
})();
})();