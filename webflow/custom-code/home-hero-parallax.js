// Hero scroll sequence (Home).
// The hero pins for two viewport-heights of scroll. The 5 mountain layers slide
// down at different speeds (front fastest), the sky fades into the dark blue
// behind it, the heading + CTA fade out, and the bottom group (text + link)
// travels to the centre of the viewport while the text grows 16px -> 24px.
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
    var content = sec.querySelector('.hero_contain');
    var bottom = sec.querySelector('.hero_bottom');
    var text = sec.querySelector('.hero_text');

    // Where the bottom group lands: its layout box at the final 24px text size,
    // centred in the pinned hero. Transforms don't affect offsetLeft/Top.
    function finalBox() {
      var prev = text.style.fontSize;
      text.style.fontSize = '1.5rem';
      var box = {
        left: bottom.offsetLeft, top: bottom.offsetTop,
        width: bottom.offsetWidth, height: bottom.offsetHeight,
        W: sec.clientWidth, H: sec.clientHeight
      };
      text.style.fontSize = prev;
      return box;
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

    tl.to(content, { autoAlpha: 0, y: -80, duration: 0.25 }, 0)
      .to(layer(1), { yPercent: 80, scale: 1.1, transformOrigin: '50% 100%', duration: 0.6 }, 0)
      .to(layer(2), { yPercent: 60, duration: 0.6 }, 0)
      .to(layer(3), { yPercent: 45, autoAlpha: 0.5, duration: 0.6 }, 0)
      .to(layer(4), { yPercent: 30, duration: 0.6 }, 0)
      .to(layer(5), { yPercent: 10, autoAlpha: 0, duration: 0.5 }, 0.1)
      .to(text, { fontSize: '1.5rem', duration: 0.5, ease: 'power1.inOut' }, 0.3)
      .to(bottom, {
        x: function () { var b = finalBox(); return (b.W - b.width) / 2 - b.left; },
        y: function () { var b = finalBox(); return (b.H - b.height) / 2 - b.top; },
        duration: 0.5,
        ease: 'power1.inOut'
      }, 0.3)
      .to({}, { duration: 0.2 }); // hold the centred end state before the page moves on
  }

  window.addEventListener('load', function () {
    ensureGsap().then(init).catch(function (e) { console.warn('Hero parallax skipped:', e); });
  });
})();
