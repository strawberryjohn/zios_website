import re, math
import numpy as np
from rot import parse, fmt, sample, vecs, PSI0
import os
SRC=os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..') + '/'
def subpaths(cmds):
    out=[];cur=[]
    for c in cmds:
        if c[0]=='M' and cur: out.append(cur);cur=[]
        cur.append(c)
        if c[0]=='Z': out.append(cur);cur=[]
    if cur: out.append(cur)
    return out
MINHITS=3
def turn_icon(name, front, bands, theta, bmax=90, tol=0.7, N=56, overrides=None, bandd=None, debug=None, levels_fixed=None, groups=None):
    s=open(SRC+f'wwd-icon-{name}.svg').read()
    tags=re.findall(r'<path [^>]*/>',s)
    P=[parse(re.search(r' d="([^"]+)"',t).group(1)) for t in tags]
    U,W,V=vecs(PSI0)
    M=np.array([U,V]).T
    # groups: list of (paths, front paths, fixed levels or None); default one group
    grp=groups or [(list(range(len(P))),front,levels_fixed)]
    gof={}
    Wn=W/np.hypot(*W); Wp=np.array([-Wn[1],Wn[0]])
    from collections import Counter
    GD=[]
    for gi,(gp,gf,gl) in enumerate(grp):
        for k in gp: gof[k]=gi
        Fg=np.array([q for i in gf for q in sample(P[i])])
        FA=np.array([a[-2:] for i in gf for c,a in P[i] if c!='Z'])
        if gl is None:
            hits=[]
            for ii in gp:
                if ii in gf: continue
                for c,a in P[ii]:
                    if c=='Z': continue
                    dv=np.array(a[-2:])[None,:]-FA
                    r=np.abs(dv@Wp); bb=(dv@W)/(W@W)
                    ok=(r<0.35)&(bb>1.5)&(bb<bmax)
                    hits+=list(np.round(bb[ok]*2)/2)
            cnt=Counter(hits); lv=[0.0]
            for bb,kk in cnt.most_common():
                if kk<MINHITS: break
                if all(abs(bb-l)>1.0 for l in lv): lv.append(float(bb))
        else: lv=list(gl)
        print(name,'group',gi,'levels',lv)
        fine=np.concatenate([np.arange(l-0.75,l+0.751,0.25) for l in lv])
        GD.append((Fg,fine))
    F=np.concatenate([g[0] for g in GD])
    ov={(round(k[0],1),round(k[1],1)):v for k,v in (overrides or {}).items()}
    cache={}
    cur_group=[0]
    def depth(p):
        r1=(round(p[0],1),round(p[1],1))
        if r1 in ov: return ov[r1]
        gi=cur_group[0]
        key=(gi,round(p[0],2),round(p[1],2))
        if key in cache: return cache[key]
        Fg,fine=GD[gi]
        if np.sqrt(((F-np.array(p)[None,:])**2).sum(1)).min()<tol:
            cache[key]=0.0; return 0.0
        q=np.array(p)[None,:]-fine[:,None]*W[None,:]
        d=np.sqrt(((q[:,None,:]-Fg[None,:,:])**2).sum(-1)).min(1)
        z=np.argmin(np.abs(fine))
        if d[z]<tol: r=0.0
        elif d.min()<tol: r=float(fine[np.argmin(d)])
        else:
            cont=np.arange(0.5,bmax,0.25)
            q2=np.array(p)[None,:]-cont[:,None]*W[None,:]
            d2=np.sqrt(((q2[:,None,:]-F[None,:,:])**2).sum(-1)).min(1)
            okk=np.where(d2<tol)[0]
            r=float(cont[okk[0]]) if len(okk) else float(fine[np.argmin(d)])
        cache[key]=r; return r
    def world(p,b):
        a,c=np.linalg.solve(M,np.array(p)-b*W); return a,b,c
    def proj(w,th):
        U2,W2,V2=vecs(PSI0+math.radians(th)); a,b,c=w; return a*U2+b*W2+c*V2
    # per-point world coords for every path (shared by rest and turned)
    worlds=[]
    for kk,cmds in enumerate(P):
        cur_group[0]=gof.get(kk,0)
        wl=[];prevb=0
        for c,a in cmds:
            if c=='Z': wl.append((c,[]));continue
            if c in 'ML':
                b=depth(a);wl.append((c,[world(a,b)]));prevb=b
            else:
                b3=depth(a[4:6]);wl.append((c,[world(a[0:2],prevb),world(a[2:4],b3),world(a[4:6],b3)]));prevb=b3
        worlds.append(wl)
    def draw(wl,th):
        out=[]
        for c,ws in wl:
            out.append([c,[v for w in ws for v in proj(w,th)]])
        return out
    # band rebuild data
    bandinfo={}
    for bi,(outline_path,limits) in bands.items():
        sub=subpaths(P[outline_path])[0]
        osamp=np.array(sample(sub,40))
        # dedupe
        keep=[0]
        for i in range(1,len(osamp)):
            if np.hypot(*(osamp[i]-osamp[keep[-1]]))>0.3: keep.append(i)
        osamp=osamp[keep]; K=len(osamp)
        ow=[world(p,0.0) for p in osamp]
        cur_group[0]=gof.get(bi,0)
        bsamp=np.array(sample(P[bi],30))
        bd=[depth(p) for p in bsamp]
        fronts=[p for p,b in zip(bsamp,bd) if abs(b)<0.01]
        backs=[b for b in bd if abs(b)>2]
        d=float(np.median(backs)) if not (bandd and bi in bandd) else bandd[bi]
        fronts=[p for p in fronts if np.sqrt(((osamp-p)**2).sum(1)).min()<0.8]
        idx=sorted(set(int(np.argmin(((osamp-p)**2).sum(1))) for p in fronts))
        # circular range = complement of largest gap
        gaps=[((idx[(k+1)%len(idx)]-idx[k])%K,k) for k in range(len(idx))]
        g,k=max(gaps); i1=idx[(k+1)%len(idx)]; i2=idx[k]
        bandinfo[bi]=(ow,K,d,i1,i2,limits)
    def band_d(bi,th):
        ow,K,d,i1,i2,limits=bandinfo[bi]
        U2,W2,V2=vecs(PSI0+math.radians(th)); U0,W0,V0=vecs(PSI0)
        O=np.array([a*U2+c*V2 for a,_,c in ow]); O0=np.array([a*U0+c*V0 for a,_,c in ow])
        def crs(Oa,Wv,i):
            t=Oa[(i+1)%K]-Oa[(i-1)%K]; t=t/np.hypot(*t); return t[0]*Wv[1]-t[1]*Wv[0]
        def adjust(i,Wv,Oa,dyn):
            if not dyn: return i
            best=None
            for off in range(0,90):
                for j in (i+off,i-off):
                    j%=K
                    if crs(Oa,Wv,j)*crs(Oa,Wv,(j+1)%K)<=0: best=j;break
                if best is not None: break
            return i if best is None else best
        def corner(i):
            a=O0[i]-O0[(i-4)%K]; b=O0[(i+4)%K]-O0[i]
            ca=(a@b)/(np.hypot(*a)*np.hypot(*b)+1e-9); return ca<math.cos(math.radians(25))
        dyn1=not corner(i1); dyn2=not corner(i2)
        j1=adjust(i1,W2,O,dyn1); j2=adjust(i2,W2,O,dyn2)
        if th==0: j1=adjust(i1,W0,O0,dyn1); j2=adjust(i2,W0,O0,dyn2)
        L=(j2-j1)%K
        ts=np.linspace(0,L,N)
        pts=[]
        for t in ts:
            f=j1+t; i=int(math.floor(f))%K; fr=f-math.floor(f)
            pts.append(O[i]*(1-fr)+O[(i+1)%K]*fr)
        Dv=d*W2
        chain=[('M' if k==0 else 'L',list(p)) for k,p in enumerate(pts)]
        chain+=[('L',list(p+Dv)) for p in reversed(pts)]
        chain.append(('Z',[]))
        return chain
    if debug is not None:
        for k in debug:
            print(k,[(round(a[-2],1),round(a[-1],1),depth(a[-2:])) for c,a in P[k] if c!='Z'])
    def all_paths(th):
        res=[]
        for k in range(len(P)):
            res.append(band_d(k,th) if k in bandinfo else draw(worlds[k],th))
        return res
    return s,tags,all_paths
def fit(rest,turned,box=(4,196)):
    def pts(paths): return np.array([v for p in paths for c,a in p for v in zip(a[0::2],a[1::2])])
    r=pts(rest); t=pts(turned)
    rc=(r.min(0)+r.max(0))/2; tc=(t.min(0)+t.max(0))/2
    span=(t.max(0)-t.min(0)).max(); rspan=(r.max(0)-r.min(0)).max()
    sc=min(1.0, max(rspan, box[1]-box[0]-8)/span) if span>0 else 1
    sc=min(sc,(box[1]-box[0])/span)
    out=[]
    for p in turned:
        q=[]
        for c,a in p:
            xy=np.array(a).reshape(-1,2) if a else np.zeros((0,2))
            xy=(xy-tc)*sc+rc
            q.append([c,list(xy.reshape(-1))])
        out.append(q)
    return out,sc
