// What we do services: icons turn on row hover.
// Each icon SVG carries, on every path, the shape it has when the object is
// turned 25deg counter-clockwise round its vertical axis (data-t, computed
// offline from the drawing's own isometric camera: see
// webflow/assets/what-we-do/animated/make-animated.py). On the published page
// the <img> is swapped for the same SVG inline (identical at rest, so the
// Designer and the page match), and hovering a row morphs every path from d to
// data-t and back: 700ms on (.32,.72,0,1), reversible mid-way. The lift comes
// from wwd-services-hover.js. Mouse only; touch and reduced motion get nothing.
// Lives in the What we do page footer custom code.
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var NUM = /-?\d*\.?\d+(?:e-?\d+)?/g;

  // cubic-bezier(.32,.72,0,1)
  function ease(x) {
    var x1 = .32, y1 = .72, x2 = 0, y2 = 1, t = x;
    for (var i = 0; i < 8; i++) {
      var cx = 3 * x1 * t * (1 - t) * (1 - t) + 3 * x2 * t * t * (1 - t) + t * t * t - x;
      var dx = 3 * x1 * (1 - t) * (1 - 3 * t) + 3 * x2 * t * (2 - 3 * t) + 3 * t * t;
      if (Math.abs(cx) < 1e-5 || !dx) break;
      t = Math.min(1, Math.max(0, t - cx / dx));
    }
    return 3 * y1 * t * (1 - t) * (1 - t) + 3 * y2 * t * t * (1 - t) + t * t * t;
  }

  function prep(svg) {
    var parts = [];
    svg.querySelectorAll('path[data-t]').forEach(function (p) {
      var d = p.getAttribute('d'), a = d.match(NUM), b = p.getAttribute('data-t').match(NUM);
      if (!a || !b || a.length !== b.length) return;
      parts.push({ el: p, tpl: d.split(NUM), a: a.map(Number), b: b.map(Number) });
    });
    return parts;
  }

  function draw(parts, k) {
    parts.forEach(function (q) {
      var s = q.tpl[0];
      for (var i = 0; i < q.a.length; i++) s += (q.a[i] + (q.b[i] - q.a[i]) * k).toFixed(2) + q.tpl[i + 1];
      q.el.setAttribute('d', s);
    });
  }

  function setup(row, img) {
    fetch(img.currentSrc || img.src).then(function (r) { return r.ok ? r.text() : Promise.reject(); }).then(function (txt) {
      var holder = document.createElement('div');
      holder.innerHTML = txt;
      var svg = holder.querySelector('svg');
      if (!svg) return;
      svg.setAttribute('class', img.getAttribute('class'));
      svg.setAttribute('aria-hidden', 'true');
      svg.style.overflow = 'visible';
      img.replaceWith(svg);
      var parts = prep(svg), k = 0, from = 0, to = 0, t0 = 0, raf = 0;
      function step(now) {
        var x = Math.min(1, (now - t0) / 700);
        k = from + (to - from) * ease(x);
        draw(parts, k);
        raf = x < 1 ? requestAnimationFrame(step) : 0;
      }
      function go(target) {
        from = k; to = target; t0 = performance.now();
        if (!raf) raf = requestAnimationFrame(step);
      }
      row.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') go(1); });
      row.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse') go(0); });
    }).catch(function () {});
  }

  document.querySelectorAll('.wwdservices_row').forEach(function (row) {
    var img = row.querySelector('img.wwdservices_icon');
    if (img) setup(row, img);
  });
})();
