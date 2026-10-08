// Home hero reveal guard (page head). Hides the hero text until
// home-hero-reveal.js has set the animation's start state; lifts after 3s anyway.
(function () {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var d = document.documentElement;
  d.classList.add('hr-pending');
  var s = document.createElement('style');
  s.textContent = 'html.hr-pending .hero_sec .hero_heading,html.hr-pending .hero_sec .button-wr.is-hero .button_primary_wrap,html.hr-pending .hero_sec .hero_bottom .hero_text,html.hr-pending .hero_sec .hero_bottom .text_link{visibility:hidden}.hero_line-mask{padding-bottom:.1em;margin-bottom:-.1em}';
  document.head.appendChild(s);
  setTimeout(function () { d.classList.remove('hr-pending'); }, 3000);
})();
