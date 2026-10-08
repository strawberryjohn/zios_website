// What we do services: CAD-style 3D icons that turn on row hover.
// Each icon SVG carries a model in <metadata data-hl3d>: its flat profiles
// (the front sketch, in model units), how deep each is extruded, and any pocket
// cut into the front. On hover this file swaps the <img> for an inline SVG and
// redraws the model every frame as the camera turns 25deg counter-clockwise
// round the vertical axis (seen from above): walls are extruded from the
// profile, faces turned away are culled, the rest are painted back to front with
// each solid's front face on top, and only real edges are stroked (outlines,
// sharp corners, and the silhouette lines of curved walls). Fills sit in one
// group at the icons' 0.75 opacity so hidden faces never show through; strokes
// go through a mask so the hidden ones are covered. At rest the original <img>
// (the Designer's) is shown again. Built by
// webflow/assets/what-we-do/animated/cad/model.py.
// Lives in the What we do page footer custom code.
(function (root) {
  var NUM = /-?\d*\.?\d+(?:e-?\d+)?/g, SEG = 10;
  var FRONT = '#4E87D0', TOP = '#3E7AC9', SIDE = '#2D6CBD', EDGE = '#8CBEFF';
  var NS = 'http://www.w3.org/2000/svg';

  function parse(d) {
    var out = [], re = /([MLCZ])([^MLCZ]*)/g, m;
    while ((m = re.exec(d))) out.push([m[1], (m[2].match(NUM) || []).map(Number)]);
    return out;
  }
  // split a path into closed loops of points (curves sampled); remember which points are corners
  function loopsOf(d) {
    var cmds = parse(d), loops = [], cur = null, last = null;
    cmds.forEach(function (c) {
      var a = c[1];
      if (c[0] === 'M') { cur = { p: [[a[0], a[1]]], cmd: [c] }; loops.push(cur); last = [a[0], a[1]]; }
      else if (c[0] === 'L') { cur.p.push([a[0], a[1]]); cur.cmd.push(c); last = [a[0], a[1]]; }
      else if (c[0] === 'C') {
        for (var i = 1; i <= SEG; i++) {
          var t = i / SEG, u = 1 - t;
          cur.p.push([u * u * u * last[0] + 3 * u * u * t * a[0] + 3 * u * t * t * a[2] + t * t * t * a[4],
                      u * u * u * last[1] + 3 * u * u * t * a[1] + 3 * u * t * t * a[3] + t * t * t * a[5]]);
        }
        cur.cmd.push(c); last = [a[4], a[5]];
      } else if (c[0] === 'Z') cur.cmd.push(c);
    });
    loops.forEach(function (L) {
      var p = L.p;
      var dd = [p[0]];
      for (var k = 1; k < p.length; k++) { var lq = dd[dd.length - 1]; if (Math.hypot(p[k][0] - lq[0], p[k][1] - lq[1]) > 1.0) dd.push(p[k]); }
      if (dd.length > 2 && Math.hypot(dd[0][0] - dd[dd.length - 1][0], dd[0][1] - dd[dd.length - 1][1]) < 1.0) dd.pop();
      L.p = p = dd;
      var n = p.length, area = 0;
      for (var i = 0; i < n; i++) { var q = p[i], r = p[(i + 1) % n]; area += q[0] * r[1] - r[0] * q[1]; }
      L.ccw = area > 0;
      L.sharp = p.map(function (q, i) {
        var a = p[(i - 1 + n) % n], b = p[(i + 1) % n];
        var d1 = [q[0] - a[0], q[1] - a[1]], d2 = [b[0] - q[0], b[1] - q[1]];
        var cs = (d1[0] * d2[0] + d1[1] * d2[1]) / (Math.hypot(d1[0], d1[1]) * Math.hypot(d2[0], d2[1]) + 1e-9);
        return cs < 0.8;
      });
    });
    return loops;
  }
  // even-odd nesting: is a loop a hole (material outside it)?
  function inside(pt, poly) {
    var c = false;
    for (var i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      var a = poly[i], b = poly[j];
      if ((a[1] > pt[1]) !== (b[1] > pt[1]) && pt[0] < (b[0] - a[0]) * (pt[1] - a[1]) / (b[1] - a[1]) + a[0]) c = !c;
    }
    return c;
  }
  function prepare(model) {
    var solids = model.solids.map(function (s) {
      var loops = [];
      s.loops.forEach(function (d) { loops = loops.concat(loopsOf(d)); });
      loops.forEach(function (L, i) {
        var depth = 0;
        loops.forEach(function (M, j) { if (j !== i && inside(L.p[0], M.p)) depth++; });
        L.hole = depth % 2 === 1;
      });
      var pk = null;
      if (s.pocket) {
        var pl = [];
        s.pocket.loops.forEach(function (d) { pl = pl.concat(loopsOf(d)); });
        pk = { depth: s.pocket.depth, floor: s.pocket.floor || FRONT, keys: pl.map(function (L) { return L.p[0][0].toFixed(1) + ',' + L.p[0][1].toFixed(1); }) };
      }
      return { s: s, loops: loops, pocket: pk };
    });
    var xs = [], zs = [];
    solids.forEach(function (S) { S.loops.forEach(function (L) { L.p.forEach(function (q) { xs.push(q[0]); }); }); zs.push(S.s.z0, S.s.z1); });
    return { model: model, solids: solids, pivot: [(Math.min.apply(0, xs) + Math.max.apply(0, xs)) / 2, (Math.min.apply(0, zs) + Math.max.apply(0, zs)) / 2] };
  }

  function camera(model, theta, pivot) {
    var al = model.alpha, kv = model.kv;
    function cam(psi) {
      var sa = Math.sin(al), ca = Math.cos(al);
      return {
        U: [Math.cos(psi), Math.sin(psi) * sa], Wv: [Math.sin(psi), -Math.cos(psi) * sa], V: [0, -ca * kv],
        t: [ca * Math.sin(psi), -ca * Math.cos(psi), sa]
      };
    }
    var c0 = cam(model.psi), c1 = cam(model.psi + theta);
    function pr(c, a, b, h) { return [a * c.U[0] + b * c.Wv[0], a * c.U[1] + b * c.Wv[1] + h * c.V[1]]; }
    var p0 = pr(c0, pivot[0], pivot[1], 0), p1 = pr(c1, pivot[0], pivot[1], 0);
    var dx = p0[0] - p1[0], dy = p0[1] - p1[1];
    return {
      t: c1.t,
      // world point: a (across), b (depth), h (up) -> screen
      P: function (a, b, h) { var s = pr(c1, a, b, h); return [s[0] + dx, s[1] + dy]; },
      far: function (a, b, h) { return -(a * c1.t[0] + b * c1.t[1] + h * c1.t[2]); }
    };
  }

  function f2(v) { return v.toFixed(2); }
  function capPath(cam, L, b) {
    var s = '';
    L.cmd.forEach(function (c) {
      var a = c[1];
      if (c[0] === 'Z') { s += 'Z'; return; }
      s += c[0];
      for (var i = 0; i < a.length; i += 2) { var q = cam.P(a[i], b, -a[i + 1]); s += f2(q[0]) + ' ' + f2(q[1]) + ' '; }
    });
    return s;
  }

  // Build the list of faces for one frame.
  function faces(prep, theta) {
    var cam = camera(prep.model, theta, prep.pivot), out = [], t = cam.t;
    prep.solids.forEach(function (S, si) {
      var s = S.s, layer = s.layer || 0;
      var pkKeys = S.pocket ? S.pocket.keys : [];
      S.loops.forEach(function (L) {
        var key = L.p[0][0].toFixed(1) + ',' + L.p[0][1].toFixed(1);
        var inPocket = pkKeys.indexOf(key) >= 0;
        var z0 = s.z0, z1 = inPocket ? s.z0 + S.pocket.depth : s.z1;
        var n = L.p.length, quads = [];
        // material side: outer loops have material inside; holes outside
        var sign = (L.ccw ? 1 : -1) * (L.hole ? -1 : 1);
        for (var i = 0; i < n; i++) {
          var a = L.p[i], b = L.p[(i + 1) % n];
          var ex = b[0] - a[0], ey = b[1] - a[1], len = Math.hypot(ex, ey) || 1;
          // profile y is drawn downwards; world up h = -y. outward normal in (a, h)
          var na = sign * ey / len, nh = sign * ex / len;
          var vis = na * t[0] + nh * t[2] > 1e-4;
          quads.push({ a: a, b: b, na: na, nh: nh, vis: vis });
        }
        // colour per smooth run: average normal of its visible quads
        var runs = [], run = [];
        for (var k = 0; k < n; k++) { if (L.sharp[k] && run.length) { runs.push(run); run = []; } run.push(k); }
        if (run.length) { if (runs.length && !L.sharp[0]) runs[0] = run.concat(runs[0]); else runs.push(run); }
        runs.forEach(function (r) {
          var sa = 0, sh = 0, turn = 0;
          r.forEach(function (k, j) {
            if (quads[k].vis) { sa += quads[k].na; sh += quads[k].nh; }
            if (j > 0) { var q0 = quads[r[j - 1]], q1 = quads[k]; turn += q0.na * q1.nh - q0.nh * q1.na; }
          });
          // inner (concave) walls are shaded the other way round in the source drawings
          var concave = r.length > 2 ? turn * (L.ccw ? 1 : -1) * (L.hole ? -1 : 1) > 0.05 : L.hole;
          var ang = Math.atan2(sh, sa) * 180 / Math.PI, up = ang > 20;
          var col = (concave ? s.holeWall : s.wall) || ((up !== concave) ? TOP : SIDE);
          r.forEach(function (k) { quads[k].col = col; quads[k].run = si + ':' + L.p[0][0].toFixed(1) + ':' + r[0]; });
        });
        quads.forEach(function (q, i) {
          if (!q.vis) return;
          var prev = quads[(i - 1 + n) % n], next = quads[(i + 1) % n];
          var A0 = cam.P(q.a[0], z0, -q.a[1]), B0 = cam.P(q.b[0], z0, -q.b[1]);
          var A1 = cam.P(q.a[0], z1, -q.a[1]), B1 = cam.P(q.b[0], z1, -q.b[1]);
          var d = 'M' + f2(A0[0]) + ' ' + f2(A0[1]) + 'L' + f2(B0[0]) + ' ' + f2(B0[1]) + 'L' + f2(B1[0]) + ' ' + f2(B1[1]) + 'L' + f2(A1[0]) + ' ' + f2(A1[1]) + 'Z';
          var e = 'M' + f2(A0[0]) + ' ' + f2(A0[1]) + 'L' + f2(B0[0]) + ' ' + f2(B0[1]) + 'M' + f2(A1[0]) + ' ' + f2(A1[1]) + 'L' + f2(B1[0]) + ' ' + f2(B1[1]);
          if (L.sharp[i] || !prev.vis) e += 'M' + f2(A0[0]) + ' ' + f2(A0[1]) + 'L' + f2(A1[0]) + ' ' + f2(A1[1]);
          if (L.sharp[(i + 1) % n] || !next.vis) e += 'M' + f2(B0[0]) + ' ' + f2(B0[1]) + 'L' + f2(B1[0]) + ' ' + f2(B1[1]);
          var mx = (q.a[0] + q.b[0]) / 2, my = (q.a[1] + q.b[1]) / 2;
          out.push({ layer: layer, rank: 1, far: cam.far(mx, (z0 + z1) / 2, -my), d: d, edge: e, fill: q.col, cls: s.cls, si: si, run: q.run });
        });
      });
      // pocket floor
      if (S.pocket) {
        var fl = S.loops.filter(function (L) { return pkKeys.indexOf(L.p[0][0].toFixed(1) + ',' + L.p[0][1].toFixed(1)) >= 0; });
        var fd = fl.map(function (L) { return capPath(cam, L, s.z0 + S.pocket.depth); }).join('');
        var c = fl[0].p[0];
        out.push({ layer: layer, rank: 0, far: cam.far(c[0], s.z0 + S.pocket.depth, -c[1]) + 1e3, d: fd, edge: fd, fill: S.pocket.floor, cls: s.cls, si: si, evenodd: true });
      }
      // front cap last within its layer
      var cd = S.loops.map(function (L) { return capPath(cam, L, s.z0); }).join('');
      out.push({ layer: layer, rank: 2, far: -1e9, d: cd, edge: cd, fill: s.cap || FRONT, cls: s.cls, si: si, evenodd: true });
    });
    out.sort(function (x, y) { return x.layer - y.layer || (x.rank === 2) - (y.rank === 2) || y.far - x.far; });
    return out;
  }

  // Render into an <svg>: fills group at .75, strokes masked so hidden ones are covered.
  function Renderer(svg, model, id) {
    var prep = prepare(model);
    svg.innerHTML = '';
    var defs = document.createElementNS(NS, 'defs'), mask = document.createElementNS(NS, 'mask');
    mask.setAttribute('id', id + '-m'); mask.setAttribute('maskUnits', 'userSpaceOnUse');
    mask.setAttribute('x', '-100'); mask.setAttribute('y', '-100'); mask.setAttribute('width', '400'); mask.setAttribute('height', '400');
    defs.appendChild(mask); svg.appendChild(defs);
    var fills = document.createElementNS(NS, 'g'); fills.setAttribute('opacity', '0.75'); svg.appendChild(fills);
    var rect = document.createElementNS(NS, 'rect');
    rect.setAttribute('x', '-100'); rect.setAttribute('y', '-100'); rect.setAttribute('width', '400'); rect.setAttribute('height', '400');
    rect.setAttribute('fill', EDGE); rect.setAttribute('mask', 'url(#' + id + '-m)'); svg.appendChild(rect);
    function draw(theta) {
      var F = faces(prep, theta), fh = '', mh = '', pend = '', run = null;
      function flush() { if (pend) mh += '<path d="' + pend + '" fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round"/>'; pend = ''; }
      F.forEach(function (f) {
        var fr = f.evenodd ? ' fill-rule="evenodd"' : '';
        fh += '<path d="' + f.d + '" fill="' + f.fill + '"' + fr + ' stroke="' + f.fill + '" stroke-width="0.6" stroke-linejoin="round"/>';
        // a smooth wall's pieces are stroked together once the run ends, so they don't nibble each other's edges
        if (!f.run || f.run !== run) flush();
        run = f.run || null;
        mh += '<path d="' + f.d + '" fill="#000"' + fr + ' stroke="#000" stroke-width="0.7" stroke-linejoin="round"/>';
        pend += f.edge;
        if (!f.run) flush();
      });
      flush();
      fills.innerHTML = fh; mask.innerHTML = mh;
    }
    return { draw: draw };
  }
  root.HL3D = { Renderer: Renderer, faces: faces, prepare: prepare };

  // ---- page wiring -------------------------------------------------------
  // cubic-bezier(.32,.72,0,1)
  function ease(x) {
    var t = x;
    for (var i = 0; i < 8; i++) {
      var cx = .96 * t * (1 - t) * (1 - t) + t * t * t - x, dx = .96 * (1 - t) * (1 - 3 * t) + 3 * t * t;
      if (Math.abs(cx) < 1e-5 || !dx) break;
      t = Math.min(1, Math.max(0, t - cx / dx));
    }
    return 2.16 * t * (1 - t) * (1 - t) + 3 * t * t * (1 - t) + t * t * t;
  }
  var TURN = -25 * Math.PI / 180, DUR = 700, FADE = '150ms';
  function setup(row, img, n) {
    fetch(img.currentSrc || img.src).then(function (r) { return r.ok ? r.text() : Promise.reject(); }).then(function (txt) {
      var holder = document.createElement('div'); holder.innerHTML = txt;
      var meta = holder.querySelector('metadata[data-hl3d]');
      if (!meta) return;
      var model = JSON.parse(meta.textContent);
      var wrap = document.createElement('div');
      wrap.style.cssText = 'position:relative;display:block;flex:none;transition:transform 700ms cubic-bezier(.32,.72,0,1)';
      img.parentNode.insertBefore(wrap, img); wrap.appendChild(img);
      var svg = document.createElementNS(NS, 'svg');
      svg.setAttribute('viewBox', '0 0 200 200'); svg.setAttribute('aria-hidden', 'true');
      svg.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;overflow:visible;opacity:0;pointer-events:none;transition:opacity ' + FADE;
      img.style.transition = 'opacity ' + FADE;
      wrap.appendChild(svg);
      var R = Renderer(svg, model, 'hl3d' + n), k = 0, from = 0, to = 0, t0 = 0, raf = 0;
      R.draw(0);
      function step(now) {
        var x = Math.min(1, (now - t0) / DUR);
        k = from + (to - from) * ease(x);
        R.draw(k * TURN);
        if (x < 1) raf = requestAnimationFrame(step);
        else { raf = 0; if (to === 0) { img.style.opacity = ''; svg.style.opacity = '0'; } }
      }
      function go(target) {
        from = k; to = target; t0 = performance.now();
        if (target) { svg.style.opacity = '1'; img.style.opacity = '0'; }
        wrap.style.transform = target ? 'translateY(-0.5rem)' : '';
        if (!raf) raf = requestAnimationFrame(step);
      }
      row.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') go(1); });
      row.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse') go(0); });
    }).catch(function () {});
  }
  if (root.document && !root.HL3D_NO_AUTO && !root.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var init = function () {
      document.querySelectorAll('.wwdservices_row').forEach(function (row, n) {
        var img = row.querySelector('img.wwdservices_icon');
        if (img) setup(row, img, n);
      });
    };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
  }
})(window);
