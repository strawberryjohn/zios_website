// Über Zios panel (Home): brings the static ASCII mountain image to life.
// The image (.aboutUs_ascii background, 1440x439, bottom-centred, max 1920px
// wide) stays as the base. On top, a canvas matched to the image's box makes
// individual cells twinkle: a glyph fades in bright over the art, flickers
// through a few symbols and fades out slowly (snow catching light), with a
// soft glow. The bright snow band along the ridge twinkles most; the dotted
// body only now and then. Cell grid traced from the same artwork (PWxPH cells,
// rows 'leadingSpaces:levels', 1-4 body, 5-9 snow).
// Lives in the Home page footer. Reduced motion: no canvas, image only.
(function () {
  // Webflow publishes class names lowercased.
  var host = document.querySelector('.aboutus_ascii, .aboutUs_ascii');
  if (!host || !window.HTMLCanvasElement) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var IW = 1440, IH = 439, PW = 8.28, PH = 13.83, OX = 8.0, OY = 5.0;
  var MAX_W_REM = 120; // matches background-size: min(100%, 120rem)
  var GRID = '133:244315|130:518994433361|129:38999444444473111|127:14999999944444443232|125:13944999944444444444443211|123:549999494444444444444444444221111221|118:51154999994994444444444444444444433433442211 1|114:112999999999999494494444444444444444444444444432222111|112:1599499999949449444999444444444444444443444444444434432311|110:74499999999994499449994444444444444444344344444444444444442222|107:11994999999999944499449944444444844433434344444444444443444444444|105:5749999999999944944944944444444447944323323244344444444443444444444|97:1  51 749999999999944499999999444844444437333332223232244444444443433444444|96:2449494949999999944449999999944444444484333323322263232233444444443434444444|94:549999999999499999449499999994444444484633333323322223232232233444443444444444|92:18999999999999944444944348499444443744433233323223322222222232223223222433443444|90:1499999999944444444444443333333333733733323233222222322222222222233262222322332343|84:1123449999999944444444449494343333333332732732322222222222222222222232223222222322332333|83:14499999999944444494994444444333333333732332322222222223222222222222232223222222322232342|76:343 13499999944444444444994843444433263323232332322322222222223222222222222232263222222322333343|73:126444239999444444444449944444343444333232222222222322322222222222222222222222232223222222322333343|71:12344433389444444444449994444334344333233222222222222222222222222222222222222222222222222222322333343|68:12434944333434444444444444444373333343333232222222222222222222222222222222222222222222222222222322333333|64:222238944444433444434443444444333373333332222222222222222222222222222222222222222222222222223222222322333343|58:211122444444444433343444434443444433333333323232222222222222222222222322222222222222222222222222263222222322233343|51:1122222434334444443444433343433434443443333323232222222222222222222222222222222222222222222222222222232223262222222233332|48:1232334334444444443444344333333433434443333332222232222222222222222222222222322222222222222222222222222232222222222322232333|46:233444434334444343443444443433333433434332433222222222222222222222222222222222222222222222223222222222222232222222222222222233|42:1122494444444334444343444443443333343433434333322222222222223222222222222222222222222322222222222222222222222222222222222222222222|33:1111122222444444434444334344333443443443433333433333322223222222222222222222222222222222222222322222222222222222222222222222222222222222222|30:1122223344434434433434434334334333443443343333333333322222222222222222223222222222222222222222222222222222222222222222222222222222222222222222';
  var FONT = 11;
  var SNOW = '@%#*+=', BODY = ':-+';
  var TICK = 200;        // ms between spawn batches
  var SNOW_RATE = 0.006; // share of snow cells starting a twinkle per batch
  var BODY_RATE = 0.0012;
  var LIFE = 2000;       // twinkle duration (quick rise, slow fade)

  var snow = [], body = [];
  GRID.split('|').forEach(function (row, r) {
    var p = row.split(':'), pad = +p[0], line = p[1];
    for (var c = 0; c < line.length; c++) {
      var lvl = line.charCodeAt(c) - 48;
      if (lvl < 1 || lvl > 9) continue;
      var cell = { x: OX + (pad + c + 0.5) * PW, y: OY + (r + 0.5) * PH, t0: 0, ch: '' };
      (lvl >= 5 ? snow : body).push(cell);
    }
  });

  var canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  canvas.style.cssText = 'position:absolute;left:0;top:0;pointer-events:none;';
  host.appendChild(canvas);
  var ctx = canvas.getContext('2d'), dpr = 1, s = 1;

  // Size the canvas to the image's rendered box.
  function layout() {
    var hw = host.clientWidth, hh = host.clientHeight;
    if (!hw || !hh) return;
    var rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
    var w = Math.min(hw, MAX_W_REM * rem), h = w * IH / IW;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    s = w / IW;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    canvas.style.left = (hw - w) / 2 + 'px';
    canvas.style.top = (hh - h) + 'px';
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
  }

  var live = [];
  function spawn(list, rate, set, now) {
    var n = Math.max(1, Math.round(list.length * rate));
    for (var i = 0; i < n; i++) {
      var c = list[(Math.random() * list.length) | 0];
      if (c.t0) continue;
      c.t0 = now; c.set = set; c.ch = set[(Math.random() * set.length) | 0];
      c.peak = set === SNOW ? 0.9 : 0.55;
      live.push(c);
    }
  }

  function frame(now) {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.setTransform(dpr * s, 0, 0, dpr * s, 0, 0);
    ctx.font = FONT + 'px ui-monospace, SFMono-Regular, Menlo, Consolas, "DejaVu Sans Mono", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    live = live.filter(function (c) {
      var p = (now - c.t0) / LIFE;
      if (p >= 1) { c.t0 = 0; return false; }
      var a = c.peak * (p < 0.15 ? p / 0.15 : Math.pow(1 - (p - 0.15) / 0.85, 2));
      if (p < 0.4 && Math.random() < 0.08) c.ch = c.set[(Math.random() * c.set.length) | 0];
      var g = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, PH);
      g.addColorStop(0, 'rgba(189, 221, 255,' + (a * 0.45) + ')');
      g.addColorStop(1, 'rgba(189, 221, 255, 0)');
      ctx.globalAlpha = 1;
      ctx.fillStyle = g;
      ctx.fillRect(c.x - PH, c.y - PH, PH * 2, PH * 2);
      ctx.globalAlpha = a;
      ctx.fillStyle = '#fcfcfc';
      ctx.fillText(c.ch, c.x, c.y);
      return true;
    });
  }

  layout();
  if (window.ResizeObserver) new ResizeObserver(layout).observe(host);
  else window.addEventListener('resize', layout);

  var visible = true, last = 0;
  if (window.IntersectionObserver) {
    new IntersectionObserver(function (e) { visible = e[0].isIntersecting; }).observe(host);
  }
  function loop(now) {
    if (visible && !document.hidden) {
      if (now - last >= TICK) { last = now; spawn(snow, SNOW_RATE, SNOW, now); spawn(body, BODY_RATE, BODY, now); }
      frame(now);
    }
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
})();
