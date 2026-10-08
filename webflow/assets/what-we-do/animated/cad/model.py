"""CAD-style extrusion models of the What we do service icons.

Each icon is drawn in one fixed projection (edges at 30deg and -26.6deg plus
vertical; the vertical is squashed by 1/1.0789 so circles come back round).
The front faces of the SVG are unprojected into a flat sketch (model units),
and each icon is described as profiles pushed back to a depth, like a sketch
extruded in Fusion: holes and islands come from the sketch's nested loops.
wwd-icon-3d.js draws these models at any angle.
"""
import json, math, re, sys
import numpy as np
from geo import load, subs, to_world, dstr, U, W, V, KV
from rot import ALPHA, PSI0

def loops(n, path, idx=None, b=0.0):
    P=load(n); sp=subs(P[path])
    sel=sp if idx is None else [sp[i] for i in idx]
    return [dstr(to_world(s,b)) for s in sel]

def build(n):
    if n=='cybersecurity':
        solids=[dict(loops=loops(n,0)+loops(n,3), z0=0, z1=45.5)]
    elif n=='ki-automatisierung':
        solids=[dict(loops=loops(n,3), z0=0, z1=51)]
    elif n=='compliance':
        solids=[dict(loops=loops(n,0), z0=0, z1=45, pocket=dict(loops=loops(n,0,[1]), depth=4, floor='#2D6CBD'))]
    elif n=='managed-it':
        solids=[dict(loops=loops(n,0), z0=0, z1=43), dict(loops=loops(n,18), z0=0, z1=43)]
    elif n=='cloud-backup':
        solids=[dict(loops=loops(n,6), z0=0, z1=41.6),
                dict(loops=loops(n,0), z0=0, z1=41.6, wall='#2D6CBD')]
    return dict(alpha=ALPHA, psi=PSI0, kv=KV, solids=solids)

if __name__=='__main__':
    for n in sys.argv[1:]:
        json.dump(build(n), open(f'model-{n}.json','w'))
        print(n,'ok')
