// Über Zios ASCII mountain (Home). Same look and motion as the hero's animated
// binary mountain (home-hero-ascii.js): symbols chosen by depth below the ridge
// ('1' ridges, ':' mid-slope, '0' foreground, '.'/':' faint edges), per-symbol
// opacity, slow swaps and snow-like twinkle, same symbol size and spacing.
// The shape is generated for this panel: overlapping peaks in three depth
// layers, each with a bright outline, a lit left face, a shaded right face, a
// bright spine down from the summit and gullies running down the slopes.
//  - low foothills on the left, so nothing sits behind "24/7 Monitoring"; the
//    range starts right after it and fills the right side;
//  - both ends fade out, and so does the bottom-right corner behind the
//    "Über Zios" link.
// Shape noise is seeded, so the mountain is the same on every load.
// Canvas inside .aboutUs_ascii: at most 1920px (120rem) wide, centred,
// bottom-aligned, never taller than 60% of the panel (then only the row
// spacing tightens). On narrow screens the symbols keep a minimum size and
// the right-hand peaks stay in view. Reduced motion gets a still frame.
(function () {
  // Webflow publishes class names lowercased.
  var host = document.querySelector('.aboutus_ascii, .aboutUs_ascii');
  if (!host || !window.HTMLCanvasElement) return;

  // Virtual drawing space, same units as the hero art (scaled to fit).
  var IW = 2514, CH = 19.66, NR = 42, IH = NR * CH;
  var PX = 16, FONT = 11;
  var MAX_W_REM = 120, MIN_SCALE = 0.4, MAX_H = 0.6; // max share of the panel height
  var ALPHA = [0, 0.24, 0.3, 0.38, 0.44, 0.5, 0.56, 0.62, 0.7];
  var KEEP = [0, 0.45, 0.7, 0.9, 1, 1, 1, 1, 1];
  var FAINT = { set: '.:', w: [0.55, 1] };
  var DEPTH = [
    { max: 2, set: '1:', w: [0.8, 1] },
    { max: 7, set: ':1', w: [0.55, 1] },
    { max: 12, set: '0:1', w: [0.45, 0.75, 1] },
    { max: 99, set: '01:', w: [0.82, 0.92, 1] }
  ];
  var SWAP_MS = 180, SWAP = 0.004, SPARK = 0.0008, SPARK_MS = 1800;

  // Seeded random + smooth value noise for the shape.
  var seed = 7;
  function rnd() {
    seed = (seed + 0x6d2b79f5) | 0;
    var t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
  var LATTICE = [];
  for (var i = 0; i < 512; i++) LATTICE.push(rnd());
  function noise(v) {
    var i0 = Math.floor(v), f = v - i0, a = LATTICE[i0 & 511], b = LATTICE[(i0 + 1) & 511];
    return a + (b - a) * f * f * (3 - 2 * f);
  }
  function fbm(v) { return noise(v) * 0.6 + noise(v * 2.3 + 17) * 0.28 + noise(v * 5.1 + 41) * 0.12; }
  function smooth(a, b, v) { var t = Math.min(1, Math.max(0, (v - a) / (b - a))); return t * t * (3 - 2 * t); }

  // The range: overlapping peaks in three depth layers (0 = back). Each one
  // is a jagged cone: centre c, height h (rows), half-widths wl / wr (share
  // of the width). The front-most peak covering a spot decides how it's drawn.
  var PEAKS = [
    { c: 0.55, h: 28, wl: 0.2, wr: 0.15, z: 0 },
    { c: 0.79, h: 38, wl: 0.19, wr: 0.17, z: 0 },
    { c: 0.98, h: 31, wl: 0.13, wr: 0.12, z: 0 },
    { c: 0.42, h: 20, wl: 0.075, wr: 0.11, z: 1 },
    { c: 0.67, h: 24, wl: 0.12, wr: 0.11, z: 1 },
    { c: 0.9, h: 22, wl: 0.11, wr: 0.12, z: 1 },
    { c: 0.355, h: 11, wl: 0.035, wr: 0.06, z: 2 },
    { c: 0.58, h: 11, wl: 0.09, wr: 0.09, z: 2 }
  ];
  PEAKS.forEach(function (m, i) { m.k = i * 13.7; });

  // Silhouette height of peak m at u (0 outside it).
  function top(m, u) {
    var w = u < m.c ? m.wl : m.wr, t = 1 - Math.abs(u - m.c) / w;
    if (t <= 0) return 0;
    var jag = (fbm(u * 60 + m.k) - 0.5) * 3 + (noise(u * 160 + m.k) - 0.5) * 1.2;
    return Math.max(0, m.h * Math.pow(t, 1.25) + jag * Math.min(1, t * 3));
  }
  // Low foreground strip along the bottom, so the range has a base.
  function base(u) { return 1.5 + 2 * fbm(u * 12 + 3); }

  // Ends fade out instead of stopping at a hard edge; the bottom-right corner
  // fades too, so the "Über Zios" link sits on a quiet background.
  function fadeAt(u, y) {
    var dx = (1 - u) / 0.22, dy = y / (NR * 0.42);
    return smooth(0, 0.06, u) * smooth(1, 0.95, u) * (1 - 0.92 * Math.exp(-(dx * dx + dy * dy)));
  }

  function pick(z) {
    var r = Math.random();
    for (var i = 0; i < z.w.length; i++) if (r < z.w[i]) return z.set[i];
    return z.set[0];
  }
  function zoneFor(level, depth) {
    if (level <= 2) return FAINT;
    for (var i = 0; i < DEPTH.length; i++) if (depth <= DEPTH[i].max) return DEPTH[i];
    return DEPTH[DEPTH.length - 1];
  }

  var cells = [];
  for (var x = PX / 2; x < IW; x += PX) {
    var u = x / IW;
    var tops = PEAKS.map(function (m) { return top(m, u); });
    var sky = Math.max(base(u), Math.max.apply(null, tops));
    // Faint snow dust just above the outline.
    if (rnd() < 0.3) {
      var yd = sky + 0.6;
      cells.push(cell(x, NR - yd, 1 + (rnd() < 0.4 ? 1 : 0), 0, fadeAt(u, yd)));
    }
    for (var r = 0; r < NR; r++) {
      var y = NR - r - 0.5;
      if (y >= sky) continue;
      // Front-most peak covering this spot.
      var m = null, mt = 0;
      for (var i = 0; i < PEAKS.length; i++) {
        if (y < tops[i] && (!m || PEAKS[i].z > m.z)) { m = PEAKS[i]; mt = tops[i]; }
      }
      var lvl, d;
      if (!m) {
        d = base(u) - y;
        lvl = d < 1 ? 5 : 4;
      } else {
        d = mt - y;
        var w = u < m.c ? m.wl : m.wr;
        var side = (u - m.c) / w;
        // Lit left faces, shaded right faces, a bright spine down from the
        // summit, and gullies running down the slopes.
        lvl = u < m.c ? 5.6 : 3.6;
        if (Math.abs(u - m.c) * IW < PX * 1.2 && y > m.h * 0.35) lvl += 2;
        lvl += (noise((Math.abs(side) - y / m.h) * 14 + m.k) - 0.5) * 3.2;
        lvl -= Math.max(0, d - 6) * 0.06;
        if (d < 1.1) lvl = 7.5;
        else if (d < 2.2) lvl = Math.max(lvl, 5.5);
      }
      lvl = Math.round(Math.min(8, Math.max(1, lvl)));
      if (rnd() > KEEP[lvl]) continue;
      cells.push(cell(x, r + 0.5, lvl, d, fadeAt(u, y)));
    }
  }
  function cell(x, row, lvl, depth, fade) {
    var z = zoneFor(lvl, depth);
    var a = Math.min(0.8, ALPHA[lvl] * (0.75 + rnd() * 0.4)) * fade;
    return { x: x, y: row * CH, z: z, ch: pick(z), a: a, glow: 0, t0: 0, fade: fade };
  }
  cells = cells.filter(function (c) { return c.a > 0.01; });

  var canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  canvas.style.cssText = 'position:absolute;left:0;top:0;pointer-events:none;';
  host.appendChild(canvas);
  var ctx = canvas.getContext('2d');
  var sx = 1, sy = 1, ox = 0;

  function layout() {
    var hw = host.clientWidth, hh = host.clientHeight;
    if (!hw || !hh) return false;
    var rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
    var w = Math.min(hw, MAX_W_REM * rem);
    // Width always fills; if that would make the range too tall for the
    // panel, only the vertical spacing is tightened (symbols stay upright).
    sx = Math.max(w / IW, MIN_SCALE);
    sy = Math.min(sx, MAX_H * hh / IH);
    ox = w - IW * sx;
    var h = IH * sy;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    canvas.style.left = (hw - w) / 2 + 'px';
    canvas.style.top = (hh - h) + 'px';
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    // Right-aligned (ox): when the art is wider than the canvas, the left
    // foothills are what gets cropped.
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.font = (FONT * sy).toFixed(2) + 'px ui-monospace, SFMono-Regular, Menlo, Consolas, "DejaVu Sans Mono", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#ffffff';
    return true;
  }

  function paint(c) {
    var x = ox + c.x * sx, y = c.y * sy;
    ctx.clearRect(x - PX * sx / 2, y - CH * sy / 2, PX * sx, CH * sy);
    ctx.globalAlpha = c.a + (c.fade - c.a) * c.glow;
    ctx.fillText(c.ch, x, y);
  }

  function drawAll() {
    if (!layout()) return;
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
    for (var i = 0; i < cells.length; i++) paint(cells[i]);
  }

  var twinkling = [];
  function batch(now) {
    var n = cells.length, i, c;
    for (i = Math.max(1, Math.round(n * SWAP)); i > 0; i--) {
      c = cells[(Math.random() * n) | 0];
      if (c.t0) continue;
      c.ch = pick(c.z);
      paint(c);
    }
    for (i = Math.max(1, Math.round(n * SPARK)); i > 0; i--) {
      c = cells[(Math.random() * n) | 0];
      if (c.t0) continue;
      c.t0 = now;
      twinkling.push(c);
    }
  }

  // Twinkle envelope: rise over the first 15%, ease out over the rest.
  function twinkle(now) {
    twinkling = twinkling.filter(function (c) {
      var p = (now - c.t0) / SPARK_MS;
      if (p >= 1) { c.glow = 0; c.t0 = 0; paint(c); return false; }
      c.glow = 0.85 * (p < 0.15 ? p / 0.15 : Math.pow(1 - (p - 0.15) / 0.85, 2));
      paint(c);
      return true;
    });
  }

  drawAll();
  if (window.ResizeObserver) new ResizeObserver(drawAll).observe(host);
  else window.addEventListener('resize', drawAll);
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var visible = true, last = 0;
  if (window.IntersectionObserver) {
    new IntersectionObserver(function (e) { visible = e[0].isIntersecting; }).observe(host);
  }
  function loop(now) {
    if (visible && !document.hidden) {
      if (now - last >= SWAP_MS) { last = now; batch(now); }
      twinkle(now);
    }
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
})();
