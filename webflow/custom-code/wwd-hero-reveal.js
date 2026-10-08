// What we do hero: GSAP stagger reveal on load.
// Heading lines slide up out of a mask one after another, then the lead text and
// the CTA rise in; the background fades in underneath. The elements stay hidden
// (html.wwd-reveal-pending, set in the page head) until the timeline has set its
// start state, and the head script un-hides them after 3s if GSAP never loads.
// Reduced motion: no animation. Lives in the What we do page footer custom code.
(function () {
  var d = document.documentElement;
  var hero = document.querySelector('.wwdhero_sec');
  function show() { d.classList.remove('wwd-reveal-pending'); }
  if (!hero || window.matchMedia('(prefers-reduced-motion: reduce)').matches) { show(); return; }

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      var s = document.createElement('script');
      s.src = src; s.onload = resolve; s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  var chain = Promise.resolve();
  if (typeof window.gsap === 'undefined') {
    chain = chain.then(function () { return loadScript('https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/gsap.min.js'); });
  }
  chain = chain.then(function () {
    // SplitText needs a 3.13+ core; with an older gsap already on the page, reveal the heading whole.
    var v = (window.gsap.version || '0').split('.').map(Number);
    var newEnough = v[0] > 3 || (v[0] === 3 && v[1] >= 13);
    if (typeof window.SplitText === 'undefined' && newEnough) {
      return loadScript('https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/SplitText.min.js').catch(function () {});
    }
  });
  chain.then(function () { return document.fonts ? document.fonts.ready : null; }).then(run).catch(show);

  function run() {
    var gsap = window.gsap;
    var heading = hero.querySelector('.wwdhero_heading');
    var text = hero.querySelector('.wwdhero_text');
    var btn = hero.querySelector('.wwdhero_content .button_primary_wrap');
    var bg = hero.querySelector('.wwdhero_bg');
    var split = null;

    var tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    if (bg) tl.from(bg, { autoAlpha: 0, scale: 1.06, duration: 1.8, ease: 'power2.out' }, 0);
    if (heading && window.SplitText) {
      gsap.registerPlugin(window.SplitText);
      split = window.SplitText.create(heading, { type: 'lines', mask: 'lines', linesClass: 'wwdhero_line' });
      tl.from(split.lines, { yPercent: 110, duration: 1, stagger: 0.12 }, 0.1);
    } else if (heading) {
      tl.from(heading, { y: 40, autoAlpha: 0, duration: 1 }, 0.1);
    }
    tl.from([text, btn].filter(Boolean), { y: 24, autoAlpha: 0, duration: 0.8, stagger: 0.12 }, '-=0.6');
    // Back to plain text afterwards so the heading re-wraps normally on resize.
    if (split) tl.eventCallback('onComplete', function () { split.revert(); });
    show();
  }
})();
