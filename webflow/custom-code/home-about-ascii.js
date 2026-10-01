// Über Zios ASCII mountain (Home). Same look and motion as the hero's animated
// binary mountain (home-hero-ascii.js): symbols chosen by depth below the ridge
// ('1' ridges, ':' mid-slope, '0' foreground, '.'/':' faint edges), per-symbol
// opacity, slow swaps and snow-like twinkle, same symbol size and spacing.
// The shape is generated for this panel instead of traced from the hero art:
//  - low foothills on the left, so nothing sits behind "24/7 Monitoring";
//  - the range rises from about a third of the width and fills the right side;
//  - both ends fade out instead of being cut off.
// Shape noise is seeded, so the mountain is the same on every load.
// Canvas inside .aboutUs_ascii: at most 1920px (120rem) wide, centred,
// bottom-aligned, never taller than 60% of the panel. On narrow screens the
// symbols keep a minimum size and the right-hand peaks stay in view. Reduced motion gets a still frame.
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
  function peak(u, c, h, w) { var t = Math.max(0, 1 - Math.abs(u - c) / w); return h * Math.pow(t, 1.5); }

  // Ridge height in rows at horizontal position u (0..1).
  function height(u) {
    var rise = smooth(0.3, 0.64, u);
    var h = 2.5 + 2 * fbm(u * 9)
      + 21 * rise
      + rise * (peak(u, 0.47, 4, 0.05) + peak(u, 0.6, 9, 0.07) + peak(u, 0.7, 6, 0.05)
        + peak(u, 0.82, 13, 0.09) + peak(u, 0.93, 8, 0.07))
      + (fbm(u * 30 + 5) - 0.5) * (2 + 4 * rise)
      + Math.abs(noise(u * 90 + 3) - 0.5) * 2 * rise;
    return Math.min(NR - 1, Math.max(1, h));
  }
  // Ends fade out instead of stopping at a hard edge.
  function edgeFade(u) { return smooth(0, 0.08, u) * smooth(1, 0.9, u); }

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
    var u = x / IW, h = height(u), top = NR - h, fade = edgeFade(u);
    // Faces turned to the left catch the light, the others sit in shadow.
    var slope = (height(u + 0.004) - height(u - 0.004)) / 0.008;
    var light = Math.max(-1.5, Math.min(2, slope * 0.06));
    // Faint snow dust just above the ridge.
    if (rnd() < 0.35) {
      cells.push(cell(x, top - 0.5, 1 + (rnd() < 0.4 ? 1 : 0), 0, fade));
    }
    for (var r = Math.ceil(top); r < NR; r++) {
      var d = r - top;
      var lvl = d < 1.2 ? 7.5 : 6.2 - d * 0.08 + light * Math.max(0, 1 - d / 14);
      lvl += (noise(x * 0.02 + r * 0.7) - 0.5) * 3;
      lvl = Math.round(Math.min(8, Math.max(1, lvl)));
      if (rnd() > KEEP[lvl]) continue;
      cells.push(cell(x, r + 0.5, lvl, d, fade));
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

  function layout() {
    var hw = host.clientWidth, hh = host.clientHeight;
    if (!hw || !hh) return false;
    var rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
    var w = Math.min(hw, MAX_W_REM * rem);
    var s = Math.min(Math.max(w / IW, MIN_SCALE), MAX_H * hh / IH), h = IH * s;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    canvas.style.left = (hw - w) / 2 + 'px';
    canvas.style.top = (hh - h) + 'px';
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    // Right-aligned: when the art is wider than the canvas, the left foothills
    // are what gets cropped.
    ctx.setTransform(dpr * s, 0, 0, dpr * s, dpr * (w - IW * s), 0);
    ctx.font = FONT + 'px ui-monospace, SFMono-Regular, Menlo, Consolas, "DejaVu Sans Mono", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#ffffff';
    return true;
  }

  function paint(c) {
    ctx.clearRect(c.x - PX / 2, c.y - CH / 2, PX, CH);
    ctx.globalAlpha = c.a + (c.fade - c.a) * c.glow;
    ctx.fillText(c.ch, c.x, c.y);
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
