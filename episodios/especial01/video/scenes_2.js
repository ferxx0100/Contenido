/* Escenas 14–26 · SISTEMA 1 "A dónde se va tu dinero" */
(() => {
  'use strict';
  const { h, css, attr, text, tr, P, env, kf, Ease, clamp, lerp, cue, Scene, sfx, ctx, T } = S;
  const { Words, inout, Counter, money, nf0, drawPath, Strike, Check, Phone, Row, DotGrid, Chip, Box } = C;
  const V = (a, b) => (ctx.vertical ? b : a);
  const M = V(288, 120);
  const CW = V(1524, 820);
  const c = (p, a = 0) => cue(p, a);
  const layer = (root, cls = '') => { const el = h('div', { class: 'layer ' + cls }); root.append(el); return el; };

  // ===================================================================== S14 diseñadas para que compres
  {
    const a = c('Y cuando veas esos números').s, en = c('no te enojes contigo').s, ds = c('Esas aplicaciones están diseñadas').s,
      b1 = c('un botón').s, b2 = c('sin contraseña').s, b3 = c('sin ver tu saldo').s, nf = c('No están fallando').s,
      fu = c('están funcionando exactamente').s, ju = c('Hasta hoy no sabías').s, re = c('con reglas que no conocías').s, end = c('Anota esos cuatro números').s;
    let W0, W1, btn, cursor, notes = [], W2, W3, board;
    Scene({
      id: 's14', start: a - 0.2, end: end - 0.25,
      build(root) {
        const L = layer(root);
        W0 = Words(Box(L, M, V(400, 780), 'col', { width: CW + 'px' }), 'No te enojes *contigo.*', 'd1').sync('no te enojes contigo');
        W1 = Words(Box(L, M, V(176, 250), 'col', { width: V(680, 870) + 'px' }), 'Están diseñadas para que compres *sin pensarlo.*', 'd3 d3-xl').sync('Esas aplicaciones están diseñadas por', ds);
        const stg = Box(L, V(1000, 140), V(250, 700), 'buystage', { width: V(760, 800) + 'px', height: V(560, 600) + 'px' });
        btn = h('div', { class: 'buy' }, 'Comprar ahora'); stg.append(btn);
        cursor = h('div', { class: 'cursor' }); stg.append(cursor);
        [['1 botón', 'n1'], ['sin contraseña', 'n2'], ['sin ver tu saldo', 'n3']].forEach(([s, k]) => { const n = h('div', { class: 'ann ' + k }, s); stg.append(n); notes.push(n); });
        W2 = Words(Box(L, M, V(420, 760), 'col', { width: V(900, 912) + 'px' }), 'No están fallando. Funcionan *como las diseñaron.*', 'd2').sync('No están fallando están funcionando exactamente como las diseñaron', nf);
        W3 = Words(Box(L, M, V(380, 700), 'col', { width: V(1100, 912) + 'px' }), 'Un juego con reglas *que no conocías.*', 'd1').sync('un juego con reglas que no conocías', ju);
        board = Box(L, M, V(330, 640), 'hasta-hoy kicker big-k'); board.textContent = 'HASTA HOY';
        sfx(b1 + 0.1, 'click', 0.7); sfx(b2 + 0.1, 'tick', 0.5); sfx(b3 + 0.1, 'tick', 0.5); sfx(ju, 'whoosh', 0.5);
      },
      update(t) {
        W0.update(t, ds - 0.35);
        const mid = nf - 0.35;
        W1.update(t, mid);
        inout(btn.parentNode, t, ds + 0.1, mid, { dy: 40, s0: 0.94 });
        // cursor que llega y hace clic en "un botón"
        const cp = P(t, ds + 1.0, 1.1, Ease.move);
        const click = t > b1 && t < b1 + 0.18;
        css(cursor, { transform: tr(lerp(V(560, 600), V(360, 380), cp), lerp(V(470, 520), V(250, 280), cp), click ? 0.86 : 1) });
        btn.classList.toggle('press', click);
        notes.forEach((n, i) => inout(n, t, [b1, b2, b3][i] + 0.05, mid, { dy: 16, s0: 0.9 }));
        W2.update(t, ju - 0.35);
        W3.update(t, end - 0.45);
        inout(board, t, ju, end - 0.45, { dy: 12 });
      },
    });
  }

  // ===================================================================== S15 anota los 4 números
  {
    const a = c('Anota esos cuatro números').s, pp = c('Ese es tu punto de partida real').s, mano = c('Y con esos números en la mano').s, dt = c('este dato te va a caer distinto').s, end = c('Según BBVA').s;
    let W0, grid, cells = [], frame, W1, W2;
    const NUMS = [['Comida a domicilio', '$901'], ['Suscripciones', '$357'], ['Tienda en línea', '$2,297'], ['Patrón de quincena', '+$3,680']];
    Scene({
      id: 's15', start: a - 0.2, end: end - 0.2,
      build(root) {
        const L = layer(root);
        W0 = Words(Box(L, M, V(150, 260), 'col', { width: CW + 'px' }), 'Anota tus *4 números.*', 'd2').sync('Anota esos cuatro números');
        grid = Box(L, M, V(340, 480), 'four', { width: CW + 'px' });
        NUMS.forEach(([k, v], i) => { const cl = h('div', { class: 'card cell' }, h('div', { class: 'kicker' }, String(i + 1).padStart(2, '0') + ' · ' + k), h('div', { class: 'cell-v num' }, v)); grid.append(cl); cells.push(cl); });
        frame = h('div', { class: 'start-frame' }, h('span', { class: 'kicker acc-k' }, 'TU PUNTO DE PARTIDA REAL')); grid.append(frame);
        W1 = Words(Box(L, M, V(800, 1500), 'col', { width: CW + 'px' }), 'Con esos números en la mano…', 'd3 muted').sync('Y con esos números en la mano');
        W2 = Words(Box(L, M, V(880, 1600), 'col', { width: CW + 'px' }), 'este dato te va a caer *distinto.*', 'd3').sync('este dato te va a caer distinto');
        cells.forEach((_, i) => sfx(a + 0.3 + i * 0.2, 'tick', 0.45)); sfx(pp + 0.3, 'pop', 0.6);
      },
      update(t) {
        const out = end - 0.4;
        W0.update(t, out);
        cells.forEach((cl, i) => inout(cl, t, a + 0.3 + i * 0.2, out, { dy: 40, s0: 0.95 }));
        const fp = P(t, pp + 0.2, 0.6, Ease.move);
        css(frame, { opacity: fp * (1 - P(t, out, 0.3, Ease.exit)), transform: `scale(${lerp(1.04, 1, fp).toFixed(4)})` });
        W1.update(t, out); W2.update(t, out);
      },
    });
  }

  // ===================================================================== S16 BBVA con datos de CONDUSEF: más del 12% en gastos hormiga
  {
    const a = c('Según BBVA').s, cd = c('con datos de la Condusef').s, gh = c('los gastos hormiga').s, m12 = c('más del doce por ciento').s,
      u10 = c('Más de uno de cada diez pesos').s, se = c('sin saber a dónde se fue').s, np = c('No es que ganes poco').s, eq = c('Es que una parte').s, end = c('Y esto no pasa porque').s;
    let K, kGh, W0, big, n12, lbl, row, pesos = [], plab, W3, W4;
    Scene({
      id: 's16', start: a - 0.2, end: end - 0.25,
      build(root) {
        const L = layer(root);
        K = Box(L, M, V(176, 370), 'kicker', { width: CW + 'px' }); K.innerHTML = '<span class="acc">SEGÚN BBVA,</span> CON DATOS DE LA CONDUSEF';
        kGh = Box(L, M, V(216, 410), 'kicker acc-k'); kGh.textContent = 'GASTOS HORMIGA · MÁS DEL';
        big = Box(L, M - 12, V(246, 440), 'stat-row');
        n12 = h('span', { class: 'stat-n num-d' }, '0');
        const side = h('div', { class: 'stat-side' }, h('span', { class: 'stat-p' }, '%'));
        W0 = Words(Box(L, M, V(300, 520), 'col', { width: CW + 'px' }), 'Los gastos *hormiga.*', 'd1 hero').sync('los gastos hormiga');
        lbl = Words(ctx.vertical ? Box(L, M, 870, 'col', { width: CW + 'px' }) : side, 'de lo que *ganas.*', ctx.vertical ? 'd2' : 'd3 stat-desc').sync('de lo que ganas', m12);
        big.append(n12, side);
        row = Box(L, M, V(660, 990), 'peso-row', { width: CW + 'px' });
        for (let i = 0; i < 10; i++) { const el = h('div', { class: 'peso' + (i === 0 ? ' lost' : '') }, '$1'); row.append(el); pesos.push(el); }
        plab = Box(L, M, V(800, 1110), 'kicker peso-lab', { width: CW + 'px' }); plab.innerHTML = '<span class="acc">− MÁS DE 1 DE CADA 10 PESOS</span> · SIN SABER A DÓNDE SE FUE';
        W3 = Words(Box(L, M, V(300, 420), 'col', { width: CW + 'px' }), 'No es que ganes poco.', 'd1 hero').sync('No es que ganes poco');
        W4 = Words(Box(L, M, V(560, 860), 'col', { width: V(1400, 820) + 'px' }), 'Es que se va *antes de que tú decidas.*', 'd2').sync('Es que una parte de lo', eq);
        sfx(m12, 'thud', 1.0); sfx(u10, 'tick', 0.6); sfx(se, 'strike', 0.4);
      },
      update(t) {
        const mid2 = np - 0.35, out = end - 0.45;
        inout(K, t, a, mid2, { dy: 12 });
        W0.update(t, m12 - 0.35);
        inout(kGh, t, m12 - 0.3, mid2, { dy: 12 });
        inout(big, t, m12 - 0.2, mid2, { dy: 50, din: 0.7 });
        text(n12, nf0.format(Math.round(lerp(0, 12, P(t, m12, 0.8)))));
        lbl.update(t, mid2);
        inout(row, t, u10 - 0.2, mid2, { dy: 24 });
        pesos.forEach((el, i) => { const p = P(t, u10 + i * 0.07, 0.35); css(el, { opacity: p, transform: tr(0, (1 - p) * 16, 1) }); });
        pesos[0].classList.toggle('gone', t > se + 0.2);
        inout(plab, t, u10 + 0.6, mid2, { dy: 10 });
        W3.update(t, eq - 0.3);
        W4.update(t, out);
      },
    });
  }

  // ===================================================================== S17 tesis: no es falta de disciplina
  {
    const a = c('Y esto no pasa porque').s, ind = c('indisciplinado').s, pa = c('Pasa porque nunca tuviste').s, nd = c('No es falta de disciplina').s,
      dis = c('disciplina', nd).s, fs = c('Es falta de sistema').s, sis = c('sistema', fs).s, can = c('Por eso este canal').s, end = c('Uno abre las notas').s;
    let W0, st, W1, T1, st2, T2, dbl, wm, wdbl, fitted = false, placed = false;
    Scene({
      id: 's17', start: a - 0.2, end: end - 0.2,
      build(root) {
        const L = layer(root);
        W0 = Words(Box(L, M, V(250, 400), 'col', { width: CW + 'px' }), 'No es porque seas indisciplinado.', 'd2').sync('Y esto no pasa porque seas indisciplinado');
        st = Strike(W0.ws[4], 'strike');
        W1 = Words(Box(L, M, V(560, 760), 'col', { width: V(1400, 820) + 'px' }), 'Es que nunca tuviste *con qué ver* a dónde se iba tu dinero.', 'd3 d3-xl').sync('Pasa porque nunca tuviste con qué ver hacia dónde se iba tu dinero');
        T1 = Words(Box(L, M, V(200, 420), 'col', { width: CW + 'px' }), 'No es falta de disciplina.', 'serif-line').sync('No es falta de disciplina');
        st2 = Strike(T1.ws[4], 'strike');
        T2 = Words(Box(L, M, V(360, 640), 'col', { width: CW + 'px' }), 'Es falta de sistema.', 'd1 hero').sync('Es falta de sistema');
        dbl = h('div', { class: 'dbl' }); T2.el.parentNode.append(dbl);
        const wb = Box(L, M, V(300, 600), 'wm-box', { width: CW + 'px' });
        wm = h('div', { class: 'wordmark giant' }, 'SISTEMA'); wdbl = h('div', { class: 'dbl' }); wb.append(wm, wdbl);
        sfx(ind + 0.3, 'strike', 0.7); sfx(dis + 0.4, 'strike', 0.6); sfx(sis + 0.2, 'thud', 1.0); sfx(can + 0.1, 'riser', 0.4);
      },
      update(t) {
        if (!fitted) { const w = wm.scrollWidth; if (w > 0) { const f = parseFloat(getComputedStyle(wm).fontSize); css(wm, { fontSize: (f * CW / w).toFixed(1) + 'px' }); fitted = true; } }
        if (!placed) { const m = T2.ws[3].parentNode; if (m.offsetWidth > 0) { css(dbl, { left: m.offsetLeft + 6, right: 'auto', top: m.offsetTop + m.offsetHeight - 6, width: m.offsetWidth - 40 }); placed = true; } }
        const mid = nd - 0.35, mid2 = can - 0.1;
        W0.update(t, mid); st.update(t, ind + 0.25); W1.update(t, mid);
        T1.update(t, mid2); st2.update(t, dis + 0.45);
        T2.update(t, mid2);
        css(dbl, { transform: `scaleX(${P(t, sis + 0.05, 0.45, Ease.move).toFixed(4)})`, opacity: 1 - P(t, mid2, 0.32, Ease.exit) });
        const wp = P(t, can + 0.25, 0.8, Ease.enter), wq = P(t, end - 0.45, 0.3, Ease.exit);
        css(wm, { opacity: wp * (1 - wq), transform: tr(0, (1 - wp) * 60, 1) });
        css(wdbl, { transform: `scaleX(${P(t, can + 0.8, 0.6, Ease.move).toFixed(4)})`, opacity: 1 - wq });
      },
    });
  }

  // ===================================================================== S18–S21 los cuatro pasos
  function StepHead(L, n, title, t0, tout) {
    const big = Box(L, V(M, 120), V(150, 210), 'step-n num-d'); big.textContent = n;
    const k = Box(L, V(M + 190, 300), V(176, 250), 'kicker acc-k'); k.textContent = 'PASO ' + n + ' DE 4';
    const W = Words(Box(L, V(M + 190, 300), V(214, 290), 'col', { width: V(1300, 700) + 'px' }), title, 'd3 step-t');
    return { big, k, W, update(t) { inout(big, t, t0, tout, { dy: 50, s0: 0.9 }); inout(k, t, t0 + 0.1, tout, { dy: 14 }); W.update(t, tout); } };
  }
  // Paso 1: dos columnas
  {
    const a = c('Uno abre las notas').s, ab = c('abre las notas de tu teléfono').s, en = c('De un lado lo que entra').s, sa = c('del otro lo que sale').s, po = c('Ponle los números').s,
      pq = c('Porque si trabajas todo el mes').s, pt = c('entonces para qué trabajas').s, end = c('Dos si sueles pagar').s;
    let H, notes, colIn, colOut, items = [], W2;
    Scene({
      id: 's18', start: a - 0.2, end: end - 0.25,
      build(root) {
        const L = layer(root);
        H = StepHead(L, '1', 'Haz *dos columnas* en las notas de tu teléfono', a, end - 0.45); H.W.at(ab);
        notes = Box(L, V(M, 120), V(380, 520), 'card notes', { width: V(980, 870) + 'px' });
        notes.append(h('div', { class: 'notes-h' }, 'Mi dinero · noviembre'));
        const cols = h('div', { class: 'notes-cols' });
        colIn = h('div', { class: 'ncol' }, h('div', { class: 'ncol-k acc' }, 'ENTRA'));
        colOut = h('div', { class: 'ncol' }, h('div', { class: 'ncol-k leak' }, 'SALE'));
        cols.append(colIn, colOut); notes.append(cols);
        const addI = (col, k, v, cls = '') => { const r = h('div', { class: 'nrow ' + cls }, h('span', {}, k), h('span', { class: 'num' }, v)); col.append(r); items.push(r); return r; };
        addI(colIn, 'Sueldo (2 quincenas)', '$24,960');
        addI(colOut, 'Renta', '$6,500'); addI(colOut, 'Súper', '$3,200');
        addI(colOut, 'Comida a domicilio', '$901', 'found'); addI(colOut, 'Suscripciones', '$357', 'found'); addI(colOut, 'Tienda en línea', '$2,297', 'found');
        W2 = Words(Box(L, V(1340, 120), V(420, 1580), 'col', { width: V(470, 870) + 'px' }), 'Si trabajas todo el mes y se te va en tontería… *¿para qué trabajas?*', 'd3').sync('Porque si trabajas todo el mes y se te va en tontería entonces para qué trabajas');
        sfx(a, 'tick', 0.6); sfx(en + 0.4, 'blip', 0.4); sfx(sa + 0.3, 'blip', 0.4); [0, 1, 2].forEach(i => sfx(po + 0.5 + i * 0.3, 'blip', 0.4));
      },
      update(t) {
        const out = end - 0.45;
        H.update(t);
        inout(notes, t, ab + 0.3, out, { dy: 40 });
        const times = [en + 0.4, sa + 0.3, sa + 0.6, po + 0.5, po + 0.8, po + 1.1];
        items.forEach((r, i) => inout(r, t, times[i], out, { dy: 14, dx: -10, din: 0.4 }));
        W2.update(t, out);
      },
    });
  }
  // Paso 2: compras chicas en efectivo
  {
    const a = c('Dos si sueles pagar').s, si = c('si sueles pagar con el teléfono').s, pa = c('para las compras chicas').s, vu = c('vuelve al efectivo').s, se = c('Vas a sentir la diferencia').s, end = c('Tres revisa tu estado').s;
    let H, swap, ph, cash, meter, mi;
    Scene({
      id: 's19', start: a - 0.2, end: end - 0.25,
      build(root) {
        const L = layer(root);
        H = StepHead(L, '2', 'Compras chicas: *vuelve al efectivo* por un tiempo', a, end - 0.45); H.W.at(si);
        swap = Box(L, V(M, 84), V(420, 600), 'swap', { width: V(1100, 912) + 'px' });
        ph = h('div', { class: 'swap-i phone-i' }, h('div', { class: 'tap-phone' }), h('span', { class: 'kicker' }, 'TELÉFONO'));
        cash = h('div', { class: 'swap-i cash-i' }, h('div', { class: 'bills' }, h('i'), h('i'), h('i')), h('span', { class: 'kicker' }, 'EFECTIVO'));
        swap.append(ph, h('div', { class: 'swap-arrow' }), cash);
        meter = Box(L, V(M, 84), V(800, 1300), 'meter wide', { width: V(1100, 912) + 'px' });
        meter.append(h('div', { class: 'meter-k' }, 'Vas a sentir la diferencia'), h('div', { class: 'meter-bar' }, mi = h('i')));
        sfx(vu, 'whoosh', 0.5); sfx(se + 0.3, 'tick', 0.6);
      },
      update(t) {
        const out = end - 0.45;
        H.update(t);
        inout(swap, t, si, out, { dy: 30 });
        const sp = P(t, vu, 0.7, Ease.move);
        css(ph, { opacity: lerp(1, 0.3, sp), transform: tr(0, 0, lerp(1, 0.9, sp)) });
        css(cash, { opacity: lerp(0.3, 1, sp), transform: tr(0, 0, lerp(0.9, 1.06, sp)) });
        inout(meter, t, se - 0.2, out, { dy: 20 });
        css(mi, { width: (P(t, se + 0.2, 1.0) * 80).toFixed(2) + '%' });
      },
    });
  }
  // Paso 3: un día fijo a la semana
  {
    const a = c('Tres revisa tu estado').s, rv = c('revisa tu estado de cuenta un día fijo').s, ns = c('no solo cuando algo te preocupa').s, as = c('Así lo controlas tú').s, end = c('Cuatro si sabes que viene').s;
    let H, weeks, cells = [], W2;
    Scene({
      id: 's20', start: a - 0.2, end: end - 0.25,
      build(root) {
        const L = layer(root);
        H = StepHead(L, '3', 'Revisa tu estado de cuenta *un día fijo* a la semana', a, end - 0.45); H.W.at(rv);
        weeks = Box(L, V(M, 120), V(400, 560), 'weeks', { width: V(980, 870) + 'px' });
        const head = h('div', { class: 'wk-row head' }); ['L', 'M', 'M', 'J', 'V', 'S', 'D'].forEach(d => head.append(h('span', { class: 'kicker' }, d))); weeks.append(head);
        for (let w = 0; w < 4; w++) { const r = h('div', { class: 'wk-row' }); for (let d = 0; d < 7; d++) { const cl = h('i', { class: 'wk' + (d === 6 ? ' fixed' : '') }); r.append(cl); if (d === 6) cells.push(cl); } weeks.append(r); }
        W2 = Words(Box(L, V(1340, 120), V(440, 1420), 'col', { width: V(470, 870) + 'px' }), 'Así lo controlas tú, *y no al revés.*', 'd3').sync('Así lo controlas tú y no al revés');
        cells.forEach((_, i) => sfx(rv + 1.0 + i * 0.25, 'blip', 0.35));
      },
      update(t) {
        const out = end - 0.45;
        H.update(t);
        inout(weeks, t, rv, out, { dy: 30 });
        cells.forEach((cl, i) => cl.classList.toggle('on', t > rv + 1.0 + i * 0.25));
        W2.update(t, out);
      },
    });
  }
  // Paso 4: anota cobros fijos el día que decides
  {
    const a = c('Cuatro si sabes que viene').s, sb = c('si sabes que viene un cobro').s, an = c('anótalo el día que decidiste').s, ns = c('no el día que te sorprenda').s, end = c('Y esas suscripciones que encontraste').s;
    let H, chips = [], tl, d1, d2, W2;
    Scene({
      id: 's21', start: a - 0.2, end: end - 0.25,
      build(root) {
        const L = layer(root);
        H = StepHead(L, '4', 'Anota cada cobro fijo *el día que lo decides*', a, end - 0.45); H.W.at(sb);
        const row = Box(L, V(M, 84), V(400, 560), 'chips-row', { width: V(1100, 912) + 'px' });
        ['un cobro', 'una suscripción', 'un pago fijo'].forEach(s => { const ch = Chip(row, s); chips.push(ch); });
        tl = Box(L, V(M, 84), V(560, 780), 'timeline', { width: V(1100, 912) + 'px' });
        tl.append(h('div', { class: 'tl-line' }));
        d1 = h('div', { class: 'tl-pt ok', style: { left: '12%' } }, h('i'), h('span', { class: 'kicker' }, 'DÍA QUE DECIDES'), h('b', {}, 'lo anotas ✓')); tl.append(d1);
        d2 = h('div', { class: 'tl-pt bad', style: { left: '78%' } }, h('i'), h('span', { class: 'kicker' }, 'DÍA DEL COBRO'), h('b', {}, 'ya no te sorprende')); tl.append(d2);
        sfx(an + 0.3, 'check', 0.6); sfx(ns + 0.3, 'tick', 0.5);
      },
      update(t) {
        const out = end - 0.45;
        H.update(t);
        chips.forEach((ch, i) => inout(ch, t, sb + 0.4 + i * 0.55, out, { dy: 16, s0: 0.92 }));
        inout(tl, t, an - 0.2, out, { dy: 20 });
        css(tl.querySelector('.tl-line'), { transform: `scaleX(${P(t, an - 0.1, 1.0, Ease.move).toFixed(4)})` });
        inout(d1, t, an + 0.3, out, { dy: 14 }); inout(d2, t, ns + 0.2, out, { dy: 14 });
      },
    });
  }

  // ===================================================================== S22 bonus: cancelar suscripciones en iPhone
  {
    const a = c('Y esas suscripciones que encontraste').s, ip = c('Si tienes iPhone').s, aj = c('abre Ajustes').s, nm = c('toca tu nombre arriba').s,
      sus = c('luego Suscripciones').s, ve = c('Ahí ves todo lo que te cobra').s, tc = c('Tocas la que quieras').s, cs = c('Cancelar suscripción').s,
      hz = c('Hazlo ahora').s, vc = c('con el video corriendo').s, end = c('Y una cosa más').s;
    let K, H, crumbs = [], phone, scr = {}, tap, hz1;
    Scene({
      id: 's22', start: a - 0.2, end: end - 0.25,
      build(root) {
        const L = layer(root);
        K = Box(L, M, V(176, 370), 'kicker acc-k'); K.textContent = 'BONUS · iPHONE';
        H = Words(Box(L, M, V(214, 410), 'col', { width: V(980, 820) + 'px' }), 'Quítalas *ahora mismo.*', 'd2').sync('quitarlas ahora mismo');
        const cr = Box(L, M, V(470, 640), 'crumbs', { width: V(820, 420) + 'px' });
        ['Ajustes', 'Tu nombre', 'Suscripciones', 'Cancelar suscripción'].forEach((s, i) => { const el = h('div', { class: 'crumb' + (i === 3 ? ' danger' : '') }, h('span', { class: 'num' }, String(i + 1)), h('span', {}, s)); cr.append(el); crumbs.push(el); });
        hz1 = Words(Box(L, M, V(840, 1000), 'col', { width: V(980, 420) + 'px' }), 'Hazlo ahora, *con el video corriendo.*', 'd3 d3-xl').sync('Hazlo ahora con el video corriendo');
        const pw = Box(L, V(1330, 600), V(126, 600), 'phone-wrap');
        const P1 = Phone(pw, { w: V(420, 480), hgt: V(810, 940), cls: 'ios' }); phone = P1.el;
        const s = P1.screen;
        const mk = (k, kids) => { const el = h('div', { class: 'ios-screen ' + k }, ...kids); s.append(el); scr[k] = el; return el; };
        mk('settings', [h('div', { class: 'ios-title' }, 'Ajustes'), h('div', { class: 'ios-profile' }, h('i', { class: 'ios-avatar' }), h('div', {}, h('b', {}, 'Tu nombre'), h('span', {}, 'Cuenta, iCloud, compras'))),
          h('div', { class: 'ios-group' }, ...['Modo avión', 'Wi-Fi', 'Bluetooth', 'Notificaciones', 'General'].map(x => h('div', { class: 'ios-row' }, x)))]);
        mk('account', [h('div', { class: 'ios-title' }, 'Tu nombre'), h('div', { class: 'ios-group' }, ...['Información personal', 'Inicio de sesión y seguridad', 'Pago y envío'].map(x => h('div', { class: 'ios-row' }, x)), h('div', { class: 'ios-row hl' }, 'Suscripciones'), h('div', { class: 'ios-row' }, 'iCloud'))]);
        mk('subs', [h('div', { class: 'ios-title' }, 'Suscripciones'), h('div', { class: 'ios-group' }, ...[['Streaming de video', '$219/mes'], ['Música', '$129/mes'], ['App de fotos', '$49/mes'], ['Almacenamiento', '$179/mes']].map(([x, p], i) => h('div', { class: 'ios-row sub' + (i === 1 ? ' hl' : '') }, h('span', {}, x), h('span', { class: 'num' }, p))))]);
        mk('detail', [h('div', { class: 'ios-title' }, 'Música'), h('div', { class: 'ios-group' }, h('div', { class: 'ios-row' }, 'Plan individual · $129/mes')), h('div', { class: 'ios-cancel' }, 'Cancelar suscripción')]);
        tap = h('i', { class: 'tapdot' }); s.append(tap);
        sfx(aj, 'tick', 0.5); sfx(nm + 0.5, 'click', 0.6); sfx(sus + 0.6, 'click', 0.6); sfx(tc + 0.6, 'click', 0.6); sfx(cs + 0.5, 'click', 0.7);
      },
      update(t) {
        const out = end - 0.45;
        inout(K, t, a, out, { dy: 14 }); H.update(t, out);
        crumbs.forEach((cr, i) => { const ti = [aj, nm, sus, cs][i]; inout(cr, t, ti, out, { dx: -20, dy: 0 }); cr.classList.toggle('on', t > ti + 0.2); });
        inout(phone.parentNode, t, ip - 0.2, out, { dy: 160, din: 0.8 });
        // navegación por pantallas (deslizamiento lateral tipo iOS)
        const steps = [['settings', ip - 0.3], ['account', nm + 0.7], ['subs', sus + 0.8], ['detail', tc + 0.8]];
        steps.forEach(([k, t0], i) => {
          const next = steps[i + 1] ? steps[i + 1][1] : 1e9;
          const pin = P(t, t0, 0.45, Ease.move), pout = P(t, next, 0.45, Ease.move);
          css(scr[k], { transform: tr(i === 0 ? 0 : (1 - pin) * 470, 0, 1) + ` translateX(${(-pout * 30).toFixed(1)}%)`, opacity: i === 0 ? 1 - pout * 0.5 : Math.min(1, pin * 2) * (1 - pout * 0.5), zIndex: i });
        });
        // toques
        const taps = [[nm + 0.45, V(230, 240), 175], [sus + 0.55, V(230, 240), 330], [tc + 0.55, V(230, 240), 225], [cs + 0.4, V(230, 240), 285]];
        let tp = null; for (const tt of taps) if (t >= tt[0] && t < tt[0] + 0.45) tp = tt;
        if (tp) { const p = P(t, tp[0], 0.45, Ease.outCubic); css(tap, { opacity: 1 - p, transform: tr(tp[1], tp[2], 0.6 + p * 1.2) }); } else css(tap, { opacity: 0 });
        hz1.update(t, out);
      },
    });
  }

  // ===================================================================== S23 borra las apps de impulso
  {
    const a = c('Y una cosa más').s, el = c('Elimina las aplicaciones').s, pq = c('Porque ahí no solo pierdes tiempo').s, mo = c('ahí te están mostrando').s,
      of = c('ofertas').s, co = c('cosas que de repente necesitas').s, ge = c('gente que parece tener').s, em = c('Eso es lo que te empuja').s,
      bo = c('Mejor bórralas').s, end = c('Con esto terminas Sistema uno').s;
    let W0, W1, home, icons = [], feed = [], W2, W3;
    const APPS = ['tag', 'bag', 'spark', 'cart', 'tag', 'gift', 'bag', 'star', 'cart', 'spark', 'gift', 'tag'];
    Scene({
      id: 's23', start: a - 0.2, end: end - 0.25,
      build(root) {
        const L = layer(root);
        W0 = Words(Box(L, M, V(176, 250), 'col', { width: V(900, 870) + 'px' }), 'Una cosa más:', 'kicker big-k').sync('Y una cosa más');
        W1 = Words(Box(L, M, V(214, 300), 'col', { width: V(860, 870) + 'px' }), 'Borra las apps *de impulso.*', 'd2').sync('Elimina las aplicaciones donde compras por impulso');
        home = Box(L, V(1180, 160), V(150, 760), 'home', { width: V(520, 760) + 'px' });
        APPS.forEach((k, i) => { const ic = h('div', { class: 'app-ic ic-' + k + (i % 3 === 1 ? ' impulse' : '') }, h('i'), h('span', { class: 'minus' }, '−')); home.append(ic); icons.push(ic); });
        const fw = Box(L, M, V(500, 1500), 'feed', { width: V(900, 912) + 'px' });
        [['Ofertas', '−70% solo hoy'], ['Cosas que de repente necesitas', 'Te podría gustar…'], ['Gente que parece tener lo que tú no', '@alguien compró…']].forEach(([k, v]) => { const f = h('div', { class: 'card feed-i' }, h('b', {}, k), h('span', { class: 'muted' }, v)); fw.append(f); feed.push(f); });
        W2 = Words(Box(L, M, V(880, 1780), 'col', { width: V(900, 912) + 'px' }), 'Eso es lo que *te empuja a gastar.*', 'd3').sync('Eso es lo que te empuja a gastar');
        W3 = Words(Box(L, M, V(500, 1500), 'col', { width: V(860, 870) + 'px' }), 'Bórralas de tu pantalla principal… *o de tu teléfono.*', 'd3 d3-xl').sync('Mejor bórralas de tu pantalla principal o de tu teléfono', bo);
        [of, co, ge].forEach(x => sfx(x + 0.1, 'pop', 0.4)); [0, 1, 2, 3].forEach(i => sfx(bo + 1.2 + i * 0.35, 'blip', 0.35));
      },
      update(t) {
        const out = end - 0.45;
        W0.update(t, out); W1.update(t, out);
        inout(home, t, el, out, { dy: 40 });
        const jig = t > bo ? 1 : 0;
        icons.forEach((ic, i) => {
          const imp = i % 3 === 1, kill = bo + 1.2 + Math.floor(i / 3) * 0.35;
          const gone = imp ? P(t, kill, 0.35, Ease.inCubic) : 0;
          const wob = jig * Math.sin(t * 22 + i) * 2.2 * (1 - gone);
          css(ic, { transform: tr(0, 0, 1 - gone, wob), opacity: P(t, el + 0.2 + i * 0.04, 0.3) * (1 - gone) });
          ic.classList.toggle('jiggle', t > bo);
        });
        feed.forEach((f, i) => inout(f, t, [of, co, ge][i], bo - 0.35, { dy: 30, s0: 0.95 }));
        W2.update(t, bo - 0.35);
        W3.update(t, out);
      },
    });
  }

  // ===================================================================== S24 recap: nivel 1 completado
  {
    const a = c('Con esto terminas Sistema uno').s, n = c('Encontraste tu número real').s, co = c('tienes tus dos columnas').s, qu = c('y ya quitaste').s, end = c('En Sistema dos').s;
    let W0, bar, fill, items = [], checks = [];
    Scene({
      id: 's24', start: a - 0.2, end: end - 0.2,
      build(root) {
        const L = layer(root);
        W0 = Words(Box(L, M, V(196, 300), 'col', { width: CW + 'px' }), 'Terminaste *Sistema 1.*', 'd2').sync('Con esto terminas Sistema uno');
        bar = Box(L, M, V(380, 560), 'lvlbar', { width: CW + 'px' });
        bar.append(h('span', { class: 'kicker' }, 'NIVEL 1'), h('div', { class: 'lvlbar-track' }, fill = h('i')), h('span', { class: 'kicker acc' }, 'COMPLETADO'));
        const list = Box(L, M, V(500, 720), 'recap', { width: CW + 'px' });
        ['Encontraste tu número real', 'Tienes tus dos columnas', 'Quitaste lo que te costaba en silencio'].forEach(s => { const r = h('div', { class: 'goal-row' }); const ck = Check(r, 52); r.append(h('span', { class: 'goal-t' }, s)); list.append(r); items.push(r); checks.push(ck); });
        sfx(a + 0.4, 'riser', 0.4); [n, co, qu].forEach(x => sfx(x + 0.6, 'check', 0.6));
      },
      update(t) {
        const out = end - 0.4;
        W0.update(t, out);
        inout(bar, t, a + 0.3, out, { dy: 20 });
        css(fill, { transform: `scaleX(${P(t, a + 0.6, 6.5, Ease.inOutCubic).toFixed(4)})` });
        items.forEach((r, i) => { const ti = [n, co, qu][i]; inout(r, t, ti, out, { dy: 20 }); checks[i].update(t, ti + 0.4); });
      },
    });
  }

  // ===================================================================== S25 siguiente: Sistema 2 · deuda → nivel 0
  {
    const a = c('En Sistema dos').s, de = c('deuda').s, va = c('vas a agarrar esas dos columnas').s, pr = c('de forma profesional').s,
      pa = c('para que dejes de pagar intereses').s, n0 = c('al nivel cero').s, y0 = c('Y el nivel cero es').s, si = c('simple').s, nd = c('no deber nada').s, nv = c('Vamos con Sistema dos').s;
    let K, card2, W1, ladder, rungs = [], W2, W3, W4;
    Scene({
      id: 's25', start: a - 0.2, end: nv + 1.6, post: 0.3,
      build(root) {
        const L = layer(root);
        K = Box(L, M, V(176, 250), 'kicker'); K.textContent = 'LO QUE SIGUE';
        card2 = Box(L, M, V(220, 310), 'next-card');
        card2.append(h('div', { class: 'lvl-n num' }, '2'), h('div', {}, h('div', { class: 'kicker acc-k' }, 'SISTEMA 2'), h('div', { class: 'next-t' }, 'Deuda')));
        W1 = Words(Box(L, M, V(500, 760), 'col', { width: V(960, 870) + 'px' }), 'Manejar tu deuda *de forma profesional.*', 'd3 d3-xl').sync('manejar tu deuda de forma profesional', va);
        ladder = Box(L, V(1320, 640), V(200, 1100), 'ladder');
        ['3', '2', '1', '0'].reverse().forEach(() => {});
        [['0', 'No deber nada'], ['…', ''], ['2', 'Deuda'], ['1', 'A dónde se va tu dinero']].forEach(([nn, lab]) => { const r = h('div', { class: 'rung' + (nn === '0' ? ' goal' : '') }, h('span', { class: 'num' }, nn), h('span', {}, lab)); ladder.append(r); rungs.push(r); });
        W2 = Words(Box(L, M, V(680, 1000), 'col', { width: V(960, 870) + 'px' }), 'Deja de pagar *intereses que no necesitas.*', 'd3').sync('para que dejes de pagar intereses que no necesitas', pa);
        const fin = Box(L, 0, V(300, 620), 'col center', { width: V(1920, 1080) + 'px' });
        W3 = Words(fin, 'Nivel 0:', 'd2 muted').sync('Y el nivel cero es');
        W4 = Words(fin, '*No deber nada.*', 'd1').sync('no deber nada');
        S.__nv = Words(Box(L, 0, V(640, 1000), 'col center', { width: V(1920, 1080) + 'px' }), 'Vamos con *Sistema 2.*', 'd3 muted').sync('Vamos con Sistema dos');
        sfx(de, 'tick', 0.6); sfx(n0, 'riser', 0.5); sfx(nd, 'thud', 1.0); sfx(nv, 'pop', 0.5);
      },
      update(t) {
        const mid = y0 - 0.35;
        inout(K, t, a, mid, { dy: 12 });
        inout(card2, t, a + 0.1, mid, { dy: 30, s0: 0.95 });
        card2.classList.toggle('unlock', t > de);
        W1.update(t, mid);
        inout(ladder, t, va, mid, { dy: 30 });
        rungs.forEach((r, i) => { r.classList.toggle('on', (i === 3 && t > va) || (i === 2 && t > de) || (i === 0 && t > n0)); inout(r, t, va + (3 - i) * 0.15, mid, { dy: 16 }); });
        W2.update(t, mid);
        W3.update(t, nv + 1.5); W4.update(t, nv + 1.5); S.__nv.update(t, nv + 1.5);
      },
    });
  }

  // ===================================================================== S26 pantalla final (end screen de YouTube)
  {
    const a = c('Vamos con Sistema dos').s;
    const t0 = a + 60, END = T.duration + 1.5; // especial: sin pantalla final, sigue Sistema 2
    let mark, sub, slots;
    Scene({
      id: 's26', start: t0, end: END, pre: 0.4,
      build(root) {
        const L = layer(root, 'endcard');
        mark = Box(L, M, V(700, 1500), 'wm-box end-wm', {}); mark.append(h('div', { class: 'wordmark' }, 'SISTEMA'), h('div', { class: 'dbl thin' }));
        sub = Box(L, M, V(196, 300), 'col', { width: V(800, 870) + 'px' });
        sub.append(h('div', { class: 'kicker acc-k big-k' }, 'SIGUIENTE · NIVEL 2'), h('div', { class: 'd2' }, 'Deuda'), h('div', { class: 'd3 muted' }, 'Cómo dejar de pagar intereses que no necesitas.'));
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
