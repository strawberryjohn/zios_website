// Home hero: the same GSAP stagger reveal as the What we do hero.
// Heading lines slide up out of masks one after another, then the CTA, the
// bottom text and its link rise in; the mountain scene fades in underneath.
// The scroll parallax (home-hero-parallax.js) transforms .hero_head,
// .button-wr.is-hero and .hero_bottom, so this only animates what's inside
// them (lines, the button, the text, the link) and the .hero_layers wrapper.
// Lines are split by a small built-in splitter (no SplitText, so it works with
// the gsap 3.12 the page already loads) and put back to plain text afterwards.
// Guard: html.hr-pending (home-hero-reveal-guard.js, page head) keeps the
// elements hidden until the start state is set; it lifts itself after 3s.
// Registered as a Home page footer script.
(function () {
  var d = document.documentElement;
  var sec = document.querySelector('.hero_sec');
  function show() { d.classList.remove('hr-pending'); }
  if (!sec || matchMedia('(prefers-reduced-motion: reduce)').matches) { show(); return; }

  function load(src) {
    return new Promise(function (ok, no) {
      var s = document.createElement('script');
      s.src = src; s.onload = ok; s.onerror = no;
      document.head.appendChild(s);
    });
  }

  function splitLines(el) {
    var text = el.textContent.trim();
    el.textContent = '';
    var words = text.split(/\s+/).map(function (w, i) {
      var s = document.createElement('span');
      s.style.display = 'inline-block';
      s.textContent = w;
      el.appendChild(s);
      el.appendChild(document.createTextNode(' '));
      return s;
    });
    var lines = [], top = null;
    words.forEach(function (w) {
      if (w.offsetTop !== top) { lines.push([]); top = w.offsetTop; }
      lines[lines.length - 1].push(w.textContent);
    });
    el.textContent = '';
    var inners = lines.map(function (l) {
      var mask = document.createElement('span');
      mask.className = 'hero_line-mask';
      mask.style.cssText = 'display:block;overflow:hidden';
      var inner = document.createElement('span');
      inner.style.display = 'block';
      inner.textContent = l.join(' ');
      mask.appendChild(inner);
      el.appendChild(mask);
      return inner;
    });
    return { lines: inners, revert: function () { el.textContent = text; } };
  }

  function run() {
    var g = window.gsap;
    var heading = sec.querySelector('.hero_heading');
    var rest = [
      sec.querySelector('.button-wr.is-hero .button_primary_wrap'),
      sec.querySelector('.hero_bottom .hero_text'),
      sec.querySelector('.hero_bottom .text_link')
    ].filter(Boolean);
    var scene = sec.querySelector('.hero_layers');
    var split = heading ? splitLines(heading) : null;

    var tl = g.timeline({ defaults: { ease: 'power3.out' } });
    if (scene) tl.from(scene, { autoAlpha: 0, scale: 1.04, duration: 1.8, ease: 'power2.out' }, 0);
    if (split) tl.from(split.lines, { yPercent: 110, duration: 1, stagger: 0.12 }, 0.1);
    tl.from(rest, { y: 24, autoAlpha: 0, duration: 0.8, stagger: 0.12 }, '-=0.6');
    tl.eventCallback('onComplete', function () {
      if (split) split.revert();
      g.set(rest.concat(scene || []), { clearProps: 'transform,opacity,visibility' });
    });
    show();
  }

  (window.gsap ? Promise.resolve() : load('https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js'))
    .then(function () { return document.fonts ? document.fonts.ready : null; })
    .then(run)
    .catch(show);
})();
