import re, numpy as np
from rot import parse, vecs, PSI0, sample
import os
SRC=os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..') + '/'
KV=1/1.0789
U,W,V=vecs(PSI0); V=V*KV
M=np.array([U,V]).T
def subs(cmds):
    out=[];cur=[]
    for c in cmds:
        if c[0]=='M' and cur: out.append(cur);cur=[]
        cur.append(c)
    if cur: out.append(cur)
    return out
def load(n):
    s=open(SRC+f'wwd-icon-{n}.svg').read(); t=re.findall(r'<path [^>]*/>',s)
    return [parse(re.search(r' d="([^"]+)"',x).group(1)) for x in t]
def to_world(cmds,b=0.0):
    out=[]
    for c,a in cmds:
        if c=='Z': out.append(['Z',[]]);continue
        v=[]
        for i in range(0,len(a),2):
            aa,cc=np.linalg.solve(M,np.array(a[i:i+2])-b*W); v+=[aa,-cc]
        out.append([c,v])
    return out
def dstr(cmds):
    return ''.join(c+' '.join(f'{x:.2f}' for x in a) for c,a in cmds)
