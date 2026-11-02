"""Forced alignment of known narration text to TTS audio using pause detection + DP.
Usage: python3 -I align.py <work_dir> <out_json>
"""
import sys, json, re, unicodedata
import numpy as np
SR = 16000; HOP = 0.01
work = sys.argv[1]; out = sys.argv[2]
PARTS = [("Audio_01_Gancho_y_Razones", "text/part1.txt"),
         ("Audio_02_Pasos", "text/part2.txt"),
         ("Audio_03_Bonus_y_Cierre", "text/part3.txt")]
PRON = {"bbva": "bebeuvea", "iphone": "aifon", "deloitte": "deloit", "apple": "apol", "rappi": "rapi"}

def load(p): return np.fromfile(p, dtype=np.int16).astype(np.float32)/32768.0
def env_db(x, win=0.02, hop=HOP):
    n=int(SR*win); h=int(SR*hop); m=1+(len(x)-n)//h
    idx=np.arange(n)[None,:]+h*np.arange(m)[:,None]
    return 20*np.log10(np.sqrt(np.mean(x[idx]**2,axis=1))+1e-9)

def speech_segments(e, thr=-40.0, min_sil=0.10, min_sp=0.08):
    sp = e > thr; segs=[]; i=0; N=len(sp)
    while i<N:
        if sp[i]:
            j=i
            while j<N and sp[j]: j+=1
            segs.append([i,j]); i=j
        else: i+=1
    merged=[]
    for s in segs:
        if merged and (s[0]-merged[-1][1])*HOP < min_sil: merged[-1][1]=s[1]
        else: merged.append(list(s))
    # absorb tiny blips into nearest neighbour
    out=[]
    for s in merged:
        if (s[1]-s[0])*HOP < min_sp and out:
            out[-1][1]=s[1]
        else: out.append(s)
    return [(a*HOP+0.01, b*HOP+0.01) for a,b in out]  # +10ms: window centre correction

def strip_acc(s):
    return ''.join(c for c in unicodedata.normalize('NFD', s) if unicodedata.category(c)!='Mn')

def phon_weight(word):
    w = re.sub(r"[^\wáéíóúüñÁÉÍÓÚÜÑ]", "", word).lower()
    w = PRON.get(strip_acc(w), w)
    w = strip_acc(w)
    w = w.replace('ch','C').replace('ll','L').replace('rr','R').replace('qu','k').replace('gue','ge').replace('gui','gi')
    w = re.sub(r'h', '', w)
    return max(1, len(w)) + 0.6  # per-word overhead

def tokenize(text):
    words=[]
    paras=[p for p in text.strip().split('\n\n')]
    for pi,p in enumerate(paras):
        toks=p.split()
        for ti,t in enumerate(toks):
            punct = ''
            m = re.search(r'([.,:;!?¿¡]+)$', t)
            if m: punct = m.group(1)
            words.append({"w": t, "punct": punct, "para_end": ti==len(toks)-1, "weight": phon_weight(t)})
    return words

def boundary_pen(word):
    """penalty for placing a PAUSE right after this word"""
    p=word["punct"]
    if word["para_end"] or any(c in p for c in '.!?'): return 0.0
    if ':' in p or ';' in p: return 0.1
    if ',' in p: return 0.3
    return 2.5
def missed_pen(word):
    """penalty for NOT pausing after this word (word is inside a segment)"""
    p=word["punct"]
    if word["para_end"]: return 4.0
    if any(c in p for c in '.!?'): return 2.5
    if ':' in p or ';' in p: return 1.2
    if ',' in p: return 0.25
    return 0.0

SOFT=0.17
def align(segs, words):
    M=len(segs); N=len(words)
    D=np.array([b-a for a,b in segs]); C=np.array([w["weight"] for w in words])
    r = D.sum()/C.sum()
    gaps=[segs[k+1][0]-segs[k][1] for k in range(M-1)]
    cum=np.concatenate([[0],np.cumsum(C)])
    miss=np.array([missed_pen(w) for w in words]); cmiss=np.concatenate([[0],np.cumsum(miss)])
    bpen=np.array([boundary_pen(w) for w in words])
    INF=1e18; MAXW=45
    F=np.full((M+1,N+1),INF); B=np.zeros((M+1,N+1),dtype=int); G=np.zeros((M+1,N+1),dtype=int)
    F[0,0]=0
    for j in range(1,M+1):
        # candidate group starts: segments js..j-1 (0-based) merged if inner gaps are soft
        starts=[j-1]
        k=j-2
        while k>=0 and gaps[k] < SOFT and len(starts)<4:
            starts.append(k); k-=1
        for i in range(1,N+1):
            best=INF; bi=-1; bg=-1
            lo=max(0,i-MAXW)
            for js in starts:
                Dj=segs[j-1][1]-segs[js][0]
                ngap=(j-1)-js
                for ip in range(lo,i):
                    f=F[js,ip]
                    if f>=INF: continue
                    pred=r*(cum[i]-cum[ip])
                    z=(Dj-pred)/(0.15*pred+0.15)
                    cost=f+z*z+(cmiss[i-1]-cmiss[ip])+0.35*ngap
                    cost+=bpen[i-1] if j<M else 0.0
                    if cost<best: best=cost; bi=ip; bg=js
            F[j,i]=best; B[j,i]=bi; G[j,i]=bg
    assign=[]; i=N; j=M
    while j>0:
        ip=B[j,i]; js=G[j,i]; assign.append((js,j-1,ip,i)); i=ip; j=js
    assign.reverse()
    return assign, r, F[M,N]

def word_times_in_segment(seg, ws, e):
    a,b=seg; tot=sum(w["weight"] for w in ws); t=a; res=[]
    for w in ws:
        d=(b-a)*w["weight"]/tot; res.append((t,t+d)); t+=d
    return res

result={"parts":[]}
for name, tfile in PARTS:
    x=load(f"{work}/{name}.pcm"); e=env_db(x)
    segs=speech_segments(e)
    words=tokenize(open(f"{work}/{tfile}",encoding="utf-8").read())
    assign,r,cost=align(segs,words)
    print(f"== {name}: {len(segs)} segments, {len(words)} words, rate={r*1000:.1f} ms/unit, total cost={cost:.2f}")
    part={"name":name,"duration":len(x)/SR,"segments":[],"words":[]}
    bad=0
    for (js,j,i0,i1) in assign:
        ws=words[i0:i1]; seg=(segs[js][0],segs[j][1])
        pred=r*sum(w["weight"] for w in ws); dur=seg[1]-seg[0]
        flag = "" if abs(dur-pred) < 0.3*pred+0.2 else "  <<< CHECK"
        if flag: bad+=1
        txt=' '.join(w["w"] for w in ws)
        print(f"{j:3d} {seg[0]:7.2f}-{seg[1]:7.2f} d={dur:5.2f} p={pred:5.2f}{flag} | {txt}")
        times=word_times_in_segment(seg, ws, e)
        part["segments"].append({"start":round(seg[0],3),"end":round(seg[1],3),"text":txt})
        for w,(s,t) in zip(ws,times):
            part["words"].append({"w":w["w"],"start":round(s,3),"end":round(t,3),"punct":w["punct"],"para_end":w["para_end"]})
    print(f"   segments flagged: {bad}")
    result["parts"].append(part)
json.dump(result, open(out,"w",encoding="utf-8"), ensure_ascii=False, indent=1)
