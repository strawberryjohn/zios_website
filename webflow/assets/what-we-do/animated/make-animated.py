import re, sys
import os
SRC=os.path.join(os.path.dirname(os.path.abspath(__file__)), '..') + '/'
OUT=SRC+'animated/'
EASE='cubic-bezier(.32,.72,0,1)'
BASE=f'''
.hl-float{{animation:hl-float 6s ease-in-out infinite;transform-box:view-box;transform-origin:50% 50%}}
@keyframes hl-float{{0%,100%{{transform:translateY(0)}}50%{{transform:translateY(-3px)}}}}
.hl-trace{{fill:none;stroke:#E4F1FF;stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:14 86;stroke-dashoffset:100;opacity:0}}
@media (prefers-reduced-motion:reduce){{*{{animation:none!important}}}}
'''
def first_subpath(d):
    m=re.match(r'(.*?[Zz])',d,re.S); return m.group(1) if m else d
def build(name, parts, trace_from, css, trace_anim):
    s=open(SRC+f'wwd-icon-{name}.svg').read()
    paths=re.findall(r'<path [^>]*/>',s)
    ds=[re.search(r' d="([^"]+)"',p).group(1) for p in paths]
    for i,cls in parts.items():
        new=paths[i].replace('<path ',f'<path class="{cls}" ',1)
        s=s.replace(paths[i],new,1); paths[i]=new
    traces=''.join(f'<path class="hl-trace {cls}" pathLength="100" d="{first_subpath(ds[i])}"/>' for i,cls in trace_from)
    body=s[s.index('>',s.index('<svg'))+1:s.rindex('</svg>')]
    head=s[:s.index('>',s.index('<svg'))+1]
    out=f'{head}\n<style>{BASE}{trace_anim}{css}</style>\n<g class="hl-float">{body}{traces}</g>\n</svg>\n'
    open(OUT+f'wwd-icon-{name}.svg','w').write(out); print(name,len(out))

def trace_kf(n,dur,delay=0,steps='0%{stroke-dashoffset:100;opacity:0}6%{opacity:1}55%{stroke-dashoffset:0;opacity:1}62%,100%{stroke-dashoffset:0;opacity:0}'):
    return f'.{n}{{animation:{n} {dur}s {EASE} {delay}s infinite}}@keyframes {n}{{{steps}}}'

# 1 Cybersecurity: shackle lifts and clicks down; trace round the shield face
build('cybersecurity',{1:'sh',2:'sh',3:'sh'},[(0,'tr1'),(6,'tr2')],
 f'.sh{{animation:sh 6s {EASE} infinite}}@keyframes sh{{0%,58%{{transform:translateY(0)}}66%{{transform:translateY(-7px)}}76%,100%{{transform:translateY(0)}}}}',
 trace_kf('tr1',6)+trace_kf('tr2',6,.25))
# 2 KI: a charge runs down the bolt's front edge, then the side
build('ki-automatisierung',{},[(3,'tr1'),(2,'tr2')],'',
 trace_kf('tr1',4.5)+trace_kf('tr2',4.5,.35))
# 3 Compliance: tick draws in, holds, fades and redraws; trace round the rim
build('compliance',{2:'ck'},[(3,'tr1')],
 f'.ck{{stroke-dasharray:100;animation:ck 6s {EASE} infinite}}@keyframes ck{{0%{{stroke-dashoffset:100;fill-opacity:0}}22%{{stroke-dashoffset:0;fill-opacity:0}}34%,88%{{stroke-dashoffset:0;fill-opacity:.75}}100%{{stroke-dashoffset:0;fill-opacity:.75}}}}',
 trace_kf('tr1',6,1.2))
# 4 Managed IT: cursor taps the globe; trace orbits the globe
build('managed-it',{i:'cu' for i in range(16,23)},[(23,'tr1')],
 f'.cu{{animation:cu 5s {EASE} infinite}}@keyframes cu{{0%,40%{{transform:translate(0,0)}}52%{{transform:translate(-5px,-4px)}}58%{{transform:translate(-4px,-3px)}}72%,100%{{transform:translate(0,0)}}}}',
 trace_kf('tr1',5,.4))
# 5 Cloud backup: trace runs round the refresh arrow, twice per loop
build('cloud-backup',{},[(6,'tr1'),(10,'tr2')],'',
 trace_kf('tr1',4)+trace_kf('tr2',4,.3))
