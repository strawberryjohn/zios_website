// What we do: Core Industries card reveal (GSAP + ScrollTrigger).
// As each row of cards scrolls into view, the top line draws from left to right,
// then the title and arrow rise in, then the tag chips follow one after another.
// The cards in a row start a beat apart. Runs once per card. The line is drawn
// with a background gradient over a transparent border, which is handed back to
// the real border (and its hover colour) when the card finishes.
// Uses the site's gsap when present, else loads it; loads ScrollTrigger if missing.
// Reduced motion: no animation. Runs on the What we do page as the registered inline
// script 'wwdcoreindustriesreveal' (footer), minified with terser to fit the 2000-char limit.
// Versioned in strawberryjohn/zios_website: webflow/custom-code/wwd-core-industries-reveal.js
(function () {
  var cards = document.querySelectorAll('.coreind_card');
  if (!cards.length || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      var s = document.createElement('script');
      s.src = src; s.onload = resolve; s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  // Wait for window load so a gsap that another footer script is still injecting has arrived.
  function ready() {
    return new Promise(function (resolve) {
      if (document.readyState === 'complete') resolve();
      else window.addEventListener('load', resolve, { once: true });
    });
  }

  ready().then(function () {
    if (typeof window.gsap === 'undefined') {
      return loadScript('https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/gsap.min.js');
    }
  }).then(function () {
    if (typeof window.ScrollTrigger === 'undefined') {
      return loadScript('https://cdn.jsdelivr.net/npm/gsap@' + (window.gsap.version || '3.13.0') + '/dist/ScrollTrigger.min.js');
    }
  }).then(run).catch(function () {
    // GSAP unavailable: leave the cards as they are (fully visible).
  });

  function run() {
    var gsap = window.gsap;
    gsap.registerPlugin(window.ScrollTrigger);

    Array.prototype.forEach.call(cards, function (card) {
      var line = getComputedStyle(card).borderTopColor;
      gsap.set(card, {
        borderTopColor: 'transparent',
        backgroundImage: 'linear-gradient(' + line + ', ' + line + ')',
        backgroundRepeat: 'no-repeat',
        backgroundOrigin: 'border-box',
        backgroundPosition: '0 0',
        backgroundSize: '0% 1px'
      });
      gsap.set(card.querySelectorAll('.coreind_card_title, .coreind_card_icon'), { y: 24, autoAlpha: 0 });
      gsap.set(card.querySelectorAll('.coreind_tag'), { y: 16, autoAlpha: 0 });
    });

    function reveal(card, delay) {
      var tl = gsap.timeline({
        delay: delay,
        defaults: { ease: 'power3.out' },
        onComplete: function () {
          gsap.set(card, { clearProps: 'borderTopColor,backgroundImage,backgroundRepeat,backgroundOrigin,backgroundPosition,backgroundSize' });
          gsap.set(card.querySelectorAll('.coreind_card_title, .coreind_card_icon, .coreind_tag'), { clearProps: 'transform,opacity,visibility' });
        }
      });
      tl.to(card, { backgroundSize: '100% 1px', duration: 1, ease: 'power3.inOut' }, 0)
        .to(card.querySelectorAll('.coreind_card_title, .coreind_card_icon'), { y: 0, autoAlpha: 1, duration: 0.8, stagger: 0.08 }, 0.25)
        .to(card.querySelectorAll('.coreind_tag'), { y: 0, autoAlpha: 1, duration: 0.6, stagger: 0.05 }, 0.45);
    }

    window.ScrollTrigger.batch(cards, {
      start: 'top 85%',
      once: true,
      onEnter: function (batch) {
        batch.forEach(function (card, i) { reveal(card, i * 0.15); });
      }
    });
  }
})();
