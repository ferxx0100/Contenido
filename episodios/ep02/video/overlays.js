/* Capas persistentes del libro mayor: cabeza corrida, pestaña de nivel, pie con fuente/nota (16:9)
   y subtítulos palabra por palabra (9:16). */
(() => {
  'use strict';
  const { h, css, text, P, Ease, clamp, lerp, cue, ctx, T } = S;
  const c = (p, a = 0) => cue(p, a).s;

  // capítulos (cabeza corrida y capítulos de YouTube)
  const CH = [
    { t: c('Esto es Sistema dos'), k: 'INTRO', yt: 'Intro' },
    { t: c('Abre ahorita la aplicación'), k: 'TU ESTADO DE CUENTA', yt: 'Abre tu tarjeta' },
    { t: c('En Sistema uno hiciste'), k: 'TU NIVEL', yt: 'La tercera columna y tu nivel' },
    { t: c('Mira tu pago mínimo'), k: 'EL PAGO MÍNIMO', yt: 'Cómo se calcula tu pago mínimo' },
    { t: c('Vamos con un ejemplo'), k: 'EJEMPLO', yt: 'Ejemplo: deuda de 20 mil pesos' },
    { t: c('Ahora ponlo en el mapa'), k: 'EL MAPA', yt: 'Cuánto tardas pagando solo el mínimo' },
    { t: c('Y cuando veas tu número'), k: 'LAS REGLAS', yt: 'No es falta de disciplina' },
    { t: c('Busca en tu estado de cuenta el pago'), k: 'SIN INTERESES', yt: 'El pago para no generar intereses' },
    { t: c('Paso uno deja de bajar'), k: 'PASO 1 DE 5', yt: 'Paso 1: deja de bajar' },
    { t: c('Paso dos congela tu pago'), k: 'PASO 2 DE 5', yt: 'Paso 2: congela tu pago' },
    { t: c('Paso tres aumenta tu pago'), k: 'PASO 3 DE 5', yt: 'Paso 3: usa tus dos columnas' },
    { t: c('Paso cuatro'), k: 'PASO 4 DE 5', yt: 'Paso 4: una deuda a la vez' },
    { t: c('Paso cinco cuida tu historial'), k: 'PASO 5 DE 5', yt: 'Paso 5: Buró de Crédito' },
    { t: c('Si ya no puedes ni con el mínimo'), k: 'SI NO ALCANZA', yt: 'Si ya no puedes con el mínimo' },
    { t: c('Ahora el paso de hoy'), k: 'EL PASO DE HOY', yt: 'El paso de hoy' },
    { t: c('Con esto terminas Sistema dos'), k: 'CIERRE', yt: 'Cierre y Sistema 3' },
  ];
  S.CHAPTERS = CH;
  // notas al pie: etiqueta en la columna de margen + texto en la columna de contenido
  const FOOT = [
    [c('Y no eres el único'), c('Mira tu pago mínimo'), 'FUENTE', 'ENSAFI 2023 · INEGI y CONDUSEF'],
    [c('Mira tu pago mínimo'), c('Vamos con un ejemplo'), 'REGLA', 'Banxico · Circular 13/2011 · cada banco puede pedir más'],
    [c('Vamos con un ejemplo'), c('Y cuando veas tu número'), 'EJEMPLO', 'Ilustrativo: $20,000 · límite $30,000 · 60% anual + IVA · sin compras nuevas'],
    [c('Si cubres el mínimo y nada más'), c('Esa es tu meta de cada mes'), 'FUENTE', 'CONDUSEF · meses sin intereses'],
    [c('Con una deuda de ejemplo'), c('Paso cuatro'), 'EJEMPLO', 'Ilustrativo: $20,000 · límite $30,000 · 60% anual + IVA · sin compras nuevas'],
    [c('Así lo explica la Reserva'), c('Paso cinco'), 'FUENTE', 'Fed de San Luis · Gal y McShane (2012) · Trudel, HBR (2016)'],
    [c('Y un atraso no desaparece'), c('Si ya no puedes ni'), 'FUENTE', 'Ley para Regular las Sociedades de Información Crediticia · montos aprox. en UDIS'],
    [c('la ley te da derecho'), c('Con esto terminas'), 'FUENTE', 'Reporte de Crédito Especial · gratis cada 12 meses'],
  ];
  const hudOn = c('Abre ahorita la aplicación'), hudOff = c('Nos vemos en Sistema tres') + 1.4;
  const tabOn = c('Esto es Sistema dos') + 0.4;

  let hud, hudSec, tab, foot, footL, footV, progFill, cap, capWords = [], capChunk = -1, brand, cta, curFoot = -1;
  const CLIP_END = +(ctx.Q.get('t1') || 0), CLIP_T0 = +(ctx.Q.get('t0') || 0);
  (window.__afterBuild ||= []).push(() => {
    const stage = document.getElementById('stage');
    if (!ctx.vertical) {
      hud = h('div', { class: 'hud' },
        h('div', { class: 'hud-l' }, h('span', { class: 'hud-mark' }, 'SISTEMA'), h('span', { class: 'hud-lvl' }, 'Nivel 2'), h('span', { class: 'hud-ttl' }, 'Deuda')),
        hudSec = h('div', { class: 'hud-r' }, ''));
      tab = h('div', { class: 'tab' }, '2');
      foot = h('div', { class: 'foot' }, h('div', { class: 'prog' }, progFill = h('i')), footL = h('div', { class: 'foot-l' }), footV = h('div', { class: 'foot-v' }));
      stage.append(hud, tab, foot);
    } else {
      brand = h('div', { class: 'vbrand' }, h('span', { class: 'hud-mark' }, 'SISTEMA'), h('span', { class: 'hud-lvl' }, '2'));
      cap = h('div', { class: 'vcap' });
      cta = h('div', { class: 'vcta' }, 'Episodio completo: Sistema 2', h('small', {}, 'EN YOUTUBE Y SPOTIFY · BUSCA “SISTEMA”'));
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
