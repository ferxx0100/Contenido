# SISTEMA · contenido

Serie de finanzas personales por niveles ("No es falta de disciplina. Es falta de sistema.").
Este repositorio guarda todo lo necesario para producir y publicar cada episodio: narración, sincronía, motor de animación, renders, diseño y kit de publicación.

## Episodio 1 · Sistema 1 · A dónde se va tu dinero

| Qué | Dónde |
|---|---|
| Video 16:9 para YouTube y video podcast de Spotify (5:47, 1080p30, −14 LUFS) | `episodios/ep01/out/SISTEMA_Ep01_16x9_YouTube.mp4` |
| 11 clips verticales 9:16 con subtítulos (Shorts, TikTok, Reels, Facebook) · plan en `episodios/ep01/kit_publicacion/shorts_plan.md` | `episodios/ep01/out/SISTEMA_Ep01_clip*_9x16.mp4` |
| Audio para podcast (MP3 192 kbps) | `episodios/ep01/audio/SISTEMA_Ep01_audio.mp3` |
| Subtítulos SRT (es-MX) | `episodios/ep01/timing/ep01_es.srt` |
| Miniaturas y portada 3000×3000 | `marca/direccion_A_libro_mayor/png/` |
| Títulos, descripciones, capítulos y textos por red | `episodios/ep01/kit_publicacion/` |
| Narración real (texto de ElevenLabs) y guion original | `episodios/ep01/guion/` |

**Antes de publicar, lee `episodios/ep01/kit_publicacion/LEEME_antes_de_publicar.md`.**

## Cómo está hecho
- **Voz:** ElevenLabs (flow "Sistema 01 - A dónde se va el dinero (narración)", modelo `eleven_v4`).
- **Sincronía:** `tools/align.py` alinea el texto exacto de la narración con las pausas del audio (programación dinámica, sin ASR) → `timing/timing.js` con el tiempo de cada palabra.
- **Animación:** HTML/CSS/JS propio (`episodios/ep01/video/`). Todo es función del tiempo `t` (`window.__seek(t)`), así que cada cuadro es reproducible y queda pegado a la voz. Sin librerías externas ni licencias.
- **Diseño:** dirección "Libro mayor editorial" (`marca/direccion_A_libro_mayor/`): papel de libro contable, renglones cada 54 px, doble margen bermellón, Inter Display + JetBrains Mono + Bitstream Charter itálica, un solo acento `#C4361C`.
- **Render:** `tools/render.js` captura cada cuadro con Chromium (Playwright) y codifica con ffmpeg en paralelo.
- **Audio:** `tools/sfx_mix.py` sintetiza efectos sutiles (tic, golpe, tachado, tecleo…) en los tiempos que declara cada escena y masteriza a −14 LUFS / −1 dBTP.

## Re-renderizar
```bash
cd episodios/ep01
node ../../tools/export_sfx.js video/index.html timing/sfx.json
python3 -I ../../tools/sfx_mix.py audio/ep01_voz_completa.mp3 timing/sfx.json audio/ep01_master.wav
node ../../tools/render.js --page video/index.html --query "fmt=16x9" --w 1920 --h 1080 --fps 30 --start 0 --end 347.2 --workers 3 --audio audio/ep01_master.wav --out out/SISTEMA_Ep01_16x9_YouTube.mp4
python3 -I ../../tools/render_clips.py "$PWD"
```
Vista previa en navegador: abre `video/index.html?play=1` (16:9) o `video/index.html?fmt=9x16&t=48` (vertical, congelado en el segundo 48).
Cuadros sueltos: `node ../../tools/render.js --page video/index.html --query fmt=16x9 --still "12,47.6" --png /tmp/cuadro`.

## Siguiente episodio (receta)
1. Escribe la narración y genérala en ElevenLabs con la misma voz.
2. Copia `episodios/ep01` → `episodios/ep02`, pon los textos en `timing/texto/` y corre `tools/align.py` + `tools/offsets.py` + `tools/build_timing.py`.
3. Reescribe las escenas (`scenes_*.js`) usando los mismos componentes y `cue('frase exacta')` para amarrarlas a la voz.
4. Render 16:9 + clips, miniatura y kit.

## Formato de entrega de Shorts (usar siempre)
Cada episodio se entrega igual que el Ep01:
1. Clips 9:16 en `episodios/epXX/out/`, definidos en `video/clips.json` y renderizados con `tools/render_clips.py`. Cada clip empieza y termina en frase completa y no usa datos sin fuente verificada.
2. Una página de publicación como `episodios/ep01/kit_publicacion/shorts_checklist.html`, publicada como Artifact. Por cada clip, en orden de publicación (uno por día), trae: botón **Descargar video** (enlace a raw.githubusercontent.com fijado al commit), **título** (solo YouTube) con botón Copiar, **descripción** con hashtags + "Contenido educativo; no es asesoría financiera. Voz generada con IA." con botón Copiar, y casillas YouTube / TikTok / Instagram + Facebook.
3. Arriba de la página, los pasos de dónde pegar cada cosa en cada app del celular, incluida la etiqueta de IA.
