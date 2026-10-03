// Partners marquee (Home): slows right down while the pointer is over it, and
// eases back to full speed on leave. The marquee motion itself lives in the
// external bundle (app.js / app.css), so this works on whatever drives it:
// CSS animations / Web Animations (playbackRate) and GSAP tweens (timeScale).
(function () {
  var sec = document.querySelector('.partners_sec');
  if (!sec || !window.matchMedia('(hover: hover)').matches) return;
  var SLOW = 0.15, EASE_MS = 600;
  var rate = 1, target = 1, from = 1, t0 = 0, raf = 0;

  function apply(r) {
    if (sec.getAnimations) {
      sec.getAnimations({ subtree: true }).forEach(function (a) { a.playbackRate = r; });
    }
    if (window.gsap) {
      gsap.getTweensOf(sec.querySelectorAll('.partners_component, .partners_list_wrap, .partners_list'))
        .forEach(function (t) { t.timeScale(r); });
    }
  }
  function step(now) {
    var p = Math.min(1, (now - t0) / EASE_MS);
    rate = from + (target - from) * (1 - Math.pow(1 - p, 3));
    apply(rate);
    raf = p < 1 ? requestAnimationFrame(step) : 0;
  }
  function go(r) {
    target = r; from = rate; t0 = performance.now();
    if (!raf) raf = requestAnimationFrame(step);
  }
  sec.addEventListener('mouseenter', function () { go(SLOW); });
  sec.addEventListener('mouseleave', function () { go(1); });
})();
