// Über Zios panel (Home): code-drawn, animated ASCII mountain background.
// Replaces the static illustration. Drawn on two canvases inside
// .aboutUs_ascii, sized like the artwork was: full width up to 1920px
// (120rem), centred, sitting on the bottom of the blue panel.
//  - pillars: one faint vertical light column per glyph column, tapered tip
//    at the ridge, plus a soft glow under the snow band (static);
//  - glyphs: bright snow band along the ridge in '@%#*+=', blue ':-' dots on
//    the slopes. Kept subtle (about the strength of the original art).
// Motion, like the hero: a few glyphs swap symbol every tick, and cells
// twinkle like snow (bright glyph + glow, quick rise, slow fade); the ridge
// twinkles most. Grid traced from the Figma artwork 'ascii-art 1'
// (1440x439, cells PWxPH, rows 'leadingSpaces:levels', 1-4 body, 5-9 snow).
// Lives in the Home page footer. Reduced motion: one still frame.
(function () {
  // Webflow publishes class names lowercased.
  var host = document.querySelector('.aboutus_ascii, .aboutUs_ascii');
  if (!host || !window.HTMLCanvasElement) return;

  var IW = 1440, IH = 439, PW = 8.28, PH = 13.83, OX = 8.0, OY = 5.0;
  var MAX_W_REM = 120;
  var GRID = '133:244315|130:518994433361|129:38999444444473111|127:14999999944444443232|125:13944999944444444444443211|123:549999494444444444444444444221111221|118:51154999994994444444444444444444433433442211 1|114:112999999999999494494444444444444444444444444432222111|112:1599499999949449444999444444444444444443444444444434432311|110:74499999999994499449994444444444444444344344444444444444442222|107:11994999999999944499449944444444844433434344444444444443444444444|105:5749999999999944944944944444444447944323323244344444444443444444444|97:1  51 749999999999944499999999444844444437333332223232244444444443433444444|96:2449494949999999944449999999944444444484333323322263232233444444443434444444|94:549999999999499999449499999994444444484633333323322223232232233444443444444444|92:18999999999999944444944348499444443744433233323223322222222232223223222433443444|90:1499999999944444444444443333333333733733323233222222322222222222233262222322332343|84:1123449999999944444444449494343333333332732732322222222222222222222232223222222322332333|83:14499999999944444494994444444333333333732332322222222223222222222222232223222222322232342|76:343 13499999944444444444994843444433263323232332322322222222223222222222222232263222222322333343|73:126444239999444444444449944444343444333232222222222322322222222222222222222222232223222222322333343|71:12344433389444444444449994444334344333233222222222222222222222222222222222222222222222222222322333343|68:12434944333434444444444444444373333343333232222222222222222222222222222222222222222222222222222322333333|64:222238944444433444434443444444333373333332222222222222222222222222222222222222222222222222223222222322333343|58:211122444444444433343444434443444433333333323232222222222222222222222322222222222222222222222222263222222322233343|51:1122222434334444443444433343433434443443333323232222222222222222222222222222222222222222222222222222232223262222222233332|48:1232334334444444443444344333333433434443333332222232222222222222222222222222322222222222222222222222222232222222222322232333|46:233444434334444343443444443433333433434332433222222222222222222222222222222222222222222222223222222222222232222222222222222233|42:1122494444444334444343444443443333343433434333322222222222223222222222222222222222222322222222222222222222222222222222222222222222|33:1111122222444444434444334344333443443443433333433333322223222222222222222222222222222222222222322222222222222222222222222222222222222222222|30:1122223344434434433434434334334333443443343333333333322222222222222222223222222222222222222222222222222222222222222222222222222222222222222222';
  var FONT = 11;
  var SNOW = '@%#*+=', BODY = ':-';
  var BASE = 0.32;                 // overall strength of the resting art
  var BODY_ALPHA = [0, 0.45, 0.6, 0.75, 0.9];
  var TICK = 200;                  // ms between batches
  var SWAP = 0.006;                // share of glyphs that swap per batch
  var SNOW_SPARK = 0.006, BODY_SPARK = 0.0012, LIFE = 2000;

  var cells = [], snowCells = [], bodyCells = [], tops = {};
  GRID.split('|').forEach(function (row, r) {
    var p = row.split(':'), pad = +p[0], line = p[1];
    for (var c = 0; c < line.length; c++) {
      var lvl = line.charCodeAt(c) - 48;
      if (lvl < 1 || lvl > 9) continue;
      var col = pad + c, snow = lvl >= 5;
      if (tops[col] === undefined) tops[col] = r;
      var cell = {
        x: OX + (col + 0.5) * PW, y: OY + (r + 0.5) * PH,
        snow: snow, set: snow ? SNOW : BODY,
        a: BASE * (snow ? 0.85 + (lvl - 5) * 0.03 : BODY_ALPHA[lvl]),
        ch: '', glow: 0, t0: 0
      };
      cell.ch = pick(cell);
      cells.push(cell);
      (snow ? snowCells : bodyCells).push(cell);
    }
  });
  function pick(c) { return c.set[(Math.random() * c.set.length) | 0]; }

  function makeCanvas() {
    var el = document.createElement('canvas');
    el.setAttribute('aria-hidden', 'true');
    el.style.cssText = 'position:absolute;left:0;top:0;pointer-events:none;';
    host.appendChild(el);
    return el;
  }
  var pc = makeCanvas(), gc = makeCanvas();
  var pctx = pc.getContext('2d'), ctx = gc.getContext('2d');
  var dpr = 1, s = 1;

  function fit() {
    var hw = host.clientWidth, hh = host.clientHeight;
    if (!hw || !hh) return false;
    var rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
    var w = Math.min(hw, MAX_W_REM * rem), h = w * IH / IW;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    s = w / IW;
    [pc, gc].forEach(function (el) {
      el.style.width = w + 'px'; el.style.height = h + 'px';
      el.style.left = (hw - w) / 2 + 'px'; el.style.top = (hh - h) + 'px';
      el.width = Math.round(w * dpr); el.height = Math.round(h * dpr);
    });
    pctx.setTransform(dpr * s, 0, 0, dpr * s, 0, 0);
    ctx.setTransform(dpr * s, 0, 0, dpr * s, 0, 0);
    ctx.font = FONT + 'px ui-monospace, SFMono-Regular, Menlo, Consolas, "DejaVu Sans Mono", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    return true;
  }

  function drawPillars() {
    var bw = PW * 0.42;
    Object.keys(tops).forEach(function (k) {
      var col = +k, x = OX + (col + 0.5) * PW, top = OY + tops[col] * PH;
      var g = pctx.createLinearGradient(0, top, 0, IH);
      g.addColorStop(0, 'rgba(189, 221, 255,' + 0.45 * BASE + ')');
      g.addColorStop(0.3, 'rgba(123, 186, 255,' + 0.32 * BASE + ')');
      g.addColorStop(1, 'rgba(123, 186, 255,' + 0.22 * BASE + ')');
      pctx.fillStyle = g;
      pctx.beginPath();
      pctx.moveTo(x, top - PH * 0.3);
      pctx.lineTo(x + bw / 2, top + PH * 0.2);
      pctx.lineTo(x + bw / 2, IH);
      pctx.lineTo(x - bw / 2, IH);
      pctx.lineTo(x - bw / 2, top + PH * 0.2);
      pctx.closePath();
      pctx.fill();
    });
    snowCells.forEach(function (c) {
      var g = pctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, PH * 1.1);
      g.addColorStop(0, 'rgba(252, 252, 252,' + 0.35 * BASE + ')');
      g.addColorStop(1, 'rgba(252, 252, 252, 0)');
      pctx.fillStyle = g;
      pctx.fillRect(c.x - PH * 1.1, c.y - PH * 1.1, PH * 2.2, PH * 2.2);
    });
  }

  function drawCell(c) {
    if (c.glow > 0.01) {
      var g = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, PH);
      g.addColorStop(0, 'rgba(189, 221, 255,' + 0.45 * c.glow + ')');
      g.addColorStop(1, 'rgba(189, 221, 255, 0)');
      ctx.globalAlpha = 1;
      ctx.fillStyle = g;
      ctx.fillRect(c.x - PH, c.y - PH, PH * 2, PH * 2);
    }
    ctx.globalAlpha = c.a + (1 - c.a) * c.glow;
    ctx.fillStyle = c.snow || c.glow > 0.2 ? '#fcfcfc' : '#bdddff';
    ctx.fillText(c.ch, c.x, c.y);
  }
  function drawGlyphs() {
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, gc.width, gc.height); ctx.restore();
    for (var i = 0; i < cells.length; i++) drawCell(cells[i]);
  }
  function drawAll() {
    if (!fit()) return;
    drawPillars();
    drawGlyphs();
  }

  var live = [];
  function spawn(list, rate, now) {
    var n = Math.max(1, Math.round(list.length * rate));
    for (var i = 0; i < n; i++) {
      var c = list[(Math.random() * list.length) | 0];
      if (c.t0) continue;
      c.t0 = now; c.peak = c.snow ? 0.9 : 0.6;
      live.push(c);
    }
  }
  function batch(now) {
    var n = cells.length;
    for (var i = Math.max(1, Math.round(n * SWAP)); i > 0; i--) {
      var c = cells[(Math.random() * n) | 0];
      if (c.t0) continue;
      c.ch = pick(c);
    }
    spawn(snowCells, SNOW_SPARK, now);
    spawn(bodyCells, BODY_SPARK, now);
  }
  function step(now) {
    live = live.filter(function (c) {
      var p = (now - c.t0) / LIFE;
      if (p >= 1) { c.glow = 0; c.t0 = 0; return false; }
      c.glow = c.peak * (p < 0.15 ? p / 0.15 : Math.pow(1 - (p - 0.15) / 0.85, 2));
      if (p < 0.4 && Math.random() < 0.08) c.ch = pick(c);
      return true;
    });
    drawGlyphs(); // full redraw: cheap at this cell count, keeps glows clean
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
      if (now - last >= TICK) { last = now; batch(now); }
      step(now);
    }
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
})();
