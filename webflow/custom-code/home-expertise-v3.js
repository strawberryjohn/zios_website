// Expertise slider v3 (Home), rebuilt from Figma 10119:14288.
// Endless loop in both directions, autoplay, square arrows on the active
// slide's edges, and a tab bar whose active tab fills (blue -> white) in sync
// with the autoplay timer. Uses the site-wide Swiper 12. Lives in the Home
// page footer.
window.addEventListener('load', function () {
  var root = document.querySelector('[data-expert]');
  if (!root || typeof Swiper === 'undefined') return;
  var el = root.querySelector('.expert_swiper');
  var wrapper = el.querySelector('.swiper-wrapper');
  var tabs = Array.prototype.slice.call(root.querySelectorAll('.expert_tab'));
  var prev = root.querySelector('.expert_nav.is-prev');
  var next = root.querySelector('.expert_nav.is-next');

  // Only 3 slides: clone them once so the loop always has slides on both sides.
  var originals = Array.prototype.slice.call(wrapper.children);
  var count = originals.length;
  originals.forEach(function (slide) {
    var clone = slide.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    wrapper.appendChild(clone);
  });

  function gap() { // 1.5rem in px (the site's root size is fluid)
    return 1.5 * parseFloat(getComputedStyle(document.documentElement).fontSize);
  }
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var swiper = new Swiper(el, {
    loop: true,
    slidesPerView: 'auto',
    centeredSlides: true,
    spaceBetween: gap(),
    speed: 800,
    grabCursor: true,
    autoplay: reduceMotion ? false : { delay: 6000, disableOnInteraction: false },
    navigation: { prevEl: prev, nextEl: next }
  });

  function fill(i, ratio) {
    var f = tabs[i] && tabs[i].querySelector('.expert_tab_fill');
    if (f) f.style.width = (ratio * 100).toFixed(2) + '%';
  }
  function syncTabs() {
    var active = swiper.realIndex % count;
    tabs.forEach(function (tab, i) {
      var on = i === active;
      tab.classList.toggle('is-active', on);
      tab.setAttribute('aria-selected', on ? 'true' : 'false');
      fill(i, on && reduceMotion ? 1 : 0);
    });
  }
  swiper.on('slideChange', syncTabs);
  swiper.on('autoplayTimeLeft', function (s, ms, progress) {
    fill(swiper.realIndex % count, 1 - progress);
  });
  syncTabs();

  function activate(fn) {
    return function (e) {
      if (e.type === 'keydown' && e.key !== 'Enter' && e.key !== ' ') return;
      e.preventDefault();
      fn();
    };
  }
  tabs.forEach(function (tab, i) {
    var go = activate(function () { swiper.slideToLoop(i); });
    tab.addEventListener('click', go);
    tab.addEventListener('keydown', go);
  });
  [[prev, 'slidePrev'], [next, 'slideNext']].forEach(function (p) {
    p[0].addEventListener('keydown', activate(function () { swiper[p[1]](); }));
  });

  var t;
  window.addEventListener('resize', function () {
    clearTimeout(t);
    t = setTimeout(function () { swiper.params.spaceBetween = gap(); swiper.update(); }, 150);
  });
});
