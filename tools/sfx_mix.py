"""Sintetiza efectos de sonido sutiles, los mezcla bajo la voz y entrega un WAV maestro.
Uso: python3 -I sfx_mix.py <voz.mp3|wav> <sfx.json> <salida.wav> [--no-sfx]
"""
import sys, json, subprocess, numpy as np
SR = 48000
voice_path, sfx_path, out_path = sys.argv[1:4]
use_sfx = '--no-sfx' not in sys.argv
rng = np.random.default_rng(7)

def env_exp(n, tau): return np.exp(-np.arange(n) / (tau * SR))
def tone(f0, f1, dur, tau, phase=0.0):
    n = int(dur * SR); t = np.arange(n) / SR
    f = f0 * (f1 / f0) ** (t / dur) if f1 != f0 else np.full(n, f0)
    ph = 2 * np.pi * np.cumsum(f) / SR + phase
    return np.sin(ph) * env_exp(n, tau)
def onepole_lp(x, fc):
    a = np.exp(-2 * np.pi * fc / SR); y = np.zeros_like(x); acc = 0.0
    for i in range(len(x)): acc = (1 - a) * x[i] + a * acc; y[i] = acc
    return y
def bandnoise(dur, lo, hi):
    n = int(dur * SR); x = rng.standard_normal(n)
    return onepole_lp(x, hi) - onepole_lp(x, lo)
def fade(x, a=0.002, b=0.01):
    na, nb = int(a * SR), int(b * SR); y = x.copy()
    if na: y[:na] *= np.linspace(0, 1, na)
    if nb: y[-nb:] *= np.linspace(1, 0, nb)
    return y
def db(x, level):  # normaliza el pico a 'level' dBFS
    m = np.max(np.abs(x)) or 1; return x / m * 10 ** (level / 20)

SYN = {}
SYN['tick'] = db(fade(tone(1700, 1600, 0.06, 0.012) + 0.4 * bandnoise(0.06, 2500, 6000) * env_exp(int(0.06 * SR), 0.003)), -27)
SYN['blip'] = db(fade(tone(1150, 1150, 0.08, 0.02)), -30)
SYN['pop'] = db(fade(tone(480, 900, 0.14, 0.05) + 0.25 * tone(960, 1800, 0.14, 0.03)), -23)
k = np.zeros(int(0.17 * SR))
for i, off in enumerate([0.0, 0.05, 0.11]):
    c = bandnoise(0.012, 1800, 5500) * env_exp(int(0.012 * SR), 0.003); s0 = int(off * SR); k[s0:s0 + len(c)] += c * (1 - 0.15 * i)
SYN['type'] = db(fade(k), -31)
n = int(0.55 * SR); t = np.arange(n) / SR
w = rng.standard_normal(n); lp = np.zeros(n); acc = 0.0
for i in range(n):
    fc = 300 + 2400 * np.sin(np.pi * t[i] / 0.55) ** 2; a = np.exp(-2 * np.pi * fc / SR); acc = (1 - a) * w[i] + a * acc; lp[i] = acc
SYN['whoosh'] = db(fade(lp * np.sin(np.pi * t / 0.55) ** 2, 0.01, 0.05), -27)
n = int(1.2 * SR); t = np.arange(n) / SR
r = (0.6 * tone(220, 660, 1.2, 99) + 0.4 * bandnoise(1.2, 400, 3000)) * (t / 1.2) ** 2
SYN['riser'] = db(fade(r, 0.05, 0.08), -31)
SYN['thud'] = db(fade(tone(96, 44, 0.5, 0.16) + 0.15 * bandnoise(0.5, 200, 1200) * env_exp(int(0.5 * SR), 0.01), 0.001, 0.05), -17)
n = int(0.3 * SR); t = np.arange(n) / SR
SYN['strike'] = db(fade(bandnoise(0.3, 1500, 5000) * (0.6 + 0.4 * np.sin(2 * np.pi * 23 * t)) * np.sin(np.pi * t / 0.3), 0.005, 0.03), -31)
ck = np.concatenate([tone(1318, 1318, 0.08, 0.03), tone(1661, 1661, 0.16, 0.05)])
SYN['check'] = db(fade(ck), -29)
cl = np.zeros(int(0.05 * SR)); c1 = bandnoise(0.006, 3000, 9000) * env_exp(int(0.006 * SR), 0.0015); cl[:len(c1)] += c1; cl[int(0.012 * SR):int(0.012 * SR) + len(c1)] += 0.6 * c1
SYN['click'] = db(fade(cl, 0.0005, 0.005), -25)
n = int(0.14 * SR); t = np.arange(n) / SR
SYN['beep'] = db(fade(np.sin(2 * np.pi * 1850 * t) * np.sin(np.pi * t / 0.14) ** 0.5, 0.004, 0.02), -25)

# voz
pcm = subprocess.run(['ffmpeg', '-v', 'error', '-i', voice_path, '-f', 'f32le', '-ac', '2', '-ar', str(SR), '-'], capture_output=True, check=True).stdout
voice = np.frombuffer(pcm, dtype=np.float32).reshape(-1, 2).copy()
data = json.load(open(sfx_path))
total = max(len(voice) / SR, data.get('end') or 0) + 0.5
mix = np.zeros((int(total * SR), 2), dtype=np.float32)
mix[:len(voice)] += voice
if use_sfx:
    for i, e in enumerate(data['events']):
        x = SYN.get(e['type'])
        if x is None: continue
        s0 = int(e['t'] * SR); g = float(e.get('gain', 1)) ** 1.5
        pan = 0.5 + 0.12 * np.sin(i * 1.7)      # leve paneo para dar aire
        seg = x[:max(0, min(len(x), len(mix) - s0))] * g
        mix[s0:s0 + len(seg), 0] += seg * (1 - pan) * 2 * 0.85
        mix[s0:s0 + len(seg), 1] += seg * pan * 2 * 0.85
tmp = out_path + '.raw.wav'
import wave
pcm16 = np.clip(mix, -1, 1)
with wave.open(tmp, 'wb') as wf:
    wf.setnchannels(2); wf.setsampwidth(2); wf.setframerate(SR); wf.writeframes((pcm16 * 32767).astype(np.int16).tobytes())
# loudnorm en dos pasadas: -14 LUFS, -1 dBTP (YouTube / Spotify)
m = subprocess.run(['ffmpeg', '-hide_banner', '-i', tmp, '-af', 'loudnorm=I=-14:TP=-1.0:LRA=11:print_format=json', '-f', 'null', '-'], capture_output=True, text=True).stderr
js = json.loads(m[m.rindex('{'):m.rindex('}') + 1])
af = (f"loudnorm=I=-14:TP=-1.0:LRA=11:measured_I={js['input_i']}:measured_TP={js['input_tp']}:measured_LRA={js['input_lra']}"
      f":measured_thresh={js['input_thresh']}:offset={js['target_offset']}:linear=true")
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', tmp, '-af', af, '-ar', str(SR), out_path], check=True)
import os; os.remove(tmp)
print('ok', out_path, 'dur', round(total, 2), 'sfx', len(data['events']) if use_sfx else 0, 'measured', js['input_i'])
