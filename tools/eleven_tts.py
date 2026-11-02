"""Narra un texto con ElevenLabs y guarda MP3 + alineación por carácter.
Uso: python3 -I tools/eleven_tts.py texto.txt salida_sin_extension [voice_id] [model_id]
La clave la inyecta el entorno (Network secrets); no se lee ni se guarda aquí."""
import sys, json, base64, urllib.request
txt, out = sys.argv[1], sys.argv[2]
voice = sys.argv[3] if len(sys.argv) > 3 else 'qIViwRC6Yj0rDEwrCiEN'   # Emiliano
model = sys.argv[4] if len(sys.argv) > 4 else 'eleven_v4'
text = open(txt, encoding='utf-8').read().strip()
# modo streaming: la respuesta llega por pedazos (una línea JSON por pedazo) y la conexión no se queda callada
req = urllib.request.Request(f'https://api.elevenlabs.io/v1/text-to-speech/{voice}/stream/with-timestamps?output_format=mp3_44100_192',
                             data=json.dumps({'text': text, 'model_id': model}).encode(), headers={'Content-Type': 'application/json'})
audio = bytearray(); A = {'characters': [], 'character_start_times_seconds': [], 'character_end_times_seconds': []}
with urllib.request.urlopen(req, timeout=900) as resp:
    for line in resp:
        line = line.strip()
        if not line: continue
        ch = json.loads(line)
        if ch.get('audio_base64'): audio += base64.b64decode(ch['audio_base64'])
        al = ch.get('alignment')
        if al:
            for k in A: A[k] += al[k]
open(out + '.mp3', 'wb').write(audio)
json.dump({'text': text, 'alignment': A}, open(out + '_align.json', 'w', encoding='utf-8'), ensure_ascii=False)
print(out, len(text), 'caracteres', len(A['characters']), 'alineados', A['character_end_times_seconds'][-1] if A['characters'] else None, 's')
