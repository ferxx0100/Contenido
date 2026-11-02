/* Grupo 2 · bloques 04–06 · SISTEMA 2 "Deuda"
   04 Cómo se calcula tu mínimo · 05 El ejemplo de los veinte mil · 06 El mapa del mínimo */
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
  const tag = (parent, label = 'EJEMPLO', cls = '') => { const el = h('span', { class: 'g2-tag ' + cls }, label); parent.append(el); return el; };
  const fade = (el, t, t0, t1, d = 0.3) => css(el, { opacity: P(t, t0, d) * (1 - P(t, t1, d, Ease.exit)) });

  // pantalla de estado de cuenta estilizada (sin marcas reales)
  function stmtPhone(L, x, y, w, hgt, rows) {
    const wrap = Box(L, x, y, 'g2-phwrap');
    const ph = Phone(wrap, { w, hgt });
    const s = ph.screen;
    s.append(h('div', { class: 'app-head' }, h('span', { class: 'app-logo' }), h('span', {}, 'Mi tarjeta')));
    s.append(h('div', { class: 'g2-st-k' }, 'ESTADO DE CUENTA · ÚLTIMO CORTE'));
    const out = {};
    rows.forEach(([k, v, id]) => {
      const r = h('div', { class: 'g2-st-row' }, h('span', {}, k), h('b', { class: 'num' }, v));
      if (id) { const br = h('div', { class: 'bracket' }); r.append(br); out[id] = { row: r, br }; }
      s.append(r);
    });
    return { wrap, ph, screen: s, rows: out };
  }

  // ===================================================================== G2-01 mira tu pago mínimo [CAPTURA]
  {
    const a = c('Mira tu pago mínimo').s, pm = c('pago mínimo', a).s, nz = c('No es una cifra al azar').s, bx = c('Sale de una regla de Banxico').s,
      end = c('Tu pago mínimo es lo que salga').s;
    let K, W1, W2, W3, st;
    Scene({
      id: 'g2_minimo', start: a - 0.2, end: end - 0.25,
      build(root) {
        const L = layer(root);
        K = Box(L, M, V(176, 262), 'kicker acc-k'); K.textContent = 'TU ESTADO DE CUENTA';
        W1 = Words(Box(L, M, V(226, 306), 'col', { width: V(860, 820) + 'px' }), 'Mira tu *pago mínimo.*', 'd2').sync('Mira tu pago mínimo');
        W2 = Words(Box(L, M, V(560, 1470), 'col', { width: V(860, 820) + 'px' }), 'No es una cifra al azar.', 'd3 d3-xl').sync('No es una cifra al azar');
        W3 = Words(Box(L, M, V(646, 1550), 'col', { width: V(860, 820) + 'px' }), 'Sale de una regla de *Banxico.*', 'd3 d3-xl').sync('Sale de una regla de Banxico');
        st = stmtPhone(L, V(1300, 230), V(160, 530), V(440, 620), V(760, 660), [
          ['Saldo al corte', '$ • • • • •'],
          ['Pago para no generar intereses', '$ • • • •'],
          ['Pago mínimo', '$ • • • •', 'pm'],
          ['Fecha límite de pago', '• • / • •'],
        ]);
        sfx(a + 0.1, 'whoosh', 0.45); sfx(pm + 0.3, 'tick', 0.6); sfx(bx + 0.1, 'pop', 0.45);
      },
      update(t) {
        const out = end - 0.4;
        inout(K, t, a, out, { dy: 12 });
        W1.update(t, out); W2.update(t, out); W3.update(t, out);
        inout(st.wrap, t, a + 0.05, out, { dy: 120, din: 0.8, oy: 40 });
        const b = st.rows.pm, bp = P(t, pm + 0.25, 0.45);
        css(b.br, { opacity: bp, transform: `scale(${lerp(1.12, 1, bp).toFixed(3)})` });
        b.row.classList.toggle('on', t > pm + 0.25);
      },
    });
  }

  // ===================================================================== G2-02 la regla: gana la más alta de dos cuentas
  {
    const a = c('Tu pago mínimo es lo que salga').s, la1 = c('La primera', a).s, p15 = c('el uno punto cinco', a).s, deb = c('de lo que debes', p15).s,
      int = c('los intereses del mes', p15).s, iva = c('y su IVA', p15).s, la2 = c('La segunda', a).s, p125 = c('el uno punto veinticinco', a).s,
      lim = c('de tu límite de crédito', p125).s, end = c('Eso es el piso').s;
    let K, W1, cA, cB, aPct, aDeb, aInt, aIva, bPct, bLim, bLim2, vs;
    Scene({
      id: 'g2_regla', start: a - 0.2, end: end - 0.25,
      build(root) {
        const L = layer(root);
        K = Box(L, M, V(176, 262), 'kicker'); K.innerHTML = '<span class="acc">REGLA DE BANXICO</span> · GANA LA MÁS ALTA';
        W1 = Words(Box(L, M, V(222, 306), 'col', { width: CW + 'px' }), 'Tu pago mínimo es lo que salga *más alto* entre dos cuentas.', 'g2-h').sync('Tu pago mínimo es lo que salga más alto entre dos cuentas');
        const cw = V(722, 820), ch = V(380, 360), ch2 = V(380, 250);
        cA = Box(L, M, V(430, 560), 'g2-card', { width: cw + 'px', height: ch + 'px' });
        cA.append(h('div', { class: 'kicker' }, 'CUENTA A'));
        const la = h('div', { class: 'g2-line g2-first' }, aPct = h('span', { class: 'g2-pct num-d' }, '1.5%'), aDeb = h('span', {}, 'de lo que debes'));
        aInt = h('div', { class: 'g2-line' }, h('span', { class: 'g2-plus' }, '+'), h('span', {}, 'intereses del mes'));
        aIva = h('div', { class: 'g2-line' }, h('span', { class: 'g2-plus' }, '+'), h('span', {}, 'su IVA'));
        cA.append(la, aInt, aIva);
        cB = Box(L, V(M + cw + 80, M), V(430, 1000), 'g2-card', { width: cw + 'px', height: ch2 + 'px' });
        cB.append(h('div', { class: 'kicker' }, 'CUENTA B'));
        cB.append(h('div', { class: 'g2-line g2-first' }, bPct = h('span', { class: 'g2-pct num-d' }, '1.25%'), bLim = h('span', {}, 'de tu límite')));
        cB.append(bLim2 = h('div', { class: 'g2-line g2-sub' }, 'de crédito'));
        vs = Box(L, V(M + cw + 4, 0), V(600, 0), 'g2-vs'); vs.textContent = 'o';
        if (ctx.vertical) css(vs, { display: 'none' });
        sfx(la1, 'pop', 0.5); sfx(p15 + 0.2, 'tick', 0.5); sfx(int, 'tick', 0.4); sfx(iva, 'tick', 0.4); sfx(la2, 'pop', 0.5); sfx(p125 + 0.2, 'tick', 0.5);
      },
      update(t) {
        const out = end - 0.4;
        inout(K, t, a, out, { dy: 12 });
        W1.update(t, out);
        inout(cA, t, la1, out, { dy: 40, s0: 0.97 });
        inout(aPct, t, p15, out, { dy: 24 });
        inout(aDeb, t, deb - 0.05, out, { dy: 18 });
        inout(aInt, t, int, out, { dy: 18 });
        inout(aIva, t, iva, out, { dy: 18 });
        inout(cB, t, la2, out, { dy: 40, s0: 0.97 });
        inout(vs, t, la2 + 0.1, out, { dy: 0, s0: 0.6 });
        inout(bPct, t, p125, out, { dy: 24 });
        inout(bLim, t, lim - 0.05, out, { dy: 18 });
        inout(bLim2, t, lim + 0.2, out, { dy: 18 });
      },
    });
  }

  // ===================================================================== G2-03 eso es el piso: más sí, menos nunca
  {
    const a = c('Eso es el piso').s, pi = c('piso', a).s, mas = c('puede pedirte más', a).s, nun = c('pero nunca menos', a).s, me = c('menos', nun + 0.2).s,
      end = c('Esta regla existe para que').s;
    let W1, floor, flab, up, upT, dn, dnT, stk, ups, dns;
    Scene({
      id: 'g2_piso', start: a - 0.2, end: end - 0.25,
      build(root) {
        const L = layer(root);
        W1 = Words(Box(L, M, V(190, 300), 'col', { width: CW + 'px' }), 'Eso es *el piso.*', 'd1 hero').sync('Eso es el piso');
        const fy = V(640, 900);
        floor = Box(L, M, fy, 'g2-floor', { width: CW + 'px' });
        flab = Box(L, M, fy + 22, 'kicker'); flab.textContent = 'TU PAGO MÍNIMO';
        up = Box(L, M, V(470, 700), 'g2-dir', { width: CW + 'px' });
        up.append(ups = h('span', { class: 'g2-arrow up' }), upT = h('span', {}, 'Tu banco puede pedirte ', h('b', {}, 'más.')));
        dn = Box(L, M, V(740, 1010), 'g2-dir', { width: CW + 'px' });
        dn.append(dns = h('span', { class: 'g2-arrow dn' }), dnT = h('span', { class: 'g2-dn' }, 'Nunca ', h('b', { class: 'g2-menos' }, 'menos.')));
        stk = Strike(dnT.querySelector('.g2-menos'), 'strike');
        sfx(pi, 'thud', 0.7); sfx(mas + 0.4, 'tick', 0.45); sfx(me + 0.1, 'strike', 0.45);
      },
      update(t) {
        const out = end - 0.4;
        W1.update(t, out);
        const fp = P(t, pi - 0.1, 0.7, Ease.move);
        css(floor, { transform: `scaleX(${fp.toFixed(4)})`, opacity: 1 - P(t, out, 0.3, Ease.exit) });
        inout(flab, t, pi + 0.3, out, { dy: 10 });
        inout(up, t, mas, out, { dy: 30 });
        inout(dn, t, nun, out, { dy: -30 });
        stk.update(t, me + 0.1);
      },
    });
  }

  // ===================================================================== G2-04 una parte de tu pago baja la deuda: ¿qué tan grande?
  {
    const a = c('Esta regla existe para que').s, pa = c('una parte de tu pago', a).s, bd = c('baje la deuda', a).s, q = c('La pregunta es qué tan grande', a).s,
      ep = c('esa parte', q).s, end = c('Vamos con un ejemplo').s;
    let W1, W2, bar, seg, segL, payL, qm;
    Scene({
      id: 'g2_parte', start: a - 0.2, end: end - 0.25,
      build(root) {
        const L = layer(root);
        W1 = Words(Box(L, M, V(196, 280), 'col', { width: V(1400, 820) + 'px' }), 'Esta regla existe para que al menos *una parte* de tu pago baje la deuda.', 'g2-h').sync('Esta regla existe para que al menos una parte de tu pago baje la deuda');
        payL = Box(L, M, V(470, 640), 'kicker'); payL.textContent = 'TU PAGO';
        bar = Box(L, M, V(510, 690), 'g2-bar', { width: CW + 'px', height: V(150, 180) + 'px' });
        seg = h('i', { class: 'g2-bar-part' }); bar.append(seg);
        segL = Box(L, M, V(684, 894), 'g2-seglab', { width: CW + 'px' });
        segL.append(h('span', { class: 'kicker acc-k' }, 'BAJA LA DEUDA'));
        qm = h('span', { class: 'g2-qm' }, '?'); seg.append(qm);
        W2 = Words(Box(L, M, V(760, 990), 'col', { width: CW + 'px' }), '¿Qué tan grande *es esa parte?*', 'd2').sync('La pregunta es qué tan grande es esa parte');
        sfx(pa + 0.2, 'pop', 0.4); sfx(q, 'tick', 0.5);
      },
      update(t) {
        const out = end - 0.4;
        W1.update(t, out);
        inout(payL, t, a + 0.4, out, { dy: 10 });
        inout(bar, t, a + 0.4, out, { dy: 30 });
        // la parte que baja la deuda: aparece en "una parte" y "duda" de tamaño mientras se pregunta
        const sp = P(t, pa, 0.6, Ease.move);
        const wob = P(t, q, 0.4) * Math.sin((t - q) * 2.6) * 10 * (1 - P(t, ep + 0.6, 0.6));
        const w = (30 + wob) * sp;
        css(seg, { width: w.toFixed(2) + '%' });
        css(qm, { opacity: P(t, q, 0.35) });
        css(segL, { opacity: P(t, bd, 0.35) * (1 - P(t, out, 0.3, Ease.exit)), paddingLeft: ((100 - w) / 100 * CW).toFixed(1) + 'px' });
        W2.update(t, out);
      },
    });
  }

  // ===================================================================== G2-05 el ejemplo: datos (EJEMPLO)
  {
    const a = c('Vamos con un ejemplo').s, db = c('Debes veinte mil pesos', a).s, li = c('tu límite es de treinta mil', a).s, ta = c('sesenta por ciento al año', a).s,
      co = c('ya no haces compras nuevas', a).s, al = c('Es una tasa alta', a).s, tu = c('la tuya viene en los documentos', a).s, end = c('Con esos números tu primer').s;
    let K, W1, card, rows = [], note, nK, nW, arrow;
    const DATA = [['DEBES', '$20,000', db], ['TU LÍMITE', '$30,000', li], ['TASA', '60% al año', ta], ['COMPRAS NUEVAS', 'ninguna', co]];
    Scene({
      id: 'g2_datos', start: a - 0.2, end: end - 0.25,
      build(root) {
        const L = layer(root);
        K = Box(L, M, V(176, 262), 'g2-krow'); tag(K); K.append(h('span', { class: 'kicker' }, 'ILUSTRATIVO'));
        W1 = Words(Box(L, M, V(222, 312), 'col', { width: CW + 'px' }), 'Un ejemplo con *números redondos.*', 'g2-h').sync('Vamos con un ejemplo con números redondos');
        card = Box(L, M, V(378, 486), 'g2-ledger card', { width: V(920, 820) + 'px' });
        DATA.forEach(([k, v]) => { const r = h('div', { class: 'g2-lrow' }, h('span', { class: 'kicker' }, k), h('span', { class: 'g2-lv num' }, v)); card.append(r); rows.push(r); });
        note = Box(L, V(1300, M), V(560, 976), 'g2-note', { width: V(512, 820) + 'px' });
        note.append(nK = h('div', { class: 'kicker acc-k' }, 'TASA ALTA · SOLO PARA EL EJEMPLO'));
        nW = Words(note, 'La tuya viene en los *documentos de tu tarjeta.*', 'd3').sync('la tuya viene en los documentos de tu tarjeta');
        arrow = Box(L, V(1230, 820), V(578, 776), 'g2-ptr'); arrow.textContent = '←'; if (ctx.vertical) css(arrow, { display: 'none' });
        DATA.forEach(d => sfx(d[2] + 0.05, 'type', 0.3)); sfx(al + 0.1, 'tick', 0.5);
      },
      update(t) {
        const out = end - 0.4;
        inout(K, t, a, out, { dy: 12 });
        W1.update(t, out);
        css(card, { opacity: P(t, db - 0.4, 0.4) * (1 - P(t, out, 0.3, Ease.exit)) });
        rows.forEach((r, i) => { inout(r, t, DATA[i][2] - 0.05, out, { dy: 20, din: 0.45, oy: 0 }); r.classList.toggle('hot', i === 2 && t > al); });
        inout(nK, t, al, out, { dy: 14 });
        nW.update(t, out);
        inout(arrow, t, al + 0.1, out, V({ dx: 30, dy: 0 }, { dy: 30 }));
      },
    });
  }

  // ===================================================================== G2-06 la barra partida del primer mínimo (EJEMPLO)
  {
    const a = c('Con esos números tu primer').s, n1460 = c('mil cuatrocientos sesenta pesos', a).s, pe = c('Pero de eso', a).s, n1160 = c('mil ciento sesenta', a).s,
      iv = c('se van en intereses e IVA', a).s, so = c('Solo trescientos', a).s, bj = c('bajan lo que debes', a).s, end = c('Pagas mil cuatrocientos sesenta').s;
    const FR = 1160 / 1460;
    let K, W1, big, cnt, bar, red, white, lR, lW, vR, vW, cR, cW2, tot;
    Scene({
      id: 'g2_barra', start: a - 0.2, end: end - 0.25,
      build(root) {
        const L = layer(root);
        K = Box(L, M, V(176, 262), 'g2-krow'); tag(K); K.append(h('span', { class: 'kicker' }, 'DEBES $20,000 · 60% AL AÑO'));
        W1 = Words(Box(L, M, V(226, 312), 'col', { width: CW + 'px' }), 'Tu primer *pago mínimo:*', 'd3 d3-xl').sync('tu primer mínimo sería de unos');
        big = Box(L, M - 8, V(300, 384), 'g2-big num-d'); big.textContent = '$0'; cnt = Counter(big, 0, 1460, v => $(v));
        const bw = CW, bh = V(150, 190), by = V(560, 640);
        bar = Box(L, M, by, 'g2-bar', { width: bw + 'px', height: bh + 'px' });
        red = h('i', { class: 'g2-bar-red' }); white = h('i', { class: 'g2-bar-white' }); bar.append(red, white);
        tot = Box(L, M, by - 40, 'kicker', { width: bw + 'px', textAlign: 'right' }); tot.textContent = 'TU PAGO COMPLETO';
        lR = Box(L, M, by + bh + 22, 'g2-lab', { width: V(1000, 560) + 'px' });
        lR.append(vR = h('div', { class: 'g2-lab-v num-d acc' }, '$0'), h('div', { class: 'g2-lab-k kicker acc-k' }, 'INTERESES + IVA'));
        cR = Counter(vR, 0, 1160, v => $(v));
        lW = Box(L, M + bw - V(500, 300), by + bh + 22, 'g2-lab right', { width: V(500, 300) + 'px' });
        lW.append(vW = h('div', { class: 'g2-lab-v num-d' }, '$300'), h('div', { class: 'g2-lab-k kicker' }, 'BAJA TU DEUDA'));
        sfx(n1460 + 0.1, 'thud', 0.7); sfx(n1160, 'whoosh', 0.5); sfx(so + 0.15, 'pop', 0.6);
      },
      update(t) {
        const out = end - 0.4;
        inout(K, t, a, out, { dy: 12 });
        W1.update(t, out);
        inout(big, t, n1460 - 0.1, out, { dy: 40 });
        cnt.update(t, n1460 - 0.1, 1.3);
        inout(bar, t, n1460 + 0.1, out, { dy: 30 });
        inout(tot, t, n1460 + 0.4, out, { dy: 10 });
        const rp = P(t, n1160 - 0.05, 1.1, Ease.move);
        css(red, { width: (rp * FR * 100).toFixed(3) + '%' });
        const wp = P(t, so, 0.4);
        css(white, { left: (FR * 100).toFixed(3) + '%', opacity: wp });
        bar.classList.toggle('split', t > so);
        inout(lR, t, n1160 - 0.05, out, { dy: 20 });
        cR.update(t, n1160 - 0.05, 1.1);
        css(lR.lastChild, { opacity: P(t, iv + 0.1, 0.35) });
        inout(lW, t, so, out, { dy: 20 });
        css(lW.lastChild, { opacity: P(t, bj - 0.1, 0.35) });
      },
    });
  }

  // ===================================================================== G2-07 pagas $1,460 · tu deuda baja $300 (EJEMPLO)
  {
    const a = c('Pagas mil cuatrocientos sesenta').s, yb = c('y tu deuda baja trescientos', a).s, end = c('Ahora ponlo en el mapa').s;
    const FR = 1160 / 1460;
    let K, W1, W2, mini, red, dbl, under;
    Scene({
      id: 'g2_pagas', start: a - 0.2, end: end - 0.25,
      build(root) {
        const L = layer(root);
        K = Box(L, M, V(176, 262), 'g2-krow'); tag(K); K.append(h('span', { class: 'kicker' }, 'TU PRIMER MES'));
        W1 = Words(Box(L, M, V(212, 320), 'col', { width: CW + 'px' }), 'Pagas $1,460,', 'd2 num-d').sync('Pagas mil cuatrocientos sesenta');
        const b2 = Box(L, M, V(350, 460), 'col', { width: CW + 'px' });
        W2 = Words(b2, 'y tu deuda baja *$300.*', 'd1 hero num-d').sync('y tu deuda baja trescientos');
        dbl = h('div', { class: 'dbl thin' }); b2.append(dbl);
        const my = V(840, 1090);
        mini = Box(L, M, my, 'g2-bar mini', { width: CW + 'px', height: V(50, 70) + 'px' });
        red = h('i', { class: 'g2-bar-red' }); mini.append(red);
        under = Box(L, M, my + V(62, 82), 'g2-minilab', { width: CW + 'px' });
        under.append(h('span', { class: 'acc' }, '$1,160 INTERESES + IVA'), h('span', {}, '$300 A TU DEUDA'));
        css(red, { width: (FR * 100).toFixed(3) + '%' });
        sfx(a + 0.4, 'thud', 0.6); sfx(yb + 1.05, 'thud', 0.8);
      },
      update(t) {
        const out = end - 0.4;
        inout(K, t, a, out, { dy: 12 });
        W1.update(t, out); W2.update(t, out);
        css(dbl, { position: 'relative', marginTop: '18px', width: V(820, 640) + 'px', transform: `scaleX(${P(t, yb + 1.0, 0.5, Ease.move).toFixed(4)})`, opacity: 1 - P(t, out, 0.3, Ease.exit) });
        inout(mini, t, a + 0.5, out, { dy: 20 });
        inout(under, t, a + 0.7, out, { dy: 12 });
      },
    });
  }

  // ===================================================================== G2-08 el mapa: línea de tiempo pagando solo el mínimo (EJEMPLO)
  // Curva calculada con la regla de Banxico: saldo 20,000 · límite 30,000 · 5% mensual + IVA · sin compras nuevas
  const CURVE = (() => {
    let B = 20000; const pts = [[0, -10]];
    for (let m = 1; m < 200 && B > 0.005; m++) {
      const i = B * 0.05, iva = i * 0.16;
      const pay = Math.min(Math.max(0.015 * B + i + iva, 0.0125 * 30000), B + i + iva);
      B = B + i + iva - pay; pts.push([m, -Math.max(0, B) / 2000]);
    }
    return pts;   // 119 meses
  })();
  {
    const a = c('Ahora ponlo en el mapa').s, ce = c('En este ejemplo cada nivel', a).s, dm = c('dos mil pesos', ce).s, pg = c('Pagando solo el mínimo', a).s,
      sb = c('subir de menos diez', a).s, sm = c('siete meses', a).s, l5 = c('Llegar a menos cinco', a).s, c4 = c('casi cuatro años', a).s,
      ch = c('el mínimo se hace más chico', a).s, fi = c('el final se alarga', a).s, ze = c('llegarías a cero', a).s, d10 = c('casi diez años', a).s,
      end = c('y pagarías alrededor').s;
    // geometría (en px del escenario): nivel 0 y −10 sobre renglones impresos
    const X0 = V(300, 206), X1 = V(1776, 924), Y0 = V(377, 593), U = 54;
    const xm = m => X0 + (m / 120) * (X1 - X0), yl = lv => Y0 - lv * U;
    let K, W1, W2, chip, svg, path, head, axis, zl, ylab = [], xlab = [], p1, p2, p3, d1, d2, dot1, dot2, dot3, note;
    Scene({
      id: 'g2_mapa', start: a - 0.2, end: end - 0.25,
      build(root) {
        const L = layer(root);
        K = Box(L, M, V(176, 262), 'g2-krow'); tag(K); K.append(h('span', { class: 'kicker' }, 'SIN COMPRAS NUEVAS · TASA FIJA'));
        W1 = Words(Box(L, M, V(218, 306), 'col', { width: V(1000, 820) + 'px' }), 'Ahora ponlo en *el mapa.*', 'g2-h').sync('Ahora ponlo en el mapa');
        W2 = Words(Box(L, M, V(218, 306), 'col', { width: V(1000, 820) + 'px' }), 'Pagando solo *el mínimo.*', 'g2-h').sync('Pagando solo el mínimo', pg - 0.1);
        chip = Box(L, V(1440, M), V(176, 404), 'g2-chip'); chip.innerHTML = '1 NIVEL = <b>$2,000</b>';
        svg = h('svg', { class: 'g2-svg', width: V(1920, 1080), height: V(1080, 1920), viewBox: `0 0 ${V(1920, 1080)} ${V(1080, 1920)}` });
        L.append(svg);
        for (let lv = 0; lv >= -10; lv--) {
          const yl0 = yl(lv);
          const lab = Box(L, V(108, 120), yl0 - V(30, 30), 'g2-ylab' + (lv === 0 ? ' zero' : ''), { width: V(118, 70) + 'px' });
          lab.textContent = lv === 0 ? '0' : '−' + (-lv);
          ylab.push(lab);
        }
        axis = h('line', { x1: X0, x2: X1, y1: yl(-10), y2: yl(-10), class: 'g2-axis' }); svg.append(axis);
        zl = h('line', { x1: X0, x2: X1, y1: yl(0), y2: yl(0), class: 'g2-zero' }); svg.append(zl);
        [[0, 'HOY'], [24, '2 AÑOS'], [48, '4'], [72, '6'], [96, '8'], [120, '10 AÑOS']].forEach(([m, s]) => {
          const el = Box(L, xm(m) - 80, yl(-10) + 12, 'g2-xlab', { width: '160px' }); el.textContent = s; xlab.push(el);
        });
        d1 = h('line', { x1: xm(7), x2: xm(7), y1: yl(-9), y2: V(554, 800), class: 'g2-drop' });
        d2 = h('line', { x1: xm(46), x2: xm(46), y1: yl(-5), y2: V(504, 690), class: 'g2-drop' });
        path = h('polyline', { class: 'g2-curve', points: '' });
        dot1 = h('circle', { cx: xm(7), cy: yl(-9), r: 9, class: 'g2-dot' });
        dot2 = h('circle', { cx: xm(46), cy: yl(-5), r: 9, class: 'g2-dot' });
        dot3 = h('circle', { cx: xm(119), cy: yl(0), r: 13, class: 'g2-dot red' });
        head = h('circle', { r: 11, class: 'g2-head' });
        svg.append(d1, d2, path, dot1, dot2, dot3, head);
        const mk = (x, y, k, v, cls = '') => { const el = Box(L, x, y, 'g2-ann ' + cls); el.append(h('div', { class: 'kicker' }, k), h('div', { class: 'g2-ann-v' }, v)); return el; };
        p1 = mk(xm(7), V(490, 734), 'DE −10 A −9', '7 meses');
        p2 = mk(xm(46), V(440, 622), 'LLEGAR A −5', 'casi 4 años');
        p3 = Box(L, V(1000, 300), V(296, 470), 'g2-ann zero', { width: V(xm(119) - 1000 - 24, 600) + 'px' });
        p3.append(h('div', { class: 'g2-ann-v' }, h('span', { class: 'g2-ann-k' }, 'LLEGAR A 0 EN'), 'casi 10 años'));
        note = Box(L, V(1240, 520), V(714, 930), 'g2-note2 kicker', { width: V(520, 410) + 'px' });
        note.textContent = 'EL MÍNIMO SE HACE MÁS CHICO · EL FINAL SE ALARGA';
        sfx(a + 0.1, 'whoosh', 0.45); sfx(sm + 0.1, 'tick', 0.6); sfx(c4 + 0.1, 'tick', 0.6); sfx(d10, 'thud', 0.8);
      },
      update(t) {
        const out = end - 0.4;
        inout(K, t, a, out, { dy: 12 });
        W1.update(t, pg - 0.45); W2.update(t, out);
        inout(chip, t, dm - 0.1, out, { dy: 14 });
        const gp = P(t, a + 0.3, 0.6) * (1 - P(t, out, 0.3, Ease.exit));
        css(svg, { opacity: gp });
        ylab.forEach((lb, i) => inout(lb, t, a + 0.3 + (10 - i) * 0.05, out, { dy: 0, dx: -16, din: 0.4 }));
        xlab.forEach((lb, i) => inout(lb, t, ce + i * 0.06, out, { dy: 10, din: 0.4 }));
        drawPath(axis, t, a + 0.3, 0.8);
        drawPath(zl, t, a + 0.5, 0.8);
        // meses recorridos por la línea, amarrados a la voz
        const mt = kf(t, [[sb - 0.1, 0], [sm + 0.35, 7, Ease.move], [l5 - 0.05, 7], [c4 + 0.6, 46, Ease.move], [fi - 0.1, 46], [ze + 0.5, 119, Ease.inOutCubic]]);
        const pts = [];
        for (const [m, lv] of CURVE) { if (m > mt) break; pts.push(xm(m).toFixed(1) + ',' + yl(lv).toFixed(1)); }
        const k = Math.min(CURVE.length - 1, Math.floor(mt)), f = mt - k, nx = CURVE[Math.min(CURVE.length - 1, k + 1)];
        const hl = lerp(CURVE[k][1], nx[1], f);
        pts.push(xm(mt).toFixed(1) + ',' + yl(hl).toFixed(1));
        attr(path, { points: pts.join(' ') });
        attr(head, { cx: xm(mt).toFixed(1), cy: yl(hl).toFixed(1) });
        css(head, { opacity: P(t, sb - 0.2, 0.3) * (1 - P(t, ze + 0.5, 0.3)) });
        css(dot1, { opacity: P(t, sm, 0.3) }); css(dot2, { opacity: P(t, c4, 0.3) });
        const z = P(t, d10 - 0.1, 0.4, Ease.outBack);
        css(dot3, { opacity: P(t, ze + 0.4, 0.2), transform: `scale(${lerp(0.4, 1, z).toFixed(3)})`, transformOrigin: `${xm(119)}px ${yl(0)}px` });
        css(d1, { opacity: P(t, sm, 0.35) * (1 - P(t, out, 0.3, Ease.exit)) }); css(d2, { opacity: P(t, c4, 0.35) * (1 - P(t, out, 0.3, Ease.exit)) });
        inout(p1, t, sm + 0.15, out, { dy: 16 });
        inout(p2, t, c4 + 0.15, out, { dy: 16 });
        inout(p3, t, d10 - 0.1, out, { dy: 16 });
        inout(note, t, ch, out, { dy: 12 });
      },
    });
  }

  // ===================================================================== G2-09 pagarías unos $83,000 por una deuda de $20,000 (EJEMPLO)
  {
    const a = c('y pagarías alrededor').s, n83 = c('ochenta y tres mil pesos', a).s, n20 = c('por una deuda de veinte mil', a).s, end = c('Tu estado de cuenta trae').s;
    let K, W1, k1, b1, v1, c1, k2, b2, v2;
    Scene({
      id: 'g2_total', start: a - 0.2, end: end - 0.25,
      build(root) {
        const L = layer(root);
        K = Box(L, M, V(176, 262), 'g2-krow'); tag(K); K.append(h('span', { class: 'kicker' }, 'SOLO EL MÍNIMO · CASI 10 AÑOS'));
        W1 = Words(Box(L, M, V(222, 306), 'col', { width: CW + 'px' }), 'Y pagarías *alrededor de…*', 'g2-h').sync('y pagarías alrededor de');
        k1 = Box(L, M, V(372, 470), 'kicker acc-k'); k1.textContent = 'LO QUE PAGARÍAS';
        b1 = Box(L, M, V(410, 510), 'g2-tbar red', { width: CW + 'px', height: V(170, 190) + 'px' });
        b1.append(v1 = h('span', { class: 'g2-tbar-v num-d' }, 'unos $0'));
        c1 = Counter(v1, 0, 83000, v => 'unos ' + $(Math.round(v / 1000) * 1000));
        k2 = Box(L, M, V(642, 790), 'kicker'); k2.textContent = 'LO QUE DEBÍAS';
        const w2 = Math.round(CW * 20000 / 83000);
        b2 = Box(L, M, V(680, 830), 'g2-tbar ink', { width: w2 + 'px', height: V(170, 190) + 'px' });
        v2 = Box(L, M + w2 + 28, V(680, 830), 'g2-tbar-out num-d', { height: V(170, 190) + 'px' }); v2.textContent = '$20,000';
        sfx(n83, 'riser', 0.4); sfx(n83 + 1.1, 'thud', 0.8); sfx(n20 + 0.5, 'tick', 0.6);
      },
      update(t) {
        const out = end - 0.4;
        inout(K, t, a, out, { dy: 12 });
        W1.update(t, out);
        inout(k1, t, n83 - 0.1, out, { dy: 10 });
        const p1 = P(t, n83 - 0.1, 1.2, Ease.move);
        css(b1, { opacity: P(t, n83 - 0.1, 0.25) * (1 - P(t, out, 0.3, Ease.exit)), clipPath: `inset(0 ${((1 - p1) * 100).toFixed(2)}% 0 0)` });
        c1.update(t, n83 - 0.1, 1.2);
        inout(k2, t, n20, out, { dy: 10 });
        const p2 = P(t, n20 + 0.3, 0.6, Ease.move);
        css(b2, { opacity: P(t, n20 + 0.3, 0.2) * (1 - P(t, out, 0.3, Ease.exit)), clipPath: `inset(0 ${((1 - p2) * 100).toFixed(2)}% 0 0)` });
        inout(v2, t, n20 + 0.6, out, { dx: -20, dy: 0 });
      },
    });
  }

  // ===================================================================== G2-10 el recuadro de tu estado de cuenta [CAPTURA]: es tuyo
  {
    const a = c('Tu estado de cuenta trae').s, rc = c('un recuadro', a).s, ct = c('cuánto tardarías', a).s, cp = c('cuánto pagarías', a).s,
      en = c('Ese número ya no es del ejemplo', a).s, ej = c('del ejemplo', en).s, ty = c('es tuyo', en).s, end = c('Y cuando veas tu número').s;
    let W1, W2, W3, st, box, br, r1, r2, tg, tgS, tuyo;
    Scene({
      id: 'g2_recuadro', start: a - 0.2, end: end - 0.25,
      build(root) {
        const L = layer(root);
        W1 = Words(Box(L, M, V(196, 262), 'col', { width: V(900, 820) + 'px' }), 'Tu estado de cuenta trae *un recuadro.*', 'g2-h').sync('Tu estado de cuenta trae un recuadro');
        const tb = Box(L, M, V(420, 1452), 'g2-krow'); tg = tag(tb); tgS = Strike(tg, 'strike'); tuyo = tag(tb, 'TUYO', 'tuyo');
        W2 = Words(Box(L, M, V(490, 1512), 'col', { width: V(900, 820) + 'px' }), 'Ese número ya no es del ejemplo.', V('d3 d3-xl', 'd3')).sync('Ese número ya no es del ejemplo');
        W3 = Words(Box(L, M, V(590, 1590), 'col', { width: V(900, 820) + 'px' }), '*Es tuyo.*', 'd1 hero').sync('es tuyo', en);
        st = stmtPhone(L, V(1300, 230), V(160, 440), V(440, 620), V(760, 800), [
          ['Saldo al corte', '$ • • • • •'],
          ['Pago mínimo', '$ • • • •'],
        ]);
        box = h('div', { class: 'g2-st-box' },
          h('div', { class: 'g2-st-bk' }, 'SI SOLO PAGAS EL MÍNIMO'),
          r1 = h('div', { class: 'g2-st-row' }, h('span', {}, 'Tiempo para liquidar'), h('b', { class: 'num' }, '• • meses')),
          r2 = h('div', { class: 'g2-st-row' }, h('span', {}, 'Total a pagar'), h('b', { class: 'num' }, '$ • • • • •')));
        br = h('div', { class: 'bracket' }); box.append(br);
        st.screen.append(box);
        sfx(a + 0.1, 'whoosh', 0.45); sfx(rc + 0.3, 'click', 0.6); sfx(ej + 0.3, 'strike', 0.5); sfx(ty, 'pop', 0.7);
      },
      update(t) {
        const out = end - 0.4;
        W1.update(t, out);
        inout(st.wrap, t, a + 0.05, out, { dy: 120, din: 0.8, oy: 40 });
        const bp = P(t, rc + 0.2, 0.45);
        css(br, { opacity: bp, transform: `scale(${lerp(1.12, 1, bp).toFixed(3)})` });
        r1.classList.toggle('on', t > ct); r2.classList.toggle('on', t > cp);
        box.classList.toggle('mine', t > ty);
        inout(tg, t, en - 0.2, out, { dy: 10 });
        tgS.update(t, ej + 0.3);
        css(tgS.el, { top: '46%', height: '4px' });
        inout(tuyo, t, ty, out, { dy: 0, s0: 1.3 });
        W2.update(t, out); W3.update(t, out);
      },
    });
  }
})();
