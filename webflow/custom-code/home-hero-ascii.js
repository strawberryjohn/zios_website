// Animated binary mountain (Home hero, layer 3).
// Replaces the static ascii-art image (.hero_layer.is-3) with a canvas that
// redraws the mountain as an airy grid of digits. The outline stays the hero's
// own (it has to match the parallax layers); the look is the same as the other
// blue panels (ascii-mountain.js): faint cells get a dim '1', mid cells mostly
// '1', dense cells mostly '0', light weight and low per-digit opacity.
// Motion is slow and calm: now and then a digit flips, and a few digits
// twinkle like snow (quick rise, slow fade).
// The density map was traced from the exported ascii image (2514x1469, cells
// 11.79x19.66; rows are 'leadingSpaces:levels', levels 1-8) and is resampled
// onto a wider lattice (PX x CH) for more air between digits.
// The canvas takes over the is-3 class so the hero parallax script moves it
// like the image. Must run before home-hero-parallax.js. Without JS the image
// stays; with reduced motion you get a still frame.
(function () {
  var img = document.querySelector('.hero_layer.is-3');
  if (!img || !window.HTMLCanvasElement) return;

  var FIRST_ROW = 20;
  var GRID = '166:131|164:1574221|163:55763232223|160:12768861232223321|159:6576876512321123222211|157:1658685552331333322222222|155:2576865822222223333322222222223|153:2687866565252632223333233322222222213225521|151:56787865768556522222333332223222222222252225523|146:588888858866765555862322222222222322222222222552555552523|142:25556888888765686556578522222222222222222222222222225522255222222|140:268558688888855666855876222222222268 122222222222222222255525222222222|136:2658555558888888556868655555522222225651    221222222222222222255522222225525|134:156655565558865656558665762  132222252653         12222222222222222222222252522|92:121                                     168566855668556665568565865 111111232221              122222222222522222222255525|89:15876551      2          35765         12255555555556566656557665811111122332222                    122222222222222222225255|74:11          25788885588855888885     25788888866655 5555865555655555666568888866231111222521                         1122222222222255555552|70:3222555       3588888658888888888888867888888888888888786555565555666655235888885213333333553                                 21122222222555555|68:2855855566632557888855855588888888888888888887887888887865555556566566652      223221323111 1                                          1122222555|66:2555866565566655555555855655888888888888888888888888878865556556556665555 1                                                                      13|62:2288665556556566665566656555888888888888888888888888887888866665566656665655 3|47:252          18887665565866655666556665655588888888888888888888878888785655666556665556221 2|36:2       55888886551   265885556658866665566655666666665655888888888888888888765556665566556556521 21 2|33:55888623558888888888888885556656565865566655666556665555556555568888888888855556665566655555522     1 1|30:56888888888888888888888555555555655885665666656666556665555555555225885888856666566665566555563       32|27:5588888888888888888888555555566555888556666556665566655655555555666      565565566655655566565522       2|23:2588888888888888888888585555655556558885655666656666556665555556555562 1        122255655556555521         2|10:2555       25888888888888888885585586555555555655555566566665666655666565555555551 1           1112322225252|0:55521 5558888888886688888888888888888855566555655555555566665666656666556665566555555556621         1 11111333222252 1|0:888888888888888888888888888888888888668856555565555566655666556665666655666565555222222211 13      111112223322222|0:88888888888888888888888888888888885555555555556555566665666655666566665666655652222531  2 32    1111111233222251     1|0:88888888888888888888888888888886555555555555555656556665566655666522255522232222222    1 21  11 11111122222251    1|0:888888888888888888888888886655565555655556556566665566655666556652223333322222211 1111 113111111111332232221   11|0:788888888888888888888885555555565555655555666566665566656666565223222333322222  11113122221 11111133332221   1|0:788888888888888888855655555555565555566655666566665666655666512223232222222    1113221222  1111221232231|0:788888888888888865555555555555556665666655666566665666555653332223333322  11111122313222 1112321122311  1|0:788888878555555555555555655666566665566656666555552255522323222233231      111111122221  111111211|0:555555655555555556665666655666556565666652222222225552111111232221        111  112111    13  11|0:5655556555556665555555555555555555555522222222222231111111113221               11          1|0:666666655565555555555555555556555222232222222221    1111111311                           1|0:5555555555555555525252555555223222232323222211     1   1111|0:555222222222222222222222222323322222332321              1|0:2222222222222222222222222321111111111|0:22323333332232332211111111111|0:2232223333333111|0:111111111';
  var IW = 2514, IH = 1469, CW = 11.79, CH = 19.66, OY = 5;
  var PX = 16;              // horizontal pitch of the digit lattice (image px)
  var FONT = 14;            // digit size (image px)
  var WEIGHT = 300;
  // Per traced level (1-8): share of cells kept, base opacity, chance of '0'
  // (same mapping as ascii-mountain.js, so all mountains read as one family).
  var KEEP = [0, 0.5, 0.75, 0.9, 1, 1, 1, 1, 1];
  var ALPHA = [0, 0.16, 0.2, 0.26, 0.32, 0.38, 0.44, 0.5, 0.56];
  var ZERO = [0, 0, 0.05, 0.15, 0.3, 0.45, 0.6, 0.7, 0.75];
  var SWAP_MS = 180;        // how often a batch of digits changes
  var SWAP = 0.004;         // share of digits that flip per batch
  var SPARK = 0.0008;       // share of digits that start twinkling per batch
  var SPARK_MS = 1800;      // twinkle duration

  function pick(z) { return Math.random() < z ? '0' : '1'; }

  // Density level at an image-space point, from the traced grid.
  var rows = GRID.split('|').map(function (row) {
    var p = row.split(':');
    return { pad: +p[0], line: p[1] };
  });
  function levelAt(x, y) {
    var r = Math.floor((y - OY) / CH) - FIRST_ROW;
    if (r < 0 || r >= rows.length) return 0;
    var c = Math.floor(x / CW) - rows[r].pad;
    var ch = rows[r].line.charCodeAt(c) - 48;
    return ch > 0 && ch < 9 ? ch : 0;
  }

  var cells = [];
  for (var x = PX / 2; x < IW; x += PX) {
    for (var r = 0; r < rows.length; r++) {
      var y = OY + (FIRST_ROW + r + 0.5) * CH;
      var l = levelAt(x, y);
      if (!l || Math.random() > KEEP[l]) continue;
      cells.push({
        x: x, y: y, z: ZERO[l], ch: pick(ZERO[l]),
        a: ALPHA[l] * (0.8 + Math.random() * 0.35),
        glow: 0, t0: 0
      });
    }
  }

  var canvas = document.createElement('canvas');
  canvas.className = img.className;
  canvas.setAttribute('aria-hidden', 'true');
  img.parentNode.insertBefore(canvas, img);
  img.classList.remove('is-3');
  img.style.display = 'none';

  var ctx = canvas.getContext('2d');

  // Same framing as the image had: object-fit: cover, object-position 50% 100%.
  function layout() {
    var w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return false;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    var s = Math.max(w / IW, h / IH);
    ctx.setTransform(dpr * s, 0, 0, dpr * s, dpr * (w - IW * s) / 2, dpr * (h - IH * s));
    ctx.font = WEIGHT + ' ' + FONT + 'px ui-monospace, SFMono-Regular, Menlo, Consolas, "DejaVu Sans Mono", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#ffffff';
    return true;
  }

  function paint(cell) {
    ctx.clearRect(cell.x - PX / 2, cell.y - CH / 2, PX, CH);
    ctx.globalAlpha = cell.a + (0.9 - cell.a) * cell.glow;
    ctx.fillText(cell.ch, cell.x, cell.y);
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
    var n = cells.length, i, cell;
    for (i = Math.max(1, Math.round(n * SWAP)); i > 0; i--) {
      cell = cells[(Math.random() * n) | 0];
      if (cell.t0) continue;
      cell.ch = pick(cell.z);
      paint(cell);
    }
    for (i = Math.max(1, Math.round(n * SPARK)); i > 0; i--) {
      cell = cells[(Math.random() * n) | 0];
      if (cell.t0) continue;
      cell.t0 = now;
      twinkling.push(cell);
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
  if (window.ResizeObserver) new ResizeObserver(drawAll).observe(canvas);
  else window.addEventListener('resize', drawAll);
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var visible = true, last = 0;
  if (window.IntersectionObserver) {
    new IntersectionObserver(function (e) { visible = e[0].isIntersecting; }).observe(canvas);
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
