// Home: tablet/mobile behaviour (Eugene's list, 2026-10-03). Three blocks, each
// registered as its own inline page script in the Home footer (2000-char limit):
// HomeMobileHero, HomeMobileSections, HomeMobileSliders. The CSS half
// (home-mobile.css) is injected by HomeMobileCss1/2 in the page header.

// HomeMobileHero
//  2. ≤767: the hero text + link move below the hero (dark blue, no scale-up).
//     Runs before load, so the hero parallax (which starts on load) never sees
//     them and skips its move-to-centre / 16->24px tween.
//  3. Don't re-measure ScrollTrigger when the mobile address bar shows/hides;
//     that re-measure is what let the sky gradient flash through mid-scroll.
(function () {
  if (window.matchMedia('(max-width: 767px)').matches) {
    var bottom = document.querySelector('.hero_sec .hero_bottom');
    var wrap = document.querySelector('.hero_gsap_trigger_wr');
    if (bottom && wrap) {
      var box = document.createElement('div');
      box.className = 'u-container hero_bottom_mob';
      box.appendChild(bottom);
      wrap.appendChild(box);
    }
  }
  var n = 0;
  (function st() {
    if (window.ScrollTrigger) ScrollTrigger.config({ ignoreMobileResize: true });
    else if (n++ < 40) setTimeout(st, 100);
  })();
})();

// HomeMobileSections
//  7. ≤767: Produkte & Plattformen slider is destroyed; CSS stacks the cards.
//  9. ≤767: the Austria cards are pushed down until the map's "Austria" label
//     sits clear between the title and the cards.
(function () {
  if (!window.matchMedia('(max-width: 767px)').matches) return;
  window.addEventListener('load', function () {
    var prod = document.querySelector('.swiper.products');
    if (prod) {
      if (prod.swiper) prod.swiper.destroy(true, true);
      prod.classList.add('is-stacked');
    }
    var g = document.querySelector('.greetings_sec');
    var label = g && g.querySelector('.greetings_map_label');
    var head = g && g.querySelector('.greetings_head');
    var lay = g && g.querySelector('.greetings_layout');
    if (!label || !head || !lay) return;
    function fit() {
      head.style.marginBottom = '';
      var need = label.getBoundingClientRect().bottom + 32 - lay.getBoundingClientRect().top;
      if (need > 0) head.style.marginBottom = (parseFloat(getComputedStyle(head).marginBottom) + need) + 'px';
    }
    fit();
    var t;
    window.addEventListener('resize', function () { clearTimeout(t); t = setTimeout(fit, 150); });
  });
})();

// HomeMobileSliderKit
// Helpers for HomeMobileReviews / HomeMobileNews (window.zMobSlider): a timer
// bar, an arrow button, and an own autoplay timer, so it doesn't depend on the
// bundle's Swiper having Autoplay: fills the bar over 6s, then advances (back
// to the start after the last slide); pauses off screen and while a finger is
// on the slider.
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function bar(cls) {
    var d = document.createElement('div');
    d.className = cls;
    d.innerHTML = '<div class="m-nav_bar"><div class="m-nav_fill"></div></div>';
    return d;
  }
  function arrow(dir, label) {
    return '<button type="button" class="m-nav_btn is-' + dir + '" aria-label="' + label +
      '"><svg viewBox="0 0 32 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2 8h27M23 2l6 6-6 6"/></svg></button>';
  }
  function timer(sw, fill) {
    if (reduce) { fill.style.width = '100%'; return; }
    var t0 = performance.now(), held = 0, seen = 1;
    sw.on('slideChange', function () { t0 = performance.now(); });
    sw.on('touchStart', function () { held = 1; });
    sw.on('touchEnd', function () { held = 0; });
    new IntersectionObserver(function (e) { seen = e[0].isIntersecting; }).observe(sw.el);
    (function tick(now) {
      if (held || !seen) t0 = now;
      var p = Math.min(1, (now - t0) / 6000);
      fill.style.width = p * 100 + '%';
      if (p >= 1) { t0 = now; if (sw.isEnd) sw.slideTo(0); else sw.slideNext(); }
      requestAnimationFrame(tick);
    })(performance.now());
  }
  window.zMobSlider = { bar: bar, arrow: arrow, timer: timer };
})();

// HomeMobileReviews
// 10. ≤991: reviews become a slider with arrows and an autoplay timer bar.
(function () {
  if (!window.matchMedia('(max-width: 991px)').matches) return;
  var mob = window.matchMedia('(max-width: 767px)').matches;
  window.addEventListener('load', function () {
    var z = window.zMobSlider;
    if (typeof Swiper == 'undefined' || !z) return;
    var list = document.querySelector('.reviews_list');
    var grid = list && list.querySelector('.reviews_grid');
    if (grid && grid.children.length > 1) {
      list.classList.add('swiper', 'is-slider');
      grid.classList.add('swiper-wrapper');
      [].forEach.call(grid.children, function (i) { i.classList.add('swiper-slide'); });
      var nav = z.bar('m-nav');
      nav.insertAdjacentHTML('afterbegin', z.arrow('prev', 'Zurück'));
      nav.insertAdjacentHTML('beforeend', z.arrow('next', 'Weiter'));
      list.parentNode.insertBefore(nav, list.nextSibling);
      z.timer(new Swiper(list, {
        slidesPerView: mob ? 1 : 2, spaceBetween: 16, speed: 600,
        navigation: { prevEl: nav.querySelector('.is-prev'), nextEl: nav.querySelector('.is-next') }
      }), nav.querySelector('.m-nav_fill'));
    }
  });
})();

// HomeMobileNews
// 11. ≤991: news gets an autoplay timer bar (arrows made visible by the CSS;
//     wired here only if the bundle didn't wire them). Uses HomeMobileSliderKit.
(function () {
  if (!window.matchMedia('(max-width: 991px)').matches) return;
  window.addEventListener('load', function () {
    var z = window.zMobSlider;
    if (!z) return;
    // The news slider is built by the external bundle; wait for it briefly.
    (function news(tries) {
      var el = document.querySelector('.news_slider_component .swiper');
      var ns = el && el.swiper;
      if (!ns) { if (el && tries) setTimeout(function () { news(tries - 1); }, 300); return; }
      var navEl = document.querySelector('.news_swiper_nav') || el;
      if (!(ns.params.navigation && ns.params.navigation.nextEl)) {
        var p = navEl.querySelector('.swiper-button.prev'), q = navEl.querySelector('.swiper-button.next');
        if (p) p.addEventListener('click', function () { ns.slidePrev(); });
        if (q) q.addEventListener('click', function () { ns.slideNext(); });
      }
      var b = z.bar('news_timer');
      navEl.parentNode.insertBefore(b, navEl.nextSibling);
      z.timer(ns, b.querySelector('.m-nav_fill'));
    })(10);
  });
})();
