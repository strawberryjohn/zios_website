// What we do: 3D service icons (experiment, Cybersecurity first).
// The Figma icons are flat isometric drawings, so rotating the SVG itself would
// read as a flipping card. Instead each icon is rebuilt as a real 3D object in
// three.js and drawn in the same blueprint style: translucent blue faces lit so
// the tones shift as it turns (#2D6CBD .. #4E87D0 like the SVG), crisp 1px
// #8CBEFF edges, and the hidden edges faintly showing through, as the SVG's 75%
// fills do. It turns slowly around Y (a seamless 360deg loop), floats a little,
// and casts a soft glow on the panel floor. Hovering the row speeds it up.
//
// Usage: <img class="wwdServices_icon" data-icon3d="cybersecurity" ...>
// The static SVG stays in place (Designer and no-JS show it); once the first
// 3D frame is drawn the canvas fades in over it and the image fades out.
// Lazy: three.js loads only when the section is near the viewport. Rendering
// pauses off-screen and in background tabs. Reduced motion: one still frame.
// Needs an import map for "three" (see page-what-we-do-footer.html).
import * as THREE from 'three';
import { LineSegments2 } from 'three/addons/lines/LineSegments2.js';
import { LineSegmentsGeometry } from 'three/addons/lines/LineSegmentsGeometry.js';
import { LineMaterial } from 'three/addons/lines/LineMaterial.js';

const EDGE = 0x8cbeff;
const FACE = 0x3e7ac9;
const TURN_SECONDS = 16;      // one full turn
const START_ANGLE = 0.62;     // close to the static SVG's 3/4 view
const TILT = 0.2;             // looking slightly down, like the isometric art
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---------- shapes (front view, units: object is ~2 wide) ----------
function shieldOutline(s = 1) {
  const p = new THREE.Shape();
  p.moveTo(-0.66 * s, 0.82 * s);
  p.quadraticCurveTo(0, 0.7 * s, 0.66 * s, 0.82 * s);           // top edge, slight dip
  p.lineTo(0.66 * s, 0.12 * s);
  p.bezierCurveTo(0.66 * s, -0.4 * s, 0.34 * s, -0.74 * s, 0, -0.94 * s); // right flank to the point
  p.bezierCurveTo(-0.34 * s, -0.74 * s, -0.66 * s, -0.4 * s, -0.66 * s, 0.12 * s);
  p.closePath();
  return p;
}

function roundedRect(x, y, w, h, r) {
  const p = new THREE.Shape();
  p.moveTo(x + r, y);
  p.lineTo(x + w - r, y); p.quadraticCurveTo(x + w, y, x + w, y + r);
  p.lineTo(x + w, y + h - r); p.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  p.lineTo(x + r, y + h); p.quadraticCurveTo(x, y + h, x, y + h - r);
  p.lineTo(x, y + r); p.quadraticCurveTo(x, y, x + r, y);
  return p;
}

function padlockBody() {
  const body = roundedRect(-0.24, -0.34, 0.48, 0.38, 0.05);
  const key = new THREE.Path();                      // keyhole: circle + slot
  key.absarc(0, -0.1, 0.055, Math.PI * 1.25, Math.PI * -0.25, true);
  key.lineTo(0.03, -0.24);
  key.lineTo(-0.03, -0.24);
  key.closePath();
  body.holes.push(key);
  return body;
}

function padlockShackle() {
  const y0 = 0.02, cy = 0.2, ro = 0.17, ri = 0.105;
  const p = new THREE.Shape();
  p.moveTo(-ro, y0);
  p.lineTo(-ro, cy);
  p.absarc(0, cy, ro, Math.PI, 0, true);
  p.lineTo(ro, y0);
  p.lineTo(ri, y0);
  p.lineTo(ri, cy);
  p.absarc(0, cy, ri, 0, Math.PI, false);
  p.lineTo(-ri, y0);
  p.closePath();
  return p;
}

function extrude(shape, depth, bevel) {
  const g = new THREE.ExtrudeGeometry(shape, {
    depth, curveSegments: 28, steps: 1,
    bevelEnabled: bevel > 0, bevelThickness: bevel, bevelSize: bevel, bevelSegments: 1
  });
  g.translate(0, 0, -depth / 2);                      // centre on Z so front and back match
  return g;
}

const BUILDERS = {
  cybersecurity() {
    return [
      { geo: extrude(shieldOutline(1), 0.2, 0.035) },
      { geo: extrude(shieldOutline(0.8), 0.3, 0.02) },  // inner raised plate, both faces
      { geo: extrude(padlockBody(), 0.46, 0.015) },      // lock goes through: seen from both sides
      { geo: extrude(padlockShackle(), 0.4, 0.012) }
    ];
  }
};

// ---------- scene per icon ----------
function makeGlowTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d');
  const r = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  r.addColorStop(0, 'rgba(140,190,255,0.55)');
  r.addColorStop(0.45, 'rgba(79,163,255,0.18)');
  r.addColorStop(1, 'rgba(79,163,255,0)');
  g.fillStyle = r;
  g.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(c);
}

