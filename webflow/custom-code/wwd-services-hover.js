// What we do services: direction-aware row hover.
// Each .wwdservices_row holds a .wwdservices_overlay (#002768 at 40%, styled in
// Webflow, parked above the row at translateY(-101%) with a 350ms expo-out
// transition). On mouse enter the overlay jumps, without animating, to the edge
// the cursor came in through, then slides in. On leave it slides out through
// the edge the cursor left by. The row's icon tilts 25deg counter-clockwise and
// lifts 0.5rem while hovered (the 700ms transition is on .wwdservices_icon in
// Webflow). Mouse only; touch and reduced motion get nothing.
// Lives in the What we do page footer custom code.
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var rows = document.querySelectorAll('.wwdservices_row');

  function edge(row, e) {
    var r = row.getBoundingClientRect();
    return e.clientY < r.top + r.height / 2 ? -101 : 101;
  }

  function place(ov, y, animate) {
    ov.style.transition = animate ? '' : 'none';
    ov.style.transform = 'translate3d(0,' + y + '%,0)';
  }

  Array.prototype.forEach.call(rows, function (row) {
    var ov = row.querySelector('.wwdservices_overlay');
    var icon = row.querySelector('.wwdservices_icon');
    if (!ov) return;
    row.addEventListener('pointerenter', function (e) {
      if (e.pointerType !== 'mouse') return;
      place(ov, edge(row, e), false);
      ov.getBoundingClientRect(); // commit the start position before animating
      place(ov, 0, true);
      if (icon) icon.style.transform = 'translateY(-0.5rem) rotate(-25deg)';
    });
    row.addEventListener('pointerleave', function (e) {
      if (e.pointerType !== 'mouse') return;
      place(ov, edge(row, e), true);
      if (icon) icon.style.transform = '';
    });
  });
})();
