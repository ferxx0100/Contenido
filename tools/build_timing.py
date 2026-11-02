"""Genera timing.js (palabras, frases, captions) y subtítulos SRT a partir de la alineación.
Uso: python3 -I tools/build_timing.py <timeline_words.json> <out_dir> [nombre.srt]
Las siglas que se escriben en minúscula para que la voz las diga como palabra (Condusef, iva…) se muestran en mayúsculas en pantalla.
"""
import sys, json, re
src, outdir = sys.argv[1], sys.argv[2]
T = json.load(open(src, encoding='utf-8'))
words = T['words']; segs = T['segments']; dur = T['duration']

SIGLAS = {'condusef': 'CONDUSEF', 'inegi': 'INEGI', 'ensafi': 'ENSAFI', 'iva': 'IVA', 'msi': 'MSI', 'cat': 'CAT'}
def show(w):
    return re.sub(r'[A-Za-zÁÉÍÓÚáéíóúÑñ]+', lambda m: SIGLAS.get(m.group(0).lower(), m.group(0)) if m.group(0).lower() in SIGLAS and m.group(0) != m.group(0).lower().capitalize() or m.group(0).lower() in ('condusef', 'inegi', 'ensafi', 'iva') else m.group(0), w)
def clean(w):
    return re.sub(r'[.,:;!?¿¡]+$', '', show(w))

# --- sentences (for SRT / sentence-level cues)
sentences = []; cur = []
for i, w in enumerate(words):
    cur.append(w)
    if any(c in w['punct'] for c in '.!?') or w['para_end']:
        sentences.append({'text': ' '.join(x['w'] for x in cur), 'start': cur[0]['start'], 'end': cur[-1]['end'], 'i0': i - len(cur) + 1, 'i1': i + 1})
        cur = []
if cur:
    sentences.append({'text': ' '.join(x['w'] for x in cur), 'start': cur[0]['start'], 'end': cur[-1]['end'], 'i0': len(words) - len(cur), 'i1': len(words)})

# --- caption chunks for vertical clips (max ~4 words / 22 chars, break at punctuation or pause)
chunks = []; cur = []
def flush():
    global cur
    if cur:
        chunks.append({'i0': cur[0][0], 'i1': cur[-1][0] + 1, 'start': cur[0][1]['start'], 'end': cur[-1][1]['end'],
                       'text': ' '.join(clean(x[1]['w']) for x in cur)})
    cur = []
for i, w in enumerate(words):
    nxt = words[i + 1] if i + 1 < len(words) else None
    cur.append((i, w))
    chars = sum(len(clean(x[1]['w'])) + 1 for x in cur)
    gap = (nxt['start'] - w['end']) if nxt else 9
    if w['punct'] or w['para_end'] or len(cur) >= 4 or chars >= 22 or gap > 0.22:
        flush()
flush()
# hold each chunk until the next one starts if the gap is short
for a, b in zip(chunks, chunks[1:]):
    a['hold'] = b['start'] if b['start'] - a['end'] < 0.7 else a['end'] + 0.25
chunks[-1]['hold'] = chunks[-1]['end'] + 0.6

out = {'duration': dur,
       'words': [{'w': w['w'], 'c': clean(w['w']), 's': w['start'], 'e': w['end'], 'p': w['punct']} for w in words],
       'segments': [{'t': s['text'], 's': s['start'], 'e': s['end']} for s in segs],
       'sentences': [{'t': s['text'], 's': s['start'], 'e': s['end'], 'i0': s['i0'], 'i1': s['i1']} for s in sentences],
       'chunks': chunks}
with open(f'{outdir}/timing.js', 'w', encoding='utf-8') as f:
    f.write('window.TIMING = ' + json.dumps(out, ensure_ascii=False) + ';\n')
json.dump(out, open(f'{outdir}/timing.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)

# --- SRT (YouTube): split long sentences into <=42-char lines, max 2 lines, max ~6 s per cue
def fmt(t):
    h = int(t // 3600); m = int(t % 3600 // 60); s = t % 60
    return f"{h:02d}:{m:02d}:{int(s):02d},{int(round((s - int(s)) * 1000)):03d}".replace(',1000', ',999')
FUNC = set('de del la el los las y o a al en que lo tu tus mi un una con por para se te no es como sin ni le me su sus'.split())
def split_block(ws):
    text = ' '.join(x['w'] for x in ws)
    if len(text) <= 84 or len(ws) < 4:
        return [ws]
    # candidate cut positions: after word k (1..n-1); prefer punctuation, then balance
    best = None
    for k in range(2, len(ws) - 1):
        left = ' '.join(x['w'] for x in ws[:k]); bal = abs(len(left) - len(text) / 2) / len(text)
        score = bal + (0 if ws[k - 1]['punct'] in (',', ':', ';') else 0.35) + (0.3 if ws[k - 1]['w'].lower() in FUNC else 0)
        if best is None or score < best[0]: best = (score, k)
    k = best[1]
    return split_block(ws[:k]) + split_block(ws[k:])
cues = []
for s in sentences:
    cues.extend(split_block(words[s['i0']:s['i1']]))
lines = []
for k, b in enumerate(cues, 1):
    text = show(' '.join(x['w'] for x in b))
    if len(text) > 42:  # 2 lines: prefer a comma near the middle, else the space closest to the middle
        mid = len(text) // 2; sp = [i for i, c in enumerate(text) if c == ' ']
        def sc(i):
            prev = text[:i].split()[-1].lower()
            return abs(i - mid) - (12 if text[i - 1] in ',:;' else 0) + (9 if prev in FUNC else 0)
        cut = min(sp, key=sc); text = text[:cut] + '\n' + text[cut + 1:]
    end = b[-1]['end'] + 0.15
    if k < len(cues): end = min(end, cues[k][0]['start'] - 0.02)
    lines.append(f"{k}\n{fmt(b[0]['start'])} --> {fmt(end)}\n{text}\n")
open(f'{outdir}/' + (sys.argv[3] if len(sys.argv) > 3 else 'ep01_es.srt'), 'w', encoding='utf-8').write('\n'.join(lines))
print(f"words={len(words)} sentences={len(sentences)} chunks={len(chunks)} srt_cues={len(cues)}")
