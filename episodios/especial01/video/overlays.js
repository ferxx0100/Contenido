/* Capas persistentes del libro mayor: cabeza corrida, pestaña de nivel, pie con fuente/nota (16:9)
   y subtítulos palabra por palabra (9:16). */
(() => {
  'use strict';
  const { h, css, text, P, Ease, clamp, lerp, cue, ctx, T } = S;
  const c = (p, a = 0) => cue(p, a).s;

  // capítulos (cabeza corrida y capítulos de YouTube)
  const CH = [
    { t: c('Esto se llama Sistema'), k: 'INTRO' },
    { t: c('Abre ahorita'), k: 'DIAGNÓSTICO' },
    { t: c('La primera'), k: 'RAZÓN 1 DE 3' },
    { t: c('La segunda'), k: 'RAZÓN 2 DE 3' },
    { t: c('Y la tercera'), k: 'RAZÓN 3 DE 3' },
    { t: c('Ahora sí'), k: 'EJERCICIO' },
    { t: c('Y cuando veas esos números'), k: 'POR QUÉ PASA' },
    { t: c('Según BBVA'), k: 'EL DATO' },
    { t: c('Uno abre las notas'), k: 'PASO 1 DE 4' },
    { t: c('Dos si sueles pagar'), k: 'PASO 2 DE 4' },
    { t: c('Tres revisa tu estado'), k: 'PASO 3 DE 4' },
    { t: c('Cuatro si sabes que viene'), k: 'PASO 4 DE 4' },
    { t: c('Y esas suscripciones que encontraste'), k: 'BONUS' },
    { t: c('Con esto terminas Sistema uno'), k: 'CIERRE' },
  ];
  S.CHAPTERS = CH;
  // notas al pie: etiqueta en la columna de margen + texto en la columna de contenido
  const FOOT = [
    [c('Según Deloitte'), c('El dinero no se te va'), 'FUENTE', 'Deloitte, Global State of the Consumer Tracker (2025) · cada marca es 1 de cada 100'],
    [c('El dinero no se te va'), c('Y esto pasa por tres razones'), 'EJEMPLO', 'Montos ilustrativos'],
    [c('Hay estudios'), c('La segunda'), 'LECTURA', 'Ilustrativo: pagar sin efectivo se siente menos'],
    [c('Los primeros días'), c('Y la tercera'), 'EJEMPLO', 'Compras por día de la quincena: cada bloque es un cargo'],
    [c('Vuelve a tu estado de cuenta'), c('Si en cualquiera'), 'EJEMPLO', 'Cifras ilustrativas. Usa las tuyas'],
    [c('Anota esos cuatro números'), c('Según BBVA'), 'EJEMPLO', 'Cifras ilustrativas. Usa las tuyas'],
    [c('Según BBVA'), c('No es que ganes poco'), 'FUENTE', 'BBVA con datos de CONDUSEF · gastos hormiga, más del 12% de los ingresos'],
    [c('Uno abre las notas'), c('Dos si sueles pagar'), 'EJEMPLO', 'Cifras ilustrativas'],
    [c('Si tienes iPhone'), c('Y una cosa más'), 'RUTA', 'Ajustes › tu nombre › Suscripciones › Cancelar suscripción'],
  ];
  const hudOn = c('No te saltes'), hudOff = c('Vamos con Sistema dos') + 1.4;
  const tabOn = c('Esto se llama Sistema') + 0.4;

  let hud, hudSec, tab, foot, footL, footV, progFill, cap, capWords = [], capChunk = -1, brand, cta, curFoot = -1;
  const CLIP_END = +(ctx.Q.get('t1') || 0), CLIP_T0 = +(ctx.Q.get('t0') || 0);
  (window.__afterBuild ||= []).push(() => {
    const stage = document.getElementById('stage');
    if (!ctx.vertical) {
      hud = h('div', { class: 'hud' },
        h('div', { class: 'hud-l' }, h('span', { class: 'hud-mark' }, 'SISTEMA'), h('span', { class: 'hud-lvl' }, 'Nivel 1'), h('span', { class: 'hud-ttl' }, 'A dónde se va tu dinero')),
        hudSec = h('div', { class: 'hud-r' }, ''));
      tab = h('div', { class: 'tab' }, '1');
      foot = h('div', { class: 'foot' }, h('div', { class: 'prog' }, progFill = h('i')), footL = h('div', { class: 'foot-l' }), footV = h('div', { class: 'foot-v' }));
      stage.append(hud, tab, foot);
    } else {
      brand = h('div', { class: 'vbrand' }, h('span', { class: 'hud-mark' }, 'SISTEMA'), h('span', { class: 'hud-lvl' }, '1'));
      cap = h('div', { class: 'vcap' });
      cta = h('div', { class: 'vcta' }, 'Episodio completo: Sistema 1', h('small', {}, 'EN YOUTUBE Y SPOTIFY · BUSCA “SISTEMA”'));
      stage.append(brand, cap, cta);
    }
  });

  (window.__overlays ||= []).push(t => {
    if (!ctx.vertical) {
      const vis = P(t, hudOn, 0.6) * (1 - P(t, hudOff, 0.5, Ease.exit));
      css(hud, { opacity: vis }); css(foot, { opacity: vis });
      const tp = P(t, tabOn, 0.5, Ease.enter) * (1 - P(t, hudOff + 0.6, 0.4, Ease.exit));
      css(tab, { transform: `translate3d(${((1 - tp) * 70).toFixed(1)}px,0,0)` });
      let cur = ''; for (const ch of CH) if (t >= ch.t - 0.1) cur = ch.k;
      text(hudSec, cur);
      css(progFill, { transform: `scaleX(${clamp((t - hudOn) / (hudOff - hudOn)).toFixed(5)})` });
      let k = -1; FOOT.forEach((f, i) => { if (t >= f[0] - 0.1 && t < f[1] - 0.35) k = i; });
      if (k !== curFoot) { curFoot = k; text(footL, k >= 0 ? FOOT[k][2] : ''); text(footV, k >= 0 ? FOOT[k][3] : ''); }
      const fp = k >= 0 ? P(t, FOOT[k][0] - 0.1, 0.5) * (1 - P(t, FOOT[k][1] - 0.6, 0.25, Ease.exit)) : 0;
      css(footL, { opacity: fp }); css(footV, { opacity: fp });
      return;
    }
    // llamada a la acción en los últimos 2.2 s del clip
    const ctaP = CLIP_END ? P(t, CLIP_END - 2.2, 0.35) : 0;
    css(cta, { opacity: ctaP, transform: `translate3d(0,${((1 - ctaP) * 30).toFixed(1)}px,0)` });
    if (ctaP > 0.01) { css(cap, { opacity: 0 }); return; }
    // subtítulos verticales: un bloque corto a la vez, palabra actual resaltada
    let k = -1;
    for (let i = 0; i < T.chunks.length; i++) { const ch = T.chunks[i]; if (t >= ch.start - 0.05 && t < ch.hold) { k = i; break; } }
    if (k !== capChunk) {
      capChunk = k; cap.textContent = ''; capWords = [];
      if (k >= 0) { const ch = T.chunks[k]; for (let i = ch.i0; i < ch.i1; i++) { if (T.words[i].s < CLIP_T0 - 0.02) continue; const w = h('span', { class: 'vw' }, T.words[i].c); cap.append(w, ' '); capWords.push([w, T.words[i]]); } }
    }
    if (k >= 0) {
      const ch = T.chunks[k];
      const p = P(t, ch.start - 0.05, 0.18, Ease.outBack);
      css(cap, { opacity: 1, transform: `translate(-50%,0) scale(${lerp(0.92, 1, p).toFixed(4)})` });
      let cur = -1; capWords.forEach(([w, wd], i) => { if (t >= wd.s - 0.04) cur = i; });
      capWords.forEach(([w], i) => w.classList.toggle('now', i === cur));
    } else css(cap, { opacity: 0 });
  });
})();
