"""Turns each service icon 25deg counter-clockwise round its vertical axis.

The icons are orthographic drawings of extruded solids (camera ~32.5deg above
the horizon, ~47deg round). For every point the depth along the extrusion is
recovered (front plane, back plane, or the depth where a hidden edge passes
behind another part), the point is lifted to 3D, the camera is turned, and it
is projected again. Curved sides (coin rim, shield base, globe ring, refresh
ring) are rebuilt from the front outline at each angle, because the line where
a curved side meets its outline moves as the object turns.
Writes ../geometry/<name>.json: [[rest_d, turned_d], ...] per original path.
Slow (a few minutes per icon). Run: python3 build_geometry.py [names...]
"""
import json, os, sys
from turn import turn_icon, fit
from rot import fmt

HERE = os.path.dirname(os.path.abspath(__file__))
CFG = {
    'cybersecurity': dict(front=[0, 3], bands={6: (0, ('t', 't'))}),
    'ki-automatisierung': dict(front=[3], bands={}),
    'compliance': dict(front=[0], bands={3: (0, ('t', 't'))}),
    'managed-it': dict(front=[0, 18], bands={23: (0, ('t', 't'))},
                       groups=[(list(range(0, 16)) + [23], [0], [0, 43]), (list(range(16, 23)), [18], None)]),
    'cloud-backup': dict(front=[0, 6], bands={10: (6, ('t', 't'))},
                         groups=[([1, 2, 3, 4, 5, 6, 7, 8, 10], [6], [0, 41.6]), ([0, 9], [0], None)]),
}
TH = -25
for n, c in CFG.items():
    if len(sys.argv) > 1 and n not in sys.argv[1:]:
        continue
    s, tags, allp = turn_icon(n, c['front'], c['bands'], TH, groups=c.get('groups'))
    rest = allp(0)
    tur, sc = fit(rest, allp(TH))
    json.dump([[fmt(a), fmt(b)] for a, b in zip(rest, tur)],
              open(os.path.join(HERE, '..', 'geometry', f'{n}.json'), 'w'))
    print(n, 'scale', round(sc, 3))
