// Über Zios (Home): the stat numbers (.aboutUs_item_num, published lowercased as
// .aboutus_item_num: "30+", "800+", "700+", "2.300+") roll into place like an
// old mechanical counter when they scroll into view, once. Each digit is a
// strip of 0-9 that slides upwards to its target; the last digit spins the
// most, and the digits settle left to right. The target is read from the text,
// so editing the number in Webflow is enough; dots and "+" stay put. Screen
// readers get the plain value. Reduced motion: unchanged.
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !window.IntersectionObserver) return;
  var DUR = 1800, STAGGER = 150;
  var items = [];
  document.querySelectorAll('.aboutus_item_num, .aboutUs_item_num').forEach(function (el) {
    var txt = el.textContent.trim();
    if (!/\d/.test(txt)) return;
    var cs = getComputedStyle(el), lh = parseFloat(cs.lineHeight);
    if (isNaN(lh)) lh = parseFloat(cs.fontSize) * 1.2;
    el.setAttribute('aria-label', txt);
    el.textContent = '';
    el.style.fontVariantNumeric = 'tabular-nums';
    var k = 0, strips = [];
    txt.split('').forEach(function (ch) {
      var span = document.createElement('span');
      span.setAttribute('aria-hidden', 'true');
      if (!/\d/.test(ch)) { span.textContent = ch; el.appendChild(span); return; }
      span.style.cssText = 'display:inline-block;overflow:hidden;vertical-align:top;height:' + lh + 'px;line-height:' + lh + 'px';
      var strip = document.createElement('span');
      strip.style.cssText = 'display:block;will-change:transform';
      var n = ++k * 10 + +ch, s = ''; // later digits spin more
      for (var i = 0; i <= n; i++) s += '<span style="display:block">' + (i % 10) + '</span>';
      strip.innerHTML = s;
      span.appendChild(strip);
      el.appendChild(span);
      strips.push({ strip: strip, y: -n * lh });
    });
    items.push({ el: el, strips: strips });
  });
  if (!items.length) return;

  function run(it) {
    it.strips.forEach(function (s, i) {
      s.strip.style.transition = 'transform ' + (DUR + i * STAGGER) + 'ms cubic-bezier(.16,1,.3,1)';
      s.strip.style.transform = 'translateY(' + s.y + 'px)';
    });
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      io.unobserve(en.target);
      items.forEach(function (it) { if (it.el === en.target) requestAnimationFrame(function () { run(it); }); });
    });
  }, { threshold: 0.3 });
  items.forEach(function (it) { io.observe(it.el); });
})();
