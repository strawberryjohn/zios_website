// Animated ASCII mountain (Home, Über Zios panel background).
// Redraws the Figma "ascii-art 1" layer (1440x439, bottom of the blue panel)
// on two canvases: faint vertical light pillars per column (static) and the
// glyphs on top: a bright snow band along the ridge in '@%#*+=' and blue
// ':'/'-' dots on the body. Glyphs slowly swap within their zone and a few
// twinkle like snow (quick rise, slow fade). The whole layer keeps Figma's
// look: plus-lighter blend at low opacity (set on .aboutUs_ascii).
// The grid was traced from the export: cell PWxPH, rows 'leadingSpaces:levels',
// levels 1-4 = body brightness, 5-9 = snow brightness.
// Lives in the Home page footer. Reduced motion: one still frame.
(function () {
  var host = document.querySelector('.aboutUs_ascii');
  if (!host || !window.HTMLCanvasElement) return;

  var IW = 1440, IH = 439, PW = 8.28, PH = 13.83, OX = 8.0, OY = 5.0;
  var GRID = '133:244315|130:518994433361|129:38999444444473111|127:14999999944444443232|125:13944999944444444444443211|123:549999494444444444444444444221111221|118:51154999994994444444444444444444433433442211 1|114:112999999999999494494444444444444444444444444432222111|112:1599499999949449444999444444444444444443444444444434432311|110:74499999999994499449994444444444444444344344444444444444442222|107:11994999999999944499449944444444844433434344444444444443444444444|105:5749999999999944944944944444444447944323323244344444444443444444444|97:1  51 749999999999944499999999444844444437333332223232244444444443433444444|96:2449494949999999944449999999944444444484333323322263232233444444443434444444|94:549999999999499999449499999994444444484633333323322223232232233444443444444444|92:18999999999999944444944348499444443744433233323223322222222232223223222433443444|90:1499999999944444444444443333333333733733323233222222322222222222233262222322332343|84:1123449999999944444444449494343333333332732732322222222222222222222232223222222322332333|83:14499999999944444494994444444333333333732332322222222223222222222222232223222222322232342|76:343 13499999944444444444994843444433263323232332322322222222223222222222222232263222222322333343|73:126444239999444444444449944444343444333232222222222322322222222222222222222222232223222222322333343|71:12344433389444444444449994444334344333233222222222222222222222222222222222222222222222222222322333343|68:12434944333434444444444444444373333343333232222222222222222222222222222222222222222222222222222322333333|64:222238944444433444434443444444333373333332222222222222222222222222222222222222222222222222223222222322333343|58:211122444444444433343444434443444433333333323232222222222222222222222322222222222222222222222222263222222322233343|51:1122222434334444443444433343433434443443333323232222222222222222222222222222222222222222222222222222232223262222222233332|48:1232334334444444443444344333333433434443333332222232222222222222222222222222322222222222222222222222222232222222222322232333|46:233444434334444343443444443433333433434332433222222222222222222222222222222222222222222222223222222222222232222222222222222233|42:1122494444444334444343444443443333343433434333322222222222223222222222222222222222222322222222222222222222222222222222222222222222|33:1111122222444444434444334344333443443443433333433333322223222222222222222222222222222222222222322222222222222222222222222222222222222222222|30:1122223344434434433434434334334333443443343333333333322222222222222222223222222222222222222222222222222222222222222222222222222222222222222222';
  var FONT = 11;
  var SNOW = '@%#*+=';
  var BODY = ':-';
  var BODY_ALPHA = [0, 0.5, 0.65, 0.8, 0.9];
  var SWAP_MS = 200, SWAP = 0.006, SPARK = 0.0012, SPARK_MS = 1800;

  var rows = GRID.split('|').map(function (row) {
    var p = row.split(':');
    return { pad: +p[0], line: p[1] };
  });

  var cells = [], tops = {};
  rows.forEach(function (row, r) {
    for (var c = 0; c < row.line.length; c++) {
      var lvl = row.line.charCodeAt(c) - 48;
      if (lvl < 1 || lvl > 9) continue;
      var col = row.pad + c;
      if (tops[col] === undefined) tops[col] = r;
      var snow = lvl >= 5;
      cells.push({
        x: OX + (col + 0.5) * PW,
        y: OY + (r + 0.5) * PH,
        set: snow ? SNOW : BODY,
        snow: snow,
        a: snow ? 0.85 + (lvl - 5) * 0.03 : BODY_ALPHA[lvl],
        ch: '', glow: 0, t0: 0
      });
    }
  });
  function pick(cell) { return cell.set[(Math.random() * cell.set.length) | 0]; }
  cells.forEach(function (c) { c.ch = pick(c); });

  function makeCanvas() {
    var c = document.createElement('canvas');
    c.setAttribute('aria-hidden', 'true');
    c.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;';
    host.appendChild(c);
    return c;
  }
  var pillarCanvas = makeCanvas(), glyphCanvas = makeCanvas();
  var pctx = pillarCanvas.getContext('2d'), ctx = glyphCanvas.getContext('2d');

  function fit(canvas, c2d) {
    var w = host.clientWidth, h = host.clientHeight;
    if (!w || !h) return false;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    var s = Math.max(w / IW, h / IH);
    c2d.setTransform(dpr * s, 0, 0, dpr * s, dpr * (w - IW * s) / 2, dpr * (h - IH * s));
    return true;
  }

  function drawPillars() {
    if (!fit(pillarCanvas, pctx)) return;
    var bw = PW * 0.42;
    Object.keys(tops).forEach(function (k) {
      var col = +k, x = OX + (col + 0.5) * PW, top = OY + tops[col] * PH;
      var g = pctx.createLinearGradient(0, top, 0, IH);
      g.addColorStop(0, 'rgba(123, 186, 255, 0.35)');
      g.addColorStop(0.3, 'rgba(79, 163, 255, 0.25)');
      g.addColorStop(1, 'rgba(35, 140, 255, 0.2)');
      pctx.fillStyle = g;
      pctx.beginPath(); // tapered tip, then the pillar down to the bottom
      pctx.moveTo(x, top - PH * 0.2);
      pctx.lineTo(x + bw / 2, top + PH * 0.2);
      pctx.lineTo(x + bw / 2, IH);
      pctx.lineTo(x - bw / 2, IH);
      pctx.lineTo(x - bw / 2, top + PH * 0.2);
      pctx.closePath();
      pctx.fill();
    });
    // Soft glow under the snow band, so it reads as one bright ridge.
    cells.forEach(function (c) {
      if (!c.snow) return;
      var g = pctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, PH * 1.1);
      g.addColorStop(0, 'rgba(252, 252, 252, 0.35)');
      g.addColorStop(1, 'rgba(252, 252, 252, 0)');
      pctx.fillStyle = g;
      pctx.fillRect(c.x - PH * 1.1, c.y - PH * 1.1, PH * 2.2, PH * 2.2);
    });
  }

  function paint(cell) {
    ctx.clearRect(cell.x - PW / 2, cell.y - PH / 2, PW, PH);
    ctx.globalAlpha = cell.a + (1 - cell.a) * cell.glow;
    ctx.fillStyle = cell.snow || cell.glow > 0.2 ? '#fcfcfc' : '#7bbaff';
    ctx.fillText(cell.ch, cell.x, cell.y);
  }
  function drawGlyphs() {
    if (!fit(glyphCanvas, ctx)) return;
    ctx.font = FONT + 'px ui-monospace, SFMono-Regular, Menlo, Consolas, "DejaVu Sans Mono", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (var i = 0; i < cells.length; i++) paint(cells[i]);
  }
  function drawAll() { drawPillars(); drawGlyphs(); }

  var twinkling = [];
  function batch(now) {
    var n = cells.length, i, cell;
    for (i = Math.max(1, Math.round(n * SWAP)); i > 0; i--) {
      cell = cells[(Math.random() * n) | 0];
      if (cell.t0) continue;
      cell.ch = pick(cell);
      paint(cell);
    }
    for (i = Math.max(1, Math.round(n * SPARK)); i > 0; i--) {
      cell = cells[(Math.random() * n) | 0];
      if (cell.t0) continue;
      cell.t0 = now;
      twinkling.push(cell);
    }
  }
  function twinkle(now) {
    twinkling = twinkling.filter(function (c) {
      var p = (now - c.t0) / SPARK_MS;
      if (p >= 1) { c.glow = 0; c.t0 = 0; paint(c); return false; }
      c.glow = p < 0.15 ? p / 0.15 : Math.pow(1 - (p - 0.15) / 0.85, 2);
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
