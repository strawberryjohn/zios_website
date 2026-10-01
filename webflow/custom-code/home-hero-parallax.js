// Hero scroll sequence (Home).
// The hero pins (GSAP's version of position: sticky; it also works under
// ScrollSmoother) for two viewport-heights of scroll. While pinned:
//  - the mountain layers move UP and out of frame with parallax: the front
//    peak (is-1) fastest, the sky gradient (is-5) slowest, which also fades so
//    only the dark blue of hero_gsap_trigger_wr is left behind;
//  - the heading + CTA ride up with the mountains;
//  - hero_bottom stays on screen and travels to the centre of the viewport
//    while hero_text grows 16px -> 24px (the link keeps its size).
// Lives in the Home page footer custom code; loads GSAP/ScrollTrigger from
// jsDelivr only if the page doesn't already have them.
(function () {
  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      var s = document.createElement('script');
      s.src = src;
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  function ensureGsap() {
    var chain = Promise.resolve();
    if (typeof window.gsap === 'undefined') {
      chain = chain.then(function () { return loadScript('https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js'); });
    }
    return chain.then(function () {
      if (typeof window.ScrollTrigger === 'undefined') {
        return loadScript('https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js');
      }
    });
  }

  function init() {
    var sec = document.querySelector('.hero_sec');
    if (!sec || !sec.querySelector('.hero_layers')) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    gsap.registerPlugin(ScrollTrigger);

    function layer(n) { return sec.querySelector('.hero_layer.is-' + n); }
    var top = [sec.querySelector('.hero_head'), sec.querySelector('.button-wr.is-hero')].filter(Boolean);
    var bottom = sec.querySelector('.hero_bottom');
    var text = sec.querySelector('.hero_text');

    // Offset that puts hero_bottom's centre on the hero's centre, measured with
    // the text at its final 24px size and without the current transform.
    function centreOffset() {
      var tx = gsap.getProperty(bottom, 'x');
      var ty = gsap.getProperty(bottom, 'y');
      var prev = text.style.fontSize;
      text.style.fontSize = '1.5rem';
      var b = bottom.getBoundingClientRect();
      var s = sec.getBoundingClientRect();
      text.style.fontSize = prev;
      return {
        x: (s.left + s.width / 2) - (b.left - tx + b.width / 2),
        y: (s.top + s.height / 2) - (b.top - ty + b.height / 2)
      };
    }

    var tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: sec,
        start: 'top top',
        end: '+=200%',
        pin: true,
        scrub: 0.6,
        invalidateOnRefresh: true
      }
    });

    // Mountains: same duration, different distances = parallax. All four
    // mountain layers clear the top edge by 0.75.
    tl.to(layer(1), { yPercent: -160, duration: 0.75 }, 0)
      .to(layer(2), { yPercent: -140, duration: 0.75 }, 0)
      .to(layer(3), { yPercent: -125, duration: 0.75 }, 0)
      .to(layer(4), { yPercent: -110, duration: 0.75 }, 0)
      .to(layer(5), { yPercent: -50, duration: 0.75 }, 0)
      .to(layer(5), { autoAlpha: 0, duration: 0.4 }, 0.35)
      // Heading + CTA move with the mountain they sit on (layer 2's speed).
      .to(top, { y: function () { return -sec.clientHeight * 1.4; }, duration: 0.75 }, 0)
      // Bottom group: to the centre, text 16 -> 24px.
      .to(bottom, {
        x: function () { return centreOffset().x; },
        y: function () { return centreOffset().y; },
        duration: 0.6,
        ease: 'power1.inOut'
      }, 0.15)
      .to(text, { fontSize: '1.5rem', duration: 0.6, ease: 'power1.inOut' }, 0.15)
      .to({}, { duration: 0.25 }); // hold the centred end state before the page moves on
  }

  window.addEventListener('load', function () {
    ensureGsap().then(init).catch(function (e) { console.warn('Hero parallax skipped:', e); });
  });
})();
