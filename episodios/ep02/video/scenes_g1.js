/* Grupo 1 · bloques 01 Arranque, 02 Abre tu tarjeta, 03 La tercera columna y tu nivel · SISTEMA 2 "Deuda" */
(() => {
  'use strict';
  const { h, css, attr, text, tr, P, env, kf, Ease, clamp, lerp, cue, Scene, sfx, ctx } = S;
  const { inout, Counter, money, nf0, drawPath, Strike, Check, Phone, Row, DotGrid, Chip, Box } = C;
  const V = (a, b) => (ctx.vertical ? b : a);
  const M = V(288, 120);          // columna de contenido (libro mayor)
  const CW = V(1524, 820);        // ancho útil hasta la regla derecha
  const c = (p, a = 0) => cue(p, a);
  const layer = (root, cls = '') => { const el = h('div', { class: 'layer ' + cls }); root.append(el); return el; };
  const MINUS = '−';
  // *varias palabras* -> *cada* *palabra* (Words marca el acento palabra por palabra)
  const A = str => str.replace(/\*([^*]+)\*/g, (m, g) => g.trim().split(/\s+/).map(w => '*' + w.replace(/([.,:;?!]*)$/, '*$1')).join(' '));
  const Words = (p, str, cls, x) => C.Words(p, A(str), cls, x);

  // tarjeta de crédito genérica (sin marca)
  const CCard = (parent, cls = '', k = 'TARJETA DE CRÉDITO') => {
    const el = h('div', { class: 'g1-ccard ' + cls },
      h('div', { class: 'g1-cc-k' }, k), h('div', { class: 'g1-cc-chip' }), h('div', { class: 'g1-cc-n' }, '•••• •••• •••• ••••'));
    parent.append(el); return el;
  };

  // ===================================================================== G1-01 gancho: pagas cada mes y la deuda casi no baja
  {
    const t0 = c('Tienes una tarjeta de crédito').s, pg = c('pagas cada mes').s, dd = c('y la deuda casi no baja').s, cn = c('casi no baja').s,
      hv = c('Hoy vas a ver por qué').s, tn = c('con tus propios números').s, end = c('Esto es Sistema dos').s;
    const N = 12, MO = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
    const FR = Array.from({ length: N }, (_, i) => 1 - i * 0.0075 - (i % 3 === 2 ? 0.004 : 0));   // la barra casi no cambia
    let W1, W2, W3, W4, W5, card, chart, bars = [], mos = [], flat, flatL, CH;
    Scene({
      id: 'g1_gancho', start: 0, end: end - 0.25, pre: 0.2,
      build(root) {
        const L = layer(root);
        const tw = V(1000, 870), ty = V(190, 270);
        W1 = Words(Box(L, M, ty, 'col', { width: tw + 'px' }), 'Tienes una *tarjeta de crédito.*', 'd2').sync('Tienes una tarjeta de crédito');
        W2 = Words(Box(L, M, ty, 'col', { width: tw + 'px' }), 'Pagas *cada mes.*', 'd2').sync('pagas cada mes');
        W3 = Words(Box(L, M, ty, 'col', { width: tw + 'px' }), 'Y la deuda *casi no baja.*', 'd2').sync('y la deuda casi no baja');
        W4 = Words(Box(L, M, ty, 'col', { width: tw + 'px' }), 'Hoy vas a ver *por qué.*', 'd2').sync('Hoy vas a ver por qué');
        W5 = Words(Box(L, M, V(450, 470), 'col', { width: tw + 'px' }), 'Con tus propios números.', 'd3 muted').sync('con tus propios números');
        const cw = Box(L, V(1272, 280), V(170, 520), '', { width: V(540, 520) + 'px' });
        card = CCard(cw); css(card, { height: V(330, 320) });
        const chH = V(380, 460), chY = V(550, 900);
        CH = chH;
        chart = Box(L, M, chY, 'g1-chart', { width: CW + 'px', height: chH + 'px' });
        chart.append(h('div', { class: 'kicker g1-chart-k' }, 'LO QUE DEBES · MES CON MES'));
        const bw = h('div', { class: 'g1-bars' }), mw = h('div', { class: 'g1-mos' });
        for (let i = 0; i < N; i++) {
          const b = h('div', { class: 'g1-bar' }, h('i', { style: { height: (FR[i] * 100).toFixed(2) + '%' } })); bw.append(b); bars.push(b.firstChild);
          const m = h('div', { class: 'g1-mo' }, h('span', {}, ctx.vertical ? MO[i].slice(0, 1) : MO[i]), h('i', { class: 'g1-ok' })); mw.append(m); mos.push(m);
        }
        flat = h('div', { class: 'g1-flat' }, flatL = h('span', { class: 'g1-flat-l' }, 'CASI NO BAJA'));
        bw.append(flat);
        chart.append(bw, mw);
        sfx(t0 + 0.05, 'whoosh', 0.45); sfx(pg + 0.1, 'tick', 0.45); sfx(pg + 0.7, 'tick', 0.35); sfx(cn + 0.1, 'thud', 0.7);
      },
      update(t) {
        const out = end - 0.45;
        W1.update(t, pg - 0.25); W2.update(t, dd - 0.2); W3.update(t, hv - 0.3); W4.update(t, out); W5.update(t, out);
        inout(card.parentNode, t, t0, V(out, pg + 0.6), { dx: 120, dy: 0, r: 8, din: 0.7, oy: -30 });
        // sin tarjeta, el gráfico se queda; en vertical sube al lugar de la tarjeta
        inout(chart, t, pg - 0.25, out, { dy: 40 });
        if (ctx.vertical) css(chart, { top: lerp(900, 560, P(t, pg + 0.6, 0.6, Ease.move)) });
        const step = (cn - pg - 0.4) / N;
        bars.forEach((b, i) => css(b, { transform: `scaleY(${P(t, pg + i * step, 0.4, Ease.outCubic).toFixed(4)})` }));
        mos.forEach((m, i) => { const p = P(t, pg + 0.05 + i * step, 0.3); css(m, { opacity: p }); });
        // referencia: la altura del primer mes, punteada hasta el último
        const barsH = CH - 44 - 74;
        css(flat, { top: Math.round(barsH * (1 - FR[0])) - 2, transform: `scaleX(${P(t, cn - 0.05, 0.7, Ease.move).toFixed(4)})` });
        css(flatL, { opacity: P(t, cn + 0.5, 0.3) });
        // al decir "por qué", la deuda se atenúa
        css(chart.querySelector('.g1-bars'), { opacity: 1 - 0.55 * P(t, hv, 0.5) });
      },
    });
  }

  // ===================================================================== G1-02 placa: SISTEMA 2 · DEUDA
  {
    const a = c('Esto es Sistema dos').s, dos = c('dos', a).s, de = c('deuda', a).s, end = c('Vas a entender tu pago mínimo').s;
    let K, mark, dbl, two, W, top, fitted = false;
    const FIT = V(1180, 820);
    Scene({
      id: 'g1_placa', start: a - 0.2, end: end - 0.25,
      build(root) {
        const L = layer(root, 'g1-plate');
        K = Box(L, M, V(190, 330), 'kicker acc-k big-k'); K.textContent = 'NIVEL 2 DE LA SERIE';
        const wm = Box(L, M, V(240, 380), 'wm-box', { width: FIT + 'px' });
        mark = h('div', { class: 'wordmark giant' }, 'SISTEMA'); wm.append(mark);
        dbl = h('div', { class: 'dbl' }); wm.append(dbl);
        two = Box(L, V(1512, 120), V(240, 640), 'g1-two', { width: V(300, 230) + 'px', height: V(300, 230) + 'px' }); two.textContent = '2';
        W = Words(Box(L, V(M, 390), V(590, 640), 'col', { width: V(1200, 560) + 'px' }), '*Deuda.*', 'd1 hero').sync('deuda', a);
        top = Box(L, M, V(850, 920), 'g1-topics', { width: CW + 'px' });
        ['PAGO MÍNIMO', 'INTERESES', 'BURÓ'].forEach(s => top.append(h('span', {}, s)));
        sfx(a, 'riser', 0.45); sfx(dos + 0.05, 'thud', 0.8); sfx(de + 0.1, 'strike', 0.35);
      },
      update(t) {
        if (!fitted) { const w = mark.scrollWidth; if (w > 0) { const fs = parseFloat(getComputedStyle(mark).fontSize); css(mark, { fontSize: (fs * FIT / w).toFixed(1) + 'px' }); fitted = true; } }
        const out = end - 0.4;
        inout(K, t, a, out, { dy: 12 });
        const mp = P(t, a + 0.05, 0.8);
        css(mark, { opacity: mp * (1 - P(t, out, 0.3, Ease.exit)), transform: tr(0, (1 - mp) * 60, 1) });
        css(dbl, { transform: `scaleX(${P(t, de - 0.1, 0.6, Ease.move).toFixed(4)})`, opacity: 1 - P(t, out, 0.3, Ease.exit) });
        inout(two, t, dos - 0.05, out, { dy: 0, s0: 1.6, din: 0.4, ein: Ease.snap, r: -8 });
        W.update(t, out);
        inout(top, t, de + 0.3, out, { dy: 16 });
      },
    });
  }

  // ===================================================================== G1-03 lo que vas a lograr hoy + Empecemos
  {
    const a = c('Vas a entender tu pago mínimo').s, b = c('vas a dejar de pagar intereses que no necesitas').s, d = c('y vas a cuidar tu historial en Buró de Crédito').s,
      e = c('Y vas a saber exactamente en qué nivel estás').s, ni = c('nivel estás', e).s, emp = c('Empecemos').s, end = c('Abre ahorita la aplicación').s;
    const G = [
      [a, c('pago mínimo', a).e, 'Entender tu <b>pago mínimo</b>'],
      [b, c('necesitas', b).e, 'Dejar de pagar <b>intereses</b> que no necesitas'],
      [d, c('Buró de Crédito', d).e, 'Cuidar tu historial en <b>Buró de Crédito</b>'],
      [e, c('estás', e).e, 'Saber <b>en qué nivel</b> estás'],
    ];
    let K, rows = [], checks = [], q, E;
    Scene({
      id: 'g1_hoy', start: a - 0.2, end: end - 0.25,
      build(root) {
        const L = layer(root);
        K = Box(L, M, V(190, 290), 'kicker acc-k big-k'); K.textContent = 'HOY VAS A';
        const gl = Box(L, M, V(250, 350), 'g1-goals', { width: V(1120, 820) + 'px' });
        G.forEach(([, , s], i) => {
          const r = h('div', { class: 'g1-goal' }); gl.append(r);
          checks.push(Check(r, V(60, 54)));
          r.append(h('span', { class: 'goal-t', html: s }));
          rows.push(r);
        });
        q = Box(L, V(1500, 120), V(250, 1000), 'g1-q', { width: V(312, 820) + 'px', height: V(486, 230) + 'px' });
        q.append(h('div', { class: 'lvl-n num-d' }, '?'), h('div', { class: 'lvl-k' }, 'TU NIVEL'));
        E = Words(Box(L, 0, V(400, 620), 'col center', { width: V(1920, 1080) + 'px' }), '*Empecemos.*', 'd1 hero').sync('Empecemos');
        G.forEach(([t0, t1]) => sfx(t1 + 0.1, 'check', 0.5)); sfx(ni, 'pop', 0.5); sfx(emp, 'whoosh', 0.55);
      },
      update(t) {
        const out = emp - 0.35;
        inout(K, t, a - 0.1, out, { dy: 12 });
        rows.forEach((r, i) => { inout(r, t, G[i][0] - 0.1, out, { dy: 26 }); checks[i].update(t, G[i][1] - 0.15); });
        inout(q, t, ni - 0.15, out, { dy: 0, s0: 0.85, ein: Ease.outBack, din: 0.5 });
        E.update(t, end - 0.45);
      },
    });
  }

  // ===================================================================== G1-04 abre la app de tu tarjeta y busca cuatro datos
  {
    const a = c('Abre ahorita la aplicación de tu tarjeta de crédito').s, en = c('y entra a tu último estado de cuenta').s, ec = c('estado de cuenta', en).s,
      vt = c('Si tienes varias tarjetas').s, em = c('empieza por la que más usas').s, mu = c('más usas', em).s,
      bc = c('Busca cuatro datos').s, d1 = c('cuánto debes').s, d2 = c('tu pago mínimo', bc).s, d3 = c('el pago para no generar intereses').s, d4 = c('y la fecha límite de pago').s,
      pr = c('El primero lo usas ahorita').s, end = c('En Sistema uno hiciste').s;
    const DT = [d1, d2, d3, d4];
    const FL = [['Saldo al corte', '$ ••,•••.••'], ['Pago mínimo', '$ •,•••.••'], ['Pago para no generar intereses', '$ ••,•••.••'], ['Fecha límite de pago', '•• / •• / ••••']];
    const DL = ['Cuánto debes', 'Tu pago mínimo', 'Pago para no generar intereses', 'Fecha límite de pago'];
    let WA1, WA2, WB1, WB2, WC1, ph, scrA, scrB, target, tap, flds = [], cards = [], cardsBox, pickL, drows, drs = [], nowTag;
    Scene({
      id: 'g1_app', start: a - 0.2, end: end - 0.25,
      build(root) {
        const L = layer(root);
        const tw = V(860, 870);
        WA1 = Words(Box(L, M, V(190, 270), 'col', { width: tw + 'px' }), 'Abre la app de *tu tarjeta de crédito.*', 'd2').sync('Abre ahorita la aplicación de tu tarjeta de crédito');
        WA2 = Words(Box(L, M, V(560, 1470), 'col', { width: tw + 'px' }), 'Entra a tu *último estado de cuenta.*', 'd3 d3-xl').sync('entra a tu último estado de cuenta');
        WB1 = Words(Box(L, M, V(190, 270), 'col', { width: tw + 'px' }), '¿Varias *tarjetas?*', 'd2').sync('Si tienes varias tarjetas');
        WB2 = Words(Box(L, M, V(440, 1460), 'col', { width: tw + 'px' }), 'Empieza por *la que más usas.*', 'd3 d3-xl').sync('empieza por la que más usas');
        WC1 = Words(Box(L, M, V(190, 270), 'col', { width: tw + 'px' }), 'Busca *4 datos.*', 'd2').sync('Busca cuatro datos');
        // tres tarjetas: la que más usas se levanta
        cardsBox = Box(L, V(M, 150), V(620, 1620), 'g1-cards', { width: V(860, 780) + 'px', height: '240px' });
        const CWd = V(250, 230), gap = V(40, 45);
        ['alt', '', 'alt2'].forEach((k, i) => {
          const w = h('div', { class: 'g1-cw', style: { left: (i * (CWd + gap)) + 'px', width: CWd + 'px' } });
          const cc = CCard(w, 'sm ' + k, 'TARJETA'); css(cc, { height: V(158, 146) });
          cardsBox.append(w); cards.push([w, cc]);
        });
        pickL = h('div', { class: 'kicker acc-k g1-pick-l', style: { left: (CWd + gap) + 'px', top: V(196, 182) + 'px' } }, 'LA QUE MÁS USAS');
        cardsBox.append(pickL);
        // lista de los cuatro datos
        drows = Box(L, M, V(360, 1450), 'g1-drows', { width: V(880, 820) + 'px' });
        DL.forEach((s, i) => { const r = h('div', { class: 'g1-drow' }, h('span', { class: 'g1-dn' }, String(i + 1)), h('span', {}, s)); drows.append(r); drs.push(r); });
        nowTag = h('span', { class: 'g1-now' }, 'LO USAS AHORITA'); drs[0].append(nowTag);
        // teléfono
        const pw = Box(L, V(1300, 315), V(150, 560), 'phone-wrap');
        const P1 = Phone(pw, { w: V(450, 600), hgt: V(750, 960) }); ph = P1.el;
        scrA = h('div', { class: 'g1-scr' }); scrB = h('div', { class: 'g1-scr' }); P1.screen.append(scrA, scrB);
        scrA.append(h('div', { class: 'app-head' }, h('span', { class: 'app-logo' }), h('span', {}, 'Mi tarjeta')));
        CCard(scrA, 'sm');
        scrA.append(h('div', { class: 'g1-bal' }, h('div', { class: 'g1-bal-k' }, 'Saldo actual'), h('div', { class: 'g1-bal-v' }, '$ ••,•••.••')));
        const menu = h('div', { class: 'g1-menu' }); scrA.append(menu);
        ['Movimientos', 'Estado de cuenta', 'Pagar tarjeta'].forEach((s, i) => { const r = h('div', { class: 'g1-mi' }, s); menu.append(r); if (i === 1) target = r; });
        tap = h('div', { class: 'tapdot' }); scrA.append(tap);
        scrB.append(h('div', { class: 'g1-st-h' }, 'Estado de cuenta'), h('div', { class: 'g1-st-s' }, 'ÚLTIMO CORTE'));
        FL.forEach(([k, v], i) => {
          const f = h('div', { class: 'g1-fld' }, h('div', { class: 'g1-fld-k' }, k), h('div', { class: 'g1-fld-v' }, v), h('div', { class: 'g1-brk' }), h('div', { class: 'g1-bdg' }, String(i + 1)));
          scrB.append(f); flds.push(f);
        });
        scrB.append(h('div', { class: 'g1-ph-rows' }, h('i'), h('i'), h('i'), h('i')));
        sfx(a + 0.15, 'whoosh', 0.5); sfx(ec - 0.15, 'click', 0.6); sfx(mu, 'pop', 0.45);
        DT.forEach(x => sfx(x + 0.1, 'tick', 0.5)); sfx(pr + 0.2, 'blip', 0.5);
      },
      update(t) {
        const out = end - 0.45;
        const oA = vt - 0.3, oB = bc - 0.3;
        WA1.update(t, oA); WA2.update(t, oA);
        WB1.update(t, oB); WB2.update(t, oB);
        WC1.update(t, out);
        inout(ph.parentNode, t, a + 0.1, out, { dy: 160, din: 0.9, oy: 120 });
        // pantalla A -> toque en "Estado de cuenta" -> pantalla B
        const tTap = ec - 0.25, sw = P(t, ec + 0.15, 0.55, Ease.move);
        css(scrA, { transform: `translate3d(${(-sw * 30).toFixed(2)}%,0,0)`, opacity: 1 - sw });
        css(scrB, { transform: `translate3d(${((1 - sw) * 102).toFixed(2)}%,0,0)` });
        target.classList.toggle('press', t > tTap && t < ec + 0.5);
        if (!tap.__xy && target.offsetWidth) tap.__xy = [target.offsetLeft + target.offsetWidth * 0.4, target.offsetTop + target.offsetHeight / 2];
        if (tap.__xy) { const tp = P(t, tTap - 0.3, 0.3) * (1 - P(t, tTap + 0.35, 0.25)); css(tap, { left: tap.__xy[0], top: tap.__xy[1], opacity: tp, transform: `scale(${lerp(1.5, 1, P(t, tTap - 0.3, 0.3)).toFixed(3)})` }); }
        // tarjetas
        inout(cardsBox, t, vt + 0.25, oB, { dy: 30 });
        cards.forEach(([w, cc], i) => {
          const p = P(t, vt + 0.35 + i * 0.12, 0.5);
          const lift = i === 1 ? P(t, mu - 0.1, 0.45, Ease.outBack) : 0;
          css(w, { opacity: p * (i === 1 ? 1 : 1 - 0.5 * P(t, mu, 0.4)), transform: tr(0, (1 - p) * 30 - lift * 26, 1) });
          cc.classList.toggle('pick', i === 1 && t > mu);
        });
        css(pickL, { opacity: P(t, mu + 0.2, 0.35) });
        // cuatro datos: lista y recuadros en la pantalla
        css(drows, { opacity: (t > bc - 0.2 ? 1 : 0) * (1 - P(t, out, 0.3, Ease.exit)), transform: tr(0, -P(t, out, 0.3, Ease.exit) * 24, 1) });
        drs.forEach((r, i) => {
          const p = P(t, DT[i] - 0.1, 0.45);
          css(r, { opacity: p, transform: tr((1 - p) * -24, 0, 1) });
          r.classList.toggle('dim', t > pr + 0.1 && i > 0);
        });
        const np = P(t, pr + 0.3, 0.4, Ease.outBack);
        css(nowTag, { opacity: np, transform: tr((1 - np) * 30, 0, 1) });
        flds.forEach((f, i) => {
          const p = P(t, DT[i] + 0.05, 0.35, Ease.outBack);
          const br = f.children[2], bd = f.children[3];
          css(br, { opacity: P(t, DT[i] + 0.05, 0.2), transform: `scale(${lerp(1.12, 1, p).toFixed(4)})` });
          css(bd, { opacity: P(t, DT[i] + 0.05, 0.2) });
          f.classList.toggle('hot', i === 0 && t > pr + 0.1);
          css(f, { opacity: t > pr + 0.1 && i > 0 ? 0.4 : 1 });
        });
      },
    });
  }

  // ===================================================================== G1-05 tercera columna: lo que debo
  {
    const a = c('En Sistema uno hiciste').s, hc = c('hiciste dos columnas en las notas').s, le = c('lo que entra', a).s, ls = c('lo que sale', a).s,
      ha = c('Hoy agregas una tercera').s, te = c('tercera', ha).s, ld = c('lo que debo').s, end = c('En qué nivel estás', 50).s;
    let K, H1, H2, card, cols, k1, k2, k3, c3, debt, note, rows12 = [];
    Scene({
      id: 'g1_columnas', start: a - 0.2, end: end - 0.25,
      build(root) {
        const L = layer(root);
        K = Box(L, M, V(190, 270), 'kicker acc-k big-k'); K.textContent = 'LO QUE HICISTE EN SISTEMA 1';
        H1 = Words(Box(L, M, V(236, 316), 'col', { width: CW + 'px' }), 'Dos columnas en *tus notas.*', 'd2').sync('dos columnas en las notas', a);
        H2 = Words(Box(L, M, V(236, 316), 'col', { width: CW + 'px' }), 'Hoy agregas *una tercera.*', 'd2').sync('Hoy agregas una tercera');
        card = Box(L, M, V(430, 600), 'card g1-notes', { width: V(1400, 820) + 'px' });
        card.append(h('div', { class: 'notes-h' }, 'Mi dinero'));
        cols = h('div', { class: 'g1-ncols' }); card.append(cols);
        const mk = (k, items, cls = '') => {
          const kk = h('div', { class: 'ncol-k ' + cls }, k);
          const col = h('div', { class: 'g1-ncol' }, kk);
          items.forEach(([n, v]) => { const r = h('div', { class: 'nrow' }, h('span', {}, n), h('span', { class: 'num' }, v)); col.append(r); rows12.push(r); });
          cols.append(col); return [col, kk];
        };
        [, k1] = mk('LO QUE ENTRA', [['Sueldo', '$ ••,•••'], ['Extra', '$ •,•••']]);
        [, k2] = mk('LO QUE SALE', [['Renta', '$ •,•••'], ['Súper', '$ •,•••'], ['Domicilio', '$ •••'], ['Apps', '$ •••']]);
        [c3, k3] = mk('LO QUE DEBO', [], 'g1-k3');
        c3.classList.add('c3');
        debt = h('div', { class: 'nrow debt' }, h('span', {}, 'Tarjeta'), h('span', { class: 'num' }, '$ ••,•••')); c3.append(debt);
        
        sfx(a, 'tick', 0.5); sfx(te, 'whoosh', 0.45); sfx(ld + 0.1, 'type', 0.5); sfx(ld + 0.6, 'pop', 0.45);
      },
      update(t) {
        const out = end - 0.45;
        inout(K, t, a - 0.1, ha - 0.3, { dy: 12 });
        H1.update(t, ha - 0.3); H2.update(t, out);
        inout(card, t, a + 0.2, out, { dy: 40 });
        rows12.forEach((r, i) => css(r, { opacity: P(t, hc + 0.3 + i * 0.12, 0.35) }));
        k1.classList.toggle('on', t > le - 0.05 && t < ls - 0.1); k2.classList.toggle('on', t > ls - 0.05 && t < ha);
        const p3 = P(t, te - 0.1, 0.7, Ease.move);
        css(cols, { gridTemplateColumns: `1fr 1fr ${(p3 * 1.0).toFixed(4)}fr` });
        css(c3, { opacity: p3 > 0.02 ? P(t, te + 0.2, 0.4) : 0, borderLeftWidth: p3 > 0.02 ? '3px' : '0px', paddingLeft: (p3 * V(24, 14)).toFixed(1) + 'px', paddingRight: (p3 * V(24, 14)).toFixed(1) + 'px' });
        const pd = P(t, ld + 0.2, 0.4);
        css(debt, { opacity: pd, transform: tr((1 - pd) * -16, 0, 1) });
      },
    });
  }

  // ===================================================================== G1-06 la escala de niveles: de −10 a 0
  {
    const a = c('En qué nivel estás', 50).s, z = c('El nivel cero es no deber nada').s, nd = c('no deber nada', z).s, ab = c('Todo lo que está abajo es negativo').s, ng = c('negativo', ab).s,
      me = c('y medirlo es fácil').s, tm = c('toma lo que debes y divídelo entre diez').s, lq = c('lo que debes', tm).s, dv = c('divídelo', tm).s, di = c('diez', tm).s,
      ec = c('Esa cantidad es un nivel').s, un = c('un nivel', ec).s,
      sd = c('Si debes veinte mil pesos').s, vm = c('veinte mil pesos', sd).s, cn = c('cada nivel son dos mil').s, dm = c('dos mil', cn).s,
      sa = c('Si debes algo').s, md = c('menos diez', sa).s, cv = c('Cada vez que bajas tu deuda una décima parte').s, dp = c('décima parte', cv).s, su = c('subes uno', cv).s,
      m9 = c('menos nueve', su).s, m8 = c('menos ocho', su).s, hl = c('hasta llegar a cero', su).s, ce = c('cero', hl).s, end = c('Y no eres el único').s;

    // geometría de la escala
    const G = V({ x: 1010, top: 216, mk: 0, lab: 120, lw: 92, cx: 230, cw: 572 }, { x: 120, top: 540, mk: 0, lab: 120, lw: 92, cx: 240, cw: 580 });
    const RU = 54, SEG = G.cw / 10;
    // posición del marcador (en renglones: 10 = −10, 0 = 0)
    const markRow = t => kf(t, [[su - 0.1, 10], [m9 - 0.05, 9, Ease.move], [m8 - 0.15, 9], [m8 + 0.25, 8, Ease.move], [hl + 0.1, 8], [ce + 0.05, 0, Ease.inOutCubic]]);
    let A1, A2, A3, B1, frm, F1, eqk, F2, F3, Dk, lv, D2, scale, sk1, sk2, axis, rungs = [], segs = [], zero, zchk, dimA, dimAL, dimO, dimOL, mark, mkT, stepL;
    Scene({
      id: 'g1_escala', start: a - 0.2, end: end - 0.25,
      build(root) {
        const L = layer(root);
        const tw = V(700, 870);
        A1 = Words(Box(L, M, V(190, 270), 'col', { width: tw + 'px' }), '¿En qué *nivel* estás?', 'd2').sync('En qué nivel estás', 50);
        A2 = Words(Box(L, M, V(470, 1460), 'col', { width: tw + 'px' }), 'Nivel 0 = *no deber nada.*', 'd3 d3-xl').sync('El nivel cero es no deber nada');
        A3 = Words(Box(L, M, V(600, 1560), 'col', { width: tw + 'px' }), 'Todo lo de abajo es *negativo.*', 'd3 d3-xl').sync('Todo lo que está abajo es negativo');
        B1 = Words(Box(L, M, V(190, 270), 'col', { width: tw + 'px' }), 'Medirlo es *fácil.*', 'd2').sync('y medirlo es fácil');
        // fórmula
        frm = Box(L, M, V(450, 1450), 'card g1-frm', { width: tw + 'px' });
        F1 = Words(frm, 'Lo que debes ÷ 10 = *1 nivel*', 'd3 d3-xl');
        F1.times = [lq, lq + 0.12, lq + 0.2, dv, di, ec + 0.2, un, un + 0.12].map(x => x - 0.06);
        eqk = h('div', { class: 'g1-eqk' }, h('span', { class: 'g1-tagx' }, 'EJEMPLO'), h('span', { class: 'kicker' }, 'SI DEBES $20,000'));
        frm.append(eqk);
        F2 = Words(frm, '$20,000 ÷ 10 = *$2,000*', 'g1-eq');
        F2.times = [vm, cn, cn + 0.1, dm - 0.2, dm].map(x => x - 0.06);
        F3 = Words(frm, 'por nivel', 'g1-eqs'); F3.times = [dm + 0.3, dm + 0.36];
        // nivel de hoy
        Dk = Box(L, M, V(190, 1470), 'kicker acc-k big-k'); Dk.textContent = 'HOY ESTÁS EN';
        lv = Box(L, M - 10, V(240, 1520), 'g1-lv'); lv.textContent = MINUS + '10';
        D2 = Words(Box(L, M, V(560, 270), 'col', { width: tw + 'px' }), 'Cada vez que bajas tu deuda *una décima parte,* subes uno.', 'd3 d3-xl').sync('Cada vez que bajas tu deuda una décima parte subes uno');
        // escala
        scale = Box(L, G.x, G.top, 'g1-scale', { width: (G.cx + G.cw) + 'px', height: (11 * RU) + 'px' });
        sk1 = h('div', { class: 'kicker g1-sk', style: { left: G.lab + 'px', top: '-40px', width: G.lw + 'px', textAlign: 'right' } }, 'NIVEL');
        sk2 = h('div', { class: 'kicker g1-sk', style: { left: G.cx + 'px', top: '-40px' } }, 'LO QUE DEBES');
        scale.append(sk1, sk2);
        axis = h('div', { class: 'g1-axis', style: { left: (G.cx - 8) + 'px', height: (11 * RU) + 'px' } }); scale.append(axis);
        for (let n = 0; n <= 10; n++) {
          const r = h('div', { class: 'g1-rung', style: { top: (n * RU) + 'px' } });
          r.append(h('div', { class: 'g1-rl', style: { left: G.lab + 'px', width: G.lw + 'px' } }, n === 0 ? '0' : MINUS + n));
          const cell = h('div', { class: 'g1-rc', style: { left: G.cx + 'px', width: G.cw + 'px' } });
          const ss = [];
          if (n === 0) { zero = h('div', { class: 'g1-zero' }, 'NO DEBER NADA'); cell.append(zero); zchk = Check(zero, 44); }
          for (let k = 0; k < n; k++) { const s = h('div', { class: 'g1-seg', style: { left: (k * SEG) + 'px', width: (SEG - 4) + 'px' } }); cell.append(s); ss.push(s); }
          r.append(cell); scale.append(r); rungs.push(r); segs.push(ss);
        }
        // cotas bajo el −10
        dimA = h('div', { class: 'g1-dim', style: { left: G.cx + 'px', width: (G.cw - 4) + 'px', top: (11 * RU + 12) + 'px' } }, dimAL = h('span', { class: 'g1-dim-l' }, 'LO QUE DEBES'));
        dimO = h('div', { class: 'g1-dim acc', style: { left: (G.cx + 9 * SEG) + 'px', width: (SEG - 4) + 'px', top: (11 * RU + 52) + 'px' } }, dimOL = h('span', { class: 'g1-dim-l' }, '1 NIVEL'));
        css(dimAL, { left: '50%', transform: 'translateX(-50%)' }); css(dimOL, { right: (SEG + 4) + 'px' });
        scale.append(dimA, dimO);
        mark = h('div', { class: 'g1-mark', style: { left: '0px', width: (G.lab - 4) + 'px' } }, mkT = h('span', {}, 'HOY'));
        scale.append(mark);
        stepL = h('div', { class: 'g1-step', style: { position: 'absolute', left: (G.cx + 9 * SEG + 10) + 'px' } }, '+1');
        scale.append(stepL);
        sfx(a + 0.1, 'whoosh', 0.4); sfx(nd, 'pop', 0.55); sfx(ng, 'tick', 0.4); sfx(di, 'tick', 0.5); sfx(un, 'thud', 0.5);
        sfx(vm, 'blip', 0.4); sfx(dm + 0.05, 'pop', 0.5); sfx(md, 'thud', 0.8); sfx(m9, 'tick', 0.55); sfx(m8 + 0.25, 'tick', 0.55); sfx(ce + 0.1, 'check', 0.7);
      },
      update(t) {
        const out = end - 0.45;
        A1.update(t, me - 0.3); A2.update(t, me - 0.3); A3.update(t, me - 0.3);
        B1.update(t, sa - 0.3);
        inout(frm, t, me + 0.4, sa - 0.3, { dy: 30 });
        F1.update(t);
        css(eqk, { opacity: P(t, sd - 0.05, 0.35) });
        F2.update(t); F3.update(t);
        // nivel de hoy
        inout(Dk, t, sa, out, { dy: 12 });
        const row = markRow(t), lvN = Math.round(row);
        text(Dk, t > cv - 0.1 ? 'TU NIVEL' : 'HOY ESTÁS EN');
        text(lv, lvN === 0 ? '0' : MINUS + lvN);
        lv.classList.toggle('zero', lvN === 0);
        inout(lv, t, md - 0.1, out, { dy: 0, s0: 1.25, din: 0.45, ein: Ease.snap });
        D2.update(t, out);
        // escala: entra y se queda todo el bloque
        inout(scale, t, a - 0.05, out, { dy: 0, dx: 40, din: 0.6 });
        css(sk1, { opacity: P(t, a + 0.3, 0.4) }); css(sk2, { opacity: P(t, ng + 0.2, 0.4) });
        css(axis, { transform: `scaleY(${P(t, a + 0.1, 0.9, Ease.move).toFixed(4)})` });
        rungs.forEach((r, n) => {
          const lab = r.firstChild;
          css(lab, { opacity: P(t, a + 0.15 + n * 0.06, 0.3) });
          r.classList.toggle('cur', t > md - 0.1 && n === lvN);
        });
        const zp = P(t, z + 0.3, 0.45, Ease.move);
        css(zero, { transform: `scaleX(${zp.toFixed(4)})`, opacity: zp > 0 ? 1 : 0 });
        zchk.update(t, ce + 0.1);
        segs.forEach((ss, n) => ss.forEach((s, k) => {
          const p = P(t, ab + 0.3 + (n - 1) * 0.16 + k * 0.025, 0.35, Ease.outCubic);
          css(s, { transform: `scaleX(${p.toFixed(4)})` });
        }));
        // la décima parte: el último bloque del −10
        const one = segs[10][9];
        const hiOne = (t > un - 0.1 && t < sa) || (t > dp - 0.1 && t < m9 + 0.3);
        css(one, { background: hiOne ? 'var(--tinta)' : 'var(--verm)' });
        css(dimA, { opacity: P(t, lq, 0.35) * (1 - P(t, sa - 0.3, 0.3)) });
        text(dimAL, t > vm - 0.1 ? '$20,000 · EJEMPLO' : 'LO QUE DEBES');
        css(dimO, { opacity: P(t, un - 0.1, 0.35) * (1 - P(t, sa - 0.3, 0.3)) });
        text(dimOL, t > dm - 0.1 ? '1 NIVEL = $2,000' : '1 NIVEL');
        // marcador
        const mv = P(t, md - 0.15, 0.4, Ease.outBack);
        css(mark, { top: row * RU, opacity: mv * (1 - P(t, out, 0.3)), transform: tr((1 - mv) * -40, 0, 1) });
        text(mkT, t > cv ? 'TÚ' : 'HOY');
        // +1 junto al −10 cuando sube
        const sp = P(t, su - 0.1, 0.3) * (1 - P(t, m8 - 0.2, 0.3));
        css(stepL, { top: 9 * RU + 14, opacity: sp });
      },
    });
  }

  // ===================================================================== G1-07 no eres el único (ENSAFI)
  {
    const a = c('Y no eres el único').s, se = c('Según la encuesta ENSAFI').s, n = c('el treinta y seis por ciento').s, ad = c('de los adultos en México tenía algún tipo de deuda').s,
      dq = c('Y de quienes tenían deuda').s, ud = c('más de uno de cada cuatro').s, cu = c('cuatro', ud).s, sa = c('se atrasó en algún pago').s, end = c('Mira tu pago mínimo').s;
    let W0, K, row, num, cnt, desc, tally, marks = [], n36, K2, figs = [], W2, W3;
    Scene({
      id: 'g1_ensafi', start: a - 0.2, end: end - 0.25,
      build(root) {
        const L = layer(root);
        W0 = Words(Box(L, M, V(330, 520), 'col', { width: CW + 'px' }), 'No eres *el único.*', 'd1 hero').sync('Y no eres el único');
        K = Box(L, M, V(176, 330), 'kicker acc-k g1-src'); K.textContent = ctx.vertical ? 'ENSAFI 2023 · INEGI Y CONDUSEF' : 'ENCUESTA ENSAFI · INEGI Y CONDUSEF';
        row = Box(L, M - 14, V(206, 380), 'stat-row');
        num = h('span', { class: 'stat-n num-d' }, '0'); cnt = Counter(num, 0, 36);
        const side = h('div', { class: 'stat-side' }, h('span', { class: 'stat-p' }, '%'));
        desc = Words(ctx.vertical ? Box(L, M, 740, 'col', { width: CW + 'px' }) : side, 'de los adultos en México tenía *algún tipo de deuda.*', ctx.vertical ? 'd3 d3-xl' : 'd3 stat-desc').sync('de los adultos en México tenía algún tipo de deuda');
        row.append(num, side);
        tally = Box(L, M, V(744, 1040), 'tally', { width: CW + 'px' });
        const tm = h('div', { class: 'tally-marks' }); for (let i = 0; i < 100; i++) { const m = h('i', { class: i < 36 ? 'on' : '' }); tm.append(m); marks.push(m); }
        tally.append(tm, h('div', { class: 'tally-base' }), h('span', { class: 'tally-lab', style: { left: '0' } }, '0'), h('span', { class: 'tally-lab', style: { right: '0' } }, '100 ADULTOS'));
        n36 = h('span', { class: 'tally-lab n', style: { left: '36%' } }, '36'); tally.append(n36);
        // de quienes tenían deuda: más de 1 de cada 4
        K2 = Box(L, M, V(190, 270), 'kicker acc-k big-k'); K2.textContent = 'DE QUIENES TENÍAN DEUDA';
        W2 = Words(Box(L, M, V(240, 316), 'col', { width: V(800, 870) + 'px' }), 'Más de *1 de cada 4*', 'd2').sync('más de uno de cada cuatro');
        W3 = Words(Box(L, M, V(500, 1070), 'col', { width: V(760, 870) + 'px' }), 'se atrasó en *algún pago.*', 'd3 d3-xl').sync('se atrasó en algún pago');
        const fw = Box(L, V(1180, 120), V(330, 560), 'g1-figs', { width: V(632, 820) + 'px' });
        for (let i = 0; i < 4; i++) { const f = h('div', { class: 'g1-fig' + (i === 0 ? ' on' : '') }, h('span', { class: 'g1-fig-l' }, String(i + 1))); fw.append(f); figs.push(f); }
        if (ctx.vertical) css(fw, { justifyContent: 'center' });
        sfx(a, 'tick', 0.5); sfx(n + 0.1, 'thud', 0.9); sfx(dq, 'whoosh', 0.4); sfx(cu + 0.05, 'pop', 0.6);
      },
      update(t) {
        const mid = dq - 0.35, out = end - 0.45;
        W0.update(t, n - 0.4);
        inout(K, t, se + 0.3, mid, { dy: 12 });
        inout(row, t, n - 0.12, mid, { dy: 50, din: 0.7 });
        cnt.update(t, n + 0.1, 1.2);
        desc.update(t, mid);
        inout(tally, t, n - 0.2, mid, { dy: 24 });
        marks.forEach((m, i) => {
          const on = i < 36;
          const ti = on ? n + 0.1 + (i / 36) * 1.2 : n - 0.2 + i * 0.004;
          css(m, { transform: `scaleY(${P(t, ti, 0.22, Ease.outCubic).toFixed(3)})` });
        });
        css(n36, { opacity: P(t, n + 1.3, 0.3) });
        inout(K2, t, dq, out, { dy: 12 });
        W2.update(t, out); W3.update(t, out);
        figs.forEach((f, i) => {
          inout(f, t, dq + 0.3 + i * 0.12, out, { dy: 40, din: 0.5 });
          if (i === 0) f.classList.toggle('on', t > cu);
        });
      },
    });
  }
})();
