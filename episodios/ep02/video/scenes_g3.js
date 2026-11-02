/* Grupo 3 · bloques 07–09 · SISTEMA 2 "Deuda"
   07 La liberación · 08 Dejar de pagar intereses · 09 Paso uno: deja de bajar */
(() => {
  'use strict';
  const { h, css, attr, text, tr, P, env, kf, Ease, clamp, lerp, cue, Scene, sfx, ctx } = S;
  const { Words: Words0, inout, Counter, money, nf0, drawPath, Strike, Check, Phone, Row, DotGrid, Chip, Box } = C;
  // *varias palabras* -> *cada* *palabra* (Words solo acentúa palabra por palabra)
  const Words = (parent, str, cls, extra) => Words0(parent, str.replace(/\*([^*]+)\*/g, (m, g) => g.split(/\s+/).map(w => { const k = w.match(/^(.*?)([.,:;?!…]*)$/); return '*' + k[1] + '*' + k[2]; }).join(' ')), cls, extra);
  const V = (a, b) => (ctx.vertical ? b : a);
  const M = V(288, 120);          // columna de contenido (libro mayor)
  const CW = V(1524, 820);        // ancho útil hasta la regla derecha
  const A0 = 194;                 // todo lo de este grupo vive después de aquí
  const c = (p, a = A0) => cue(p, a);
  const layer = (root, cls = '') => { const el = h('div', { class: 'layer ' + cls }); root.append(el); return el; };
  // tiempos por palabra a partir de varias frases exactas de la narración (una palabra en pantalla por palabra dicha)
  const seq = (W, parts) => { const ts = []; parts.forEach(([ph, af]) => { const k = cue(ph, af ?? A0); const n = ph.trim().split(/\s+/).length; for (let j = 0; j < n; j++) ts.push(k.i >= 0 && S.T.words[k.i + j] ? S.T.words[k.i + j].s - 0.06 : k.s + j * 0.08); }); while (ts.length < W.ws.length) ts.push(ts[ts.length - 1]); W.times = ts.slice(0, W.ws.length); return W; };
  const fade = (el, t, t0, t1, d = 0.3) => css(el, { opacity: P(t, t0, d) * (1 - P(t, t1, d, Ease.exit)) });

  // ruta de 5 pasos (línea con nodos)
  function Route(L, x, y, w) {
    const el = Box(L, x, y, 'g3-route', { width: w + 'px' });
    const line = h('div', { class: 'g3-route-line' }); el.append(line);
    const nodes = [];
    for (let i = 0; i < 5; i++) {
      const n = h('div', { class: 'g3-node', style: { left: (i * 25) + '%' } }, h('b', { class: 'num-d' }, String(i + 1)), h('span', {}, 'PASO'));
      el.append(n); nodes.push(n);
    }
    return {
      el, nodes,
      update(t, t0, tout, hi = -1, thi = 1e9) {
        css(el, { opacity: 1 - P(t, tout, 0.3, Ease.exit) });
        css(line, { transform: `scaleX(${P(t, t0, 0.9, Ease.move).toFixed(4)})` });
        nodes.forEach((n, i) => { const p = P(t, t0 + 0.12 + i * 0.13, 0.4, Ease.outBack); css(n, { opacity: P(t, t0 + 0.12 + i * 0.13, 0.2), transform: `translate(-50%,0) scale(${lerp(0.6, 1, p).toFixed(4)})` }); n.classList.toggle('on', i === hi && t > thi); });
      },
    };
  }

  // teléfono estilizado (sin marcas reales)
  function phone(L, x, y, w, hgt) {
    const wrap = Box(L, x, y, 'g3-phwrap');
    const ph = Phone(wrap, { w, hgt });
    return { wrap, el: ph.el, screen: ph.screen };
  }

  // ===================================================================== G3-01 no te enojes · el mínimo no está fallando [CARA]
  {
    const a = c('Y cuando veas tu número').s, ne = c('no te enojes con tu banco').s, ba = c('con tu banco ni contigo').s,
      pm = c('El pago mínimo no está fallando').s, fa = c('fallando', pm).s, end = c('Funciona exactamente como lo diseñaron').s;
    let W0, W1, W2, W3;
    Scene({
      id: 'g3_enojes', start: a - 0.2, end: end - 0.25,
      build(root) {
        const L = layer(root);
        W0 = Words(Box(L, M, V(176, 290), 'col', { width: CW + 'px' }), 'Y cuando veas tu número…', 'serif-line').sync('Y cuando veas tu número');
        W1 = Words(Box(L, M, V(330, 470), 'col', { width: CW + 'px' }), 'No te *enojes.*', 'd1 hero').sync('no te enojes');
        W2 = Words(Box(L, M, V(600, 800), 'col', { width: CW + 'px' }), 'Con tu banco, *ni contigo.*', 'd3 d3-xl').sync('con tu banco ni contigo');
        W3 = Words(Box(L, M, V(300, 360), 'col', { width: V(1400, 820) + 'px' }), 'El pago mínimo *no está fallando.*', 'd1').sync('El pago mínimo no está fallando');
        sfx(ne + 0.3, 'thud', 0.6); sfx(fa, 'tick', 0.5);
      },
      update(t) {
        const mid = pm - 0.35, out = end - 0.4;
        W0.update(t, mid); W1.update(t, mid); W2.update(t, mid);
        W3.update(t, out);
      },
    });
  }

  // ===================================================================== G3-02 funciona como lo diseñaron [GRÁFICA]
  {
    const a = c('Funciona exactamente como lo diseñaron').s, mt = c('mantiene tu tarjeta al corriente').s, co = c('al corriente', mt).s,
      lq = c('Lo que nunca prometió').s, sd = c('sacarte de la deuda').s, de = c('deuda', sd).s, end = c('Esa parte te toca a ti').s;
    let K, W0, card, r1, r2, ck, st, x1, l1, l2;
    Scene({
      id: 'g3_disenado', start: a - 0.2, end: end - 0.25,
      build(root) {
        const L = layer(root);
        K = Box(L, M, V(176, 290), 'kicker acc-k big-k'); K.textContent = 'EL PAGO MÍNIMO';
        W0 = Words(Box(L, M, V(218, 334), 'col', { width: CW + 'px' }), 'Funciona *exactamente como lo diseñaron.*', 'g3-h').sync('Funciona exactamente como lo diseñaron');
        card = Box(L, M, V(430, 640), 'g3-card g3-promise', { width: CW + 'px' });
        r1 = h('div', { class: 'g3-pr' }); ck = Check(r1, V(64, 56));
        r1.append(h('div', { class: 'g3-pr-t' }, 'Mantiene tu tarjeta ', h('b', { class: 'acc' }, 'al corriente')), l1 = h('div', { class: 'g3-pr-k kicker' }, 'LO HACE'));
        r2 = h('div', { class: 'g3-pr' }); x1 = h('div', { class: 'g3-x' }); r2.append(x1);
        const t2 = h('div', { class: 'g3-pr-t' }, h('span', { class: 'g3-strk' }, 'Te saca de la deuda')); r2.append(t2, l2 = h('div', { class: 'g3-pr-k kicker acc-k' }, 'NUNCA LO PROMETIÓ'));
        st = Strike(t2.firstChild, 'strike');
        card.append(r1, r2);
        sfx(co + 0.2, 'check', 0.6); sfx(de + 0.1, 'strike', 0.6);
      },
      update(t) {
        const out = end - 0.4;
        inout(K, t, a, out, { dy: 12 });
        W0.update(t, out);
        inout(card, t, mt - 0.3, out, { dy: 40 });
        inout(r1, t, mt - 0.1, out, { dy: 16, din: 0.45 });
        ck.update(t, co + 0.1);
        inout(l1, t, co + 0.4, out, { dy: 8 });
        inout(r2, t, lq, out, { dy: 16, din: 0.45 });
        st.update(t, de);
        const xp = P(t, de + 0.2, 0.35, Ease.outBack);
        css(x1, { opacity: P(t, de + 0.2, 0.15), transform: `scale(${lerp(0.4, 1, xp).toFixed(4)})` });
        inout(l2, t, de + 0.35, out, { dy: 8 });
      },
    });
  }

  // ===================================================================== G3-03 esa parte te toca a ti · nadie te explicó las reglas [CARA]
  {
    const a = c('Esa parte te toca a ti').s, hh = c('y hasta hoy').s, nd = c('nadie te había explicado las reglas').s, end = c('No es falta de disciplina').s;
    let W0, K, W1;
    Scene({
      id: 'g3_reglas', start: a - 0.2, end: end - 0.25,
      build(root) {
        const L = layer(root);
        W0 = Words(Box(L, M, V(230, 330), 'col', { width: CW + 'px' }), 'Esa parte *te toca a ti.*', 'd1 hero').sync('Esa parte te toca a ti');
        K = Box(L, M, V(700, 1470), 'kicker acc-k big-k'); K.textContent = 'HASTA HOY';
        W1 = Words(Box(L, M, V(744, 1514), 'col', { width: V(1300, 820) + 'px' }), 'Nadie te había explicado *las reglas.*', 'd3 d3-xl').sync('nadie te había explicado las reglas');
        sfx(hh, 'tick', 0.5);
      },
      update(t) {
        const out = end - 0.4;
        W0.update(t, out);
        inout(K, t, hh, out, { dy: 12 });
        W1.update(t, out);
      },
    });
  }

  // ===================================================================== G3-04 frase ancla: no es falta de disciplina, es falta de sistema · y esta es la ruta
  {
    const a = c('No es falta de disciplina').s, dis = c('disciplina', a).s, fs = c('Es falta de sistema', a).s, sis = c('sistema', fs).s,
      ru = c('Y esta es la ruta', a).s, rt = c('ruta', ru).s, end = c('Busca en tu estado de cuenta el pago').s;
    let T1, st2, T2, dbl, W3, R, placed = false;
    Scene({
      id: 'g3_ancla', start: a - 0.2, end: end - 0.25,
      build(root) {
        const L = layer(root);
        T1 = Words(Box(L, M, V(200, 400), 'col', { width: CW + 'px' }), 'No es falta de disciplina.', 'serif-line').sync('No es falta de disciplina');
        st2 = Strike(T1.ws[4], 'strike');
        T2 = Words(Box(L, M, V(360, 640), 'col', { width: CW + 'px' }), 'Es falta de *sistema.*', 'd1 hero').sync('Es falta de sistema');
        dbl = h('div', { class: 'dbl' }); T2.el.parentNode.append(dbl);
        W3 = Words(Box(L, M, V(260, 420), 'col', { width: CW + 'px' }), 'Y esta es *la ruta.*', 'd1').sync('Y esta es la ruta');
        R = Route(L, M + V(40, 40), V(620, 820), CW - V(80, 80));
        sfx(dis + 0.4, 'strike', 0.6); sfx(sis + 0.2, 'thud', 1.0); sfx(ru + 0.2, 'whoosh', 0.4);
      },
      update(t) {
        if (!placed) { const m = T2.ws[3].parentNode; if (m.offsetWidth > 0) { css(dbl, { left: m.offsetLeft + 6, right: 'auto', top: m.offsetTop + m.offsetHeight - 6, width: m.offsetWidth - 40 }); placed = true; } }
        const mid = ru - 0.3, out = end - 0.4;
        T1.update(t, mid); st2.update(t, dis + 0.45);
        T2.update(t, mid);
        css(dbl, { transform: `scaleX(${P(t, sis + 0.05, 0.45, Ease.move).toFixed(4)})`, opacity: 1 - P(t, mid, 0.32, Ease.exit) });
        W3.update(t, out);
        R.update(t, ru + 0.3, out);
      },
    });
  }

  // ===================================================================== G3-05 el pago para no generar intereses [CAPTURA]
  {
    const a = c('Busca en tu estado de cuenta el pago').s, pn = c('el pago para no generar intereses', a).s, sp = c('Si pagas esa cantidad', a).s,
      fl = c('antes de la fecha límite', a).s, nc = c('ese mes no te cobran intereses', a).s, ni = c('intereses', nc + 0.5).s, end = c('Esa cantidad ya trae', a).s;
    let K, W0, W1, W2, ph, rows = {}, brP, brF, ok;
    Scene({
      id: 'g3_pni', start: a - 0.2, end: end - 0.25,
      build(root) {
        const L = layer(root);
        K = Box(L, M, V(176, 270), 'kicker'); K.textContent = 'EN TU ESTADO DE CUENTA';
        W0 = Words(Box(L, M, V(216, 312), 'col', { width: V(940, 820) + 'px' }), 'Busca el *pago para no generar intereses.*', 'g3-h'); seq(W0, [['Busca', a], ['el pago para no generar intereses', a]]);
        W1 = Words(Box(L, M, V(540, 1470), 'col', { width: V(940, 820) + 'px' }), 'Si pagas esa cantidad *antes de la fecha límite…*', 'd3').sync('Si pagas esa cantidad antes de la fecha límite');
        W2 = Words(Box(L, M, V(690, 1590), 'col', { width: V(940, 820) + 'px' }), 'ese mes *no te cobran intereses.*', 'd3 d3-xl').sync('ese mes no te cobran intereses');
        ph = phone(L, V(1340, 230), V(150, 470), V(440, 620), V(770, 770));
        const s = ph.screen;
        s.append(h('div', { class: 'app-head' }, h('span', { class: 'app-logo' }), h('span', {}, 'Mi tarjeta')));
        s.append(h('div', { class: 'g3-st-k' }, 'ESTADO DE CUENTA · ÚLTIMO CORTE'));
        const mk = (id, k, v) => { const r = h('div', { class: 'g3-st-row' }, h('span', {}, k), h('b', { class: 'num' }, v)); s.append(r); rows[id] = r; return r; };
        mk('saldo', 'Saldo al corte', '$ • • • • •');
        mk('min', 'Pago mínimo', '$ • • • •');
        mk('pni', 'Pago para no generar intereses', '$ • • • • •');
        mk('fecha', 'Fecha límite de pago', '• • / • •');
        brP = h('div', { class: 'bracket' }); rows.pni.append(brP);
        brF = h('div', { class: 'bracket' }); rows.fecha.append(brF);
        ok = h('div', { class: 'g3-st-ok' }, h('span', { class: 'kicker' }, 'ESE MES'), h('b', {}, 'Sin intereses'));
        s.append(ok);
        sfx(a + 0.1, 'whoosh', 0.4); sfx(pn + 0.5, 'click', 0.6); sfx(fl + 0.4, 'tick', 0.5); sfx(ni, 'check', 0.6);
      },
      update(t) {
        const out = end - 0.4;
        inout(K, t, a, out, { dy: 12 });
        W0.update(t, out); W1.update(t, out); W2.update(t, out);
        inout(ph.wrap, t, a + 0.05, out, { dy: 120, din: 0.8, oy: 40 });
        Object.values(rows).forEach((r, i) => inout(r, t, a + 0.5 + i * 0.1, out, { dy: 10, din: 0.35 }));
        const bp = P(t, pn + 0.4, 0.45);
        css(brP, { opacity: bp * (1 - P(t, fl + 0.2, 0.3)) , transform: `scale(${lerp(1.12, 1, bp).toFixed(3)})` });
        rows.pni.classList.toggle('on', t > pn + 0.4);
        const fp = P(t, fl + 0.3, 0.45);
        css(brF, { opacity: fp, transform: `scale(${lerp(1.12, 1, fp).toFixed(3)})` });
        rows.fecha.classList.toggle('on', t > fl + 0.3);
        inout(ok, t, ni - 0.1, out, { dy: 20, s0: 0.92 });
      },
    });
  }

  // ===================================================================== G3-06 ya trae tus MSI · el mínimo no [GRÁFICA]
  {
    const a = c('Esa cantidad ya trae').s, cn = c('tus compras normales', a).s, ms = c('las mensualidades de tus meses sin intereses', a).s,
      pm = c('El pago mínimo por sí solo', a).s, no = c('no esas mensualidades se pagan aparte', a).s, ap = c('se pagan aparte', a).s, end = c('Si cubres el mínimo y nada más').s;
    let K, W0, kA, segN, segM, kB, barB, segMin, ghost, W1, xmark;
    Scene({
      id: 'g3_msi', start: a - 0.2, end: end - 0.25,
      build(root) {
        const L = layer(root);
        K = Box(L, M, V(176, 270), 'kicker'); K.textContent = 'MESES SIN INTERESES (MSI)';
        W0 = Words(Box(L, M, V(216, 312), 'col', { width: CW + 'px' }), 'Esa cantidad ya trae *tus meses sin intereses.*', 'g3-h'); seq(W0, [['Esa cantidad ya trae', a], ['tus meses sin intereses', a]]);
        kA = Box(L, M, V(370, 520), 'kicker'); kA.textContent = 'PAGO PARA NO GENERAR INTERESES';
        const barA = Box(L, M, V(408, 560), 'g3-bar', { width: CW + 'px', height: V(118, 140) + 'px' });
        segN = h('div', { class: 'g3-seg n', style: { width: '62%' } }, h('span', {}, 'Compras normales'));
        segM = h('div', { class: 'g3-seg m', style: { width: '38%' } }, h('span', {}, 'Mensualidades MSI'));
        barA.append(segN, segM);
        kB = Box(L, M, V(580, 760), 'kicker'); kB.innerHTML = 'PAGO MÍNIMO, <span class="acc">POR SÍ SOLO</span>';
        barB = Box(L, M, V(618, 800), 'g3-bar', { width: CW + 'px', height: V(118, 140) + 'px' });
        segMin = h('div', { class: 'g3-seg i', style: { width: '30%' } }, h('span', {}, 'Pago mínimo'));
        ghost = h('div', { class: 'g3-seg g', style: { left: '62%', width: '38%' } }, h('span', {}, 'MSI · se pagan aparte'));
        xmark = h('div', { class: 'g3-x sm' });
        ghost.append(xmark);
        barB.append(segMin, ghost);
        W1 = Words(Box(L, M, V(790, 990), 'col', { width: CW + 'px' }), 'El mínimo *no incluye tus MSI.*', 'g3-h').sync('El pago mínimo por sí solo no', a);
        sfx(cn + 0.1, 'blip', 0.4); sfx(ms + 0.3, 'blip', 0.5); sfx(no + 0.1, 'thud', 0.6); sfx(ap + 0.1, 'tick', 0.5);
      },
      update(t) {
        const out = end - 0.4;
        inout(K, t, a, out, { dy: 12 });
        W0.update(t, out);
        inout(kA, t, a + 0.3, out, { dy: 10 });
        const pN = P(t, cn, 0.7, Ease.move), pM = P(t, ms + 0.2, 0.7, Ease.move);
        css(segN.parentNode, { opacity: P(t, a + 0.3, 0.3) * (1 - P(t, out, 0.3, Ease.exit)) });
        css(segN, { clipPath: `inset(0 ${((1 - pN) * 100).toFixed(2)}% 0 0)` });
        css(segM, { clipPath: `inset(0 ${((1 - pM) * 100).toFixed(2)}% 0 0)` });
        inout(kB, t, pm - 0.1, out, { dy: 10 });
        css(barB, { opacity: P(t, pm - 0.1, 0.3) * (1 - P(t, out, 0.3, Ease.exit)) });
        const pMin = P(t, pm + 0.2, 0.6, Ease.move);
        css(segMin, { clipPath: `inset(0 ${((1 - pMin) * 100).toFixed(2)}% 0 0)` });
        inout(ghost, t, ap - 0.1, out, { dy: 0, dx: -30 });
        const xp = P(t, no + 0.05, 0.35, Ease.outBack);
        css(xmark, { opacity: P(t, no, 0.15), transform: `translate(-50%,-50%) scale(${lerp(0.4, 1, xp).toFixed(4)})` });
        W1.update(t, out);
      },
    });
  }

  // ===================================================================== G3-07 CONDUSEF: la mensualidad se pasa a tu saldo y cobra intereses [GRÁFICA]
  {
    const a = c('Si cubres el mínimo y nada más').s, cd = c('CONDUSEF advierte', a).s, em = c('esa mensualidad', a).s, sa = c('se pasa a tu saldo', a).s,
      ec = c('empieza a cobrar intereses', a).s, it = c('intereses', ec).s, end = c('Esa es tu meta de cada mes').s;
    let K, W0, boxes = [], arrows = [];
    Scene({
      id: 'g3_condusef', start: a - 0.2, end: end - 0.25,
      build(root) {
        const L = layer(root);
        K = Box(L, M, V(176, 270), 'kicker acc-k big-k'); K.textContent = 'CONDUSEF ADVIERTE';
        W0 = Words(Box(L, M, V(218, 314), 'col', { width: CW + 'px' }), 'Si cubres el mínimo *y nada más…*', 'g3-h').sync('Si cubres el mínimo y nada más');
        const flow = Box(L, M, V(430, 530), 'g3-flow', { width: CW + 'px' });
        [['01', 'La mensualidad de tus MSI', ''], ['02', 'Se pasa a tu saldo', ''], ['03', 'Empieza a cobrar intereses', 'hot']].forEach(([n, s, k], i) => {
          if (i) { const ar = h('div', { class: 'g3-arr' }); flow.append(ar); arrows.push(ar); }
          const b = h('div', { class: 'g3-fb ' + k }, h('span', { class: 'kicker' }, n), h('b', {}, s)); flow.append(b); boxes.push(b);
        });
        sfx(cd, 'tick', 0.5); sfx(em + 0.1, 'blip', 0.4); sfx(sa + 0.3, 'blip', 0.4); sfx(it, 'thud', 0.8);
      },
      update(t) {
        const out = end - 0.4;
        inout(K, t, cd - 0.1, out, { dy: 12 });
        W0.update(t, out);
        const tb = [em - 0.1, sa + 0.1, ec + 0.1];
        boxes.forEach((b, i) => inout(b, t, tb[i], out, V({ dx: -30, dy: 0, s0: 0.96 }, { dy: -24, s0: 0.96 })));
        arrows.forEach((ar, i) => { const p = P(t, tb[i + 1] - 0.25, 0.35, Ease.move); css(ar, { transform: V(`scaleX(${p.toFixed(4)})`, `scaleY(${p.toFixed(4)})`), opacity: 1 - P(t, out, 0.3, Ease.exit) }); });
        boxes[2].classList.toggle('on', t > it);
      },
    });
  }

  // ===================================================================== G3-08 esa es tu meta · si no llegas, sigue la ruta
  {
    const a = c('Esa es tu meta de cada mes').s, me = c('meta', a).s, sn = c('Si todavía no llegas', a).s, sr = c('sigue la ruta', a).s, end = c('Paso uno deja de bajar').s;
    let K, W0, W1, R, dbl, placed = false;
    Scene({
      id: 'g3_meta', start: a - 0.2, end: end - 0.25,
      build(root) {
        const L = layer(root);
        K = Box(L, M, V(176, 290), 'kicker acc-k big-k'); K.textContent = 'PAGO PARA NO GENERAR INTERESES';
        W0 = Words(Box(L, M, V(222, 334), 'col', { width: CW + 'px' }), 'Esa es tu *meta* de cada mes.', 'd1').sync('Esa es tu meta de cada mes');
        dbl = h('div', { class: 'dbl thin' }); W0.el.parentNode.append(dbl);
        W1 = Words(Box(L, M, V(600, 1470), 'col', { width: CW + 'px' }), 'Si todavía no llegas, *sigue la ruta.*', V('d3 d3-xl', 'd3')).sync('Si todavía no llegas sigue la ruta');
        R = Route(L, M + 40, V(730, 980), CW - 80);
        sfx(me + 0.2, 'pop', 0.6); sfx(sr + 0.3, 'whoosh', 0.4);
      },
      update(t) {
        if (!placed) { const m = W0.ws[3].parentNode; if (m.offsetWidth > 0) { css(dbl, { left: m.offsetLeft + 4, right: 'auto', top: m.offsetTop + m.offsetHeight - 4, width: m.offsetWidth - 20 }); placed = true; } }
        const out = end - 0.4;
        inout(K, t, a, out, { dy: 12 });
        W0.update(t, out);
        css(dbl, { transform: `scaleX(${P(t, me + 0.3, 0.45, Ease.move).toFixed(4)})`, opacity: 1 - P(t, out, 0.3, Ease.exit) });
        W1.update(t, out);
        R.update(t, sr - 0.1, out, 0, sr + 0.9);
      },
    });
  }

  // ===================================================================== G3-09..12 PASO 1: deja de bajar
  function StepHead(L, n, title, t0, tout) {
    const big = Box(L, M, V(150, 262), 'step-n num-d'); big.textContent = n;
    const k = Box(L, V(M + 190, 300), V(176, 290), 'kicker acc-k'); k.textContent = 'PASO ' + n + ' DE 5';
    const W = Words(Box(L, V(M + 190, 300), V(214, 330), 'col', { width: V(1000, 640) + 'px' }), title, 'd2 g3-step-t');
    return { big, k, W, update(t, tout2 = tout) { inout(big, t, t0, tout2, { dy: 50, s0: 0.9 }); inout(k, t, t0 + 0.1, tout2, { dy: 14 }); W.update(t, tout2); } };
  }
  // G3-09 quítala de apps, tiendas y cartera [CAPTURA]
  {
    const a = c('Paso uno deja de bajar').s, db = c('deja de bajar', a).s, si = c('Si una tarjeta tiene deuda', a).s, qu = c('quítala de las aplicaciones', a).s,
      ap = c('aplicaciones', qu).s, ti = c('tiendas en línea', a).s, gu = c('donde está guardada', a).s, ca = c('y de la cartera de tu celular', a).s,
      cr = c('cartera', ca).s, end = c('En Sistema uno borraste').s;
    let H, W1, crumbs = [], ph, scrA, scrB, rowCard, btnDel, toast, wCard, wEmpty, btnQ, tap;
    const tTapA = gu + 0.35, tTapB = cr + 0.25;
    Scene({
      id: 'g3_paso1', start: a - 0.2, end: end - 0.25,
      build(root) {
        const L = layer(root);
        H = StepHead(L, '1', 'Deja de *bajar.*', a, end - 0.4); H.W.sync('deja de bajar', a);
        W1 = Words(Box(L, M, V(420, 1470), 'col', { width: V(940, 820) + 'px' }), 'Si una tarjeta tiene deuda, *quítala de:*', 'd3').sync('Si una tarjeta tiene deuda quítala', a);
        const cl = Box(L, M, V(520, 1560), 'crumbs g3-crumbs', { width: V(820, 820) + 'px' });
        [['1', 'Las aplicaciones'], ['2', 'Las tiendas en línea'], ['3', 'La cartera de tu celular']].forEach(([n, s]) => { const el = h('div', { class: 'crumb' }, h('span', { class: 'num' }, n), h('span', { class: 'g3-cr-t' }, s)); cl.append(el); crumbs.push(el); });
        ph = phone(L, V(1340, 300), V(150, 470), V(440, 480), V(770, 760));
        const s = ph.screen;
        scrA = h('div', { class: 'g3-scr' },
          h('div', { class: 'app-head' }, h('span', { class: 'app-logo g3-logo-b' }), h('span', {}, 'Tu tienda en línea')),
          h('div', { class: 'g3-ph-t' }, 'Métodos de pago'),
          rowCard = h('div', { class: 'g3-pay' }, h('i', { class: 'g3-mc' }), h('div', {}, h('b', {}, 'Tarjeta de crédito'), h('span', { class: 'num' }, '•••• ••••')), btnDel = h('span', { class: 'g3-del' }, 'Eliminar')),
          h('div', { class: 'g3-pay add' }, h('span', {}, '+ Agregar método de pago')),
          toast = h('div', { class: 'g3-toast' }, 'Tarjeta eliminada'));
        scrB = h('div', { class: 'g3-scr' },
          h('div', { class: 'app-head' }, h('span', { class: 'app-logo g3-logo-b' }), h('span', {}, 'Cartera')),
          h('div', { class: 'g3-ph-t' }, 'Tus tarjetas'),
          h('div', { class: 'g3-wal' }, wEmpty = h('div', { class: 'g3-wcard empty' }, 'Sin tarjetas guardadas'), wCard = h('div', { class: 'g3-wcard' }, h('span', { class: 'kicker' }, 'CRÉDITO'), h('b', { class: 'num' }, '•••• ••••'))),
          btnQ = h('div', { class: 'g3-quit' }, 'Quitar tarjeta'));
        tap = h('i', { class: 'tapdot' });
        s.append(scrA, scrB, tap);
        sfx(a, 'tick', 0.6); sfx(tTapA, 'click', 0.6); sfx(tTapB, 'click', 0.6);
      },
      update(t) {
        const out = end - 0.4;
        H.update(t);
        W1.update(t, out);
        const tc = [ap - 0.1, ti, ca + 0.3];
        fade(crumbs[0].parentNode, t, tc[0], out);
        crumbs.forEach((el, i) => { inout(el, t, tc[i], out, { dx: -20, dy: 0 }); el.classList.toggle('on', t > tc[i] + 0.2); });
        inout(ph.wrap, t, si - 0.2, out, { dy: 140, din: 0.8, oy: 40 });
        // pantalla A: tienda → eliminar la tarjeta guardada
        const sw = P(t, ca + 0.1, 0.45, Ease.move);
        css(scrA, { transform: `translateX(${(-sw * 30).toFixed(2)}%)`, opacity: 1 - sw });
        css(scrB, { transform: `translateX(${((1 - sw) * 100).toFixed(2)}%)`, opacity: Math.min(1, sw * 2) });
        btnDel.classList.toggle('press', t > tTapA && t < tTapA + 0.2);
        const g = P(t, tTapA + 0.15, 0.4, Ease.inCubic);
        css(rowCard, { opacity: 1 - g, transform: `translateX(${(-g * 40).toFixed(1)}px)` });
        inout(toast, t, tTapA + 0.4, ca, { dy: 20 });
        // pantalla B: cartera → quitar
        btnQ.classList.toggle('press', t > tTapB && t < tTapB + 0.2);
        const g2 = P(t, tTapB + 0.1, 0.35, Ease.inCubic);
        css(wCard, { opacity: 1 - g2, transform: tr(0, g2 * 90, 1 - g2 * 0.1) });
        css(wEmpty, { opacity: g2 });
        // toques
        const ctr = el => { let x = el.offsetWidth / 2, y = el.offsetHeight / 2; while (el && el !== ph.screen) { x += el.offsetLeft; y += el.offsetTop; el = el.offsetParent; } return [x, y]; };
        const pA = ctr(btnDel), pB = ctr(btnQ);
        const taps = [[tTapA, pA[0], pA[1]], [tTapB, pB[0], pB[1]]];
        let tp = null; for (const tt of taps) if (t >= tt[0] - 0.15 && t < tt[0] + 0.45) tp = tt;
        if (tp) { const p = P(t, tp[0], 0.45, Ease.outCubic); css(tap, { opacity: t < tp[0] ? 0.8 : 1 - p, transform: tr(tp[1], tp[2], 0.6 + p * 1.2) }); } else css(tap, { opacity: 0 });
      },
    });
  }

  // G3-10 en Sistema 1 borraste las apps de impulso; hoy borras la tarjeta de las que quedaron
  {
    const a = c('En Sistema uno borraste').s, im = c('las apps de impulso', a).s, hb = c('hoy borras la tarjeta', a).s, qd = c('de las que quedaron', a).s, end = c('Para las compras chicas').s;
    let K1, W0, K2, W1, home, icons = [], cards = [];
    const N = 12, imp = i => i % 3 === 1;
    Scene({
      id: 'g3_impulso', start: a - 0.2, end: end - 0.25,
      build(root) {
        const L = layer(root);
        K1 = Box(L, M, V(176, 270), 'kicker'); K1.textContent = 'EN SISTEMA 1';
        W0 = Words(Box(L, M, V(216, 310), 'col', { width: V(860, 820) + 'px' }), 'Borraste las apps *de impulso.*', 'g3-h').sync('borraste las apps de impulso', a);
        K2 = Box(L, M, V(480, 1470), 'kicker acc-k big-k'); K2.textContent = 'HOY';
        W1 = Words(Box(L, M, V(522, 1512), 'col', { width: V(860, 820) + 'px' }), 'Borras la tarjeta *de las que quedaron.*', 'g3-h').sync('hoy borras la tarjeta de las que quedaron', a);
        home = Box(L, V(1240, 190), V(170, 470), 'home g3-home', { width: V(540, 700) + 'px' });
        for (let i = 0; i < N; i++) {
          const ic = h('div', { class: 'app-ic' + (imp(i) ? ' impulse' : '') }, h('i'));
          if (!imp(i)) { const cc = h('span', { class: 'g3-cc' }); ic.append(cc); cards.push(cc); }
          home.append(ic); icons.push(ic);
        }
        sfx(im + 0.3, 'pop', 0.4); cards.forEach((_, i) => i % 2 === 0 && sfx(qd - 0.3 + i * 0.09, 'blip', 0.3));
      },
      update(t) {
        const out = end - 0.4;
        inout(K1, t, a - 0.15, out, { dy: 12 }); W0.update(t, out);
        inout(K2, t, hb - 0.1, out, { dy: 12 }); W1.update(t, out);
        inout(home, t, a - 0.15, out, { dy: 40 });
        let k = 0;
        icons.forEach((ic, i) => {
          if (imp(i)) {
            const gone = P(t, im + 0.3 + Math.floor(i / 3) * 0.12, 0.35, Ease.inCubic);
            css(ic, { transform: tr(0, 0, 1 - gone * 0.85), opacity: 1 - gone * 0.92 });
          } else {
            const cc = cards[k], tk = qd - 0.3 + k * 0.09; k++;
            css(cc, { opacity: P(t, hb - 0.2, 0.3) * (1 - P(t, tk, 0.25, Ease.inCubic)), transform: `scale(${(1 - P(t, tk, 0.25, Ease.inCubic) * 0.6).toFixed(3)})` });
          }
        });
      },
    });
  }

  // G3-11 compras chicas: efectivo
  {
    const a = c('Para las compras chicas del día a día').s, ef = c('usa efectivo', a).s, ce = c('como ya empezaste a hacer', a).s, end = c('No vas a subir de nivel').s;
    let W0, W1, sw, card, cash, W2;
    Scene({
      id: 'g3_efectivo', start: a - 0.2, end: end - 0.25,
      build(root) {
        const L = layer(root);
        W0 = Words(Box(L, M, V(176, 290), 'col', { width: CW + 'px' }), 'Compras chicas *del día a día:*', 'g3-h').sync('Para las compras chicas del día a día', a);
        W1 = Words(Box(L, M, V(290, 400), 'col', { width: CW + 'px' }), 'usa *efectivo.*', 'd1 hero').sync('usa efectivo', a);
        sw = Box(L, M, V(580, 720), 'g3-swap');
        card = h('div', { class: 'g3-sw-i' }, h('i', { class: 'g3-mc big' }), h('span', { class: 'kicker' }, 'TARJETA'));
        cash = h('div', { class: 'g3-sw-i' }, h('div', { class: 'bills g3-bills' }, h('i'), h('i'), h('i')), h('span', { class: 'kicker' }, 'EFECTIVO'));
        sw.append(card, h('div', { class: 'swap-arrow g3-sw-ar' }), cash);
        W2 = Words(Box(L, V(1310, M), V(620, 1470), 'col', { width: V(500, 820) + 'px' }), 'como *ya empezaste a hacer.*', 'd3').sync('como ya empezaste a hacer', a);
        sfx(ef, 'whoosh', 0.4);
      },
      update(t) {
        const out = end - 0.4;
        W0.update(t, out); W1.update(t, out); W2.update(t, out);
        inout(sw, t, a + 0.4, out, { dy: 30 });
        const sp = P(t, ef + 0.1, 0.7, Ease.move);
        css(card, { opacity: lerp(1, 0.3, sp), transform: tr(0, 0, lerp(1, 0.9, sp)) });
        css(cash, { opacity: lerp(0.3, 1, sp), transform: tr(0, 0, lerp(0.9, 1.05, sp)) });
      },
    });
  }

  // G3-12 no vas a subir de nivel mientras la deuda siga creciendo [GRÁFICA]
  {
    const a = c('No vas a subir de nivel').s, mi = c('mientras la deuda siga creciendo', a).s, cr = c('creciendo', mi).s, end = c('Paso dos congela tu pago').s;
    let W0, W1, lv, gr, path, dot, lab;
    Scene({
      id: 'g3_nivel', start: a - 0.2, end: end - 0.25,
      build(root) {
        const L = layer(root);
        W0 = Words(Box(L, M, V(176, 290), 'col', { width: CW + 'px' }), 'No vas a subir de nivel…', 'd2').sync('No vas a subir de nivel', a);
        W1 = Words(Box(L, M, V(330, 500), 'col', { width: CW + 'px' }), 'mientras la deuda *siga creciendo.*', 'd3 d3-xl').sync('mientras la deuda siga creciendo', a);
        lv = Box(L, M, V(520, 700), 'lvl locked g3-lvl');
        lv.append(h('div', { class: 'lvl-n' }, '−10'), h('div', { class: 'lvl-k' }, 'TU NIVEL'), h('div', { class: 'lock' }));
        const GW = V(1080, 820), GH = V(360, 340);
        gr = Box(L, V(M + 444, M), V(470, 880), 'g3-graph', { width: GW + 'px', height: GH + 'px' });
        const svg = h('svg', { viewBox: `0 0 ${GW} ${GH}`, width: GW, height: GH });
        svg.append(h('line', { x1: 0, y1: GH - 2, x2: GW, y2: GH - 2, class: 'g3-ax' }));
        const pts = []; for (let i = 0; i <= 24; i++) { const x = i / 24; pts.push([x * (GW - 40), (GH - 20) - (0.12 + 0.78 * Math.pow(x, 1.6)) * (GH - 60)]); }
        path = h('path', { d: 'M' + pts.map(p => p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' L'), class: 'g3-up' });
        svg.append(path);
        dot = h('circle', { cx: pts[24][0], cy: pts[24][1], r: 12, class: 'g3-dot' }); svg.append(dot);
        gr.append(svg);
        lab = h('div', { class: 'kicker acc-k g3-glab' }, 'TU DEUDA'); gr.append(lab);
        sfx(a + 0.2, 'thud', 0.5); sfx(cr, 'riser', 0.35);
      },
      update(t) {
        const out = end - 0.4;
        W0.update(t, out); W1.update(t, out);
        inout(lv, t, a + 0.4, out, { dy: 30, s0: 0.95 });
        css(gr, { opacity: P(t, mi - 0.2, 0.3) * (1 - P(t, out, 0.3, Ease.exit)) });
        drawPath(path, t, mi, cr + 0.6 - mi, Ease.inOutCubic);
        css(dot, { opacity: P(t, cr + 0.5, 0.2) });
        inout(lab, t, mi + 0.3, out, { dy: 10 });
      },
    });
  }
})();
