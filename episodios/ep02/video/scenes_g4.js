/* Grupo 4 · bloques 10–12 · SISTEMA 2 "Deuda"
   10 Paso dos: congela tu pago · 11 Paso tres: aumenta tu pago con tus dos columnas · 12 Paso cuatro: una deuda a la vez */
(() => {
  'use strict';
  const { h, css, attr, text, tr, P, env, kf, Ease, clamp, lerp, cue, Scene, sfx, ctx } = S;
  const { Words: Words0, inout, Counter, money, nf0, drawPath, Strike, Check, Phone, Row, DotGrid, Chip, Box } = C;
  // *varias palabras* -> *cada* *palabra* (Words solo acentúa palabra por palabra)
  const Words = (parent, str, cls, extra) => Words0(parent, str.replace(/\*([^*]+)\*/g, (m, g) => g.split(/\s+/).map(w => { const k = w.match(/^(.*?)([.,:;?!…]*)$/); return '*' + k[1] + '*' + k[2]; }).join(' ')), cls, extra);
  const V = (a, b) => (ctx.vertical ? b : a);
  const M = V(288, 120);          // columna de contenido (libro mayor)
  const CW = V(1524, 820);        // ancho útil hasta la regla derecha
  const c = (p, a = 0) => cue(p, a);
  const layer = (root, cls = '') => { const el = h('div', { class: 'layer ' + cls }); root.append(el); return el; };
  const $ = n => '$' + nf0.format(Math.round(n));
  const tag = (parent, label = 'EJEMPLO', cls = '') => { const el = h('span', { class: 'g4-tag ' + cls }, label); parent.append(el); return el; };
  // tiempos de entrada por palabra elegidos a mano (cada uno es el inicio de una palabra de la voz)
  const at = (W, arr) => { W.times = W.ws.map((_, i) => arr[Math.min(i, arr.length - 1)] - 0.06); return W; };
  const T0 = 274;   // inicio de mi tramo: los cues repetidos se buscan desde aquí

  // ---------- rutas del ejemplo: $20,000 · límite $30,000 · 60% anual (5% mensual) + IVA · sin compras nuevas ----------
  // misma regla de Banxico que el mapa del bloque 06: mínimo = máx(1.5% del saldo + intereses + IVA, 1.25% del límite)
  const ROUTE = fixed => {
    let B = 20000; const pts = [[0, -10]];
    for (let m = 1; m < 200 && B > 0.005; m++) {
      const i = B * 0.05, iva = i * 0.16;
      const mn = Math.max(0.015 * B + i + iva, 0.0125 * 30000);
      const pay = Math.min(fixed || mn, B + i + iva);
      B = B + i + iva - pay; pts.push([m, -Math.max(0, B) / 2000]);
    }
    return pts;
  };
  const R_MIN = ROUTE(0), R_1460 = ROUTE(1460), R_2500 = ROUTE(2500);   // 119 · 29 · 12 meses
  const crossings = pts => { const out = []; for (let lv = -9; lv <= 0; lv++) for (let k = 1; k < pts.length; k++) if (pts[k][1] >= lv - 1e-6) { const [m0, a0] = pts[k - 1], [m1, a1] = pts[k]; out.push(m0 + (lv - a0) / (a1 - a0 || 1) * (m1 - m0)); break; } return out; };

  // mapa de niveles (misma geometría que el renglón impreso: 1 nivel = 54 px)
  function Chart(L) {
    const X0 = V(400, 206), X1 = V(1230, 924), Y0 = V(323, 431), U = 54;
    const xm = m => X0 + (m / 120) * (X1 - X0), yl = lv => Y0 - lv * U;
    const W = V(1920, 1080), Hh = V(1080, 1920);
    const svg = h('svg', { class: 'g4-svg', width: W, height: Hh, viewBox: `0 0 ${W} ${Hh}` }); L.append(svg);
    const ylab = [], xlab = [];
    for (let lv = 0; lv >= -10; lv--) {
      const lab = Box(L, V(288, 84), yl(lv) - 30, 'g4-ylab' + (lv === 0 ? ' zero' : ''), { width: V(82, 100) + 'px' });
      lab.textContent = lv === 0 ? '0' : '−' + (-lv); ylab.push(lab);
    }
    const axis = h('line', { x1: X0, x2: X1, y1: yl(-10), y2: yl(-10), class: 'g4-axis' });
    const zl = h('line', { x1: X0, x2: X1, y1: yl(0), y2: yl(0), class: 'g4-zero' });
    svg.append(axis, zl);
    [[0, 'HOY'], [24, '2 AÑOS'], [48, '4'], [72, '6'], [96, '8'], [120, '10 AÑOS']].forEach(([m, s]) => {
      const el = Box(L, xm(m) - 80, yl(-10) + 12, 'g4-xlab', { width: '160px' }); el.textContent = s; xlab.push(el);
    });
    const ticks = h('g', {}); svg.append(ticks);
    const curves = h('g', {}); svg.append(curves);
    function curve(pts, cls) {
      const p = h('polyline', { class: 'g4-curve ' + cls, points: '' });
      const head = h('circle', { r: 10, class: 'g4-head ' + cls });
      const end = h('circle', { r: 12, cx: xm(pts[pts.length - 1][0]), cy: yl(0), class: 'g4-end ' + cls });
      curves.append(p, end, head);
      return {
        p, head, end, last: pts[pts.length - 1][0],
        set(mt, vis = 1) {
          const out = [];
          for (const [m, lv] of pts) { if (m > mt) break; out.push(xm(m).toFixed(1) + ',' + yl(lv).toFixed(1)); }
          const k = Math.min(pts.length - 1, Math.floor(mt)), f = mt - k, nx = pts[Math.min(pts.length - 1, k + 1)];
          const hl = lerp(pts[k][1], nx[1], f);
          out.push(xm(Math.min(mt, this.last)).toFixed(1) + ',' + yl(hl).toFixed(1));
          attr(p, { points: out.join(' ') });
          attr(head, { cx: xm(Math.min(mt, this.last)).toFixed(1), cy: yl(hl).toFixed(1) });
          const done = mt >= this.last - 0.01;
          css(p, { opacity: vis }); css(head, { opacity: mt > 0.01 && !done ? vis : 0 }); css(end, { opacity: done ? vis : 0 });
        },
      };
    }
    return {
      svg, xm, yl, ylab, xlab, axis, zl, ticks, curve,
      show(t, tin, tout) {
        css(svg, { opacity: P(t, tin, 0.4) * (1 - P(t, tout, 0.3, Ease.exit)) });
        drawPath(axis, t, tin, 0.7); drawPath(zl, t, tin + 0.15, 0.7);
        ylab.forEach((lb, i) => inout(lb, t, tin + (10 - i) * 0.035, tout, { dy: 0, dx: -14, din: 0.35, oy: 0 }));
        xlab.forEach((lb, i) => inout(lb, t, tin + 0.2 + i * 0.05, tout, { dy: 10, din: 0.35, oy: 0 }));
      },
    };
  }
  // tarjeta de ruta (resumen: tiempo y total)
  function RouteCard(L, x, y, w, kick, time, total, cls = '') {
    const el = Box(L, x, y, 'g4-rc ' + cls, { width: w + 'px' });
    const k = h('div', { class: 'g4-rc-k' }, kick);
    const tm = h('span', { class: 'g4-rc-t' }, time);
    const tt = h('span', { class: 'g4-rc-v num' }, total);
    el.append(k, h('div', { class: 'g4-rc-b' }, tm, tt));
    return { el, k, tm, tt };
  }

  // ===================================================================== G4-01 paso dos: congela tu pago
  {
    const a = c('Paso dos congela tu pago').s, tm = c('Toma tu mínimo de este mes').s, ps = c('paga siempre esa cantidad').s,
      ap = c('aunque te pidan menos').s, si = c('Si tienes meses sin intereses', T0).s, su = c('súmale esas mensualidades').s, end = c('Con una deuda de ejemplo').s;
    // lo que te pedirían cada mes si sigues pagando $1,460 fijos (proporción del mínimo de cada mes)
    const ASK = (() => { let B = 20000; const r = []; for (let m = 0; m < 8; m++) { const i = B * 0.05, iva = i * 0.16; r.push(Math.max(0.015 * B + i + iva, 375) / 1460); B = B + i + iva - 1460; } return r; })();
    let BIG, K, H, r1, r2, r3, plus, dbl, lock, strip, pays = [], asks = [], lg1, lg2, mlab = [];
    Scene({
      id: 'g4_paso2', start: a - 0.2, end: end - 0.25,
      build(root) {
        const L = layer(root);
        BIG = Box(L, M, V(150, 262), 'step-n num-d'); BIG.textContent = '2';
        K = Box(L, V(M + 190, 300), V(176, 290), 'kicker acc-k'); K.textContent = 'PASO 2 DE 5';
        H = Words(Box(L, V(M + 190, 300), V(214, 330), 'col', { width: V(1000, 640) + 'px' }), 'Congela *tu pago.*', 'd2 g4-step-t').sync('congela tu pago');
        const SX = M, SW = V(860, 820), SY = V(400, 470), RH = V(108, 120);
        r1 = Box(L, SX, SY, 'g4-sum', { width: SW + 'px', height: RH + 'px' });
        r1.append(h('span', { class: 'g4-sum-k kicker' }, 'ESTE MES'), h('span', { class: 'g4-sum-t' }, 'Tu mínimo de este mes'));
        r2 = Box(L, SX, SY + RH, 'g4-sum', { width: SW + 'px', height: RH + 'px' });
        r2.append(h('span', { class: 'g4-sum-k kicker' }, 'SI TIENES MSI'), h('span', { class: 'g4-sum-t' }, 'Tus mensualidades'));
        plus = Box(L, SX - V(64, 0), SY + RH + V(24, 0), 'g4-plus'); plus.textContent = '+';
        if (ctx.vertical) css(plus, { left: (SX + SW - 70) + 'px', top: (SY + RH + 26) + 'px' });
        const dy = SY + 2 * RH + 14;
        const dw = Box(L, SX, dy, '', { width: SW + 'px', height: '22px' }); dbl = h('div', { class: 'dbl' }); dw.append(dbl);
        r3 = Box(L, SX, dy + 34, 'g4-sum total', { width: SW + 'px', height: V(120, 130) + 'px' });
        r3.append(h('span', { class: 'g4-sum-k kicker acc-k' }, 'CADA MES, IGUAL'), h('span', { class: 'g4-sum-t' }, 'Tu pago fijo'));
        lock = h('span', { class: 'g4-lock' }, 'FIJO'); r3.append(lock);
        // tira: mes con mes pagas lo mismo, aunque te pidan menos
        strip = Box(L, V(1240, M), V(400, 900), 'g4-strip', { width: V(572, 820) + 'px' });
        const lg = h('div', { class: 'g4-legend' }, lg1 = h('span', { class: 'pay' }, 'LO QUE PAGAS'), lg2 = h('span', { class: 'ask' }, 'LO QUE TE PIDEN'));
        const bars = h('div', { class: 'g4-bars' });
        for (let i = 0; i < 8; i++) {
          const mo = h('div', { class: 'g4-mo' });
          const pb = h('i', { class: 'g4-b pay' }), ab = h('i', { class: 'g4-b ask', style: { height: (ASK[i] * 100).toFixed(1) + '%' } });
          mo.append(pb, ab); bars.append(mo); pays.push(pb); asks.push(ab);
        }
        const ml = h('div', { class: 'g4-mlab' }); for (let i = 0; i < 8; i++) { const s = h('span', {}, String(i + 1)); ml.append(s); mlab.push(s); }
        strip.append(lg, bars, ml, h('div', { class: 'g4-stair-k kicker' }, 'MESES'));
        sfx(a + 0.1, 'whoosh', 0.45); sfx(tm + 0.2, 'tick', 0.5); sfx(ps + 0.3, 'thud', 0.6); sfx(ap + 0.3, 'blip', 0.35); sfx(si + 0.1, 'tick', 0.5); sfx(su + 0.2, 'click', 0.6);
      },
      update(t) {
        const out = end - 0.4;
        inout(BIG, t, a, out, { dy: 50, s0: 0.9 }); inout(K, t, a + 0.1, out, { dy: 14 });
        H.update(t, out);
        inout(r1, t, tm - 0.05, out, { dy: 26 });
        inout(r2, t, si, out, { dy: 26 }); inout(plus, t, si + 0.1, out, { dy: 0, s0: 0.4, ein: Ease.outBack });
        css(dbl, { transform: `scaleX(${P(t, ps, 0.5, Ease.move).toFixed(4)})`, opacity: 1 - P(t, out, 0.3, Ease.exit) });
        inout(r3, t, ps + 0.15, out, { dy: 26 });
        const lp = P(t, ps + 0.6, 0.35, Ease.outBack);
        css(lock, { opacity: lp, transform: `scale(${lerp(1.6, 1, lp).toFixed(3)}) rotate(-4deg)` });
        r3.classList.toggle('msi', t > su + 0.3);
        inout(strip, t, ps - 0.1, out, { dy: 30 });
        pays.forEach((b, i) => css(b, { transform: `scaleY(${P(t, ps + 0.1 + i * 0.1, 0.4, Ease.outCubic).toFixed(4)})` }));
        asks.forEach((b, i) => css(b, { opacity: P(t, ap + 0.1 + i * 0.08, 0.3), transform: `scaleY(${P(t, ap + 0.1 + i * 0.08, 0.45, Ease.outCubic).toFixed(4)})` }));
        css(lg2, { opacity: P(t, ap, 0.3) });
      },
    });
  }

  // ===================================================================== G4-02 dos rutas: fijo $1,460 vs. solo el mínimo (EJEMPLO)
  {
    const a = c('Con una deuda de ejemplo').s, vm = c('veinte mil pesos', a).s, n1460 = c('mil cuatrocientos sesenta', a).s, co = c('Como tu pago ya no se encoge').s,
      ni = c('los niveles llegan cada vez más rápido').s, te = c('Terminas en unos dos años y medio').s, dm = c('dos años y medio', te).s,
      cu = c('cuarenta y un mil pesos').s, so = c('Solo con el mínimo serían').s, cd = c('casi diez años', so).s, oc = c('ochenta y tres mil', so).s,
      end = c('Con el mismo dinero').s;
    let K, ch, rf, rm, cA, cB, note, N1, N2, hoy, cross = [];
    Scene({
      id: 'g4_rutas', start: a - 0.2, end: end - 0.25,
      build(root) {
        const L = layer(root);
        K = Box(L, M, V(176, 262), 'g4-krow', { width: CW + 'px' }); tag(K, 'EJEMPLO ILUSTRATIVO');
        K.append(h('span', { class: 'kicker' }, 'DEUDA $20,000 · LÍMITE $30,000 · TASA 60% ANUAL · SIN COMPRAS NUEVAS'));
        ch = Chart(L);
        rm = ch.curve(R_MIN, 'min'); rf = ch.curve(R_1460, 'f1');
        crossings(R_1460).forEach(m => { const d = h('circle', { cx: ch.xm(m), cy: 0, r: 6, class: 'g4-cross' }); const tk = h('line', { x1: ch.xm(m), x2: ch.xm(m), y1: ch.yl(-10) - 12, y2: ch.yl(-10), class: 'g4-tick' }); ch.ticks.append(tk); cross.push([d, tk, m]); });
        cross.forEach(([d]) => ch.ticks.append(d));
        // tarjetas de las rutas
        if (!ctx.vertical) {
          cA = RouteCard(L, 1290, 270, 522, 'PAGO FIJO · $1,460', 'unos 2 años y medio', 'cerca de $41,000', 'f1');
          cB = RouteCard(L, 1290, 500, 522, 'SOLO EL MÍNIMO', 'casi 10 años', '$83,000', 'min');
        } else {
          cA = RouteCard(L, M, 1462, CW, 'PAGO FIJO · $1,460', 'unos 2 años y medio', 'cerca de $41,000', 'f1');
          cB = RouteCard(L, M, 1640, CW, 'SOLO EL MÍNIMO', 'casi 10 años', '$83,000', 'min');
        }
        hoy = Box(L, ch.xm(0) + V(220, 354), ch.yl(-10) - V(118, 84), 'g4-hoy');
        hoy.append(h('div', { class: 'kicker acc-k' }, 'HOY · NIVEL −10'), h('div', { class: 'g4-hoy-v' }, 'Debes ', h('b', { class: 'num-d' }, '$20,000')));
        note = Box(L, V(700, 470), V(530, 640), 'g4-note', { width: V(500, 450) + 'px' });
        N1 = Words(note, 'Tu pago ya *no se encoge:*', 'g4-note-t').sync('Como tu pago ya no se encoge');
        N2 = Words(note, 'los niveles llegan *cada vez más rápido.*', 'g4-note-t').sync('los niveles llegan cada vez más rápido');
        sfx(a + 0.1, 'whoosh', 0.45); sfx(n1460 + 0.1, 'tick', 0.6); sfx(dm, 'pop', 0.6); sfx(so + 0.2, 'riser', 0.35); sfx(cd + 0.1, 'thud', 0.8);
        crossings(R_1460).forEach((m, i) => { if (i % 3 === 0) sfx(ni + 0.2 + i * 0.12, 'tick', 0.25); });
      },
      update(t) {
        const out = end - 0.4;
        inout(K, t, a, out, { dy: 12 });
        ch.show(t, a + 0.2, out);
        // ruta fija: se dibuja mientras se dice "como tu pago ya no se encoge … dos años y medio"
        const mf = kf(t, [[co - 0.1, 0], [dm + 0.3, 29, Ease.inOutCubic]]);
        const vis = 1 - P(t, out, 0.3, Ease.exit);
        rf.set(mf, vis);
        const mm = kf(t, [[so, 0], [cd + 0.5, 119, Ease.inOutCubic]]);
        rm.set(mm, vis);
        cross.forEach(([d, tk, m], i) => {
          const ti = ni + 0.2 + i * 0.12, show = mf >= m - 0.01 ? 1 : 0;
          attr(d, { cy: ch.yl(-9 + i).toFixed(1) });
          css(d, { opacity: show * P(t, ti, 0.25) * vis });
          css(tk, { opacity: show * P(t, ti, 0.25) * vis });
        });
        inout(cA.el, t, n1460 - 0.1, out, { dy: 24 });
        css(cA.tm, { opacity: P(t, dm - 0.1, 0.3) }); css(cA.tt, { opacity: P(t, cu - 0.1, 0.3) });
        inout(cB.el, t, so, out, { dy: 24 });
        css(cB.tm, { opacity: P(t, cd - 0.1, 0.3) }); css(cB.tt, { opacity: P(t, oc - 0.1, 0.3) });
        N1.update(t, so - 0.3); N2.update(t, so - 0.3);
        css(note, { opacity: P(t, co - 0.3, 0.2) * (1 - P(t, so - 0.3, 0.35, Ease.exit)) });
        inout(hoy, t, vm - 0.1, so - 0.4, { dy: 14 });
      },
    });
  }

  // ===================================================================== G4-03 recordatorio mensual [CAPTURA]: con el mismo dinero
  {
    const a = c('Con el mismo dinero').s, pm = c('el primer mes', a).s, end = c('Paso tres aumenta tu pago').s;
    let W1, wrap, rems = [], chks = [];
    Scene({
      id: 'g4_recordatorio', start: a - 0.2, end: end - 0.25,
      build(root) {
        const L = layer(root);
        W1 = Words(Box(L, M, V(300, 300), 'col', { width: V(860, 820) + 'px' }), 'Con el *mismo dinero* que ya pagabas el primer mes.', 'g4-h').sync('Con el mismo dinero que ya pagabas el primer mes');
        wrap = Box(L, V(1270, 240), V(170, 620), 'g4-phwrap');
        const ph = Phone(wrap, { w: V(480, 600), hgt: V(740, 620) });
        const s = ph.screen;
        s.append(h('div', { class: 'app-head' }, h('span', { class: 'app-logo' }), h('span', {}, 'Calendario')));
        const hd = h('div', { class: 'g4-cal-h' }, h('span', {}, 'RECORDATORIO · CADA MES')); tag(hd); s.append(hd);
        for (let i = 0; i < V(6, 4); i++) {
          const ck = h('span', { class: 'g4-rem-c' });
          const r = h('div', { class: 'g4-rem' }, h('span', { class: 'g4-rem-m' }, 'MES ' + (i + 1)), h('span', { class: 'g4-rem-t' }, 'Pagar ', h('b', { class: 'num' }, '$1,460')), ck);
          s.append(r); rems.push(r); chks.push(ck);
        }
        sfx(a + 0.1, 'whoosh', 0.45); rems.forEach((_, i) => { if (i < 3) sfx(a + 1.2 + i * 0.35, 'check', 0.3); });
      },
      update(t) {
        const out = end - 0.4;
        W1.update(t, out);
        inout(wrap, t, a - 0.05, out, { dy: 120, din: 0.8, oy: 40 });
        rems.forEach((r, i) => { inout(r, t, a + 0.4 + i * 0.16, out + 1, { dy: 18, din: 0.4 }); r.classList.toggle('done', i < 3 && t > a + 1.2 + i * 0.35); });
      },
    });
  }

  // ===================================================================== G4-04 paso tres: aumenta tu pago con tus dos columnas [CAPTURA]
  {
    const a = c('Paso tres aumenta tu pago').s, ls = c('con lo de Sistema uno', a).s, re = c('Regresa a tus dos columnas').s, mr = c('marca dónde puedes recortar').s,
      lq = c('Lo que dejas de gastar').s, cd = c('comida a domicilio', lq).s, su = c('suscripciones', lq).s, ci = c('compras de impulso', lq).s,
      yn = c('ya no se va', lq).s, tt = c('ahora tiene trabajo', lq).s, end = c('Si a esos mil cuatrocientos sesenta').s;
    const IN = ['Sueldo', 'Extras'];
    const OUT = [['Renta', 0], ['Súper', 0], ['Transporte', 0], ['Comida a domicilio', 1], ['Suscripciones', 2], ['Compras de impulso', 3]];
    let BIG, K, H, W2, W3, W4, wrap, cols, outCol, brk, marks = [], debt, debtV, arrow, chips = [];
    Scene({
      id: 'g4_paso3', start: a - 0.2, end: end - 0.25,
      build(root) {
        const L = layer(root);
        BIG = Box(L, M, V(150, 262), 'step-n num-d'); BIG.textContent = '3';
        K = Box(L, V(M + 190, 300), V(176, 290), 'kicker acc-k'); K.textContent = 'PASO 3 DE 5';
        H = Words(Box(L, V(M + 190, 300), V(214, 330), 'col', { width: V(840, 640) + 'px' }), 'Aumenta *tu pago*', 'd2 g4-step-t g4-step-s').sync('aumenta tu pago');
        W2 = Words(Box(L, M, V(352, 432), 'col', { width: V(860, 820) + 'px' }), 'con lo de Sistema 1.', 'd3 d3-xl muted').sync('con lo de Sistema uno');
        W3 = Words(Box(L, M, V(520, 1462), 'col', { width: V(800, 820) + 'px' }), 'Marca dónde *puedes recortar.*', 'd3 d3-xl').sync('marca dónde puedes recortar');
        W4 = Words(Box(L, M, V(680, 1600), 'col', { width: V(820, 820) + 'px' }), 'Ahora *tiene trabajo.*', V('d2', 'd2')).sync('ahora tiene trabajo');
        wrap = Box(L, V(1190, 150), V(160, 520), 'g4-phwrap');
        const ph = Phone(wrap, { w: V(620, 780), hgt: V(690, 720) });
        const s = ph.screen; s.classList.add('g4-notes');
        s.append(h('div', { class: 'app-head' }, h('span', { class: 'app-logo' }), h('span', {}, 'Notas · Sistema 1')));
        cols = h('div', { class: 'notes-cols' });
        const inCol = h('div', { class: 'ncol' }, h('div', { class: 'ncol-k' }, 'Lo que entra'));
        IN.forEach(n => inCol.append(h('div', { class: 'nrow' }, h('span', {}, n), h('span', { class: 'num' }, '$ • • •'))));
        outCol = h('div', { class: 'ncol' }, h('div', { class: 'ncol-k' }, 'Lo que sale'));
        OUT.forEach(([n, k]) => { const r = h('div', { class: 'nrow' }, h('span', {}, n), h('span', { class: 'num' }, '$ • •')); outCol.append(r); if (k) marks.push([r, k]); });
        brk = h('div', { class: 'bracket g4-brk' }); outCol.append(brk);
        cols.append(inCol, outCol); s.append(cols);
        debt = h('div', { class: 'g4-debt' }, h('div', { class: 'ncol-k' }, 'Lo que debo'), debtV = h('div', { class: 'g4-debt-v' }, h('span', {}, 'Tu pago fijo'), h('b', { class: 'acc' }, '+ lo que recortas')));
        s.append(debt);
        arrow = h('div', { class: 'g4-arrow' }); debt.append(arrow);
        sfx(a + 0.1, 'whoosh', 0.45); sfx(re + 0.3, 'tick', 0.4); sfx(mr + 0.6, 'click', 0.5);
        [cd, su, ci].forEach(x => sfx(x + 0.1, 'blip', 0.35)); sfx(yn + 0.2, 'strike', 0.45); sfx(tt + 0.2, 'pop', 0.6);
      },
      update(t) {
        const out = end - 0.4;
        inout(BIG, t, a, out, { dy: 50, s0: 0.9 }); inout(K, t, a + 0.1, out, { dy: 14 });
        H.update(t, out); W2.update(t, out);
        W3.update(t, out); W4.update(t, out);
        inout(wrap, t, re - 0.6, out, { dy: 120, din: 0.8, oy: 40 });
        const bp = P(t, mr + 0.5, 0.45);
        css(brk, { opacity: bp * (1 - P(t, cd - 0.2, 0.3)), transform: `scale(${lerp(1.08, 1, bp).toFixed(3)})` });
        marks.forEach(([r, k]) => { const tk = [0, cd, su, ci][k]; r.classList.toggle('found', t > tk); r.classList.toggle('g4-cut', t > yn + 0.1 + (k - 1) * 0.12); });
        inout(debt, t, yn, out + 1, { dy: 20 });
        css(arrow, { opacity: P(t, tt - 0.2, 0.3), transform: `scaleY(${P(t, tt - 0.2, 0.5, Ease.move).toFixed(3)})` });
        debt.classList.toggle('on', t > tt + 0.2);
      },
    });
  }

  // ===================================================================== G4-05 $1,460 + $1,040 = $2,500 al mes · casi un nivel cada mes (EJEMPLO)
  {
    const a = c('Si a esos mil cuatrocientos sesenta').s, n1 = c('mil cuatrocientos sesenta', a).s, n2 = c('mil cuarenta pesos que recortaste').s,
      yp = c('y pagas dos mil quinientos al mes').s, n3 = c('dos mil quinientos', yp).s, sb = c('subes casi un nivel cada mes').s, end = c('Terminas en un año').s;
    let K, r1, r2, r3, v1, v2, v3, c3, dbl, plus, st, bars = [], blab = [], goal, stK;
    const LV = R_2500.slice(1, 13).map(p => 10 + p[1]);   // niveles subidos al cierre de cada mes
    Scene({
      id: 'g4_suma', start: a - 0.2, end: end - 0.25,
      build(root) {
        const L = layer(root);
        K = Box(L, M, V(176, 262), 'g4-krow', { width: CW + 'px' }); tag(K); K.append(h('span', { class: 'kicker' }, 'SIN COMPRAS NUEVAS'));
        const SX = M, SW = V(860, 820), SY = V(250, 330), RH = V(130, 130);
        const row = (y, k, v, cls = '') => { const r = Box(L, SX, y, 'g4-add ' + cls, { width: SW + 'px', height: RH + 'px' }); const vv = h('span', { class: 'g4-add-v num-d' }, v); r.append(h('span', { class: 'g4-add-k kicker' }, k), vv); return [r, vv]; };
        [r1, v1] = row(SY, 'TU PAGO FIJO', '$1,460');
        [r2, v2] = row(SY + RH, 'LO QUE RECORTASTE', '$1,040');
        plus = Box(L, SX - V(64, 0), SY + RH + 30, 'g4-plus'); plus.textContent = '+';
        if (ctx.vertical) css(plus, { left: (SX + 6) + 'px', top: (SY + RH + 56) + 'px' });
        const dw = Box(L, SX, SY + 2 * RH + 14, '', { width: SW + 'px', height: '22px' }); dbl = h('div', { class: 'dbl' }); dw.append(dbl);
        [r3, v3] = row(SY + 2 * RH + 48, 'PAGAS AL MES', '$0', 'total');
        c3 = Counter(v3, 0, 2500, v => $(v));
        // escalera: casi un nivel cada mes
        st = Box(L, V(1270, M), V(270, 830), 'g4-stair', { width: V(542, 820) + 'px' });
        stK = h('div', { class: 'kicker acc-k' }, 'CASI UN NIVEL CADA MES'); st.append(stK);
        const SH = V(540, 330);   // 10 niveles
        const area = h('div', { class: 'g4-stair-a', style: { height: SH + 'px' } });
        goal = h('div', { class: 'g4-stair-goal' }, h('span', {}, '0')); area.append(goal);
        LV.forEach((lv, i) => { const b = h('i', { style: { height: (lv / 10 * 100).toFixed(2) + '%' } }); area.append(b); bars.push(b); });
        st.append(area);
        const lab = h('div', { class: 'g4-stair-l' }); LV.forEach((_, i) => { const s = h('span', {}, i === 0 ? '1' : i === 11 ? '12' : (i + 1) % 3 === 0 ? String(i + 1) : ''); lab.append(s); blab.push(s); });
        st.append(lab, h('div', { class: 'g4-stair-k kicker' }, 'MESES'));
        sfx(n1, 'tick', 0.5); sfx(n2 + 0.1, 'tick', 0.5); sfx(n3 + 0.1, 'thud', 0.7); LV.forEach((_, i) => { if (i % 2 === 0) sfx(sb + 0.2 + i * 0.1, 'blip', 0.22); });
      },
      update(t) {
        const out = end - 0.4;
        inout(K, t, a, out, { dy: 12 });
        inout(r1, t, n1 - 0.1, out, { dy: 26 });
        inout(r2, t, n2 - 0.1, out, { dy: 26 }); inout(plus, t, n2, out, { dy: 0, s0: 0.4, ein: Ease.outBack });
        css(dbl, { transform: `scaleX(${P(t, yp, 0.45, Ease.move).toFixed(4)})`, opacity: 1 - P(t, out, 0.3, Ease.exit) });
        inout(r3, t, yp + 0.1, out, { dy: 26 });
        c3.update(t, n3 - 0.1, 0.9);
        inout(st, t, sb - 0.15, out, { dy: 30 });
        bars.forEach((b, i) => css(b, { transform: `scaleY(${P(t, sb + 0.2 + i * 0.1, 0.4, Ease.outCubic).toFixed(4)})` }));
      },
    });
  }

  // ===================================================================== G4-06 tercera ruta: $2,500 al mes · un año · unos $27,700 · más de $55,000 de diferencia
  {
    const a = c('Terminas en un año').s, ua = c('un año', a).s, pu = c('y pagas unos veintisiete mil setecientos').s, n27 = c('veintisiete mil setecientos', pu).s,
      sm = c('Son más de cincuenta y cinco mil pesos').s, n55 = c('cincuenta y cinco mil', sm).s, df = c('de diferencia contra el mínimo', sm).s, end = c('Paso cuatro').s;
    let K, ch, rm, rf, r2, cM, cF, c2, diff, D1, brk;
    Scene({
      id: 'g4_rutas3', start: a - 0.2, end: end - 0.25,
      build(root) {
        const L = layer(root);
        K = Box(L, M, V(176, 262), 'g4-krow', { width: CW + 'px' }); tag(K, 'EJEMPLO ILUSTRATIVO');
        K.append(h('span', { class: 'kicker' }, 'DEUDA $20,000 · LÍMITE $30,000 · TASA 60% ANUAL · SIN COMPRAS NUEVAS'));
        ch = Chart(L);
        rm = ch.curve(R_MIN, 'min'); rf = ch.curve(R_1460, 'f1 dim'); r2 = ch.curve(R_2500, 'f2');
        if (!ctx.vertical) {
          cM = RouteCard(L, 1290, 250, 522, 'SOLO EL MÍNIMO', 'casi 10 años', '$83,000', 'min');
          cF = RouteCard(L, 1290, 446, 522, 'PAGO FIJO · $1,460', 'unos 2 años y medio', 'cerca de $41,000', 'f1 dim');
          c2 = RouteCard(L, 1290, 642, 522, 'PAGO FIJO · $2,500', 'un año', 'unos $27,700', 'f2');
        } else {
          cM = RouteCard(L, M, 1450, CW, 'SOLO EL MÍNIMO', 'casi 10 años', '$83,000', 'min');
          cF = RouteCard(L, M, 1596, CW, 'PAGO FIJO · $1,460', 'unos 2 años y medio', 'cerca de $41,000', 'f1 dim');
          c2 = RouteCard(L, M, 1742, CW, 'PAGO FIJO · $2,500', 'un año', 'unos $27,700', 'f2');
        }
        diff = Box(L, V(690, 440), V(660, 760), 'g4-diff', { width: V(540, 484) + 'px' });
        D1 = Words(diff, 'Más de *$55,000* de diferencia', 'g4-diff-t');
        at(D1, [sm, sm, n55, df, df + 0.2]);
        diff.append(h('div', { class: 'kicker g4-diff-k' }, 'CONTRA SOLO EL MÍNIMO'));
        sfx(a + 0.1, 'whoosh', 0.4); sfx(ua + 0.2, 'pop', 0.6); sfx(n27 + 0.2, 'tick', 0.6); sfx(n55, 'thud', 0.9);
      },
      update(t) {
        const out = end - 0.4;
        inout(K, t, a - 0.1, out, { dy: 12 });
        ch.show(t, a - 0.15, out);
        const vis = 1 - P(t, out, 0.3, Ease.exit);
        const pre = P(t, a - 0.1, 0.5);
        rm.set(119, pre * vis); rf.set(29, pre * vis);
        r2.set(kf(t, [[a, 0], [ua + 0.4, 12, Ease.inOutCubic]]), vis);
        inout(cM.el, t, a - 0.1, out, { dy: 20 });
        inout(cF.el, t, a, out, { dy: 20 });
        inout(c2.el, t, a + 0.2, out, { dy: 20 });
        css(c2.tm, { opacity: P(t, ua - 0.1, 0.3) }); css(c2.tt, { opacity: P(t, n27 - 0.1, 0.3) });
        cM.el.classList.toggle('vs', t > n55); c2.el.classList.toggle('vs', t > n55);
        inout(diff, t, sm - 0.1, out, { dy: 20 });
        D1.update(t, out);
        css(diff.lastChild, { opacity: P(t, df + 0.6, 0.3) });
      },
    });
  }

  // ===================================================================== G4-07 paso cuatro: cada deuda en un renglón de tu tercera columna [CAPTURA]
  {
    const a = c('Paso cuatro').s, sv = c('Si tienes varias deudas', a).s, pc = c('pon cada una en un renglón', a).s,
      ta = c('Tarjetas', a).s, pr = c('préstamos', a).s, ab = c('abonos en tiendas', a).s, fa = c('lo que le debes a tu familia', a).s,
      ec = c('En cada renglón', a).s, cu = c('cuánto debes', ec).s, ts = c('la tasa', ec).s, mi = c('el mínimo', ec).s, fl = c('la fecha límite', ec).s,
      end = c('No le pagues un poquito').s;
    const DEBTS = [['Tarjeta', ta], ['Préstamo', pr], ['Abonos en tienda', ab], ['Familia', fa]];
    const COLS = [['DEBES', '$ • • •', cu], ['TASA', '• • %', ts], ['MÍNIMO', '$ • •', mi], ['FECHA', '• • / • •', fl]];
    let BIG, K, H, W2, wrap, heads = [], rows = [], cells = [];
    Scene({
      id: 'g4_paso4', start: a - 0.2, end: end - 0.25,
      build(root) {
        const L = layer(root);
        BIG = Box(L, M, V(150, 262), 'step-n num-d'); BIG.textContent = '4';
        K = Box(L, V(M + 190, 300), V(176, 290), 'kicker acc-k'); K.textContent = 'PASO 4 DE 5';
        H = Words(Box(L, V(M + 190, 300), V(214, 330), 'col', { width: V(540, 440) + 'px' }), 'Una deuda *a la vez.*', 'd2 g4-step-t');
        at(H, [a, a + 0.12, sv, sv + 0.1, sv + 0.2]);
        W2 = Words(Box(L, M, V(480, 520), 'col', { width: V(740, 820) + 'px' }), 'Cada una, en un renglón de tu *tercera columna.*', 'd3 d3-xl').sync('cada una en un renglón de tu tercera columna');
        wrap = Box(L, V(1086, 120), V(200, 700), 'g4-phwrap');
        const ph = Phone(wrap, { w: V(726, 840), hgt: V(640, 540) });
        const s = ph.screen; s.classList.add('g4-tbl-s');
        s.append(h('div', { class: 'app-head' }, h('span', { class: 'app-logo' }), h('span', {}, 'Notas · Lo que debo')));
        const tb = h('div', { class: 'g4-tbl' });
        const hr = h('div', { class: 'g4-tr head' }, h('span', { class: 'g4-td name' }, 'DEUDA'));
        COLS.forEach(([k]) => { const e = h('span', { class: 'g4-td' }, k); hr.append(e); heads.push(e); });
        tb.append(hr);
        DEBTS.forEach(([n]) => {
          const r = h('div', { class: 'g4-tr' }, h('span', { class: 'g4-td name' }, n)); const rc = [];
          COLS.forEach(([, v]) => { const e = h('span', { class: 'g4-td num' }, v); r.append(e); rc.push(e); });
          tb.append(r); rows.push(r); cells.push(rc);
        });
        s.append(tb);
        sfx(a + 0.1, 'whoosh', 0.45); DEBTS.forEach(([, tt]) => sfx(tt + 0.05, 'type', 0.3)); COLS.forEach(([, , tt]) => sfx(tt + 0.05, 'tick', 0.35));
      },
      update(t) {
        const out = end - 0.4;
        inout(BIG, t, a, out, { dy: 50, s0: 0.9 }); inout(K, t, a + 0.1, out, { dy: 14 });
        H.update(t, out); W2.update(t, out);
        inout(wrap, t, pc - 0.3, out, { dy: 120, din: 0.8, oy: 40 });
        rows.forEach((r, i) => inout(r, t, DEBTS[i][1] - 0.05, out + 1, { dy: 16, din: 0.4 }));
        heads.forEach((e, j) => e.classList.toggle('on', t > COLS[j][2] - 0.05));
        cells.forEach(rc => rc.forEach((e, j) => css(e, { opacity: 0.15 + 0.85 * P(t, COLS[j][2], 0.4) })));
      },
    });
  }

  // ---------- renglones de deudas (bloque 12): posiciones absolutas, deterministas ----------
  function DebtRows(L, names, y0, rh, o = {}) {
    const x = M, w = CW, nw = V(o.nw ?? 300, o.nw9 ?? 230);
    const rows = names.map((n, i) => {
      const r = Box(L, x, y0 + i * rh, 'g4-dr', { width: w + 'px', height: (rh - 14) + 'px' });
      const nm = h('span', { class: 'g4-dr-n', style: { width: (nw - 20) + 'px' } }, n); r.append(nm);
      return { r, nm };
    });
    return { rows, tx: x + nw, tw: w - nw - V(24, 10), y: i => y0 + i * rh, rh };
  }

  // ===================================================================== G4-08 no le pagues un poquito a cada una: mínimo a todas, todo lo extra a una
  {
    const a = c('No le pagues un poquito').s, ac = c('a cada una', a).s, td = c('A todas les das el mínimo', a).s, mn = c('el mínimo', td).s,
      mu = c('menos a una', td).s, ae = c('A esa le mandas', td).s, ex = c('todo lo extra', ae).s, end = c('A cuál', a).s;
    const NAMES = ['Tarjeta', 'Préstamo', 'Abonos en tienda', 'Familia'];
    let W1, W2, W3, D, bits = [], mins = [], extra, xs, mark;
    Scene({
      id: 'g4_foco', start: a - 0.2, end: end - 0.25,
      build(root) {
        const L = layer(root);
        W1 = Words(Box(L, M, V(196, 280), 'col', { width: CW + 'px' }), 'No le pagues *un poquito* a cada una.', 'g4-h').sync('No le pagues un poquito a cada una');
        css(W1.el, { display: 'inline-block', position: 'relative', width: 'max-content', maxWidth: CW + 'px' }); xs = Strike(W1.el, 'strike');
        W2 = Words(Box(L, M, V(196, 280), 'col', { width: CW + 'px' }), 'A todas, *el mínimo.*', 'g4-h');
        at(W2, [td, td + 0.2, mn, mn + 0.1]);
        W3 = Words(Box(L, M, V(286, 368), 'col', { width: CW + 'px' }), 'A una, *todo lo extra.*', 'g4-h');
        at(W3, [ae, ae + 0.12, ex, ex + 0.1, ex + 0.2]);
        D = DebtRows(L, NAMES, V(420, 520), V(116, 172));
        const ch = V(56, 64), mw = V(220, 170), bw = V(70, 60);
        D.rows.forEach((rw, i) => {
          const y = D.y(i) + (D.rh - 14 - ch) / 2;
          const b = Box(L, D.tx, y, 'g4-bit', { width: bw + 'px', height: ch + 'px' }); bits.push(b);
          const m = Box(L, D.tx, y, 'g4-chip', { width: mw + 'px', height: ch + 'px' }); m.textContent = 'MÍNIMO'; mins.push(m);
        });
        extra = Box(L, D.tx + mw + 12, D.y(0) + (D.rh - 14 - ch) / 2, 'g4-extra', { width: (D.tw - mw - 12) + 'px', height: ch + 'px' });
        extra.textContent = 'TODO LO EXTRA';
        mark = Box(L, M - 18, D.y(0), 'g4-mark', { height: (D.rh - 14) + 'px' });
        sfx(a + 0.2, 'blip', 0.3); sfx(td - 0.25, 'strike', 0.45); sfx(mn + 0.1, 'tick', 0.5); sfx(mu + 0.2, 'click', 0.5); sfx(ex + 0.1, 'thud', 0.8);
      },
      update(t) {
        const out = end - 0.4;
        W1.update(t, td - 0.2); xs.update(t, td - 0.7, 0.35); css(xs.el, { opacity: 1 - P(t, td - 0.2, 0.3, Ease.exit) });
        W2.update(t, out); W3.update(t, out);
        D.rows.forEach(({ r, nm }, i) => {
          inout(r, t, a - 0.1 + i * 0.08, out, { dy: 18 });
          r.classList.toggle('dim', t > mu + 0.2 && i > 0);
          r.classList.toggle('hot', t > mu + 0.2 && i === 0);
        });
        bits.forEach((b, i) => inout(b, t, ac + i * 0.14, td - 0.2, { dy: 0, s0: 0.3, ein: Ease.outBack, oy: 0, s1: 0.6 }));
        mins.forEach((m, i) => inout(m, t, mn + i * 0.1, out, { dy: 0, dx: -20, din: 0.4 }));
        const ep = P(t, ex - 0.05, 0.6, Ease.enter);
        css(extra, { opacity: P(t, ex - 0.05, 0.15) * (1 - P(t, out, 0.3, Ease.exit)), clipPath: `inset(0 ${((1 - ep) * 100).toFixed(2)}% 0 0)` });
        const mp = P(t, mu + 0.2, 0.35);
        css(mark, { opacity: mp * (1 - P(t, out, 0.3, Ease.exit)), transform: `scaleY(${mp.toFixed(3)})` });
      },
    });
  }

  // ===================================================================== G4-09 ¿a cuál? avalancha: primero la tasa más alta
  {
    const a = c('A cuál', 355).s, sv = c('Si solo ves los números').s, ga = c('gana atacar primero', sv).s, ta = c('tasa más alta', sv).s,
      pq = c('porque te cobra menos intereses').s, mi = c('menos intereses', pq).s, ex = c('Así lo explica la Reserva Federal').s, end = c('Pero investigadores').s;
    // tasas solo cualitativas (sin cifras): orden inicial y orden por tasa
    const NAMES = ['Préstamo', 'Tarjeta', 'Familia', 'Abonos en tienda'], RATE = [0.5, 1, 0.05, 0.78];
    const ORDER = [1, 3, 0, 2];   // por tasa, de mayor a menor
    let W0, K, H, D, bars = [], one, chip, src, hd;
    Scene({
      id: 'g4_avalancha', start: a - 0.2, end: end - 0.25,
      build(root) {
        const L = layer(root);
        W0 = Words(Box(L, M, V(330, 560), 'col', { width: CW + 'px' }), '¿A *cuál?*', 'd1 hero').sync('A cuál', 355);
        K = Box(L, M, V(176, 262), 'kicker acc-k big-k'); K.textContent = 'AVALANCHA · SI SOLO VES LOS NÚMEROS';
        H = Words(Box(L, M, V(212, 304), 'col', { width: CW + 'px' }), 'Primero, la de *tasa más alta.*', 'g4-h');
        at(H, [ga, ga + 0.3, ta - 0.1, ta, ta + 0.2, ta + 0.4]);
        const y0 = V(380, 520), rh = V(110, 116);
        hd = Box(L, M + V(300, 230), y0 - 40, 'kicker'); hd.textContent = 'TASA DE INTERÉS';
        D = DebtRows(L, NAMES, y0, rh);
        D.rows.forEach(({ r }, i) => { const tk = h('div', { class: 'g4-track' }); const b = h('i', { style: { width: (RATE[i] * 100) + '%' } }); tk.append(b); r.append(tk); bars.push(b); });
        one = h('span', { class: 'g4-one' }, '1º'); D.rows[1].r.append(one);
        chip = Box(L, V(M + 300, M), V(y0 + 4 * rh + 6, y0 + 4 * rh + 10), 'g4-res'); chip.innerHTML = '= te cobra <b>menos intereses</b>';
        src = Box(L, M, V(y0 + 4 * rh + 92, y0 + 4 * rh + 96), 'g4-src kicker', { width: CW + 'px' }); src.innerHTML = V('ASÍ LO EXPLICA LA RESERVA FEDERAL DE SAN LUIS · EE.&nbsp;UU.', 'ASÍ LO EXPLICA LA RESERVA FEDERAL<br>DE SAN LUIS · EE.&nbsp;UU.');
        sfx(a, 'pop', 0.6); sfx(ga + 0.4, 'whoosh', 0.4); sfx(ta + 0.2, 'tick', 0.6); sfx(mi, 'check', 0.5);
      },
      update(t) {
        const out = end - 0.4;
        W0.update(t, sv - 0.35);
        inout(K, t, sv, out, { dy: 12 });
        H.update(t, out);
        inout(hd, t, sv + 0.2, out, { dy: 10 });
        const sp = P(t, ga + 0.3, 0.9, Ease.move);
        D.rows.forEach(({ r }, i) => {
          const to = ORDER.indexOf(i);
          inout(r, t, sv + 0.1 + i * 0.08, out, { dy: 18 });
          css(r, { top: (D.y(0) + lerp(i, to, sp) * D.rh).toFixed(1) + 'px' });
          r.classList.toggle('hot', t > ta && i === 1);
          r.classList.toggle('dim', t > ta && i !== 1);
        });
        bars.forEach((b, i) => css(b, { transform: `scaleX(${P(t, sv + 0.3 + i * 0.1, 0.6, Ease.outCubic).toFixed(4)})` }));
        const op = P(t, ta + 0.1, 0.35, Ease.outBack); css(one, { opacity: op, transform: `scale(${lerp(0.5, 1, op).toFixed(3)})` });
        inout(chip, t, pq, out, { dy: 16 });
        inout(src, t, ex, out, { dy: 10 });
      },
    });
  }

  // ===================================================================== G4-10 concentra tus pagos: la más chica primero se motiva más
  {
    const a = c('Pero investigadores').s, cs = c('quien concentra su dinero en una sola deuda').s, mo = c('se motiva más', cs).s, pr = c('y paga más rápido', cs).s,
      st = c('sobre todo si esa deuda es la más chica').s, lc = c('la más chica', st).s, vs = c('porque ves que se acaba').s, sa = c('se acaba', vs).s,
      end = c('Entonces si las tasas').s;
    const NAMES = ['Tarjeta', 'Abonos en tienda', 'Préstamo', 'Familia'], BAL = [0.75, 0.2, 1, 0.38];
    const ORDER = [2, 0, 3, 1];   // por saldo, de menor a mayor
    let K, H, g1, g2, k1, k2, W3, D, bars = [], hd, done, ck;
    Scene({
      id: 'g4_concentra', start: a - 0.2, end: end - 0.25,
      build(root) {
        const L = layer(root);
        K = Box(L, M, V(176, 262), 'kicker acc-k big-k'); K.textContent = 'INVESTIGADORES DE VARIAS UNIVERSIDADES';
        H = Words(Box(L, M, V(212, 304), 'col', { width: V(780, 820) + 'px' }), 'Quien concentra su dinero en *una sola deuda…*', 'g4-h').sync('quien concentra su dinero en una sola deuda');
        g1 = Box(L, M, V(470, 548), 'goal-row g4-goal'); k1 = Check(g1, 52); g1.append(h('span', { class: 'goal-t' }, 'se motiva más'));
        g2 = Box(L, M + V(0, 400), V(550, 548), 'goal-row g4-goal'); k2 = Check(g2, 52); g2.append(h('span', { class: 'goal-t' }, 'y paga más rápido'));
        W3 = Words(Box(L, M, V(680, 1470), 'col', { width: V(760, 820) + 'px' }), 'Sobre todo si es *la más chica:* ves que se acaba.', 'd3 d3-xl');
        at(W3, [st, st + 0.15, st + 0.3, lc, lc + 0.1, lc + 0.2, vs, vs + 0.15, sa, sa + 0.1]);
        const y0 = V(330, 690), rh = V(116, 116);
        if (!ctx.vertical) {
          D = { rows: [], tx: 0, rh, y: i => y0 + i * rh };
          NAMES.forEach((n, i) => { const r = Box(L, 1110, y0 + i * rh, 'g4-dr', { width: '702px', height: (rh - 14) + 'px' }); const nm = h('span', { class: 'g4-dr-n' }, n); r.append(nm); D.rows.push({ r, nm }); });
        } else D = DebtRows(L, NAMES, y0, rh);
        hd = Box(L, V(1110 + 300, M + 230), y0 - 40, 'kicker'); hd.textContent = 'LO QUE DEBES';
        D.rows.forEach(({ r }, i) => { const tk = h('div', { class: 'g4-track' }); const b = h('i', { style: { width: (BAL[i] * 100) + '%' } }); tk.append(b); r.append(tk); bars.push(b); });
        done = h('span', { class: 'g4-done' }); ck = Check(done, 44); done.append(h('b', {}, 'SE ACABA')); D.rows[1].r.append(done);
        sfx(cs + 0.5, 'click', 0.5); sfx(mo + 0.5, 'check', 0.5); sfx(pr + 0.5, 'check', 0.5); sfx(st + 0.4, 'whoosh', 0.35); sfx(sa + 0.1, 'pop', 0.7);
      },
      update(t) {
        const out = end - 0.4;
        inout(K, t, a, out, { dy: 12 });
        H.update(t, out);
        inout(g1, t, mo - 0.1, out, { dy: 18 }); k1.update(t, mo + 0.3);
        inout(g2, t, pr - 0.1, out, { dy: 18 }); k2.update(t, pr + 0.3);
        W3.update(t, out);
        inout(hd, t, a + 0.3, out, { dy: 10 });
        const sp = P(t, st + 0.3, 0.9, Ease.move);
        D.rows.forEach(({ r }, i) => {
          inout(r, t, a + 0.3 + i * 0.1, out, { dy: 18 });
          css(r, { top: (D.y(0) + lerp(i, ORDER.indexOf(i), sp) * D.rh).toFixed(1) + 'px' });
          const hot = t < st + 0.3 ? (t > cs + 0.5 && i === 0) : (t > lc && i === 1);
          r.classList.toggle('hot', hot);
          r.classList.toggle('dim', (t > cs + 0.5 && t < st + 0.3 && i !== 0) || (t > lc && i !== 1));
        });
        bars.forEach((b, i) => {
          const g = P(t, a + 0.5 + i * 0.1, 0.6, Ease.outCubic);
          const drain = i === 1 ? 1 - P(t, sa - 0.4, 0.8, Ease.inOutCubic) : 1;
          css(b, { transform: `scaleX(${(g * drain).toFixed(4)})` });
        });
        css(done, { opacity: P(t, sa + 0.1, 0.3) }); ck.update(t, sa + 0.1);
      },
    });
  }

  // ===================================================================== G4-11 entonces: la regla + cuando terminas una, su pago pasa a la siguiente [CAPTURA]
  {
    const a = c('Entonces si las tasas').s, md = c('muy distintas', a).s, ac = c('ataca la más cara', a).s, sp = c('Si se parecen', a).s, lc = c('la más chica', sp).s,
      ct = c('Cuando terminas una', a).s, pp = c('su pago pasa a la siguiente', a).s, sg = c('la siguiente', pp).s, end = c('Paso cinco cuida tu historial').s;
    const NAMES = ['Abonos en tienda', 'Tarjeta', 'Préstamo'];
    let K, q1, q2, a1, a2, D, mins = [], extra, roll, struck, ok, okC, nx, lbl;
    Scene({
      id: 'g4_regla', start: a - 0.2, end: end - 0.25,
      build(root) {
        const L = layer(root);
        K = Box(L, M, V(176, 262), 'kicker acc-k big-k'); K.textContent = 'ENTONCES';
        const RY = V(214, 304), RH2 = V(108, 150);
        const rule = (y, q, an) => {
          const r = Box(L, M, y, 'g4-rule', { width: CW + 'px', height: (RH2 - 10) + 'px' });
          const qq = h('span', { class: 'g4-rule-q' }, q), aa = h('span', { class: 'g4-rule-a' }, an);
          r.append(qq, aa); return [r, aa];
        };
        [q1, a1] = rule(RY, 'Si las tasas son muy distintas', 'la más cara');
        [q2, a2] = rule(RY + RH2, 'Si se parecen', 'la más chica');
        D = DebtRows(L, NAMES, V(530, 690), V(124, 150), { nw: 420, nw9: 300 });
        const ch = V(60, 64), mw = V(200, 120), xw = V(520, 220);
        D.rows.forEach((rw, i) => { const m = Box(L, D.tx, D.y(i) + (D.rh - 14 - ch) / 2, 'g4-chip', { width: mw + 'px', height: ch + 'px' }); m.textContent = 'MÍNIMO'; mins.push(m); });
        // el pago de la primera deuda (su mínimo + lo extra) rueda a la siguiente
        roll = Box(L, D.tx, D.y(0) + (D.rh - 14 - ch) / 2, 'g4-roll', { width: (mw + 12 + xw) + 'px', height: ch + 'px' });
        roll.append(h('span', { class: 'g4-chip in', style: { width: mw + 'px' } }, 'MÍNIMO'), extra = h('span', { class: 'g4-extra in', style: { width: xw + 'px' } }, 'TODO LO EXTRA'));
        struck = Strike(D.rows[0].nm, 'strike');
        ok = h('span', { class: 'g4-done' }); okC = Check(ok, 44); ok.append(h('b', {}, 'TERMINADA')); D.rows[0].r.append(ok);
        lbl = Box(L, M, V(D.y(3) + 6, D.y(3) + 10), 'kicker acc-k', { width: CW + 'px' }); lbl.textContent = 'SU PAGO PASA A LA SIGUIENTE ↓';
        nx = Box(L, M - 18, D.y(1), 'g4-mark', { height: (D.rh - 14) + 'px' });
        sfx(a + 0.2, 'whoosh', 0.4); sfx(ac + 0.2, 'tick', 0.6); sfx(lc + 0.1, 'tick', 0.6); sfx(ct + 0.4, 'strike', 0.5); sfx(pp + 0.3, 'whoosh', 0.5); sfx(sg + 0.3, 'thud', 0.6);
      },
      update(t) {
        const out = end - 0.4;
        inout(K, t, a, out, { dy: 12 });
        inout(q1, t, a + 0.1, out, { dy: 20 }); inout(q2, t, sp - 0.1, out, { dy: 20 });
        inout(a1, t, ac, out, { dy: 0, dx: -30 }); inout(a2, t, lc, out, { dy: 0, dx: -30 });
        q1.classList.toggle('on', t > ac && t < sp); q2.classList.toggle('on', t > lc);
        D.rows.forEach(({ r }, i) => { inout(r, t, ct - 1.6 + i * 0.1, out, { dy: 18 }); r.classList.toggle('done', i === 0 && t > ct + 0.4); r.classList.toggle('hot', i === 1 && t > pp + 0.8); });
        mins.forEach((m, i) => inout(m, t, ct - 1.4 + i * 0.1, out, { dy: 0, dx: -20, din: 0.4 }));
        css(mins[0], { opacity: 0 });
        const rp = P(t, pp + 0.1, 0.9, Ease.move);
        const mw = V(200, 120);
        const ry = (D.rh - 14 - V(60, 64)) / 2;
        css(roll, { opacity: P(t, ct - 1.2, 0.35) * (1 - P(t, out, 0.3, Ease.exit)), left: (D.tx + rp * (mw + 12)).toFixed(1) + 'px', top: (D.y(0) + ry + rp * D.rh).toFixed(1) + 'px' });
        roll.classList.toggle('on', t > pp + 0.8);
        struck.update(t, ct + 0.4);
        css(ok, { opacity: P(t, pp + 0.7, 0.3) }); okC.update(t, pp + 0.7);
        inout(lbl, t, pp + 0.3, out, { dy: 10 });
        const np = P(t, pp + 0.8, 0.35);
        css(nx, { opacity: np * (1 - P(t, out, 0.3, Ease.exit)), transform: `scaleY(${np.toFixed(3)})` });
      },
    });
  }
})();
