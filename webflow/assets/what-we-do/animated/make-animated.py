"""Builds the animated What we do service icons from the static originals.

Every original path keeps its fill, opacity and stroke. On top of that:
- ambient motion (float, a soft light trace along one outline, one small
  gesture per icon), all CSS inside the SVG so it plays in a plain <img>;
- data-t on every path: the same path when the object is turned 25deg
  counter-clockwise round its vertical axis (from geometry/<name>.json, made by
  turn/build_geometry.py). wwd-icon-turn.js morphs d -> data-t on row hover.
Class and keyframe names carry a per-icon prefix so the SVGs can sit inline on
one page without clashing.
"""
import json, os, re

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, '..')
EASE = 'cubic-bezier(.32,.72,0,1)'


def base(p):
    return (f'.{p}-float{{animation:{p}-float 6s ease-in-out infinite;transform-box:view-box;transform-origin:50% 50%}}'
            f'@keyframes {p}-float{{0%,100%{{transform:translateY(0)}}50%{{transform:translateY(-3px)}}}}'
            f'.{p}-trace{{fill:none;stroke:#CFE5FF;stroke-width:1.2;stroke-linecap:round;stroke-linejoin:round;'
            f'stroke-dasharray:14 86;stroke-dashoffset:100;opacity:0}}'
            f'@media (prefers-reduced-motion:reduce){{.{p}-float,.{p}-float *{{animation:none!important}}}}')


def trace_kf(n, dur, delay=0):
    steps = ('0%{stroke-dashoffset:100;opacity:0}6%{opacity:.55}55%{stroke-dashoffset:0;opacity:.55}'
             '62%,100%{stroke-dashoffset:0;opacity:0}')
    return f'.{n}{{animation:{n} {dur}s {EASE} {delay}s infinite}}@keyframes {n}{{{steps}}}'


def first_subpath(d):
    m = re.match(r'(.*?[Zz])', d, re.S)
    return m.group(1) if m else d


def build(name, p, parts, traces, css):
    s = open(os.path.join(SRC, f'wwd-icon-{name}.svg')).read()
    tags = re.findall(r'<path [^>]*/>', s)
    geo_file = os.path.join(HERE, 'geometry', f'{name}.json')
    geo = json.load(open(geo_file)) if os.path.exists(geo_file) else None
    rest = []
    for i, tag in enumerate(tags):
        new = tag
        if geo:
            r, t = geo[i]
            new = re.sub(r' d="[^"]+"', f' d="{r}" data-t="{t}"', new)
            rest.append((r, t))
        else:
            rest.append((re.search(r' d="([^"]+)"', tag).group(1), None))
        if i in parts:
            extra = ' pathLength="100"' if parts[i] == 'ck' else ''
            new = new.replace('<path ', f'<path class="{p}-{parts[i]}"{extra} ', 1)
        s = s.replace(tag, new, 1)
    tr = ''
    for i, cls in traces:
        r, t = rest[i]
        dt = f' data-t="{first_subpath(t)}"' if t else ''
        tr += f'<path class="{p}-trace {p}-{cls}" pathLength="100" d="{first_subpath(r)}"{dt}/>'
    body = s[s.index('>', s.index('<svg')) + 1:s.rindex('</svg>')]
    head = s[:s.index('>', s.index('<svg')) + 1]
    out = f'{head}\n<style>{base(p)}{css}</style>\n<g class="{p}-float">{body}{tr}</g>\n</svg>\n'
    open(os.path.join(HERE, f'wwd-icon-{name}.svg'), 'w').write(out)
    print(name, len(out))


# 1 Cybersecurity: shackle lifts and clicks down; trace round the shield face
build('cybersecurity', 'cy', {1: 'sh', 2: 'sh', 3: 'sh'}, [(0, 'tr1'), (6, 'tr2')],
      f'.cy-sh{{animation:cy-sh 6s {EASE} infinite}}@keyframes cy-sh{{0%,58%{{transform:translateY(0)}}'
      f'66%{{transform:translateY(-7px)}}76%,100%{{transform:translateY(0)}}}}'
      + trace_kf('cy-tr1', 6) + trace_kf('cy-tr2', 6, .25))
# 2 KI: a charge runs down the bolt's front edge, then the side
build('ki-automatisierung', 'ki', {}, [(3, 'tr1'), (2, 'tr2')],
      trace_kf('ki-tr1', 4.5) + trace_kf('ki-tr2', 4.5, .35))
# 3 Compliance: tick draws in, holds, fades and redraws; trace round the rim
build('compliance', 'co', {2: 'ck'}, [(3, 'tr1')],
      f'.co-ck{{stroke-dasharray:100;animation:co-ck 6s {EASE} infinite}}@keyframes co-ck{{'
      f'0%{{stroke-dashoffset:100;fill-opacity:0}}22%{{stroke-dashoffset:0;fill-opacity:0}}'
      f'34%,88%{{stroke-dashoffset:0;fill-opacity:.75}}100%{{stroke-dashoffset:0;fill-opacity:.75}}}}'
      + trace_kf('co-tr1', 6, 1.2))
# 4 Managed IT: cursor taps the globe; trace orbits the globe
build('managed-it', 'it', {i: 'cu' for i in range(16, 23)}, [(23, 'tr1')],
      f'.it-cu{{animation:it-cu 5s {EASE} infinite}}@keyframes it-cu{{0%,40%{{transform:translate(0,0)}}'
      f'52%{{transform:translate(-5px,-4px)}}58%{{transform:translate(-4px,-3px)}}72%,100%{{transform:translate(0,0)}}}}'
      + trace_kf('it-tr1', 5, .4))
# 5 Cloud backup: trace runs round the refresh arrow, twice per loop
build('cloud-backup', 'cl', {}, [(6, 'tr1'), (10, 'tr2')],
      trace_kf('cl-tr1', 4) + trace_kf('cl-tr2', 4, .3))
