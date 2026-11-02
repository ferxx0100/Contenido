/* Grupo 5 · bloques 13–16 · SISTEMA 2 "Deuda"
   13 Paso cinco: Buró de Crédito · 14 Si ya no puedes con el mínimo · 15 El paso de hoy · 16 Cierre y gancho a Sistema tres
   + pantalla final (S.END). */
(() => {
  'use strict';
  const { h, css, attr, text, tr, P, env, kf, Ease, clamp, lerp, cue, Scene, sfx, ctx, T } = S;
  const { Words: Words0, inout, Counter, money, nf0, drawPath, Strike, Check, Phone, Row, DotGrid, Chip, Box } = C;
  // *varias palabras* -> *cada* *palabra* (Words solo acentúa palabra por palabra)
  const Words = (parent, str, cls, extra) => Words0(parent, str.replace(/\*([^*]+)\*/g, (m, g) => g.split(/\s+/).map(w => { const k = w.match(/^(.*?)([.,:;?!…]*)$/); return '*' + k[1] + '*' + k[2]; }).join(' ')), cls, extra);
  const V = (a, b) => (ctx.vertical ? b : a);
  const M = V(288, 120);          // columna de contenido (libro mayor)
  const CW = V(1524, 820);        // ancho útil hasta la regla derecha
  const A0 = 394;                 // todo lo de este grupo vive después de aquí
  const c = (p, a = A0) => cue(p, a);
  const MINUS = '−';
  const layer = (root, cls = '') => { const el = h('div', { class: 'layer ' + cls }); root.append(el); return el; };
  const fade = (el, t, t0, t1, d = 0.3) => css(el, { opacity: P(t, t0, d) * (1 - P(t, t1, d, Ease.exit)) });

  // encabezado de paso (mismo patrón que los pasos 1–4)
  function StepHead(L, n, title, t0, tout) {
    const big = Box(L, M, V(150, 262), 'step-n num-d'); big.textContent = n;
    const k = Box(L, V(M + 190, 300), V(176, 290), 'kicker acc-k'); k.textContent = 'PASO ' + n + ' DE 5';
    const W = Words(Box(L, V(M + 190, 300), V(214, 330), 'col', { width: V(1000, 640) + 'px' }), title, 'd2 g5-step-t');
    return { big, k, W, update(t, tout2 = tout) { inout(big, t, t0, tout2, { dy: 50, s0: 0.9 }); inout(k, t, t0 + 0.1, tout2, { dy: 14 }); W.update(t, tout2); } };
  }
  // teléfono estilizado (sin marcas reales)
  function phone(L, x, y, w, hgt) {
    const wrap = Box(L, x, y, 'g5-phwrap');
    const ph = Phone(wrap, { w, hgt });
    return { wrap, el: ph.el, screen: ph.screen };
  }
  // lista numerada tipo libro mayor
  function List(L, x, y, w, items) {
    const el = Box(L, x, y, 'crumbs g5-crumbs', { width: w + 'px' });
    const rows = items.map((s, i) => { const r = h('div', { class: 'crumb' }, h('span', { class: 'num' }, String(i + 1)), h('span', { class: 'g5-cr-t' }, s)); el.append(r); return r; });
    return { el, rows, update(t, ts, tout) { fade(el, t, ts[0] - 0.1, tout); rows.forEach((r, i) => { inout(r, t, ts[i], tout, { dx: -20, dy: 0 }); r.classList.toggle('on', t > ts[i] + 0.2); }); } };
  }
  const tagEj = () => h('span', { class: 'g5-tagx' }, 'EJEMPLO');

  // ===================================================================== G5-01 paso 5: cuida tu historial · ya estás en Buró
  {
    const a = c('Paso cinco cuida tu historial').s, si = c('Si tienes o tuviste').s, ta = c('una tarjeta', si).s, pr = c('un préstamo', si).s,
      pl = c('un plan de celular', si).s, ye = c('ya estás en Buró de Crédito').s, bu = c('Buró de Crédito', ye).s, end = c('No es una lista negra').s;
    let H, W1, LI, file, frows = [], arrow, W2, stamp;
    Scene({
      id: 'g5_paso5', start: a - 0.2, end: end - 0.25,
      build(root) {
        const L = layer(root);
        H = StepHead(L, '5', 'Cuida tu *historial.*', a, end - 0.45); H.W.sync('cuida tu historial', a);
        W1 = Words(Box(L, M, V(460, 470), 'col', { width: V(760, 820) + 'px' }), 'Si tienes o tuviste:', 'd3 muted').sync('Si tienes o tuviste');
        LI = List(L, M, V(540, 540), V(720, 820), ['Una tarjeta', 'Un préstamo', 'Un plan de celular']);
        arrow = Box(L, V(1050, 480), V(690, 800), 'g5-arrow' + (ctx.vertical ? ' down' : ''));
        file = Box(L, V(1170, 120), V(470, 860), 'g5-file', { width: V(662, 820) + 'px' });
        file.append(h('div', { class: 'kicker' }, 'TU EXPEDIENTE'), h('div', { class: 'g5-file-t' }, 'Buró de Crédito'));
        ['TARJETA', 'PRÉSTAMO', 'PLAN DE CELULAR'].forEach(s => { const r = h('div', { class: 'g5-frow' }, h('i'), h('span', {}, s), h('b', {}, 'REGISTRADO')); file.append(r); frows.push(r); });
        stamp = h('div', { class: 'g5-stamp' }, 'YA ESTÁS AQUÍ'); file.append(stamp);
        sfx(a, 'tick', 0.6); [ta, pr, pl].forEach(x => sfx(x + 0.1, 'blip', 0.35)); sfx(bu, 'thud', 0.6);
      },
      update(t) {
        const out = end - 0.45;
        H.update(t);
        W1.update(t, out);
        LI.update(t, [ta, pr, pl], out);
        css(arrow, { opacity: P(t, ye - 0.1, 0.3) * (1 - P(t, out, 0.3, Ease.exit)), transform: ctx.vertical ? `scaleY(${P(t, ye - 0.1, 0.5, Ease.move).toFixed(4)})` : `scaleX(${P(t, ye - 0.1, 0.5, Ease.move).toFixed(4)})` });
        inout(file, t, ye, out, { dy: 0, dx: V(40, 0), s0: 0.97 });
        frows.forEach((r, i) => inout(r, t, ye + 0.35 + i * 0.18, out, { dy: 10, din: 0.35 }));
        const sp = P(t, bu + 0.3, 0.35, Ease.outBack);
        css(stamp, { opacity: P(t, bu + 0.3, 0.15) * (1 - P(t, out, 0.3)), transform: `rotate(-6deg) scale(${lerp(1.5, 1, sp).toFixed(4)})` });
      },
    });
  }

  // ===================================================================== G5-02 no es lista negra · es tu historial · cada mes a tiempo o tarde [GRÁFICA]
  {
    const a = c('No es una lista negra').s, ne = c('negra', a).s, eh = c('es tu historial', a).s, ap = c('y ahí aparece lo bueno').s, lb = c('lo bueno', ap).s,
      lm = c('lo malo', ap).s, cm = c('Cada mes tu banco').s, at = c('a tiempo o tarde', cm).s, ta = c('tarde', at).s, ati = c('a tiempo', cm).s, end = c('Si cubres por lo menos').s;
    const MON = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
    const LATE = 6;
    let T1, sk = [], T2, dbl, K, strip, cells = [], lgB, lgM;
    Scene({
      id: 'g5_historial', start: a - 0.2, end: end - 0.25,
      build(root) {
        const L = layer(root);
        T1 = Words(Box(L, M, V(176, 290), 'col', { width: CW + 'px' }), 'No es una lista negra.', 'serif-line').sync('No es una lista negra');
        sk = [Strike(T1.ws[3], 'strike'), Strike(T1.ws[4], 'strike')];
        const b2 = Box(L, M, V(310, 400), 'col', { width: CW + 'px' });
        T2 = Words(b2, 'Es tu *historial.*', 'd1').sync('es tu historial', a);
        K = Box(L, M, V(590, 690), 'kicker'); K.textContent = 'CADA MES, TU BANCO LE DICE AL BURÓ:';
        strip = Box(L, M, V(636, 736), 'g5-months', { width: CW + 'px' });
        MON.forEach((m, i) => { const el = h('div', { class: 'g5-mo' }, h('span', { class: 'kicker' }, m), h('b', {}, i === LATE ? '✕' : '✓'), h('small', {}, i === LATE ? 'TARDE' : 'A TIEMPO')); strip.append(el); cells.push(el); });
        const lg = Box(L, M, V(836, 1050), 'g5-legend', { width: CW + 'px' });
        lgB = h('div', { class: 'g5-lg' }, h('b', {}, '✓'), h('span', {}, 'Lo bueno'));
        lgM = h('div', { class: 'g5-lg bad' }, h('b', {}, '✕'), h('span', {}, 'Lo malo'));
        lg.append(lgB, lgM);
        sfx(ne + 0.15, 'strike', 0.6); sfx(eh, 'pop', 0.5); MON.forEach((_, i) => i % 2 === 0 && sfx(cm + 0.2 + i * 0.26, 'tick', 0.25)); sfx(ta + 0.05, 'thud', 0.5);
      },
      update(t) {
        const out = end - 0.45;
        T1.update(t, out); sk[0].update(t, ne - 0.1); sk[1].update(t, ne + 0.15);
        T2.update(t, out);
        inout(K, t, ap, out, { dy: 12 });
        inout(strip, t, ap, out, { dy: 24 });
        cells.forEach((el, i) => {
          const ti = cm + 0.2 + i * 0.26;
          const p = P(t, ti, 0.3, Ease.outBack);
          el.classList.toggle('on', t >= ti);
          el.classList.toggle('late', i === LATE && t >= ti);
          css(el.children[1], { transform: `scale(${(t >= ti ? lerp(0.5, 1, p) : 0.5).toFixed(3)})`, opacity: t >= ti ? 1 : 0 });
          css(el.children[2], { opacity: P(t, ti + 0.1, 0.25) });
        });
        inout(lgB, t, lb, out, { dy: 12 }); inout(lgM, t, lm, out, { dy: 12 });
        lgB.classList.toggle('hl', t > ati && t < ta);
        lgM.classList.toggle('hl', t > ta);
      },
    });
  }

  // ===================================================================== G5-03 mínimo antes de la fecha límite = al corriente · atraso = marcado [CAPTURA]
  {
    const a = c('Si cubres por lo menos').s, mi = c('el mínimo', a).s, fl = c('antes de la fecha límite', a).s, fe = c('fecha límite', a).s, qc = c('queda al corriente', a).s,
      st = c('Si te atrasas', a).s, ps = c('aunque sean pocos días', a).s, pm = c('puede quedar marcado', a).s, ma = c('marcado', pm).s, end = c('Y un atraso no desaparece').s;
    let ph, rMin, rFec, okS, badS, r1, ck, l1, r2, x2, l2, W1, W2;
    Scene({
      id: 'g5_fecha', start: a - 0.2, end: end - 0.25,
      build(root) {
        const L = layer(root);
        ph = phone(L, V(1360, 300), V(150, 262), V(440, 480), V(770, 600));
        const s = ph.screen;
        s.append(h('div', { class: 'app-head' }, h('span', { class: 'app-logo' }), h('span', {}, 'Tu tarjeta')),
          h('div', { class: 'g5-st-k' }, 'ESTADO DE CUENTA'),
          h('div', { class: 'g5-st-row' }, h('span', {}, 'Saldo al corte'), h('i', { class: 'g5-redact' })),
          h('div', { class: 'g5-st-row' }, h('span', {}, 'Pago para no generar intereses'), h('i', { class: 'g5-redact' })),
          rMin = h('div', { class: 'g5-st-row' }, h('span', {}, 'Pago mínimo'), h('i', { class: 'g5-redact' })),
          rFec = h('div', { class: 'g5-st-row' }, h('span', {}, 'Fecha límite de pago'), h('i', { class: 'g5-redact s' }), h('div', { class: 'bracket' })));
        okS = h('div', { class: 'g5-ph-badge' }, h('span', { class: 'kicker' }, 'ESTE MES'), h('b', {}, 'Al corriente ✓'));
        badS = h('div', { class: 'g5-ph-badge bad' }, h('span', { class: 'kicker' }, 'SI TE ATRASAS'), h('b', {}, 'Puede quedar marcado'));
        s.append(okS, badS);
        const col = Box(L, M, V(190, 892), 'g5-prs', { width: V(980, 820) + 'px' });
        r1 = h('div', { class: 'g5-pr' }); ck = Check(r1, V(64, 52));
        const t1b = h('div'); r1.append(t1b);
        W1 = Words(t1b, 'Por lo menos el mínimo, *antes de la fecha límite.*', 'g5-pr-t').sync('por lo menos el mínimo antes de la fecha límite', a);
        t1b.append(l1 = h('div', { class: 'kicker g5-pr-k' }, 'QUEDA AL CORRIENTE'));
        r2 = h('div', { class: 'g5-pr' }); x2 = h('div', { class: 'g5-x' }); r2.append(x2);
        const t2b = h('div'); r2.append(t2b);
        W2 = Words(t2b, 'Te atrasas, *aunque sean pocos días.*', 'g5-pr-t').sync('te atrasas aunque sean pocos días', a);
        t2b.append(l2 = h('div', { class: 'kicker acc-k g5-pr-k' }, 'PUEDE QUEDAR MARCADO'));
        col.append(r1, r2);
        sfx(fe, 'tick', 0.5); sfx(qc + 0.2, 'check', 0.6); sfx(ma, 'thud', 0.6);
      },
      update(t) {
        const out = end - 0.45;
        inout(ph.wrap, t, a - 0.2, out, { dy: 120, din: 0.8, oy: 40 });
        rMin.classList.toggle('on', t > mi && t < fe - 0.1);
        rFec.classList.toggle('on', t > fe - 0.1);
        css(rFec.querySelector('.bracket'), { opacity: P(t, fe, 0.25) });
        inout(okS, t, qc, st, { dy: 20, s0: 0.95 });
        inout(badS, t, ma - 0.1, out, { dy: 20, s0: 0.95 });
        inout(r1, t, a - 0.1, out, { dy: 20 });
        W1.update(t, out); ck.update(t, qc);
        inout(l1, t, qc + 0.1, out, { dy: 8 });
        inout(r2, t, st - 0.1, out, { dy: 20 });
        W2.update(t, out);
        const xp = P(t, pm, 0.35, Ease.outBack);
        css(x2, { opacity: P(t, pm, 0.15) * (1 - P(t, out, 0.3)), transform: `scale(${lerp(0.4, 1, xp).toFixed(4)})` });
        inout(l2, t, ma - 0.1, out, { dy: 8 });
      },
    });
  }

  // ===================================================================== G5-04 un atraso no desaparece · cuánto dura según lo que debías [GRÁFICA]
  {
    const a = c('Y un atraso no desaparece').s, cd = c('Cuánto dura depende').s, cu = c('cuánto debías', cd).s,
      h1 = c('Hasta unos doscientos veinte pesos').s, y1 = c('un año', h1).s, h2 = c('Hasta unos cuatro mil cuatrocientos').s, y2 = c('dos años', h2).s,
      h3 = c('Hasta unos ocho mil ochocientos').s, y3 = c('cuatro años', h3).s, h4 = c('Más que eso').s, y4 = c('hasta seis años', h4).s,
      co = c('contados desde que se reportó').s, end = c('Si ya no puedes ni').s;
    const ROWS = [['HASTA', '~$220', 1, '1 año', h1, y1], ['HASTA', '~$4,400', 2, '2 años', h2, y2], ['HASTA', '~$8,800', 4, '4 años', h3, y3], ['MÁS DE', '~$8,800', 6, 'Hasta 6 años', h4, y4]];
    let W0, W1, tab, head, rows = [], bars = [], yrs = [], W2, ax;
    Scene({
      id: 'g5_plazos', start: a - 0.2, end: end - 0.25,
      build(root) {
        const L = layer(root);
        W0 = Words(Box(L, M, V(330, 520), 'col', { width: CW + 'px' }), 'Un atraso *no desaparece* cuando pagas.', 'd1').sync('un atraso no desaparece cuando pagas', a);
        W1 = Words(Box(L, M, V(176, 290), 'col', { width: CW + 'px' }), '¿Cuánto dura? Depende de *cuánto debías.*', 'g5-h').sync('Cuánto dura depende de cuánto debías');
        tab = Box(L, M, V(320, 470), 'g5-tab', { width: CW + 'px' });
        head = h('div', { class: 'g5-thead' }, h('span', {}, 'SI DEBÍAS'), ax = h('span', { class: 'g5-ax' }), h('span', {}, 'DURA EN TU HISTORIAL'));
        if (!ctx.vertical) for (let i = 1; i <= 6; i++) ax.append(h('i', { style: { left: (i / 6 * 100) + '%' } }, String(i)));
        tab.append(head);
        ROWS.forEach(([k, v, n, lab], i) => {
          const bar = h('div', { class: 'g5-tbar' }, h('i', { style: { width: (n / 6 * 100) + '%' } }));
          const y = h('div', { class: 'g5-tyr' + (i === 3 ? ' acc' : '') }, lab);
          const r = h('div', { class: 'g5-trow' + (i === 3 ? ' max' : '') }, h('div', { class: 'g5-tamt' }, h('span', { class: 'kicker' }, k), h('b', { class: 'num-d' }, v)), bar, y);
          tab.append(r); rows.push(r); bars.push(bar.firstChild); yrs.push(y);
        });
        tab.append(h('div', { class: 'g5-tnote kicker' }, 'MONTOS APROXIMADOS · SE FIJAN EN UDIS'));
        W2 = Words(Box(L, M, V(846, 1470), 'col', { width: CW + 'px' }), 'Contados desde que se reportó el atraso *por primera vez.*', V('d3', 'd3 d3-xl')).sync('contados desde que se reportó el atraso por primera vez');
        sfx(a + 0.3, 'thud', 0.5); [y1, y2, y3, y4].forEach(x => sfx(x + 0.1, 'tick', 0.45)); sfx(y4 + 0.5, 'pop', 0.4);
      },
      update(t) {
        const out = end - 0.45, mid = cd - 0.35;
        W0.update(t, mid);
        W1.update(t, out);
        inout(tab, t, cu - 0.4, out, { dy: 30 });
        rows.forEach((r, i) => {
          const R = ROWS[i];
          inout(r, t, R[4] - 0.1, out, { dy: 16, din: 0.45 });
          css(bars[i], { transform: `scaleX(${P(t, R[5] - 0.25, 0.6, Ease.move).toFixed(4)})` });
          css(yrs[i], { opacity: P(t, R[5] - 0.1, 0.3) });
          const nx = i < 3 ? ROWS[i + 1][4] - 0.1 : co - 0.1;
          r.classList.toggle('cur', t > R[4] - 0.1 && t < nx);
        });
        W2.update(t, out);
      },
    });
  }

  // ===================================================================== G5-05 si ya no puedes ni con el mínimo: no esperes [CARA]
  {
    const a = c('Si ya no puedes ni con el mínimo').s, ne = c('no esperes a atrasarte').s, end = c('Habla antes con tu banco').s;
    let W0, W1;
    Scene({
      id: 'g5_noesperes', start: a - 0.2, end: end - 0.25,
      build(root) {
        const L = layer(root);
        W0 = Words(Box(L, M, V(220, 330), 'col', { width: CW + 'px' }), 'Si ya no puedes ni con el mínimo…', 'serif-line').sync('Si ya no puedes ni con el mínimo');
        W1 = Words(Box(L, M, V(430, 640), 'col', { width: CW + 'px' }), 'No esperes *a atrasarte.*', 'd1 hero').sync('no esperes a atrasarte');
        sfx(ne, 'thud', 0.7);
      },
      update(t) {
        const out = end - 0.4;
        W0.update(t, out); W1.update(t, out);
      },
    });
  }

  // ===================================================================== G5-06 reestructura vs quita (quebranto) [GRÁFICA]
  {
    const a = c('Habla antes con tu banco').s, pu = c('pide una reestructura').s, re = c('reestructura', pu).s, np = c('un nuevo plan de pagos').s,
      sa = c('Se anota en tu historial').s, mm = c('mucho mejor', sa).s, dp = c('dejar de pagar', sa).s, ys = c('Y si te ofrecen pagar').s,
      qu = c('una quita').s, qq = c('quita', qu).s, qm = c('queda marcada como quebranto').s, qb = c('quebranto', qm).s, end = c('Y si alguien te cobra').s;
    let W0, cA, cB, kA, tA, dA, nA, mA, stA, kB, tB, dB, lB, stamp;
    Scene({
      id: 'g5_reestructura', start: a - 0.2, end: end - 0.25,
      build(root) {
        const L = layer(root);
        W0 = Words(Box(L, M, V(176, 290), 'col', { width: CW + 'px' }), 'Habla *antes* con tu banco.', 'g5-h').sync('Habla antes con tu banco');
        cA = Box(L, M, V(330, 420), 'g5-card', { width: V(740, 820) + 'px' });
        kA = h('div', { class: 'kicker' }, 'PIDE UNA');
        tA = h('div', { class: 'g5-ct' }, 'Reestructura');
        dA = Words(h('div'), '= un nuevo plan de pagos', 'g5-cd'); dA.times = [np - 0.1, ...[0, 1, 2, 3, 4].map(i => T.words[c('un nuevo plan de pagos').i + i].s - 0.06)];
        nA = h('div', { class: 'g5-cl' }, h('span', { class: 'g5-pen' }, '✎'), h('span', {}, 'Se anota en tu historial'));
        mA = h('div', { class: 'g5-cl' }, h('span', { class: 'g5-pen acc' }, '✓'), h('span', {}, 'Mucho mejor que ', stA = h('span', { class: 'g5-strk' }, 'dejar de pagar')));
        const stk = Strike(stA, 'strike'); cA.__stk = stk;
        cA.append(kA, tA, dA.el, h('div', { class: 'g5-sep' }), nA, mA);
        cB = Box(L, V(1072, 120), V(330, 850), 'g5-card', { width: V(740, 820) + 'px' });
        kB = h('div', { class: 'kicker' }, 'SI TE OFRECEN PAGAR CON DESCUENTO');
        tB = h('div', { class: 'g5-ct' }, 'Quita');
        dB = h('div', { class: 'g5-cd' }, '= pagar con descuento');
        lB = h('div', { class: 'kicker g5-ql' }, 'QUEDA MARCADA COMO');
        stamp = h('div', { class: 'g5-stamp big' }, 'QUEBRANTO');
        cB.append(kB, tB, dB, h('div', { class: 'g5-sep' }), lB, stamp);
        sfx(re, 'pop', 0.5); sfx(sa + 0.1, 'type', 0.3); sfx(dp + 0.3, 'strike', 0.5); sfx(qq, 'pop', 0.5); sfx(qb + 0.1, 'thud', 0.8);
      },
      update(t) {
        const out = end - 0.45;
        W0.update(t, out);
        inout(cA, t, pu - 0.3, out, { dy: 40 });
        inout(kA, t, pu - 0.1, out, { dy: 10 });
        inout(tA, t, re - 0.1, out, { dy: 24 });
        dA.update(t, out);
        inout(nA, t, sa - 0.1, out, { dy: 14 });
        inout(mA, t, mm - 0.1, out, { dy: 14 });
        cA.__stk.update(t, dp + 0.2);
        cA.classList.toggle('dim', t > ys + 0.2);
        inout(cB, t, ys - 0.2, out, { dy: 40 });
        inout(kB, t, ys, out, { dy: 10 });
        inout(tB, t, qq - 0.1, out, { dy: 24 });
        inout(dB, t, qq + 0.2, out, { dy: 10 });
        inout(lB, t, qm - 0.05, out, { dy: 10 });
        const sp = P(t, qb, 0.35, Ease.outBack);
        css(stamp, { opacity: P(t, qb, 0.12) * (1 - P(t, out, 0.3)), transform: `rotate(-4deg) scale(${lerp(1.6, 1, sp).toFixed(4)})` });
      },
    });
  }

  // ===================================================================== G5-07 cobrar por borrarte = fraude · un error sí se corrige [GRÁFICA]
  {
    const a = c('Y si alguien te cobra').s, ef = c('es un fraude', a).s, fr = c('fraude', ef).s, na = c('Nadie puede borrar').s,
      pe = c('Pero si hay un error').s, sc = c('eso sí se corrige').s, co = c('corrige', sc).s, cf = c('CONDUSEF te orienta gratis').s, end = c('Llamas al cincuenta').s, er = c('error', pe).s;
    const mid = pe - 0.35;
    let ad, fstamp, W1, W2, W3, rep, rr = [], rstk, rtag, rck, W4, W5, chip;
    Scene({
      id: 'g5_fraude', start: a - 0.2, end: end - 0.25,
      build(root) {
        const L = layer(root);
        // anuncio genérico (sin marcas)
        ad = Box(L, V(1180, 170), V(190, 282), 'g5-ad card', { width: V(600, 740) + 'px' });
        ad.append(h('div', { class: 'g5-ad-top' }, h('span', { class: 'kicker' }, 'MENSAJE NUEVO'), h('span', { class: 'kicker' }, 'AHORA')),
          h('div', { class: 'g5-ad-t' }, '¡Te sacamos del Buró!'), h('div', { class: 'g5-ad-s' }, 'Limpia tu historial hoy. Paga y listo.'), h('div', { class: 'g5-ad-b' }, 'PAGAR AHORA'));
        fstamp = h('div', { class: 'g5-stamp big' }, 'FRAUDE'); ad.append(fstamp);
        W1 = Words(Box(L, M, V(214, 690), 'col', { width: V(840, 820) + 'px' }), 'Si alguien te cobra *por sacarte del Buró…*', 'g5-h').sync('si alguien te cobra por sacarte del Buró', a);
        W2 = Words(Box(L, M, V(400, 840), 'col', { width: V(860, 820) + 'px' }), 'Es un *fraude.*', 'd1 g5-big').sync('es un fraude', a);
        W3 = Words(Box(L, M, V(600, 1470), 'col', { width: V(860, 820) + 'px' }), 'Nadie puede borrar tus registros negativos *antes del plazo que marca la ley.*', V('d3', 'd3')).sync('Nadie puede borrar tus registros negativos antes del plazo que marca la ley');
        // reporte con un error que sí se corrige
        rep = Box(L, V(1180, 120), V(190, 282), 'g5-rep card', { width: V(600, 820) + 'px' });
        rep.append(h('div', { class: 'kicker g5-rep-k' }, 'TU REPORTE DE CRÉDITO'));
        [['Tarjeta de crédito', 'AL CORRIENTE'], ['Plan de celular', 'AL CORRIENTE'], ['Un crédito que no es tuyo', 'ERROR']].forEach(([n, s], i) => {
          const r = h('div', { class: 'g5-rr' + (i === 2 ? ' err' : '') }, h('span', { class: 'g5-rr-n' }, n), h('span', { class: 'kicker' }, s)); rep.append(r); rr.push(r);
        });
        rstk = Strike(rr[2].firstChild, 'strike');
        rtag = h('span', { class: 'g5-fix kicker' }, 'SE CORRIGE'); rr[2].append(rtag);
        W4 = Words(Box(L, M, V(214, 690), 'col', { width: V(840, 820) + 'px' }), '¿Hay un error *en tu reporte?*', 'g5-h').sync('hay un error en tu reporte', pe);
        W5 = Words(Box(L, M, V(400, 800), 'col', { width: V(860, 820) + 'px' }), 'Eso *sí se corrige.*', 'd1').sync('eso sí se corrige');
        chip = Box(L, M, V(800, 1470), 'g5-chip'); chip.append(h('b', {}, 'CONDUSEF'), h('span', {}, 'te orienta gratis'));
        sfx(fr + 0.05, 'thud', 0.9); sfx(pe, 'whoosh', 0.4); sfx(co + 0.1, 'strike', 0.5); sfx(cf + 0.1, 'pop', 0.5);
      },
      update(t) {
        const out = end - 0.45;
        inout(ad, t, a - 0.1, mid, { dy: 40, r: -2 });
        const sp = P(t, fr, 0.35, Ease.outBack);
        css(fstamp, { opacity: P(t, fr, 0.12), transform: `rotate(-8deg) scale(${lerp(1.7, 1, sp).toFixed(4)})` });
        W1.update(t, mid); W2.update(t, mid); W3.update(t, mid);
        inout(rep, t, pe - 0.1, out, { dy: 40 });
        rr.forEach((r, i) => inout(r, t, pe + 0.1 + i * 0.15, out, { dy: 10, din: 0.35 }));
        rr[2].classList.toggle('hot', t > er);
        rstk.update(t, co);
        inout(rtag, t, co + 0.2, out, { dy: 8 });
        W4.update(t, out); W5.update(t, out);
        inout(chip, t, cf - 0.1, out, { dy: 16 });
      },
    });
  }

  // ===================================================================== G5-08 CONDUSEF 55 5340 0999 [GRÁFICA]
  {
    const a = c('Llamas al cincuenta').s, n55 = c('cincuenta y cinco', a).s, n53 = c('cincuenta y tres', a).s, n400 = c('cuatrocientos', n53).s,
      n999 = c('novecientos noventa y nueve', a).s, end = c('Ahora el paso de hoy').s;
    // dígitos agrupados como se escriben: 55 5340 0999, revelados al ritmo de la voz (55 · 53 · 400 · 999)
    const CH = [['5', n55], ['5', n55], [' '], ['5', n53], ['3', n53], ['4', n400], ['0', n400], ctx.vertical ? ['\n'] : [' '], ['0', n400], ['9', n999], ['9', n999], ['9', n999]];
    let K, W0, num, chs = [], dbl, sub;
    Scene({
      id: 'g5_condusef', start: a - 0.2, end: end - 0.25,
      build(root) {
        const L = layer(root);
        K = Box(L, M, V(200, 300), 'kicker acc-k big-k'); K.textContent = 'CONDUSEF · TE ORIENTA GRATIS';
        W0 = Words(Box(L, M, V(250, 360), 'col', { width: CW + 'px' }), 'Llamas al:', 'd3 muted').sync('Llamas al');
        num = Box(L, M - 8, V(340, 450), 'g5-tel num-d');
        CH.forEach(([ch]) => { if (ch === '\n') num.append(h('br')); else { const s = h('span', {}, ch === ' ' ? ' ' : ch); if (ch === ' ') s.className = 'sp'; num.append(s); chs.push(s); } });
        dbl = Box(L, M, V(620, 830), 'dbl', { width: V(1250, 700) + 'px' });
        sub = Box(L, M, V(680, 900), 'g5-tel-sub'); sub.append(h('span', { class: 'num' }, 'condusef.gob.mx'), h('span', { class: 'kicker' }, 'ORIENTACIÓN GRATIS'));
        [n55, n53, n400, n999].forEach(x => sfx(x, 'blip', 0.35));
      },
      update(t) {
        const out = end - 0.4;
        inout(K, t, a - 0.1, out, { dy: 12 });
        W0.update(t, out);
        css(num, { opacity: 1 - P(t, out, 0.3, Ease.exit) });
        let k = 0;
        CH.forEach(([ch, t0]) => { if (ch === '\n') return; const s = chs[k++]; if (!t0) return; const p = P(t, t0 - 0.05, 0.4, Ease.enter); css(s, { opacity: p, transform: tr(0, (1 - p) * 40, 1) }); });
        css(dbl, { transform: `scaleX(${P(t, n999 + 0.3, 0.6, Ease.move).toFixed(4)})`, opacity: 1 - P(t, out, 0.3, Ease.exit) });
        inout(sub, t, n999 + 0.5, out, { dy: 12 });
      },
    });
  }

  // ===================================================================== G5-09 el paso de hoy: con el celular, en menos de 5 minutos [CARA]
  {
    const a = c('Ahora el paso de hoy').s, cc = c('con el celular', a).s, mc = c('en menos de cinco minutos', a).s, end = c('En tus notas').s;
    let K, W0, ch1, ch2;
    Scene({
      id: 'g5_hoy', start: a - 0.2, end: end - 0.25,
      build(root) {
        const L = layer(root);
        K = Box(L, M, V(240, 400), 'kicker acc-k big-k'); K.textContent = 'TU TAREA';
        W0 = Words(Box(L, M, V(290, 450), 'col', { width: CW + 'px' }), 'El paso *de hoy.*', 'd1 hero').sync('el paso de hoy', a);
        const row = Box(L, M, V(600, 800), 'chips-row g5-chips');
        ch1 = Chip(row, 'Con el celular'); ch2 = Chip(row, '');
        ch2.append(h('span', {}, 'En menos de '), h('b', { class: 'acc' }, '5 minutos'));
        sfx(a, 'riser', 0.35); sfx(cc, 'pop', 0.4); sfx(mc + 0.6, 'pop', 0.4);
      },
      update(t) {
        const out = end - 0.4;
        inout(K, t, a - 0.1, out, { dy: 12 });
        W0.update(t, out);
        inout(ch1, t, cc - 0.1, out, { dy: 16, s0: 0.92 });
        inout(ch2, t, mc, out, { dy: 16, s0: 0.92 });
      },
    });
  }

  // ===================================================================== G5-10 notas: tercera columna ÷ 10 = tamaño de tu nivel [CAPTURA]
  {
    const a = c('En tus notas').s, su = c('suma tu tercera columna').s, tc = c('tercera columna', su).s, td = c('con todas tus deudas').s,
      dv = c('y divídela entre diez').s, di = c('diez', dv).s, ee = c('ese es el tamaño de tu nivel').s, ni = c('nivel', ee).s, nc = c('y ya no cambia').s, end = c('Después abre el calendario').s;
    let ph, tabs, rT, rTot, rDiv, rRes, K, W1, W2, W3, W4, W5, lock;
    Scene({
      id: 'g5_notas', start: a - 0.2, end: end - 0.25,
      build(root) {
        const L = layer(root);
        ph = phone(L, V(1360, 300), V(150, 262), V(440, 480), V(770, 600));
        const s = ph.screen;
        s.append(h('div', { class: 'g5-nt-top' }, h('span', { class: 'kicker' }, 'NOTAS'), tagEj()), h('div', { class: 'g5-nt-h' }, 'Mis columnas'));
        tabs = h('div', { class: 'g5-nt-tabs' }, h('span', {}, 'ENTRA'), h('span', {}, 'SALE'), h('span', { class: 'on' }, 'LO QUE DEBO'));
        s.append(tabs);
        rT = h('div', { class: 'g5-nt-row' }, h('span', {}, 'Tarjeta'), h('b', { class: 'num' }, '$20,000'));
        rTot = h('div', { class: 'g5-nt-row tot' }, h('span', {}, 'Total'), h('b', { class: 'num' }, '$20,000'));
        rDiv = h('div', { class: 'g5-nt-row' }, h('span', {}, 'Entre'), h('b', { class: 'num' }, '÷ 10'));
        rRes = h('div', { class: 'g5-nt-res' }, h('span', { class: 'kicker' }, 'TAMAÑO DE MI NIVEL'), h('b', { class: 'num' }, '$2,000'));
        s.append(rT, rTot, rDiv, rRes);
        K = Box(L, M, V(176, 890), 'kicker acc-k'); K.textContent = 'EN TUS NOTAS';
        W1 = Words(Box(L, M, V(214, 930), 'col', { width: V(980, 820) + 'px' }), 'Suma tu *tercera columna,*', 'g5-h').sync('suma tu tercera columna');
        W2 = Words(Box(L, M, V(310, 1016), 'col', { width: V(980, 820) + 'px' }), 'con todas tus deudas,', 'd3 muted').sync('con todas tus deudas');
        W3 = Words(Box(L, M, V(390, 1086), 'col', { width: V(980, 820) + 'px' }), 'y divídela *entre diez.*', 'd3 d3-xl').sync('y divídela entre diez');
        W4 = Words(Box(L, M, V(560, 1470), 'col', { width: V(980, 820) + 'px' }), 'Ese es el tamaño *de tu nivel.*', 'd2 g5-step-t').sync('ese es el tamaño de tu nivel');
        const b5 = Box(L, M, V(800, 1700), 'g5-lockrow');
        lock = h('i', { class: 'g5-lock' }); b5.append(lock);
        W5 = Words(b5, 'Y ya no cambia.', 'd3 d3-xl').sync('y ya no cambia');
        sfx(tc, 'tick', 0.4); sfx(td + 0.3, 'type', 0.3); sfx(di, 'tick', 0.5); sfx(ni, 'pop', 0.5); sfx(nc + 0.6, 'click', 0.6);
      },
      update(t) {
        const out = end - 0.45;
        inout(ph.wrap, t, a - 0.2, out, { dy: 120, din: 0.8, oy: 40 });
        tabs.lastChild.classList.toggle('hl', t > tc);
        inout(rT, t, tc + 0.2, out, { dy: 10 });
        inout(rTot, t, td + 0.2, out, { dy: 10 });
        inout(rDiv, t, di - 0.2, out, { dy: 10 });
        inout(rRes, t, ee + 0.2, out, { dy: 14, s0: 0.95 });
        inout(K, t, a, out, { dy: 12 });
        W1.update(t, out); W2.update(t, out); W3.update(t, out); W4.update(t, out); W5.update(t, out);
        const lp = P(t, nc + 0.6, 0.35, Ease.outBack);
        css(lock, { opacity: P(t, nc + 0.1, 0.25) * (1 - P(t, out, 0.3)), transform: `scale(${lerp(0.6, 1, lp).toFixed(4)})` });
        lock.classList.toggle('shut', t > nc + 0.6);
      },
    });
  }

  // ===================================================================== G5-11 calendario: recordatorio mensual, 2 días antes, pago congelado [CAPTURA]
  {
    const a = c('Después abre el calendario').s, cr = c('crea un recordatorio').s, rp = c('que se repita cada mes').s, cm = c('cada mes', rp).s,
      dd = c('dos días antes de tu fecha límite').s, fl = c('fecha límite', dd).s, pc = c('con tu pago congelado').s, ti = c('título', pc).s, end = c('Y un paso extra').s;
    const TITLE = 'PAGAR $1,460';
    let ph, fT, ty, fR, fW, wk, dayL, dayP, gap, K, W1, LI, ej;
    Scene({
      id: 'g5_cal', start: a - 0.2, end: end - 0.25,
      build(root) {
        const L = layer(root);
        ph = phone(L, V(1360, 300), V(150, 262), V(440, 480), V(770, 600));
        const s = ph.screen;
        s.append(h('div', { class: 'g5-nt-top' }, h('span', { class: 'kicker' }, 'CALENDARIO'), h('span', { class: 'kicker acc-k' }, 'GUARDAR')), h('div', { class: 'g5-nt-h' }, 'Nuevo recordatorio'));
        fT = h('div', { class: 'g5-fld' }, h('span', { class: 'kicker' }, 'TÍTULO'), h('div', { class: 'g5-fld-v' }, ty = h('b', { class: 'num' }, ''), h('i', { class: 'caret' })));
        ej = tagEj(); fT.append(ej);
        fR = h('div', { class: 'g5-fld' }, h('span', { class: 'kicker' }, 'REPETIR'), h('div', { class: 'g5-fld-v' }, 'Cada mes'));
        fW = h('div', { class: 'g5-fld' }, h('span', { class: 'kicker' }, 'CUÁNDO'), h('div', { class: 'g5-fld-v' }, '2 días antes de la fecha límite'));
        wk = h('div', { class: 'g5-week' });
        for (let i = 0; i < 7; i++) { const d = h('i'); wk.append(d); if (i === 3) dayP = d; if (i === 5) dayL = d; }
        dayP.append(h('span', {}, 'PAGAR')); dayL.append(h('span', {}, 'LÍMITE'));
        gap = h('div', { class: 'g5-gap' }, h('span', {}, MINUS + '2 DÍAS')); wk.append(gap);
        s.append(fT, fR, fW, wk);
        K = Box(L, M, V(176, 890), 'kicker acc-k'); K.textContent = 'EN TU CALENDARIO';
        W1 = Words(Box(L, M, V(214, 930), 'col', { width: V(980, 820) + 'px' }), 'Crea un *recordatorio:*', 'g5-h').sync('crea un recordatorio');
        LI = List(L, M, V(360, 1470), V(900, 820), ['Que se repita cada mes', 'Dos días antes de tu fecha límite', 'Con tu pago congelado en el título']);
        sfx(cr, 'tick', 0.4); sfx(cm, 'click', 0.4); sfx(fl, 'click', 0.4); for (let i = 0; i < 4; i++) sfx(pc + 0.3 + i * 0.28, 'type', 0.25);
      },
      update(t) {
        const out = end - 0.45;
        inout(ph.wrap, t, a - 0.2, out, { dy: 120, din: 0.8, oy: 40 });
        inout(fT, t, cr, out, { dy: 10 });
        inout(fR, t, cm - 0.1, out, { dy: 10 });
        inout(fW, t, dd, out, { dy: 10 });
        inout(wk, t, dd + 0.2, out, { dy: 10 });
        dayL.classList.toggle('on', t > fl);
        dayP.classList.toggle('on', t > fl + 0.4);
        css(gap, { opacity: P(t, fl + 0.5, 0.3), transform: `scaleX(${P(t, fl + 0.5, 0.4, Ease.move).toFixed(4)})` });
        const n = Math.round(clamp((t - (pc + 0.3)) / 1.3) * TITLE.length);
        text(ty, TITLE.slice(0, n));
        css(ej, { opacity: P(t, ti, 0.3) });
        fT.classList.toggle('on', t > pc && t < out);
        inout(K, t, a + 0.3, out, { dy: 12 });
        W1.update(t, out);
        LI.update(t, [rp, dd, pc], out);
      },
    });
  }

  // ===================================================================== G5-12 paso extra: reporte de crédito gratis cada 12 meses · revisa que todo sea tuyo [CAPTURA]
  {
    const a = c('Y un paso extra').s, ll = c('la ley te da derecho').s, cd = c('cada doce meses').s, lp = c('Lo pides en la página oficial').s,
      bc = c('Buró de Crédito', lp).s, ci = c('Círculo de Crédito', lp).s, rv = c('Revisa que todo sea tuyo').s, to = c('todo sea tuyo', rv).s, end = c('Con esto terminas Sistema dos').s;
    const tTap = bc + 0.4, tSw = rv - 0.4;
    let ph, scA, scB, btn, tap, chks = [], rws = [], K, W1, W2, K2, LI, W5;
    Scene({
      id: 'g5_reporte', start: a - 0.2, end: end - 0.25,
      build(root) {
        const L = layer(root);
        ph = phone(L, V(1360, 300), V(150, 262), V(440, 480), V(770, 600));
        const s = ph.screen;
        scA = h('div', { class: 'g5-scr' },
          h('div', { class: 'g5-url' }, h('i'), h('span', {}, 'Sitio oficial')),
          h('div', { class: 'g5-nt-h' }, 'Reporte de Crédito Especial'),
          h('div', { class: 'g5-web-p' }, 'Gratis cada 12 meses'),
          h('div', { class: 'g5-web-l' }), h('div', { class: 'g5-web-l s' }), h('div', { class: 'g5-web-l' }),
          btn = h('div', { class: 'g5-btn' }, 'Solicitar mi reporte'));
        scB = h('div', { class: 'g5-scr' }, h('div', { class: 'g5-nt-top' }, h('span', { class: 'kicker' }, 'TU REPORTE'), h('span', { class: 'kicker acc-k' }, '¿TODO ES TUYO?')), h('div', { class: 'g5-nt-h' }, 'Tus créditos'));
        ['Tarjeta de crédito', 'Préstamo', 'Plan de celular'].forEach(n => { const r = h('div', { class: 'g5-rv' }, h('span', {}, n)); const ck = Check(r, V(36, 40)); scB.append(r); rws.push(r); chks.push(ck); });
        tap = h('i', { class: 'tapdot' });
        s.append(scA, scB, tap);
        K = Box(L, M, V(176, 890), 'kicker acc-k'); K.textContent = 'PASO EXTRA';
        W1 = Words(Box(L, M, V(214, 930), 'col', { width: V(980, 820) + 'px' }), 'La ley te da derecho a un *reporte de crédito gratis*', 'g5-h').sync('la ley te da derecho a un reporte de crédito gratis');
        W2 = Words(Box(L, M, V(380, 1080), 'col', { width: V(980, 820) + 'px' }), 'cada *12 meses.*', 'd2').sync('cada doce meses');
        K2 = Box(L, M, V(560, 1470), 'kicker'); K2.textContent = 'LO PIDES EN LA PÁGINA OFICIAL DE';
        LI = List(L, M, V(600, 1510), V(800, 820), ['Buró de Crédito', 'Círculo de Crédito']);
        W5 = Words(Box(L, M, V(810, 1700), 'col', { width: V(980, 820) + 'px' }), 'Revisa que *todo sea tuyo.*', 'd3 d3-xl').sync('Revisa que todo sea tuyo');
        sfx(a, 'tick', 0.5); sfx(cd + 0.2, 'pop', 0.5); sfx(tTap, 'click', 0.6); chks.forEach((_, i) => sfx(to + i * 0.3 + 0.2, 'check', 0.4));
      },
      update(t) {
        const out = end - 0.45;
        inout(ph.wrap, t, a - 0.1, out, { dy: 120, din: 0.8, oy: 40 });
        const sw = P(t, tSw, 0.45, Ease.move);
        css(scA, { transform: `translateX(${(-sw * 30).toFixed(2)}%)`, opacity: 1 - sw });
        css(scB, { transform: `translateX(${((1 - sw) * 100).toFixed(2)}%)`, opacity: Math.min(1, sw * 2) });
        btn.classList.toggle('press', t > tTap && t < tTap + 0.25);
        if (t >= tTap - 0.05 && t < tTap + 0.45) { const p = P(t, tTap - 0.05, 0.5, Ease.outCubic); css(tap, { opacity: 1 - p, transform: tr(V(210, 230), V(470, 470), 0.6 + p * 1.2) }); } else css(tap, { opacity: 0 });
        rws.forEach((r, i) => { inout(r, t, tSw + 0.3 + i * 0.12, out, { dy: 10, din: 0.35 }); chks[i].update(t, to + i * 0.3); });
        inout(K, t, a, out, { dy: 12 });
        W1.update(t, out); W2.update(t, out);
        inout(K2, t, lp - 0.1, out, { dy: 10 });
        LI.update(t, [bc - 0.1, ci - 0.1], out);
        W5.update(t, out);
      },
    });
  }

  // ===================================================================== G5-13 terminaste Sistema 2 (recap)
  {
    const a = c('Con esto terminas Sistema dos').s, tt = c('Tienes tu tercera columna').s, sb = c('sabes en qué nivel estás').s, ru = c('tienes una ruta con números').s, end = c('Pero llegar al cero').s;
    let W0, bar, fill, items = [], checks = [];
    Scene({
      id: 'g5_recap', start: a - 0.2, end: end - 0.25,
      build(root) {
        const L = layer(root);
        W0 = Words(Box(L, M, V(196, 300), 'col', { width: CW + 'px' }), 'Terminaste *Sistema 2.*', 'd2').sync('Con esto terminas Sistema dos');
        bar = Box(L, M, V(380, 540), 'lvlbar', { width: CW + 'px' });
        bar.append(h('span', { class: 'kicker' }, 'NIVEL 2'), h('div', { class: 'lvlbar-track' }, fill = h('i')), h('span', { class: 'kicker acc' }, 'COMPLETADO'));
        const list = Box(L, M, V(500, 660), 'recap', { width: CW + 'px' });
        ['Tienes tu tercera columna', 'Sabes en qué nivel estás', 'Tienes una ruta con números para subir'].forEach(s => { const r = h('div', { class: 'goal-row' }); const ck = Check(r, 52); r.append(h('span', { class: 'goal-t' }, s)); list.append(r); items.push(r); checks.push(ck); });
        sfx(a + 0.4, 'riser', 0.4); [tt, sb, ru].forEach(x => sfx(x + 0.6, 'check', 0.6));
      },
      update(t) {
        const out = end - 0.45;
        W0.update(t, out);
        inout(bar, t, a + 0.3, out, { dy: 20 });
        css(fill, { transform: `scaleX(${P(t, a + 0.6, 6.2, Ease.inOutCubic).toFixed(4)})` });
        items.forEach((r, i) => { const ti = [tt, sb, ru][i]; inout(r, t, ti, out, { dy: 20 }); checks[i].update(t, ti + 0.4); });
      },
    });
  }

  // ===================================================================== G5-14 llegar al cero no basta · un imprevisto te regresa [GRÁFICA]
  {
    const a = c('Pero llegar al cero').s, ce = c('cero', a).s, nb = c('no basta', a).s, hq = c('hay que quedarse ahí').s, sm = c('Si mañana llega un gasto').s,
      ga = c('un gasto que no esperabas', sm).s, te = c('termina en la tarjeta').s, tj = c('tarjeta', te).s, vb = c('y vuelves a bajar').s, ba = c('bajar', vb).s, end = c('En Sistema tres vamos').s;
    const RU = 54;
    const row = t => kf(t, [[a, 10], [ce + 0.3, 0, Ease.inOutCubic], [ba - 0.35, 0], [ba + 0.25, 3, Ease.inCubic]]);
    let W1, W2, W3, W4, sc, rungs = [], band, bandT, zl, ch1, arr, ch2;
    Scene({
      id: 'g5_quedarse', start: a - 0.2, end: end - 0.25,
      build(root) {
        const L = layer(root);
        W1 = Words(Box(L, M, V(214, 290), 'col', { width: V(820, 820) + 'px' }), 'Llegar al cero *no basta.*', 'd2').sync('llegar al cero no basta', a);
        W2 = Words(Box(L, M, V(470, 480), 'col', { width: V(820, 820) + 'px' }), 'Hay que *quedarse ahí.*', 'd3 d3-xl').sync('hay que quedarse ahí');
        W3 = Words(Box(L, M, V(214, 290), 'col', { width: V(820, 820) + 'px' }), 'Si mañana llega *un gasto que no esperabas…*', 'g5-h').sync('Si mañana llega un gasto que no esperabas');
        W4 = Words(Box(L, M, V(470, 1470), 'col', { width: V(820, 820) + 'px' }), '…termina en la tarjeta *y vuelves a bajar.*', 'd3 d3-xl').sync('termina en la tarjeta y vuelves a bajar');
        const cr = Box(L, M, V(700, 1640), 'g5-flow');
        ch1 = h('div', { class: 'chip' }, 'Gasto que no esperabas'); arr = h('i', { class: 'g5-farr' }); ch2 = h('div', { class: 'chip g5-chip-c' }, 'Tarjeta');
        cr.append(ch1, arr, ch2);
        sc = Box(L, V(1250, 120), V(200, 600), 'g5-scale', { width: V(560, 820) + 'px', height: (11 * RU) + 'px' });
        band = h('div', { class: 'g5-band' }, bandT = h('span', {}, 'TÚ')); sc.append(band);
        for (let n = 0; n <= 10; n++) {
          const r = h('div', { class: 'g5-rung' + (n === 0 ? ' zero' : ''), style: { top: (n * RU) + 'px' } }, h('b', {}, n === 0 ? '0' : MINUS + n), n === 0 ? (zl = h('span', {}, 'NO DEBER NADA')) : null);
          sc.append(r); rungs.push(r);
        }
        sfx(a, 'riser', 0.4); sfx(ce + 0.3, 'check', 0.5); sfx(hq + 0.3, 'tick', 0.4); sfx(ga, 'pop', 0.45); sfx(tj, 'whoosh', 0.35); sfx(ba + 0.1, 'thud', 0.8);
      },
      update(t) {
        const out = end - 0.45, mid = sm - 0.35;
        W1.update(t, mid); W2.update(t, mid);
        W3.update(t, out); W4.update(t, out);
        inout(ch1, t, ga, out, { dy: 16, s0: 0.92 });
        css(arr, { opacity: P(t, tj - 0.3, 0.2) * (1 - P(t, out, 0.3)), transform: `scaleX(${P(t, tj - 0.3, 0.4, Ease.move).toFixed(4)})` });
        inout(ch2, t, tj - 0.1, out, { dy: 16, s0: 0.92 });
        inout(sc, t, a - 0.2, out, { dy: 0, dx: V(40, 0) });
        const r = row(t), n = Math.round(r);
        css(band, { top: r * RU, opacity: P(t, a, 0.3) * (1 - P(t, out, 0.3)) });
        band.classList.toggle('zero', n === 0);
        band.classList.toggle('down', t > ba - 0.3);
        text(bandT, n === 0 ? 'TÚ · QUÉDATE AQUÍ' : 'TÚ');
        zl.style.visibility = (n === 0 && t > a) ? 'hidden' : 'visible';
        rungs.forEach((rg, i) => { css(rg, { opacity: P(t, a - 0.1 + i * 0.04, 0.3) }); rg.classList.toggle('cur', i === n); });
        rungs[0].classList.toggle('hold', t > hq && t < ba - 0.3);
      },
    });
  }

  // ===================================================================== G5-15 Sistema 3: el ahorro que no se puede tocar
  {
    const a = c('En Sistema tres vamos').s, tr3 = c('tres', a).s, ah = c('el ahorro que no se puede tocar').s, end = c('No tienes un problema de dinero').s;
    let K, card, W1, ladder, rungs = [];
    Scene({
      id: 'g5_s3', start: a - 0.2, end: end - 0.25,
      build(root) {
        const L = layer(root);
        K = Box(L, M, V(176, 290), 'kicker'); K.textContent = 'LO QUE SIGUE';
        card = Box(L, M, V(220, 330), 'next-card');
        card.append(h('div', { class: 'lvl-n num' }, '3'), h('div', {}, h('div', { class: 'kicker acc-k' }, 'SISTEMA 3'), h('div', { class: 'next-t' }, 'Ahorro')));
        W1 = Words(Box(L, M, V(500, 570), 'col', { width: V(860, 820) + 'px' }), 'El ahorro que *no se puede tocar.*', 'd2').sync('el ahorro que no se puede tocar');
        ladder = Box(L, V(1260, 120), V(220, 930), 'ladder g5-ladder');
        [['3', 'Ahorro'], ['2', 'Deuda'], ['1', 'A dónde se va tu dinero']].forEach(([nn, lab]) => { const r = h('div', { class: 'rung' }, h('span', { class: 'num' }, nn), h('span', {}, lab), h('span', { class: 'g5-rk kicker' }, nn === '3' ? 'SIGUIENTE' : 'HECHO')); ladder.append(r); rungs.push(r); });
        sfx(tr3, 'tick', 0.6); sfx(ah + 0.4, 'pop', 0.4);
      },
      update(t) {
        const out = end - 0.4;
        inout(K, t, a, out, { dy: 12 });
        inout(card, t, a + 0.1, out, { dy: 30, s0: 0.95 });
        card.classList.toggle('unlock', t > tr3);
        W1.update(t, out);
        inout(ladder, t, a + 0.2, out, { dy: 30 });
        rungs.forEach((r, i) => { inout(r, t, a + 0.3 + (2 - i) * 0.15, out, { dy: 16 }); r.classList.toggle('on', i > 0 || t > tr3); r.classList.toggle('goal', i === 0); });
      },
    });
  }

  // ===================================================================== G5-16 frase ancla + nos vemos en Sistema 3 [CARA]
  {
    const a = c('No tienes un problema de dinero').s, di = c('dinero', a).s, ti = c('Tienes un problema de sistema').s, si = c('sistema', ti).s, nv = c('Nos vemos en Sistema tres').s;
    let W0, st, W1, dbl, W2;
    Scene({
      id: 'g5_ancla', start: a - 0.2, end: nv + 1.6, post: 0.3,
      build(root) {
        const L = layer(root);
        W0 = Words(Box(L, M, V(190, 300), 'col', { width: CW + 'px' }), 'No tienes un problema de dinero.', 'serif-line').sync('No tienes un problema de dinero');
        st = Strike(W0.ws[5], 'strike');
        const b1 = Box(L, M, V(340, 560), 'col', { width: CW + 'px' });
        W1 = Words(b1, 'Tienes un problema *de sistema.*', 'd1 g5-anchor').sync('Tienes un problema de sistema');
        dbl = h('div', { class: 'dbl' }); b1.append(dbl);
        W2 = Words(Box(L, M, V(790, 1060), 'col', { width: CW + 'px' }), 'Nos vemos en *Sistema 3.*', 'd3 muted').sync('Nos vemos en Sistema tres');
        sfx(di + 0.3, 'strike', 0.5); sfx(si, 'thud', 1.0); sfx(nv, 'pop', 0.5);
      },
      update(t) {
        const out = nv + 1.5;
        W0.update(t, out); st.update(t, di + 0.35);
        W1.update(t, out);
        css(dbl, { position: 'relative', marginTop: '18px', transform: `scaleX(${P(t, si + 0.25, 0.6, Ease.move).toFixed(4)})`, opacity: 1 - P(t, out, 0.3, Ease.exit) });
        W2.update(t, out);
      },
    });
  }

  // ===================================================================== G5-17 pantalla final (end screen de YouTube)
  {
    const a = c('Nos vemos en Sistema tres').s;
    const t0 = a + 1.6, END = T.duration + 10;
    let mark, sub, slots;
    Scene({
      id: 'g5_end', start: t0, end: END, pre: 0.4,
      build(root) {
        const L = layer(root, 'endcard');
        mark = Box(L, M, V(700, 1500), 'wm-box end-wm', {}); mark.append(h('div', { class: 'wordmark' }, 'SISTEMA'), h('div', { class: 'dbl thin' }));
        sub = Box(L, M, V(196, 300), 'col', { width: V(660, 820) + 'px' });
        sub.append(h('div', { class: 'kicker acc-k big-k' }, 'SIGUIENTE · NIVEL 3'), h('div', { class: 'g5-endt' }, 'El ahorro que no se puede tocar.'), h('div', { class: 'd3 muted g5-endn' }, 'Nos vemos en Sistema 3.'));
        // zonas reservadas para los elementos de la pantalla final (se agregan en YouTube Studio)
        slots = Box(L, V(1000, 120), V(560, 900), 'end-slots');
        slots.append(h('div', { class: 'end-slot video' }, h('span', { class: 'kicker' }, 'VIDEO SIGUIENTE')), h('div', { class: 'end-slot sub' }, h('span', { class: 'kicker' }, 'SUSCRÍBETE')));
      },
      update(t) {
        inout(mark, t, t0, 1e9, { dy: 20 });
        inout(sub, t, t0 + 0.2, 1e9, { dy: 20 });
        inout(slots, t, t0 + 0.4, 1e9, { dy: 20 });
      },
    });
    S.END = END;
  }
})();
