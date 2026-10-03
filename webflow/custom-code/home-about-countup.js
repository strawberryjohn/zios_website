// Über Zios (Home): the stat numbers (.aboutUs_item_num, published lowercased as .aboutus_item_num: "30+", "800+", "700+",
// "2.300+") count up from 0 to their value when they scroll into view, once.
// The target is read from the text, so editing the number in Webflow is
// enough; German thousands dots and the "+" are kept. Tabular digits keep the
// width steady while counting. Reduced motion: numbers stay as they are.
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !window.IntersectionObserver) return;
  var RE = /^(\D*)(\d{1,3}(?:\.\d{3})+|\d+)(\D*)$/;
  var DUR = 2000;
  var items = [];
  document.querySelectorAll('.aboutus_item_num, .aboutUs_item_num').forEach(function (el) {
    var m = el.textContent.trim().match(RE);
    if (!m) return;
    items.push({ el: el, pre: m[1], suf: m[3], to: parseInt(m[2].replace(/\./g, ''), 10), dotted: m[2].indexOf('.') > -1 });
  });
  if (!items.length) return;

  function fmt(it, v) {
    var s = String(v);
    return it.pre + (it.dotted ? s.replace(/\B(?=(\d{3})+(?!\d))/g, '.') : s) + it.suf;
  }
  function run(it) {
    var t0 = performance.now();
    (function tick(now) {
      var p = Math.min(1, (now - t0) / DUR), e = 1 - Math.pow(1 - p, 4);
      it.el.textContent = fmt(it, Math.round(it.to * e));
      if (p < 1) requestAnimationFrame(tick);
    })(t0);
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      io.unobserve(en.target);
      items.forEach(function (it) { if (it.el === en.target) run(it); });
    });
  }, { threshold: 0.3 });
  items.forEach(function (it) {
    it.el.style.fontVariantNumeric = 'tabular-nums';
    it.el.textContent = fmt(it, 0);
    io.observe(it.el);
  });
})();
