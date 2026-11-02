"""Renderiza los clips verticales 9:16 definidos en clips.json (audio recortado + relleno de silencio para la llamada a la acción)."""
import json, subprocess, sys, os
ep = sys.argv[1]  # carpeta del episodio
clips = json.load(open(f'{ep}/video/clips.json', encoding='utf-8'))
only = sys.argv[2:]  # ids opcionales
for c in clips:
    if only and c['id'] not in only: continue
    t0, fr, t1 = c['t0'], c['freeze'], c['t1']
    dur = round(t1 - t0, 3)
    wav = f"{ep}/out/{c['id']}_audio.wav"
    # audio: voz+efectos del maestro de t0 a freeze, con fundido corto y silencio hasta t1
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', str(t0), '-t', str(fr - t0 + 0.05), '-i', f'{ep}/audio/{os.path.basename(os.path.normpath(ep))}_master.wav',
                    '-af', f"afade=t=in:st=0:d=0.06,afade=t=out:st={fr - t0 - 0.15:.3f}:d=0.2,apad=whole_dur={dur}", '-ar', '48000', wav], check=True)
    q = f"fmt=9x16&t0={t0}&freeze={c.get('vfreeze', fr)}&t1={t1}"  # vfreeze: congelar la imagen antes que el audio
    out = f"{ep}/out/{c['file']}"
    subprocess.run(['node', '/home/user/Contenido/tools/render.js', '--page', f'{ep}/video/index.html', '--query', q,
                    '--w', '1080', '--h', '1920', '--fps', '30', '--start', '0', '--end', str(dur), '--workers', '3',
                    '--fmt', 'png', '--crf', '19', '--audio', wav, '--out', out], check=True)
    os.remove(wav)
    print('clip listo', out, dur, 's')
