// Binary ASCII mountain for the blue gradient panels: Home Über Zios, What we
// do Reinvention (same .aboutUs_ascii host) and the global Footer's blue CTA
// panel. The outline is traced from the approved reference (1440x465): a long
// ridge climbing from the lower left to one peak at ~80% of the width, then a
// short steep fall on the right. Cells are 9.3x10.1 px; rows are
// 'leadingSpaces:levels', levels 1-8 = ink density in the reference.
// Only digits are drawn: faint cells get a dim '1', mid cells mostly '1',
// dense cells (ridge highlights, lower-left foot) mostly '0'. Light weight and
// low opacity keep it airy. Motion: now and then a digit flips, and a few
// digits briefly brighten (quick rise, slow fade). The hero uses the same
// digit mapping (home-hero-ascii.js) on its own outline.
// Each host gets a canvas: full width up to 1920px (120rem), bottom-aligned,
// at most maxH of the host height (then only the row spacing tightens). On
// narrow screens the left foothills crop so the peak stays in view. Reduced
// motion gets a still frame. Safe in page head or footer (waits for the DOM),
// and a host is only filled once.
(function () {
  if (!window.HTMLCanvasElement) return;
  var TARGETS = [
    // Über Zios / Reinvention: the bottom-right corner dims behind the link.
    { sel: '.aboutus_ascii, .aboutUs_ascii', maxH: 0.6, corner: true },
    { sel: '.footer_action_visual_wr', maxH: 0.82, corner: false }
  ];

  var IW = 1440, IH = 465, PW = 9.3, PH = 10.1, OX = -0.47, OY = -2.66, FIRST_ROW = 9;
  var GRID = '120:1341|120:56653|119:11876655|117:14 47667666|116:141542657666662|115:1114 73656656656652|114:45515676657666666663|114:256 57777677677677676311|112:3441 3766666766766766766761 1111|111:35333237537667666666666666664666721|105:1111213335314525776776676776766766766776421|103:311111111143115147776773 257767667667667767743331|101:3121111114113644116877682    376766766766776776776542|100:511111111511111124 778761        266766766776776776776|99:1121122115112 545  767731          15766766776776766766|97:111111111151115 54523167               155665666666666666|96:111111111111511 515562762                 1565666666666666|95:11511111111111 115 726775                    56666666666666|62:1                              51111111111111155553677677                      1255666666666|59:5 111      1                   5 1111111151111115 555667765                         14666566666|46:1         1551 11111111111              1  4121111111112115141516877861                            121  1577|42:21  73        5  51111111111111  22         4  114111111111511 4 42677651                                     35|41:245227732222   31232222222222222224421   2221 222222222222133333  17522|40:141111778774611111111111111111111111114333244311111111111113533333312|37:4441111167777313151111111111111111111111452221152111114111141364344411|35:41222111117727756662111111111111111111111155115 121111112115126373333|24:5          222222222722788288222222222222222222222525555 112222225225227746431|22:44554       11111111151111711111111111111111111111555515 5111111111151172727222|14:1     55 5555555  11111111555111111711111111111111111155555555 11111111115511373673333|12:51111 5  555555555111111111555111111111111111111111111115555551111111111155127677762222|10:55111111155555555 11111111115 111111111111111111111113311115 111111111111511167767776733|8:5555111155555555 1111111111155 111111111111111111111111222255 111111111111551172776776|6:555552255555555511111111112551511111111111111111111112257333333111112112225172737777776|2:225555555555555445223222222222454152222222222222222222223534522222225545733757721657267763|1:25555555555555531333133111111131311111111111111111111111134473443446588788878455267876785|0:35555555555555531434511311141313111111111111111111111142412857555555877878877844458758842|0:555555555555552115122111141212111111111111111111111355763567777777777777777733577777642';
  var FONT = 8.5;           // digit size (reference px)
  var WEIGHT = 300;
  var MAX_W_REM = 120, MIN_SCALE = 0.7;
  // Per level (1-8): share of cells kept, base opacity, chance of '0'.
  var KEEP = [0, 0.5, 0.75, 0.9, 1, 1, 1, 1, 1];
  var ALPHA = [0, 0.16, 0.2, 0.26, 0.32, 0.38, 0.44, 0.5, 0.56];
  var ZERO = [0, 0, 0.05, 0.15, 0.3, 0.45, 0.6, 0.7, 0.75];
  var SWAP_MS = 180, SWAP = 0.004, SPARK = 0.0008, SPARK_MS = 1800;

  function smooth(a, b, v) { var t = Math.min(1, Math.max(0, (v - a) / (b - a))); return t * t * (3 - 2 * t); }
  // The left end fades out; the right edge is cut by the panel.
  function fadeAt(cfg, x, y) {
    var u = x / IW, f = smooth(0, 0.06, u);
    if (cfg.corner) {
      var dx = (1 - u) / 0.2, dy = (IH - y) / (IH * 0.45);
      f *= 1 - 0.85 * Math.exp(-(dx * dx + dy * dy));
    }
    return f;
  }
  function pick(z) { return Math.random() < z ? '0' : '1'; }

  var rows = GRID.split('|').map(function (row) {
    var p = row.split(':');
    return { pad: +p[0], line: p[1] };
  });
  function buildCells(cfg) {
    var cells = [];
    rows.forEach(function (row, r) {
      for (var c = 0; c < row.line.length; c++) {
        var l = row.line.charCodeAt(c) - 48;
        if (l < 1 || l > 8 || Math.random() > KEEP[l]) continue;
        var x = OX + (row.pad + c + 0.5) * PW, y = OY + (FIRST_ROW + r + 0.5) * PH, fade = fadeAt(cfg, x, y);
        var a = ALPHA[l] * (0.8 + Math.random() * 0.35) * fade;
        if (a > 0.01) cells.push({ x: x, y: y, z: ZERO[l], ch: pick(ZERO[l]), a: a, fade: fade, glow: 0, t0: 0 });
      }
    });
    return cells;
  }

  function mount(host, cfg) {
    if (host.hasAttribute('data-ascii-mounted')) return;
    host.setAttribute('data-ascii-mounted', '');
    var cells = buildCells(cfg);
    var canvas = document.createElement('canvas');
    canvas.setAttribute('aria-hidden', 'true');
    canvas.style.cssText = 'position:absolute;left:0;top:0;pointer-events:none;';
    if (getComputedStyle(host).position === 'static') host.style.position = 'relative';
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
      ox = w - IW * sx; // right-aligned: on narrow screens the left foothills crop
      var h = IH * sy;
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      canvas.style.left = (hw - w) / 2 + 'px';
      canvas.style.top = (hh - h) + 'px';
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.font = WEIGHT + ' ' + (FONT * sy).toFixed(2) + 'px ui-monospace, SFMono-Regular, Menlo, Consolas, "DejaVu Sans Mono", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#ffffff';
      return true;
    }

    function paint(c) {
      var x = ox + c.x * sx, y = c.y * sy;
      ctx.clearRect(x - PW * sx / 2, y - PH * sy / 2, PW * sx, PH * sy);
      ctx.globalAlpha = c.a + (c.fade * 0.9 - c.a) * c.glow;
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
  }

  function init() {
    TARGETS.forEach(function (cfg) {
      Array.prototype.forEach.call(document.querySelectorAll(cfg.sel), function (host) { mount(host, cfg); });
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
