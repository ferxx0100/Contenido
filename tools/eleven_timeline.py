"""Une partes narradas con ElevenLabs (mp3 + _align.json) en un audio continuo y un timeline por palabra.
Uso: python3 -I tools/eleven_timeline.py <dir_audio> <prefijo> <n_partes> <out_dir_timing> [gap_s=0.8]
Escribe <dir_audio>/<prefijo>_voz.wav, <dir_audio>/<prefijo>_voz_completa.mp3 y <out>/timeline_words.json."""
import json, subprocess, sys, wave
d, pre, n, out = sys.argv[1], sys.argv[2], int(sys.argv[3]), sys.argv[4]
GAP = float(sys.argv[5]) if len(sys.argv) > 5 else 0.8
words, segs, off, ins = [], [], 0.0, []
for i in range(1, n + 1):
    wav = f'{d}/{pre}_p{i}.wav'
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', f'{d}/{pre}_parte{i}.mp3', '-ac', '1', '-ar', '48000', wav], check=True)
    with wave.open(wav) as w: dur = w.getnframes() / w.getframerate()
    A = json.load(open(f'{d}/{pre}_parte{i}_align.json', encoding='utf-8'))
    t, al = A['text'], A['alignment']; S, E = al['character_start_times_seconds'], al['character_end_times_seconds']
    assert ''.join(al['characters']) == t
    j, L, ps = 0, len(t), len(words)
    while j < L:
        if t[j].isspace(): j += 1; continue
        k = j
        while k < L and not t[k].isspace(): k += 1
        w = t[j:k]; pe = t[k:k + 2] == '\n\n' or k >= L
        words.append({'w': w, 'start': round(off + S[j], 3), 'end': round(off + E[k - 1], 3),
                      'punct': ''.join(c for c in w[-2:] if c in '.,:;!?'), 'para_end': pe})
        if pe:
            segs.append({'text': ' '.join(x['w'] for x in words[ps:]), 'start': words[ps]['start'], 'end': words[-1]['end']}); ps = len(words)
        j = k
    ins += ['-i', wav]; off += dur + GAP
total = off - GAP
json.dump({'words': words, 'segments': segs, 'duration': round(total, 3)}, open(f'{out}/timeline_words.json', 'w', encoding='utf-8'), ensure_ascii=False)
# audio continuo con silencios entre partes
fc, cmd = '', ['ffmpeg', '-v', 'error', '-y']
for i in range(n):
    cmd += ins[2 * i:2 * i + 2]
    if i < n - 1: cmd += ['-f', 'lavfi', '-t', str(GAP), '-i', 'anullsrc=r=48000:cl=mono']
m = 2 * n - 1
cmd += ['-filter_complex', ''.join(f'[{i}]' for i in range(m)) + f'concat=n={m}:v=0:a=1', f'{d}/{pre}_voz.wav']
subprocess.run(cmd, check=True)
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', f'{d}/{pre}_voz.wav', '-b:a', '192k', f'{d}/{pre}_voz_completa.mp3'], check=True)
for i in range(1, n + 1):
    import os; os.remove(f'{d}/{pre}_p{i}.wav')
print(len(words), 'palabras', len(segs), 'párrafos', round(total, 2), 's')
