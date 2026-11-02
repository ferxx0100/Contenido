import sys, json, numpy as np
SR=16000
work=sys.argv[1]
def load(p): return np.fromfile(p,dtype=np.int16).astype(np.float32)/32768.0
full=load(f"{work}/Audio_COMPLETO_Spotify.pcm")
names=["Audio_01_Gancho_y_Razones","Audio_02_Pasos","Audio_03_Bonus_y_Cierre"]
expected=0.0; offs=[]
for n in names:
    x=load(f"{work}/{n}.pcm")
    # search window +-1s around expected offset using FFT xcorr on a 20s excerpt of the part (skip first 0.5s)
    ex=x[int(0.5*SR):int(20.5*SR)]
    lo=max(0,int((expected-1.0+0.5)*SR)); hi=min(len(full), lo+len(ex)+int(2.0*SR))
    seg=full[lo:hi]
    nfft=1<<int(np.ceil(np.log2(len(seg)+len(ex))))
    c=np.fft.irfft(np.fft.rfft(seg,nfft)*np.conj(np.fft.rfft(ex,nfft)),nfft)[:len(seg)-len(ex)+1]
    k=int(np.argmax(c)); off=(lo+k)/SR-0.5
    norm=c[k]/np.sqrt(np.sum(ex**2)*np.sum(seg[k:k+len(ex)]**2))
    print(f"{n}: offset in full = {off:.4f}s (expected {expected:.4f}), ncorr={norm:.4f}, gain={np.sqrt(np.sum(seg[k:k+len(ex)]**2)/np.sum(ex**2)):.3f}")
    offs.append(round(off,4)); expected=off+len(x)/SR
print("full duration", len(full)/SR)
json.dump({"offsets":offs,"full_duration":len(full)/SR}, open(f"{work}/offsets.json","w"))
