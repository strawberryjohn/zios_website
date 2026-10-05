// Über Zios + footer blue panel ASCII mountain (Home). Mirror of the block
// deployed in the Home page footer custom code, which supersedes the older
// single-panel home-about-ascii.js. Symbols match the hero: - = * #.
(function () {
  if (!window.HTMLCanvasElement) return;
  var TARGETS = [
    { sel: '.aboutus_ascii, .aboutUs_ascii', maxH: 0.6, ends: true, corner: true },
    { sel: '.footer_action_visual_wr', maxH: 0.82, ends: false, corner: false }
  ];

  var IW = 1440, IH = 439, PW = 8.28, PH = 13.83, OX = 8.0, OY = 5.0;
  var GRID = '133:244315|130:518994433361|129:38999444444473111|127:14999999944444443232|125:13944999944444444444443211|123:549999494444444444444444444221111221|118:51154999994994444444444444444444433433442211 1|114:112999999999999494494444444444444444444444444432222111|112:1599499999949449444999444444444444444443444444444434432311|110:74499999999994499449994444444444444444344344444444444444442222|107:11994999999999944499449944444444844433434344444444444443444444444|105:5749999999999944944944944444444447944323323244344444444443444444444|97:1  51 749999999999944499999999444844444437333332223232244444444443433444444|96:2449494949999999944449999999944444444484333323322263232233444444443434444444|94:549999999999499999449499999994444444484633333323322223232232233444443444444444|92:18999999999999944444944348499444443744433233323223322222222232223223222433443444|90:1499999999944444444444443333333333733733323233222222322222222222233262222322332343|84:1123449999999944444444449494343333333332732732322222222222222222222232223222222322332333|83:14499999999944444494994444444333333333732332322222222223222222222222232223222222322232342|76:343 13499999944444444444994843444433263323232332322322222222223222222222222232263222222322333343|73:126444239999444444444449944444343444333232222222222322322222222222222222222222232223222222322333343|71:12344433389444444444449994444334344333233222222222222222222222222222222222222222222222222222322333343|68:12434944333434444444444444444373333343333232222222222222222222222222222222222222222222222222222322333333|64:222238944444433444434443444444333373333332222222222222222222222222222222222222222222222222223222222322333343|58:211122444444444433343444434443444433333333323232222222222222222222222322222222222222222222222222263222222322233343|51:1122222434334444443444433343433434443443333323232222222222222222222222222222222222222222222222222222232223262222222233332|48:1232334334444444443444344333333433434443333332222232222222222222222222222222322222222222222222222222222232222222222322232333|46:233444434334444343443444443433333433434332433222222222222222222222222222222222222222222222223222222222222232222222222222222233|42:1122494444444334444343444443443333343433434333322222222222223222222222222222222222222322222222222222222222222222222222222222222222|33:1111122222444444434444334344333443443443433333433333322223222222222222222222222222222222222222322222222222222222222222222222222222222222222|30:1122223344434434433434434334334333443443343333333333322222222222222222223222222222222222222222222222222222222222222222222222222222222222222222';
  var FONT = 7.5;
  var MAX_W_REM = 120, MIN_SCALE = 0.7;
  var LEVEL = [0, 1, 2, 2, 3, 6, 7, 7, 8, 8];
  var ALPHA = [0, 0.24, 0.3, 0.38, 0.44, 0.5, 0.56, 0.62, 0.7];
  var KEEP = [0, 0.5, 0.75, 0.9, 1, 1, 1, 1, 1];
  // Symbols by weight, light to heavy: - = * #  (was . : 1 0), same as the hero.
  var FAINT = { set: '-=', w: [0.55, 1] };
  var DEPTH = [
    { max: 2, set: '*=', w: [0.8, 1] },
    { max: 7, set: '=*', w: [0.55, 1] },
    { max: 12, set: '#=*', w: [0.45, 0.75, 1] },
    { max: 99, set: '#*=', w: [0.82, 0.92, 1] }
  ];
  var SWAP_MS = 180, SWAP = 0.004, SPARK = 0.0008, SPARK_MS = 1800;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function smooth(a, b, v) { var t = Math.min(1, Math.max(0, (v - a) / (b - a))); return t * t * (3 - 2 * t); }
  function fadeAt(cfg, x, y) {
    var u = x / IW, f = 1;
    if (cfg.ends) f *= smooth(0, 0.08, u) * smooth(1, 0.96, u);
    if (cfg.corner) {
      var dx = (1 - u) / 0.2, dy = (IH - y) / (IH * 0.45);
      f *= 1 - 0.85 * Math.exp(-(dx * dx + dy * dy));
    }
    return f;
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

  var rows = GRID.split('|').map(function (row) {
    var p = row.split(':');
    return { pad: +p[0], line: p[1] };
  });

  function buildCells(cfg) {
    var ridge = {}, cells = [];
    rows.forEach(function (row, r) {
      for (var c = 0; c < row.line.length; c++) {
        var t = row.line.charCodeAt(c) - 48;
        if (t < 1 || t > 9) continue;
        var col = row.pad + c, l = LEVEL[t];
        if (ridge[col] === undefined && l >= 3) ridge[col] = r;
        if (Math.random() > KEEP[l]) continue;
        var x = OX + (col + 0.5) * PW, y = OY + (r + 0.5) * PH, fade = fadeAt(cfg, x, y);
        var z = zoneFor(l, ridge[col] === undefined ? 0 : r - ridge[col]);
        var a = Math.min(0.8, ALPHA[l] * (0.75 + Math.random() * 0.4)) * fade;
        if (a > 0.01) cells.push({ x: x, y: y, z: z, ch: pick(z), a: a, fade: fade, glow: 0, t0: 0 });
      }
    });
    return cells;
  }

  function mount(host, cfg) {
    var cells = buildCells(cfg);
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
      sx = Math.max(w / IW, MIN_SCALE);
      sy = Math.min(sx, cfg.maxH * hh / IH);
      ox = w - IW * sx;
      var h = IH * sy;
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      canvas.style.left = (hw - w) / 2 + 'px';
      canvas.style.top = (hh - h) + 'px';
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.font = (FONT * sy).toFixed(2) + 'px ui-monospace, SFMono-Regular, Menlo, Consolas, "DejaVu Sans Mono", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#ffffff';
      return true;
    }

    function paint(c) {
      var x = ox + c.x * sx, y = c.y * sy;
      ctx.clearRect(x - PW * sx / 2, y - PH * sy / 2, PW * sx, PH * sy);
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
    if (reduceMotion) return;

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
  }

  TARGETS.forEach(function (cfg) {
    var host = document.querySelector(cfg.sel);
    if (host) mount(host, cfg);
  });
})();
