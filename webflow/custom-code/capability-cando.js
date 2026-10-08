// "What can I do", static version (cando_sec): tabs on desktop, accordion on mobile, GSAP motion.
// Tab n opens panel n (same order in the markup). Classes: .is-active on the tab and its panel.
// - Scroll reveal: heading, then the titles one after another, then the open panel
//   (image wipes in from the top, lead and paragraphs rise in staggered).
// - Switching: the old panel fades out before the new one plays the same reveal, so two panels never overlap.
// - Hover (mouse, 768px+): resting on a title for a moment opens it; click, tap, Enter and Space also work.
// - Mobile: the old panel collapses while the new one opens under its title.
// - Without GSAP or with reduced motion it still switches, just without animation.
// Lives in the Capabilities (Template) page footer; CSS in capability-cando.css (page head).
(function () {
  var HOVER_DELAY = 90;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var desktopMq = window.matchMedia('(min-width: 768px)');
  var hoverMq = window.matchMedia('(hover: hover) and (pointer: fine)');

  function loadGsap() {
    if (window.gsap) return Promise.resolve(window.gsap);
    if (!document.querySelector('script[src*="gsap.min.js"]')) {
      var s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/gsap.min.js';
      document.head.appendChild(s);
    }
    // Another script (e.g. the hero reveal) may already be loading it: wait for window.gsap.
    return new Promise(function (resolve, reject) {
      var tries = 0;
      (function check() {
        if (window.gsap) return resolve(window.gsap);
        if (++tries > 100) return reject();
        setTimeout(check, 50);
      })();
    });
  }

  function init(sec) {
    var layout = sec.querySelector('.cando_layout');
    if (!layout) return;
    var tabs = [].slice.call(layout.querySelectorAll(':scope > .cando_tab'));
    var panels = [].slice.call(layout.querySelectorAll(':scope > .cando_panel'));
    var count = Math.min(tabs.length, panels.length);
    if (!count) return;
    var heading = sec.querySelector('.cando_heading');
    var gsap = null;
    var active = -1;
    var hoverTimer = null;

    function img(i) { return panels[i].querySelector('.cando_panel_img'); }
    function texts(i) {
      var body = panels[i].querySelector('.cando_panel_body');
      return body ? [].slice.call(body.children) : [];
    }
    function kids(i) { return [img(i)].concat(texts(i)).filter(Boolean); }

    for (var k = 0; k < count; k++) (function (i) {
      var tab = tabs[i], panel = panels[i];
      panel.id = panel.id || 'cando-panel-' + i;
      tab.setAttribute('role', 'button');
      tab.setAttribute('tabindex', '0');
      tab.setAttribute('aria-controls', panel.id);
      tab.removeAttribute('type');
      tab.addEventListener('click', function (e) { e.preventDefault(); activate(i, true); });
      tab.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activate(i, true); }
      });
      tab.addEventListener('pointerenter', function (e) {
        if (e.pointerType !== 'mouse' || !hoverMq.matches || !desktopMq.matches) return;
        clearTimeout(hoverTimer);
        hoverTimer = setTimeout(function () { activate(i, true); }, HOVER_DELAY);
      });
      tab.addEventListener('pointerleave', function () { clearTimeout(hoverTimer); });
    })(k);

    function setActive(i, on) {
      tabs[i].classList.toggle('is-active', on);
      panels[i].classList.toggle('is-active', on);
      tabs[i].setAttribute('aria-expanded', on ? 'true' : 'false');
    }

    function resetAll() {
      for (var i = 0; i < count; i++) {
        gsap.killTweensOf([panels[i]].concat(kids(i)));
        gsap.set(kids(i), { clearProps: 'transform,opacity,visibility,clipPath' });
        gsap.set(panels[i], { clearProps: 'height' });
        panels[i].classList.remove('is-closing');
        gsap.set(panels[i], { autoAlpha: i === active ? 1 : 0 });
      }
    }

    // The open panel's content: image wipes down, text rises in one after another.
    function revealContent(tl, i, at) {
      var im = img(i);
      if (im) tl.fromTo(im, { clipPath: 'inset(0% 0% 100% 0%)' },
        { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.9, ease: 'power3.inOut' }, at);
      tl.fromTo(texts(i), { y: 24, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.6, stagger: 0.08 }, im ? '<0.2' : at);
    }

    function activate(i, animate) {
      if (i === active) return;
      var prev = active;
      active = i;
      var anim = animate && gsap && !reduce;

      for (var j = 0; j < count; j++) setActive(j, j === i);
      if (!gsap) return;

      // Stop anything mid-flight; every panel except the outgoing one goes straight to its end state.
      for (var p = 0; p < count; p++) {
        gsap.killTweensOf([panels[p]].concat(kids(p)));
        if (p !== prev || !anim) {
          gsap.set(kids(p), { clearProps: 'transform,opacity,visibility,clipPath' });
          gsap.set(panels[p], { clearProps: 'height', autoAlpha: p === i ? 1 : 0 });
          panels[p].classList.remove('is-closing');
        }
      }
      if (!anim) return;

      var tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      if (desktopMq.matches) {
        gsap.set(panels[i], { autoAlpha: 0 });
        if (prev > -1) tl.to(panels[prev], { autoAlpha: 0, duration: 0.18, ease: 'power1.out' });
        tl.set(panels[i], { autoAlpha: 1 });
        revealContent(tl, i, '>');
      } else {
        if (prev > -1) {
          var old = panels[prev];
          old.classList.add('is-closing');
          gsap.set(old, { autoAlpha: 1 });
          tl.to(old, {
            height: 0, duration: 0.35, ease: 'power2.inOut',
            onComplete: function () {
              old.classList.remove('is-closing');
              gsap.set(old, { clearProps: 'height', autoAlpha: 0 });
            }
          }, 0);
        }
        gsap.set(panels[i], { autoAlpha: 1 });
        tl.fromTo(panels[i], { height: 0 }, { height: 'auto', duration: 0.4, ease: 'power2.inOut', clearProps: 'height' }, 0);
        revealContent(tl, i, 0.1);
      }
      tl.eventCallback('onComplete', function () {
        if (window.ScrollTrigger) window.ScrollTrigger.refresh();
      });
    }

    activate(0, false);
    if (reduce) return;

    loadGsap().then(function (g) {
      gsap = g;
      resetAll();
      if (desktopMq.addEventListener) desktopMq.addEventListener('change', resetAll);
      reveal();
    }).catch(function () {});

    function reveal() {
      // Already on screen (e.g. reload mid-page): leave it as is.
      var r = (heading || layout).getBoundingClientRect();
      if (!('IntersectionObserver' in window) || r.top < window.innerHeight * 0.85) return;
      var titles = tabs.map(function (t) { return t.querySelector('.cando_tab_title'); }).filter(Boolean);
      var im = img(active);
      var txt = texts(active);
      gsap.set([heading].concat(titles, txt).filter(Boolean), { autoAlpha: 0, y: 32 });
      if (im) gsap.set(im, { clipPath: 'inset(0% 0% 100% 0%)' });
      var io = new IntersectionObserver(function (entries) {
        if (!entries[0].isIntersecting) return;
        io.disconnect();
        var tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.8 } });
        if (heading) tl.to(heading, { autoAlpha: 1, y: 0 }, 0);
        tl.to(titles, { autoAlpha: 1, y: 0, stagger: 0.07 }, 0.15);
        if (im) tl.to(im, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1, ease: 'power3.inOut' }, 0.25);
        tl.to(txt, { autoAlpha: 1, y: 0, stagger: 0.1 }, 0.45);
        tl.eventCallback('onComplete', function () {
          gsap.set([heading, im].concat(titles, txt).filter(Boolean), { clearProps: 'transform,opacity,visibility,clipPath' });
        });
      }, { rootMargin: '0px 0px -15% 0px' });
      io.observe(layout);
    }
  }

  function start() { document.querySelectorAll('.cando_sec').forEach(init); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
