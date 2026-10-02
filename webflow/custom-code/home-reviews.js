// Reviews (Home): staggered fade-up of the three cards when they scroll into view.
// Registered inline page script (footer). Uses the GSAP + ScrollTrigger copy the
// hero parallax script loads; loads its own only if that never shows up.
(function () {
  var items = document.querySelectorAll('.reviews_sec .reviews_item');
  if (!items.length || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  function load(src) {
    return new Promise(function (ok, fail) {
      var s = document.createElement('script');
      s.src = src; s.onload = ok; s.onerror = fail;
      document.head.appendChild(s);
    });
  }
  function ready() { return window.gsap && window.ScrollTrigger; }
  function waitForGsap() {
    return new Promise(function (ok) {
      var tries = 0;
      (function poll() {
        if (ready() || ++tries > 30) return ok();
        setTimeout(poll, 100);
      })();
    }).then(function () {
      if (ready()) return;
      var base = 'https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/';
      return (window.gsap ? Promise.resolve() : load(base + 'gsap.min.js'))
        .then(function () { return window.ScrollTrigger || load(base + 'ScrollTrigger.min.js'); });
    });
  }

  function init() {
    gsap.registerPlugin(ScrollTrigger);
    gsap.set(items, { autoAlpha: 0, y: 48 });
    ScrollTrigger.batch(items, {
      start: 'top 88%',
      once: true,
      onEnter: function (batch) {
        gsap.to(batch, {
          autoAlpha: 1, y: 0, duration: 1.1, ease: 'power3.out', stagger: 0.15,
          clearProps: 'transform'
        });
      }
    });
  }

  window.addEventListener('load', function () {
    waitForGsap().then(init).catch(function (e) { console.warn('Reviews reveal skipped:', e); });
  });
})();
