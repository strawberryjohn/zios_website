import re, math, sys
import numpy as np
import os
SRC=os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..') + '/'
ALPHA=math.asin(math.sqrt(math.tan(math.radians(30))*0.5))
PSI0=math.atan(math.tan(math.radians(30))/math.sin(ALPHA))
def vecs(psi):
    U=np.array([math.cos(psi), math.sin(psi)*math.sin(ALPHA)])
    W=np.array([math.sin(psi), -math.cos(psi)*math.sin(ALPHA)])
    V=np.array([0.0,-math.cos(ALPHA)])
    return U,W,V
def parse(d):
    toks=re.findall(r'[MLHVCZ]|-?\d*\.?\d+(?:e-?\d+)?',d)
    out=[];i=0;cur=(0,0)
    while i<len(toks):
        c=toks[i];i+=1
        if c=='Z': out.append(['Z',[]]);continue
        n={'M':2,'L':2,'H':1,'V':1,'C':6}[c]
        while i<len(toks) and not toks[i].isalpha():
            a=[float(x) for x in toks[i:i+n]];i+=n
            if c=='H': c2,a='L',[a[0],cur[1]]
            elif c=='V': c2,a='L',[cur[0],a[0]]
            else: c2=c
            out.append([c2,a]); cur=(a[-2],a[-1])
            if c=='M': c='L'
    return out
def fmt(cmds):
    o=[]
    for c,a in cmds: o.append(c+' '.join(f'{v:.2f}'.rstrip('0').rstrip('.') for v in a))
    return ''.join(o)
def sample(cmds,n=24):
    pts=[];cur=None;start=None
    for c,a in cmds:
        if c=='M': cur=np.array(a);start=cur;pts.append(cur)
        elif c=='L':
            p=np.array(a)
            for t in np.linspace(0,1,n)[1:]: pts.append(cur+(p-cur)*t)
            cur=p
        elif c=='C':
            p1,p2,p3=np.array(a[0:2]),np.array(a[2:4]),np.array(a[4:6])
            for t in np.linspace(0,1,n)[1:]:
                pts.append((1-t)**3*cur+3*(1-t)**2*t*p1+3*(1-t)*t*t*p2+t**3*p3)
            cur=p3
        elif c=='Z' and start is not None:
            for t in np.linspace(0,1,n)[1:]: pts.append(cur+(start-cur)*t)
            cur=start
    return pts
def solve(name, front_idx, theta_deg, bmax=90, tol=0.7):
    s=open(SRC+f'wwd-icon-{name}.svg').read()
    paths=re.findall(r'<path [^>]*/>',s)
    P=[parse(re.search(r' d="([^"]+)"',p).group(1)) for p in paths]
    U,W,V=vecs(PSI0); U2,W2,V2=vecs(PSI0+math.radians(theta_deg))
    F=np.array([q for i in front_idx for q in sample(P[i])])
    bs=np.arange(-bmax,bmax+0.001,0.25)
    cache={}
    def depth(p):
        key=(round(p[0],2),round(p[1],2))
        if key in cache: return cache[key]
        q=np.array(p)[None,:]-bs[:,None]*W[None,:]
        d=np.sqrt(((q[:,None,:]-F[None,:,:])**2).sum(-1)).min(1)
        i0=np.argmin(np.abs(bs))
        r=0.0 if d[i0]<tol else float(bs[np.argmin(d+np.abs(bs)*0.002)])
        cache[key]=r; return r
    M=np.array([U,V]).T
    def xf(p,b):
        q=np.array(p)-b*W
        a,c=np.linalg.solve(M,q)
        return a*U2+b*W2+c*V2
    out=[]
    for k,cmds in enumerate(P):
        new=[];prevb=0
        for c,a in cmds:
            if c=='Z': new.append(['Z',[]]);continue
            if c in 'ML':
                b=depth(a[0:2]); new.append([c,list(xf(a,b))]);prevb=b
            else:
                b3=depth(a[4:6])
                p1=xf(a[0:2],prevb);p2=xf(a[2:4],b3);p3=xf(a[4:6],b3)
                new.append(['C',list(p1)+list(p2)+list(p3)]);prevb=b3
        out.append((paths[k],fmt(cmds),fmt(new)))
    return s,out
def render(name,front,theta,outfile):
    s,out=solve(name,front,theta)
    t=s
    for orig,d0,d1 in out:
        t=t.replace(orig, re.sub(r' d="[^"]+"',f' d="{d1}"',orig),1)
    open(outfile,'w').write(t)
if __name__=='__main__':
    print(math.degrees(ALPHA),math.degrees(PSI0))
    cfg={'cybersecurity':[0],'ki-automatisierung':[3],'compliance':[0],'managed-it':[0,18],'cloud-backup':[0,6]}
    for n,f in cfg.items():
        for th in (25,-25):
            render(n,f,th,f'{n}_{th}.svg')
        print('done',n)
