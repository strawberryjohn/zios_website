/* Scroll reveals (GSAP stagger) for page sections, plus the "Why ..." dot-chart build-up.
   Loaded as a hosted page script (footer) from jsDelivr on:
   - Capabilities (Template) 69bc155fa7556de240825b39: CTA section / Image, Why Cybersecurity Matters
   - What we do 69aed262702891b6c33f36a8: Reinvention
   Sections not on a page are skipped. Uses the page's GSAP if present, else loads 3.13.0.
   Triggers with IntersectionObserver (no ScrollTrigger, so no plugin/core version mismatch).
   Reduced motion: nothing is hidden or animated. */
(function () {
  if (window.__sectionReveal) return;
  window.__sectionReveal = true;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // items: staggered rise-in, in this order. extra(tl, root, q): section-specific tweens.
  var SECTIONS = [
    {
      sel: '.ctaimg_sec',
      items: ['.ctaimg_title', '.ctaimg_text', '.ctaimg_btn_wr'],
      // Animate the blended images themselves, never their wrapper: opacity/transform on an ancestor
      // isolates them, and plus-lighter / color-dodge then blend against nothing (black arms show).
      prep: function (root, q) {
        root.__glowOpacity = q('.ctaimg_glow').map(function (g) { return getComputedStyle(g).opacity; });
        gsap.set(q('.ctaimg_hand, .ctaimg_glow'), { opacity: 0, x: 80 });
      },
      extra: function (tl, root, q) {
        tl.to(q('.ctaimg_hand'), { opacity: 1, x: 0, duration: 1.6, ease: 'power2.out' }, 0);
        q('.ctaimg_glow').forEach(function (g, i) {
          tl.to(g, { opacity: root.__glowOpacity[i], x: 0, duration: 1.6, ease: 'power2.out' }, 0);
        });
        tl.eventCallback('onComplete', function () {
          gsap.set(q('.ctaimg_hand, .ctaimg_glow'), { clearProps: 'transform,opacity' });
        });
      }
    },
    {
      sel: '.wwdreinvent_sec',
      items: ['.wwdreinvent_title', '.wwdreinvent_text', '.wwdreinvent_btn_wr'],
      prep: function (root, q) { gsap.set(q('.aboutUs_ascii, .aboutus_ascii'), { autoAlpha: 0 }); },
      extra: function (tl, root, q) {
        tl.to(q('.aboutUs_ascii, .aboutus_ascii'), { autoAlpha: 1, duration: 1.6, ease: 'power1.out', clearProps: 'opacity,visibility' }, 0);
      }
    },
    {
      sel: '.why_sec',
      items: ['.why_title', '.why_eyebrow', '.why_text'],
      prep: function (root, q) {
        gsap.set(q('.why_divider'), { scaleX: 0, transformOrigin: '0% 50%' });
        gsap.set(q('.why_stat'), { autoAlpha: 0, y: 40 });
        prepChart(root);
      },
      extra: function (tl, root, q) {
        playChart(tl, root, 0.2);
        tl.to(q('.why_divider'), { scaleX: 1, duration: 1.2, ease: 'power3.inOut' }, 0.5);
        tl.to(q('.why_stat'), { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.15 }, 0.8);
      }
    }
  ];

  /* Chart: the dot SVG (why_chart_img) is fetched and inlined so each dot can grow in,
     column by column from the left. If the fetch fails, the image is wiped in instead. */
  function prepChart(root) {
    var img = root.querySelector('.why_chart_img');
    if (!img) return;
    root.__chart = { img: img, mode: 'wipe' };
    gsap.set(img, { clipPath: 'inset(0% 100% 0% 0%)' });
    var src = img.currentSrc || img.src;
    if (!/\.svg(\?|$)/i.test(src) || !window.fetch) return;
    root.__chart.ready = fetch(src).then(function (r) { return r.ok ? r.text() : Promise.reject(); }).then(function (txt) {
      var doc = new DOMParser().parseFromString(txt, 'image/svg+xml');
      var svg = doc.documentElement;
      if (!svg || svg.nodeName.toLowerCase() !== 'svg') return;
      svg = document.importNode(svg, true);
      svg.setAttribute('class', img.getAttribute('class') || '');
      svg.setAttribute('role', 'img');
      svg.setAttribute('aria-label', img.getAttribute('alt') || '');
      svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
      var dots = Array.prototype.slice.call(svg.querySelectorAll('circle')).filter(function (d) { return !d.closest('defs'); });
      var grid = svg.querySelector('rect');
      img.parentNode.replaceChild(svg, img);
      gsap.set(dots, { scale: 0, transformOrigin: '50% 50%' });
      if (grid) gsap.set(grid, { autoAlpha: 0 });
      root.__chart = { mode: 'dots', svg: svg, dots: dots, grid: grid };
    }).catch(function () {});
  }

  function playChart(tl, root, at) {
    var c = root.__chart;
    if (!c) return;
    if (c.mode === 'dots') {
      var x0 = Infinity, x1 = -Infinity;
      c.dots.forEach(function (d) { var x = +d.getAttribute('cx'); if (x < x0) x0 = x; if (x > x1) x1 = x; });
      var span = Math.max(1, x1 - x0), sweep = 1.6;
      if (c.grid) tl.to(c.grid, { autoAlpha: 1, duration: 0.8, ease: 'power1.out' }, at);
      c.dots.forEach(function (d) {
        var t = at + ((+d.getAttribute('cx') - x0) / span) * sweep;
        tl.to(d, { scale: 1, duration: 0.45, ease: 'back.out(3)' }, t);
      });
    } else {
      tl.to(c.img, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.6, ease: 'power2.inOut' }, at);
    }
  }

  function run(gsap) {
    SECTIONS.forEach(function (cfg) {
      Array.prototype.forEach.call(document.querySelectorAll(cfg.sel), function (root) {
        var q = function (s) { return Array.prototype.slice.call(root.querySelectorAll(s)); };
        var items = [];
        cfg.items.forEach(function (s) { items = items.concat(q(s)); });
        gsap.set(items, { autoAlpha: 0, y: 40 });
        if (cfg.prep) cfg.prep(root, q);

        var played = false;
        function play() {
          if (played) return;
          played = true;
          Promise.resolve(root.__chart && root.__chart.ready).then(function () {
            var tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.9 } });
            tl.to(items, { autoAlpha: 1, y: 0, stagger: 0.15 }, 0);
            if (cfg.extra) cfg.extra(tl, root, q);
          });
        }
        if (!window.IntersectionObserver) return play();
        var io = new IntersectionObserver(function (entries) {
          if (entries.some(function (e) { return e.isIntersecting; })) { io.disconnect(); play(); }
        }, { rootMargin: '0px 0px -20% 0px' });
        io.observe(root);
      });
    });
  }

  function loadGsap() {
    if (window.gsap) return Promise.resolve(window.gsap);
    return new Promise(function (resolve, reject) {
      var tag = document.querySelector('script[src*="gsap.min.js"]');
      if (!tag) {
        tag = document.createElement('script');
        tag.src = 'https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/gsap.min.js';
        document.head.appendChild(tag);
      }
      // Another script may already be loading it: wait for window.gsap.
      var tries = 0;
      (function wait() {
        if (window.gsap) return resolve(window.gsap);
        if (++tries > 100) return reject();
        setTimeout(wait, 50);
      })();
    });
  }

  function start() { loadGsap().then(function (g) { window.gsap = g; run(g); }).catch(function () {}); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
