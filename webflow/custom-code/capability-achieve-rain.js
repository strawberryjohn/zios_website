// "What you'll achieve" cards: one wave of digital rain rising through the dotted icon box on hover
// (approved preview: claude.ai/artifact/CHsNzNzVkB1WkaFFgV1yem).
// - Mouse: plays once when the pointer enters a card; leaving lets it finish; plays again on the next
//   hover after it has finished. The lighter gradient is CSS (.achieve_item.is-hover, capability-achieve-rain.css).
// - Touch screens: plays once when a card scrolls into view (no gradient shift).
// - Binary 0/1 characters on the dot-grid pitch (two dots per character), ragged front (columns start up to
//   0.25s apart, +-15% speed), bright leading character with a 7-character blue-30 tail. ~1.4s.
// - Canvas only draws while a wave runs. Reduced motion: no rain (gradient still shifts on hover).
// Lives in the page footer of Capabilities (Template) and the Leistungsbereiche CMS template.
(function () {
  var WAVE = 1.4, STAGGER = 0.25, TRAIL = 7, DENSITY = 0.7, CHARS = '01';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var touch = window.matchMedia('(hover: none)').matches;

  function hash(a, b, c) {
    var h = (a * 374761393 + b * 668265263 + c * 2147483647) | 0;
    h = (h ^ (h >>> 13)) * 1274126177 | 0;
    return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
  }

  function init(card, index) {
    var box = card.querySelector('.achieve_visual_wr');
    if (!box) return;
    var canvas = document.createElement('canvas');
    canvas.className = 'achieve_rain';
    canvas.setAttribute('aria-hidden', 'true');
    box.insertBefore(canvas, box.firstChild);
    var ctx = canvas.getContext('2d');
    var seed = index * 31 + 7, running = false, w = 0, h = 0, pitch = 14.4;

    function size() {
      var r = box.getBoundingClientRect();
      var dpr = Math.min(2, window.devicePixelRatio || 1);
      w = r.width; h = r.height;
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Dot grid is 0.45rem; one character every two dots.
      pitch = parseFloat(getComputedStyle(document.documentElement).fontSize) * 0.9 || 14.4;
    }

    // Draws the wave t seconds in; returns false once the box is clear.
    function draw(t) {
      ctx.clearRect(0, 0, w, h);
      var p = pitch, cols = Math.floor(w / p), rows = Math.ceil(h / p) + 1;
      var offX = (w - cols * p) / 2 + p / 2, trailPx = TRAIL * p, step = Math.floor(t * 12), alive = false;
      ctx.font = '500 ' + Math.round(p * 0.86) + 'px ui-monospace,monospace';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.shadowColor = '#bdddffe6';
      for (var col = 0; col < cols; col++) {
        if (hash(col, 7, seed) > DENSITY) continue;
        var prog = (t - hash(col, 1, seed) * STAGGER) / WAVE * (0.85 + hash(col, 2, seed) * 0.3);
        if (prog < 0) { alive = true; continue; }
        var headY = (h + p) - prog * (h + trailPx + p * 2);
        if (headY + trailPx > -p) alive = true;
        var x = offX + col * p;
        for (var r = 0; r < rows; r++) {
          var y = r * p + p / 2, d = y - headY;
          if (d < -p * 0.5 || d > trailPx) continue;
          var k = Math.max(0, d) / trailPx;
          var ch = CHARS.charAt(Math.floor(hash(col, r, step + col) * CHARS.length));
          var head = d < p * 0.5;
          ctx.fillStyle = head ? '#fcfcfc' : '#bdddff';
          ctx.globalAlpha = head ? 0.95 : 0.75 * (1 - k) * (1 - k);
          ctx.shadowBlur = head ? p * 0.6 : 0;
          ctx.fillText(ch, x, y);
        }
      }
      ctx.shadowBlur = 0; ctx.globalAlpha = 1;
      return alive;
    }

    function play() {
      if (running || reduce) return;
      running = true;
      size();
      var start = performance.now();
      requestAnimationFrame(function frame(now) {
        if (draw((now - start) / 1000)) requestAnimationFrame(frame);
        else { ctx.clearRect(0, 0, w, h); running = false; }
      });
    }

    if (touch) {

      var io = new IntersectionObserver(function (entries) {
        if (!entries[0].isIntersecting) return;
        io.disconnect();
        play();
      }, { threshold: 0.6 });
      io.observe(box);
      return;
    }
    card.addEventListener('pointerenter', function (e) {
      if (e.pointerType !== 'mouse') return;
      card.classList.add('is-hover');
      play();
    });
    card.addEventListener('pointerleave', function () { card.classList.remove('is-hover'); });
  }

  document.querySelectorAll('.achieve_item').forEach(init);
})();
