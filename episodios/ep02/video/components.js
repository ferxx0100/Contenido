/* Componentes reutilizables para las escenas (todo calculado en función de t). */
(() => {
  'use strict';
  const { h, css, attr, text, tr, P, env, kf, Ease, clamp, lerp, splitWords, cue, T } = S;

  // ---------- palabras ----------
  // Marcado en el texto: *palabra* = acento, !palabra! = fuga (rojo), _palabra_ = atenuada
  function Words(parent, str, cls = 'd2', extra = {}) {
    const el = h('div', { class: 'words ' + cls, ...extra });
    parent.append(el);
    const raw = str.split(/\s+/).filter(Boolean);
    const clean = raw.map(w => w.replace(/^[*!_]|[*!_](?=[.,:;?!]*$)/g, '').replace(/[*!_]/g, ''));
    const ws = splitWords(el, clean.join(' '));
    raw.forEach((w, i) => {
      if (/^\*.*\*[.,:;?!]*$/.test(w)) ws[i].classList.add('acc');
      else if (/^!.*![.,:;?!]*$/.test(w)) ws[i].classList.add('leak');
      else if (/^_.*_[.,:;?!]*$/.test(w)) ws[i].classList.add('dim');
    });
    const o = {
      el, ws,
      // tiempos por palabra sincronizados a la voz: phrase debe coincidir con la narración
      sync(phrase, after = 0) {
        const c = cue(phrase, after);
        const n = phrase.trim().split(/\s+/).length;
        o.times = [];
        for (let i = 0; i < ws.length; i++) {
          const wi = c.i + Math.min(i, n - 1);
          o.times.push(c.i >= 0 && T.words[wi] ? T.words[wi].s - 0.06 : c.s + i * 0.08);
        }
        return o;
      },
      at(t0, stagger = 0.055) { o.times = ws.map((_, i) => t0 + i * stagger); return o; },
      update(t, tout = 1e9, dur = 0.62) {
        const q = P(t, tout, 0.32, Ease.exit);
        for (let i = 0; i < ws.length; i++) {
          const p = P(t, o.times[i], dur, Ease.enter);
          css(ws[i], { transform: `translate3d(0,${((1 - p) * 108 - q * 40).toFixed(2)}%,0)`, opacity: p * (1 - q) });
        }
      },
    };
    return o;
  }

  // ---------- movimiento genérico de entrada/salida ----------
  function inout(el, t, tin, tout = 1e9, o = {}) {
    const din = o.din ?? 0.6, dout = o.dout ?? 0.32;
    const p = P(t, tin, din, o.ein || Ease.enter), q = P(t, tout, dout, o.eout || Ease.exit);
    const dx = (o.dx ?? 0) * (1 - p) + (o.ox ?? 0) * q;
    const dy = (o.dy ?? 40) * (1 - p) + (o.oy ?? -24) * q;
    const s = lerp(o.s0 ?? 1, 1, p) * lerp(1, o.s1 ?? 1, q);
    css(el, { opacity: (o.op0 ?? 0) + (1 - (o.op0 ?? 0)) * p * (1 - q), transform: tr(dx, dy, s, (o.r ?? 0) * (1 - p)) });
    return p * (1 - q);
  }

  // ---------- números ----------
  const nf0 = new Intl.NumberFormat('es-MX', { maximumFractionDigits: 0 });
  const nf2 = new Intl.NumberFormat('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const money = (n, dec = true) => (n < 0 ? '−$' : '$') + (dec ? nf2 : nf0).format(Math.abs(n));
  function Counter(el, from, to, fmt = v => nf0.format(Math.round(v))) {
    return { update(t, t0, d = 1.2, e = Ease.outQuart) { text(el, fmt(lerp(from, to, P(t, t0, d, e)))); } };
  }

  // ---------- trazos SVG ----------
  function drawPath(path, t, t0, d = 0.6, e = Ease.move) {
    if (!path.__len) { path.__len = path.getTotalLength ? path.getTotalLength() : 1000; attr(path, { 'stroke-dasharray': path.__len }); }
    attr(path, { 'stroke-dashoffset': (path.__len * (1 - P(t, t0, d, e))).toFixed(2) });
  }
  // raya que tacha un elemento (se dibuja de izquierda a derecha)
  function Strike(parent, cls = 'strike') {
    const el = h('div', { class: cls }); parent.append(el);
    return { el, update(t, t0, d = 0.38) { css(el, { transform: `scaleX(${P(t, t0, d, Ease.move).toFixed(4)})` }); } };
  }
  function Check(parent, size = 44, cls = 'check') {
    const svg = h('svg', { class: cls, viewBox: '0 0 44 44', width: size, height: size },
      h('circle', { cx: 22, cy: 22, r: 20, class: 'ring' }),
      h('path', { d: 'M12 23 L19 30 L33 15', class: 'tick' }));
    parent.append(svg);
    const ring = svg.querySelector('circle'), tick = svg.querySelector('path');
    return { el: svg, update(t, t0) { drawPath(ring, t, t0, 0.45); drawPath(tick, t, t0 + 0.25, 0.35); css(svg, { opacity: t >= t0 ? 1 : 0 }); } };
  }

  // ---------- teléfono ----------
  function Phone(parent, { w = 430, hgt = 880, cls = '' } = {}) {
    const el = h('div', { class: 'phone ' + cls, style: { width: w + 'px', height: hgt + 'px' } });
    const screen = h('div', { class: 'phone-screen' });
    const notch = h('div', { class: 'phone-notch' });
    el.append(screen, notch); parent.append(el);
    return { el, screen };
  }

  // ---------- fila de estado de cuenta ----------
  function Row(parent, { date, name, amount, tag = '' }) {
    const el = h('div', { class: 'row' },
      h('span', { class: 'row-date' }, date),
      h('span', { class: 'row-name' }, name),
      tag ? h('span', { class: 'row-tag' }, tag) : null,
      h('span', { class: 'row-amt' }, amount < 0 ? money(amount) : '+' + money(amount)));
    parent.append(el);
    return el;
  }

  // ---------- rejilla de puntos (proporciones) ----------
  function DotGrid(parent, { n = 100, cols = 10, size = 30, gap = 14, cls = 'dots' } = {}) {
    const el = h('div', { class: cls, style: { gridTemplateColumns: `repeat(${cols}, ${size}px)`, gap: gap + 'px' } });
    const dots = [];
    for (let i = 0; i < n; i++) { const d = h('i', { class: 'dot' }); el.append(d); dots.push(d); }
    parent.append(el);
    return {
      el, dots,
      // rellena k puntos empezando en t0 (orden de lectura)
      update(t, t0, k, d = 1.4, cls2 = 'on') {
        for (let i = 0; i < dots.length; i++) {
          const ti = t0 + (i / Math.max(1, k)) * d;
          const on = i < k && t >= ti;
          dots[i].classList.toggle(cls2, on);
          const p = i < k ? P(t, ti, 0.35, Ease.outBack) : 1;
          css(dots[i], { transform: `scale(${(i < k ? 0.55 + 0.45 * p : 1).toFixed(3)})` });
        }
      },
    };
  }

  // ---------- etiqueta / chip ----------
  const Chip = (parent, label, cls = 'chip') => { const el = h('div', { class: cls }, label); parent.append(el); return el; };

  // ---------- capa con posición absoluta ----------
  function Box(parent, x, y, cls = '', st = {}) {
    const el = h('div', { class: 'box ' + cls, style: { left: x + 'px', top: y + 'px', ...st } });
    parent.append(el); return el;
  }

  window.C = { Words, inout, Counter, money, nf0, nf2, drawPath, Strike, Check, Phone, Row, DotGrid, Chip, Box };
})();
