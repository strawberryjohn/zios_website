// Partners marquee (Capabilities page): one transform on the whole track instead of a separate
// CSS animation per logo group, so the groups can never drift apart.
// - Loop length = measured distance from group 1 to group 2 (includes the real gap), so the wrap
//   point lands exactly on an identical frame: no visible reset.
// - Enough groups are cloned to cover the screen width plus one loop.
// - Hover eases the whole track down to 25% speed and back, instead of pausing one group.
// Speed matches the old CSS: one group width per 40s. Reduced motion: static.
// Lives in the Capabilities (Template) page footer custom code; CSS in capability-partners-marquee.css.
(function () {
  var SECONDS_PER_LOOP = 40, HOVER_RATE = 0.25, EASE = 4;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function init(track) {
    var groups = track.querySelectorAll(':scope > .partners_list_wrap');
    if (groups.length < 2) return;
    track.classList.add('is-js-marquee');
    if (reduce) return;

    var period = 0, x = 0, rate = 1, target = 1, last = 0, visible = true;
    var host = track.parentElement;

    function measure() {
      var g = track.querySelectorAll(':scope > .partners_list_wrap');
      period = g[1].getBoundingClientRect().left - g[0].getBoundingClientRect().left;
      if (period <= 0) return;
      // Cover the visible width plus one loop so the right edge never runs out of logos.
      while (g.length * period < host.clientWidth + 2 * period) {
        var clone = g[g.length - 1].cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        track.appendChild(clone);
        g = track.querySelectorAll(':scope > .partners_list_wrap');
      }
      x = x % period;
    }

    function frame(now) {
      var dt = last ? Math.min(0.1, (now - last) / 1000) : 0;
      last = now;
      if (visible && period > 0) {
        rate += (target - rate) * Math.min(1, dt * EASE);
        x -= (period / SECONDS_PER_LOOP) * rate * dt;
        if (x <= -period) x += period;
        track.style.transform = 'translate3d(' + x.toFixed(2) + 'px,0,0)';
      }
      requestAnimationFrame(frame);
    }

    measure();
    // Logo widths change once images load or fonts/breakpoints change.
    if (window.ResizeObserver) new ResizeObserver(measure).observe(groups[0]);
    window.addEventListener('load', measure);
    window.addEventListener('resize', measure);
    if (window.IntersectionObserver) {
      new IntersectionObserver(function (e) { visible = e[0].isIntersecting; }).observe(host);
    }
    host.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') target = HOVER_RATE; });
    host.addEventListener('pointerleave', function () { target = 1; });
    requestAnimationFrame(frame);
  }

  function start() {
    document.querySelectorAll('.partners_component').forEach(init);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