function mount(img) {
  const parts = (BUILDERS[img.dataset.icon3d] || (() => null))();
  if (!parts) return;
  const host = img.parentElement;
  if (getComputedStyle(host).position === 'static') host.style.position = 'relative';

  const canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  canvas.style.cssText = 'position:absolute;pointer-events:none;opacity:0;transition:opacity .7s ease';
  host.appendChild(canvas);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'low-power' });
  renderer.setClearColor(0x000000, 0);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(20, 1, 0.1, 50);
  camera.position.set(0, 0, 5.9);

  scene.add(new THREE.AmbientLight(0xffffff, 0.9));
  const key = new THREE.DirectionalLight(0xffffff, 2.4);
  key.position.set(-2.5, 3, 4);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0x9cc8ff, 0.9);
  rim.position.set(3, -1, -3);
  scene.add(rim);

  const tilt = new THREE.Group();
  tilt.rotation.x = TILT;
  const spin = new THREE.Group();
  tilt.add(spin);
  scene.add(tilt);

  const faceMat = new THREE.MeshLambertMaterial({ color: FACE, transparent: true, opacity: 0.78, side: THREE.FrontSide });
  // Scanner sweep: a faint band of light runs down the object every few seconds
  // (world-space Y, so it stays level while the object turns).
  const scan = { value: 9 };
  faceMat.onBeforeCompile = (sh) => {
    sh.uniforms.uScanY = scan;
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', '#include <common>\nvarying float vWorldY;')
      .replace('#include <project_vertex>', '#include <project_vertex>\nvWorldY = (modelMatrix * vec4(transformed, 1.0)).y;');
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', '#include <common>\nuniform float uScanY;\nvarying float vWorldY;')
      .replace('#include <dithering_fragment>',
        '#include <dithering_fragment>\nfloat band = smoothstep(0.16, 0.0, abs(vWorldY - uScanY));\ngl_FragColor.rgb += vec3(0.32, 0.56, 1.0) * band * 0.55;');
  };
  const lineMats = [];
  function edgeMat(opacity, onTop) {
    const m = new LineMaterial({ color: EDGE, linewidth: 1, transparent: true, opacity, depthTest: !onTop, depthWrite: false });
    lineMats.push(m);
    return m;
  }
  const visibleEdges = edgeMat(1, false);
  const hiddenEdges = edgeMat(0.22, true);

  parts.forEach(({ geo }) => {
    const mesh = new THREE.Mesh(geo, faceMat);
    mesh.renderOrder = 1;
    spin.add(mesh);
    const e = new THREE.EdgesGeometry(geo, 24);
    const lg = new LineSegmentsGeometry().setPositions(e.attributes.position.array);
    const hidden = new LineSegments2(lg, hiddenEdges);
    hidden.renderOrder = 0;
    const shown = new LineSegments2(lg, visibleEdges);
    shown.renderOrder = 2;
    spin.add(hidden, shown);
  });

  // Soft pool of light under the object: a camera-facing ellipse (a floor plane
  // would be seen almost edge-on at this tilt and read as a thin line).
  const glow = new THREE.Mesh(
    new THREE.PlaneGeometry(2.3, 0.62),
    new THREE.MeshBasicMaterial({ map: makeGlowTexture(), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })
  );
  glow.position.set(0, -1.12, -0.4);
  glow.renderOrder = -1;
  scene.add(glow);

  function size() {
    const w = img.offsetWidth, h = img.offsetHeight;
    if (!w || !h) return;
    canvas.style.left = img.offsetLeft + 'px';
    canvas.style.top = img.offsetTop + 'px';
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    lineMats.forEach((m) => m.resolution.set(w, h));
  }
  size();
  if (window.ResizeObserver) new ResizeObserver(size).observe(host);

  let angle = START_ANGLE, speed = 1, target = 1, t = 0, last = performance.now(), shown = false;
  const row = img.closest('.wwdServices_row');
  if (row && !reduceMotion) {
    row.addEventListener('mouseenter', () => { target = 2.6; });
    row.addEventListener('mouseleave', () => { target = 1; });
  }

  function frame(now) {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    if (!reduceMotion) {
      speed += (target - speed) * Math.min(1, dt * 3);           // ease into hover speed
      angle += dt * speed * (Math.PI * 2 / TURN_SECONDS);
      t += dt;
    }
    spin.rotation.y = angle;
    const bob = Math.sin(t * Math.PI * 2 / 6);
    spin.position.y = 0.05 * bob;
    glow.material.opacity = 0.75 - 0.2 * bob;
    const cycle = (t % 7) / 2.4;                                   // sweep 2.4s, then rest
    scan.value = cycle < 1 ? 1.25 - cycle * 2.6 : 9;
    glow.scale.setScalar(1 - 0.06 * bob);
    renderer.render(scene, camera);
    if (!shown) {
      shown = true;
      canvas.style.opacity = '1';
      img.style.transition = 'opacity .7s ease';
      img.style.opacity = '0';
    }
  }

  let visible = false, raf = 0;
  function loop(now) {
    raf = 0;
    if (!visible || document.hidden) return;
    frame(now);
    if (!reduceMotion) raf = requestAnimationFrame(loop);
  }
  function wake() {
    if (!raf && visible && !document.hidden) { last = performance.now(); raf = requestAnimationFrame(loop); }
  }
  new IntersectionObserver((entries) => { visible = entries[0].isIntersecting; wake(); }).observe(host);
  document.addEventListener('visibilitychange', wake);
}

export function init(root = document) {
  const imgs = root.querySelectorAll('img[data-icon3d]');
  if (!imgs.length) return;
  try {
    const test = document.createElement('canvas');
    if (!(test.getContext('webgl2') || test.getContext('webgl'))) return;
  } catch (e) { return; }
  imgs.forEach((img) => {
    if (img.complete) mount(img); else img.addEventListener('load', () => mount(img), { once: true });
  });
}
