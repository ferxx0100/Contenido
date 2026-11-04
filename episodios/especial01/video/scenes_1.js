/* Escenas 01–13 · SISTEMA 1 "A dónde se va tu dinero" */
(() => {
  'use strict';
  const { h, css, attr, text, tr, P, env, kf, Ease, clamp, lerp, cue, Scene, sfx, ctx } = S;
  const { Words, inout, Counter, money, nf0, drawPath, Strike, Check, Phone, Row, DotGrid, Chip, Box } = C;
  const V = (a, b) => (ctx.vertical ? b : a);
  const M = V(288, 120);          // columna de contenido (libro mayor)
  const CW = V(1524, 820);        // ancho útil hasta la regla derecha
  const c = (p, a = 0) => cue(p, a);

  // fondo/escena con capa absoluta
  const layer = (root, cls = '') => { const el = h('div', { class: 'layer ' + cls }); root.append(el); return el; };

  // ===================================================================== S01 cold open
  {
    const t1 = c('Te acaban de pagar').s, t2 = c('Y en unos días').s, t3 = c('Hoy lo vas a saber').s, tEnd = c('Esto se llama Sistema').s;
    const ENTRIES = [['16 NOV', 'RAPPI *RESTAURANTES', -236], ['17 NOV', 'APPLE.COM/BILL', -129], ['18 NOV', 'TIENDA EN LÍNEA', -649], ['19 NOV', 'CAFETERÍA', -58],
      ['21 NOV', 'UBER *VIAJE', -94], ['23 NOV', 'RAPPI *TURBO', -189], ['24 NOV', 'SUSCRIPCIÓN STREAMING', -219], ['26 NOV', 'RAPPI *RESTAURANTES', -276], ['· · ·', '· · ·', 0]];
    const STEP = 0.34, T0 = t2 + 0.4;
    let W1, W2, W3, dayK, dayBars = [], win, inner, rows = [], bal, balV;
    Scene({
      id: 's01', start: 0, end: tEnd - 0.2, pre: 0.2,
      build(root) {
        const L = layer(root);
        W1 = Words(Box(L, M, V(190, 420), 'col', { width: V(1400, 870) + 'px' }), 'Te acaban de *pagar.*', 'd1 hero').sync('Te acaban de pagar');
        W2 = Words(Box(L, M, V(196, 420), 'col', { width: V(1524, 870) + 'px' }), '¿En qué se te fue *el dinero?*', 'd1').sync('en qué se te fue el dinero', t2);
        W3 = Words(Box(L, M, V(330, 700), 'col', { width: V(1524, 870) + 'px' }), 'Hoy lo vas *a saber.*', 'd1 hero').sync('Hoy lo vas a saber');
        const dk = Box(L, V(1412, 120), V(150, 290), 'daycount', { width: '400px' });
        dayK = h('div', { class: 'kicker daycount-k' }, 'DÍA 1 DE 15'); dk.append(dayK);
        const bars = h('div', { class: 'daycount-bars' }); for (let i = 0; i < 15; i++) { const b = h('i'); bars.append(b); dayBars.push(b); } dk.append(bars);
        win = Box(L, 0, V(702, 1350), 'ledger', { width: V(1920, 1080) + 'px', height: V(216, 324) + 'px' });
        inner = h('div', { class: 'ledger-in' }); win.append(inner);
        const mk = (d, n, a, cls = '') => { const r = h('div', { class: 'lrow ' + cls }, h('span', { class: 'l-date' }, d), h('span', { class: 'l-con' }, n), h('span', { class: 'l-amt num' }, a === 0 ? '' : (a > 0 ? '+' : '') + money(a))); inner.append(r); rows.push(r); };
        mk('15 NOV', 'ABONO · NÓMINA QUINCENAL', 12480, 'first');
        ENTRIES.forEach(([d, n, a]) => mk(d, n, a));
        bal = Box(L, M, V(926, 1700), 'lbal', { width: V(1524, 870) + 'px' });
        bal.append(h('span', { class: 'kicker' }, 'SALDO DISPONIBLE'), balV = h('span', { class: 'num l-bal' }, '$12,480.00'));
        sfx(t1, 'pop', 0.8); ENTRIES.slice(0, 8).forEach((_, i) => sfx(T0 + i * STEP, 'type', 0.22)); sfx(t3, 'whoosh', 0.6);
      },
      update(t) {
        W1.update(t, t2 - 0.12);
        W2.update(t, t3 - 0.3);
        W3.update(t, tEnd - 0.45);
        const out = t3 - 0.3, fo = 1 - P(t, out, 0.3, Ease.exit);
        rows.forEach((r, i) => {
          const ti = i === 0 ? t1 + 0.45 : T0 + (i - 1) * STEP;
          css(r, { opacity: P(t, ti, 0.25, Ease.outCubic) * fo });
          r.classList.toggle('typing', i > 0 && t >= ti && t < ti + STEP);
        });
        // el libro sube un renglón por asiento: siempre 4 renglones visibles
        const n = clamp(Math.floor((t - T0) / STEP) + 2, 1, rows.length);
        const target = Math.max(0, n - 4) * 54;
        const prev = Math.max(0, n - 5) * 54;
        const ps = P(t, T0 + (n - 2) * STEP, 0.22, Ease.outCubic);
        css(inner, { transform: tr(0, -lerp(prev, target, ps), 1) });
        const day = clamp(1 + Math.floor(P(t, T0, ENTRIES.length * STEP, Ease.linear) * 12), 1, 13);
        text(dayK, `DÍA ${day} DE 15`);
        dayBars.forEach((b, i) => b.classList.toggle('on', i < day));
        css(dayK.parentNode, { opacity: P(t, t1 + 0.3, 0.4) * fo });
        const v = lerp(12480, 1215.4, P(t, T0, ENTRIES.length * STEP, Ease.inOutCubic));
        text(balV, money(v));
        balV.classList.toggle('low', v < 3000);
        css(bal, { opacity: P(t, T0 - 0.2, 0.35) * fo });
      },
    });
  }

  // ===================================================================== S02 sistema por niveles (portada del capítulo)
  {
    const a = c('Esto se llama Sistema').s, b = c('y funciona por niveles').s, d = c('Cada nivel es un capítulo').s,
      e = c('Este es el nivel uno').s, f = c('encontrar en tu estado').s, end = c('No te saltes').s;
    let K, mark, dbl, ix, rows = [], caps = [], kick, title, fitted = false;
    const LV = [['1', 'A dónde se va tu dinero', 'AQUÍ'], ['2', 'Deuda', 'SIGUIENTE'], ['', '· · ·', ''], ['0', 'No deber nada', 'META']];
    Scene({
      id: 's02', start: a - 0.1, end: end - 0.25,
      build(root) {
        const L = layer(root);
        K = Box(L, M, V(176, 300), 'kicker'); K.textContent = 'FUNCIONA POR NIVELES · CADA NIVEL ES UN CAPÍTULO';
        const wm = Box(L, M, V(226, 360), 'wm-box', { width: CW + 'px' });
        mark = h('div', { class: 'wordmark giant' }, 'SISTEMA'); wm.append(mark);
        dbl = h('div', { class: 'dbl' }); wm.append(dbl);
        kick = Box(L, M, V(640, 760), 'kicker acc-k big-k'); kick.textContent = 'NIVEL 1';
        title = Words(Box(L, M, V(684, 810), 'col', { width: V(800, 870) + 'px' }), 'A dónde se va tu dinero', 'd2 chapter-t').sync('a dónde se va tu dinero', f);
        ix = Box(L, V(1176, 120), V(640, 1130), 'index', { width: V(636, 870) + 'px' });
        ix.append(h('div', { class: 'index-h' }, h('span', {}, 'ÍNDICE'), h('span', {}, 'CAPÍTULO')));
        LV.forEach(([n, label, r], i) => {
          const cap = h('span', { class: 'ix-cap' }, n && n !== '0' ? 'CAP. ' + n : '');
          const row = h('div', { class: 'ix-row' + (n === '0' ? ' goal' : '') }, h('span', { class: 'ix-n' }, n), h('span', { class: 'ix-t' }, label, cap), h('span', { class: 'ix-lead' }), h('span', { class: 'ix-r' }, r));
          ix.append(row); rows.push(row); caps.push(cap);
        });
        sfx(a, 'riser', 0.5); sfx(a + 0.9, 'strike', 0.4); sfx(e, 'tick', 0.7);
      },
      update(t) {
        if (!fitted) { // ajusta el cuerpo para que la tinta mida todo el ancho útil
          const w = mark.scrollWidth; if (w > 0) { const fs = parseFloat(getComputedStyle(mark).fontSize); css(mark, { fontSize: (fs * CW / w).toFixed(1) + 'px' }); fitted = true; }
        }
        const out = end - 0.45;
        const mp = P(t, a + 0.05, 0.9, Ease.enter);
        css(mark, { opacity: mp * (1 - P(t, out, 0.3, Ease.exit)), transform: tr(0, (1 - mp) * 60, 1) });
        css(dbl, { transform: `scaleX(${P(t, a + 0.75, 0.7, Ease.move).toFixed(4)})`, opacity: 1 - P(t, out, 0.3, Ease.exit) });
        inout(K, t, b, out, { dy: 12 });
        inout(ix, t, b + 0.2, out, { dy: 30 });
        rows.forEach((r, i) => { inout(r, t, b + 0.3 + i * 0.12, out, { dy: 18, din: 0.45 }); r.classList.toggle('on', i === 0 && t > e + 0.15); });
        caps.forEach(cp => css(cp, { opacity: P(t, d, 0.4) }));
        inout(kick, t, f, out, { dy: 14 });
        title.update(t, out);
      },
    });
  }

  // ===================================================================== S03 reglas + objetivos
  {
    const a = c('No te saltes al dos').s, b = c('porque el dos se construye').s, o1 = c('Vas a ver tu número exacto').s,
      o2 = c('vas a eliminar lo que', o1).s, emp = c('Empecemos').s, end = c('Abre ahorita').s;
    let lk, ln, W1, W2, g1, g2, ch1, ch2, E;
    Scene({
      id: 's03', start: a - 0.2, end: end - 0.25,
      build(root) {
        const L = layer(root);
        const row = Box(L, M, V(250, 380), 'lockrow', { width: CW + 'px' });
        const one = h('div', { class: 'lvl sel mini' }, h('div', { class: 'lvl-n num' }, '1'), h('div', { class: 'lvl-k' }, 'NIVEL 1'));
        ln = h('div', { class: 'build-arrow' }, h('span', { class: 'build-label' }, 'se construye con lo que encuentres hoy'));
        lk = h('div', { class: 'lvl mini locked' }, h('div', { class: 'lvl-n num' }, '2'), h('div', { class: 'lvl-k' }, 'NIVEL 2'), h('div', { class: 'lock' }));
        row.append(one, ln, lk);
        W1 = Words(Box(L, M, V(560, 780), 'col', { width: CW + 'px' }), 'Hoy vas a:', 'kicker big-k').at(o1 - 0.3);
        g1 = Box(L, M, V(640, 880), 'goal-row'); ch1 = Check(g1, 56); g1.append(h('span', { class: 'goal-t' }, 'Ver tu *número exacto*'.replace(/\*/g, '')));
        g2 = Box(L, M, V(740, 1000), 'goal-row'); ch2 = Check(g2, 56); g2.append(h('span', { class: 'goal-t' }, 'Eliminar lo que te cobran sin que te des cuenta'));
        E = Words(Box(L, 0, V(420, 820), 'col center', { width: V(1920, 1080) + 'px' }), '*Empecemos.*', 'd1').sync('Empecemos');
        sfx(a + 0.4, 'thud', 0.5); sfx(o1 + 0.9, 'check', 0.6); sfx(o2 + 1.2, 'check', 0.6); sfx(emp, 'whoosh', 0.6);
      },
      update(t) {
        const out = emp - 0.35;
        const rp = inout(lk.parentNode, t, a, out, { dy: 30 });
        // candado: pequeño temblor al decir "no te saltes"
        const sh = Math.sin((t - a - 0.4) * 38) * 7 * (1 - P(t, a + 0.4, 0.6, Ease.linear)) * (t > a + 0.4 ? 1 : 0);
        css(lk, { transform: tr(sh, 0, 1) });
        const ap = P(t, b, 0.9, Ease.move);
        css(ln, { '--p': ap.toFixed(4) });
        css(ln.firstChild, { opacity: P(t, b + 0.5, 0.5) });
        W1.update(t, out);
        inout(g1, t, o1, out, { dy: 26 }); ch1.update(t, o1 + 0.7);
        inout(g2, t, o2 + 0.2, out, { dy: 26 }); ch2.update(t, o2 + 1.0);
        E.update(t, end - 0.45);
      },
    });
  }

  // ===================================================================== S04 abre tu app
  {
    const a = c('Abre ahorita').s, tm = c('últimos tres meses').s, sa = c('Mira el saldo').s, dj = c('Déjalo abierto').s, end = c('Y no eres el único').s;
    let ph, K, W1, W2, W3, tab, chip, saldo, brk;
    Scene({
      id: 's04', start: a - 0.2, end: end - 0.25,
      build(root) {
        const L = layer(root);
        K = Box(L, M, V(250, 250), 'kicker acc-k'); K.textContent = 'AHORA MISMO';
        W1 = Words(Box(L, M, V(300, 310), 'col', { width: V(820, 912) + 'px' }), 'Abre la app de *tu banco*', 'd2').sync('Abre ahorita la aplicación de tu banco');
        W2 = Words(Box(L, M, V(566, 460), 'col', { width: V(820, 870) + 'px' }), 'Movimientos · últimos *3 meses*', 'd3 muted').sync('ve a tus movimientos de los últimos tres meses');
        W3 = Words(Box(L, M, V(692, 560), 'col', { width: V(820, 870) + 'px' }), 'Memoriza tu *saldo de hoy.*', 'd3').sync('Mira el saldo que traes hoy');
        const P1 = Phone(Box(L, V(1240, 300), V(150, 760), 'phone-wrap'), { w: V(440, 480), hgt: V(800, 940) });
        ph = P1.el; const s = P1.screen;
        s.append(h('div', { class: 'app-head' }, h('span', { class: 'app-logo' }), h('span', {}, 'Mi banco')));
        saldo = h('div', { class: 'app-balance' }, h('div', { class: 'app-bl' }, 'Saldo disponible'), h('div', { class: 'app-bv num' }, '$ • • • • •'));
        s.append(saldo);
        brk = h('div', { class: 'bracket' }); saldo.append(brk);
        const tabs = h('div', { class: 'app-tabs' }, h('span', {}, 'Inicio'), tab = h('span', { class: 'on' }, 'Movimientos'), h('span', {}, 'Tarjetas'));
        s.append(tabs);
        chip = h('div', { class: 'app-filter' }, 'Últimos 3 meses ▾'); s.append(chip);
        const list = h('div', { class: 'app-list' }); s.append(list);
        [['28 OCT', 'RAPPI*RESTAURANTES', -236], ['27 OCT', 'APPLE.COM/BILL', -129], ['26 OCT', 'CAFETERÍA', -58], ['25 OCT', 'TIENDA EN LÍNEA', -649], ['24 OCT', 'UBER *TRIP', -94], ['22 OCT', 'RAPPI*RESTAURANTES', -189]]
          .forEach(r => Row(list, { date: r[0], name: r[1], amount: r[2] }));
        sfx(a + 0.2, 'whoosh', 0.5); sfx(tm, 'tick', 0.5); sfx(sa + 0.3, 'tick', 0.6);
      },
      update(t) {
        const out = end - 0.5;
        inout(K, t, a, out, { dy: 14 });
        W1.update(t, out); W2.update(t, out); W3.update(t, out);
        inout(ph.parentNode, t, a + 0.1, dj + 0.6, { dy: 140, din: 0.9, oy: 220, dout: 0.6 });
        chip.classList.toggle('on', t > tm);
        const bp = P(t, sa + 0.2, 0.5);
        css(brk, { opacity: bp, transform: `scale(${lerp(1.15, 1, bp).toFixed(3)})` });
      },
    });
  }

  // ===================================================================== S05 Deloitte 54% (regla de 100 marcas)
  {
    const a = c('Y no eres el único').s, src = c('Según Deloitte').s, n = c('el cincuenta y cuatro por ciento').s,
      mit = c('Más de la mitad del país').s, car = c('Esto no es un problema').s, cr2 = c('carácter', car).s, pat = c('es un patrón').s, end = c('El dinero no se te va').s;
    let W0, K, row, num, cnt, desc, tally, marks = [], half, n54, W5, st;
    Scene({
      id: 's05', start: a - 0.2, end: end - 0.25,
      build(root) {
        const L = layer(root);
        W0 = Words(Box(L, M, V(330, 520), 'col', { width: CW + 'px' }), 'No eres *el único.*', 'd1 hero').sync('Y no eres el único', a);
        K = Box(L, M, V(176, 370), 'kicker acc-k'); K.textContent = 'SEGÚN DELOITTE · 2025';
        row = Box(L, M - 14, V(196, 410), 'stat-row');
        num = h('span', { class: 'stat-n num-d' }, '0'); cnt = Counter(num, 0, 54);
        const side = h('div', { class: 'stat-side' }, h('span', { class: 'stat-p' }, '%'));
        desc = Words(ctx.vertical ? Box(L, M, 770, 'col', { width: CW + 'px' }) : side, 'de los mexicanos llega a fin de mes *sin dinero.*', ctx.vertical ? 'd3 d3-xl' : 'd3 stat-desc').sync('de los mexicanos llega a fin de mes sin dinero');
        row.append(num, side);
        tally = Box(L, M, V(744, 1040), 'tally', { width: CW + 'px' });
        const tm = h('div', { class: 'tally-marks' }); for (let i = 0; i < 100; i++) { const m = h('i', { class: i < 54 ? 'on' : '' }); tm.append(m); marks.push(m); }
        half = h('div', { class: 'tally-half' }, h('span', {}, 'LA MITAD'));
        tally.append(tm, h('div', { class: 'tally-base' }), half, h('span', { class: 'tally-lab', style: { left: '0' } }, '0'), h('span', { class: 'tally-lab', style: { right: '0' } }, '100'));
        n54 = h('span', { class: 'tally-lab n', style: { left: '54%' } }, '54'); tally.append(n54);
        W5 = Words(Box(L, M, V(300, 470), 'col', { width: CW + 'px' }), 'No es tu carácter. Es un *patrón.*', 'd1 hero').sync('Esto no es un problema de tu carácter es un patrón', car);
        st = Strike(W5.ws[3], 'strike');
        sfx(n + 0.1, 'thud', 1); sfx(mit, 'tick', 0.6); sfx(cr2 + 0.2, 'strike', 0.7); sfx(pat, 'pop', 0.6);
      },
      update(t) {
        W0.update(t, src - 0.25);
        const out = car - 0.35;
        inout(K, t, src, out, { dy: 12 });
        inout(row, t, n - 0.12, out, { dy: 50, din: 0.7 });
        cnt.update(t, n, 1.3);
        desc.update(t, out);
        inout(tally, t, n - 0.2, out, { dy: 24 });
        marks.forEach((m, i) => {
          const on = i < 54;
          const ti = on ? n + (i / 54) * 1.3 : n - 0.2 + i * 0.004;
          css(m, { transform: `scaleY(${P(t, ti, 0.22, Ease.outCubic).toFixed(3)})` });
        });
        css(half, { opacity: P(t, mit, 0.35) }); css(n54, { opacity: P(t, n + 1.3, 0.3) });
        W5.update(t, end - 0.45);
        st.update(t, cr2 + 0.25);
      },
    });
  }

  // ===================================================================== S06 renta/súper vs cosas chicas
  {
    const a = c('El dinero no se te va').s, v1 = c('Esos los ves').s, v2 = c('los recuerdas').s, v3 = c('hasta te quejas').s,
      sm = c('Se te va en las cosas chicas').s, una = c('una por una').s, end = c('Y esto pasa por tres razones').s;
    let big, tags = [], W1, W2, chips = [];
    const SMALL = [['Café', 58], ['Envío', 49], ['Antojo', 35], ['App', 99], ['Propina', 20], ['Snack', 28], ['Envío', 39], ['Café', 62], ['Botana', 24], ['Juego', 79], ['Extra', 45], ['Refresco', 22]];
    Scene({
      id: 's06', start: a - 0.2, end: end - 0.25,
      build(root) {
        const L = layer(root);
        W1 = Words(Box(L, M, V(176, 370), 'col', { width: CW + 'px' }), 'No se te va en la renta *ni en el súper.*', 'd2').sync('El dinero no se te va en la renta ni en el súper');
        big = Box(L, M, V(470, 680), 'bigblocks', { width: CW + 'px' });
        const b1 = h('div', { class: 'blk' }, h('div', { class: 'blk-k' }, 'RENTA'), h('div', { class: 'blk-v num' }, '$6,500'));
        const b2 = h('div', { class: 'blk' }, h('div', { class: 'blk-k' }, 'SÚPER'), h('div', { class: 'blk-v num' }, '$3,200'));
        big.append(b1, b2);
        const tagRow = Box(L, M, V(846, 1170), 'tagrow', { width: CW + 'px' });
        ['Los ves', 'Los recuerdas', 'Hasta te quejas de ellos'].forEach(s2 => { const tg = h('div', { class: 'tag' }, s2); tagRow.append(tg); tags.push(tg); });
        W2 = Words(Box(L, M, V(176, 370), 'col', { width: CW + 'px' }), 'Se te va en *las cosas chicas,* una por una.', 'd2').sync('Se te va en las cosas chicas que', sm);
        const rain = Box(L, M, V(500, 700), 'rain', { width: CW + 'px' });
        SMALL.forEach(([n, v]) => { const ch = h('div', { class: 'small-chip' }, h('span', {}, n), h('span', { class: 'num leak' }, '−$' + v)); rain.append(ch); chips.push(ch); });
        sfx(a + 0.3, 'tick', 0.4);
        SMALL.forEach((_, i) => sfx(sm + 1.2 + i * 0.32, 'blip', 0.35));
      },
      update(t) {
        const mid = sm - 0.3;
        W1.update(t, mid);
        const bp = inout(big, t, a + 0.2, mid, { dy: 40 });
        tags.forEach((tg, i) => inout(tg, t, [v1, v2, v3][i], mid, { dy: 18, s0: 0.9 }));
        W2.update(t, end - 0.4);
        chips.forEach((ch, i) => {
          const ti = sm + 1.1 + i * 0.32;
          inout(ch, t, ti, end - 0.4, { dy: -50, din: 0.45, s0: 0.85, ein: Ease.outBack });
        });
      },
    });
  }

  // ===================================================================== S07 tres razones
  {
    const a = c('Y esto pasa por tres razones').s, b = c('Las tres las vamos').s, end = c('La primera').s;
    let W1, W2, boxes = [];
    Scene({
      id: 's07', start: a - 0.2, end: end - 0.2,
      build(root) {
        const L = layer(root);
        W1 = Words(Box(L, M, V(250, 380), 'col', { width: CW + 'px' }), 'Tres *razones.*', 'd1').sync('Y esto pasa por tres razones');
        const row = Box(L, M, V(470, 640), 'three', { width: CW + 'px' });
        for (let i = 1; i <= 3; i++) { const bx = h('div', { class: 'reason-slot' }, h('span', { class: 'num' }, String(i).padStart(2, '0'))); row.append(bx); boxes.push(bx); }
        W2 = Words(Box(L, M, V(800, 1180), 'col', { width: CW + 'px' }), 'Las vamos a comprobar *con tu dinero.*', 'd3 muted').sync('Las tres las vamos a comprobar con tu propio dinero');
        boxes.forEach((_, i) => sfx(a + 1.0 + i * 0.18, 'tick', 0.5));
      },
      update(t) {
        W1.update(t, end - 0.45); W2.update(t, end - 0.45);
        boxes.forEach((bx, i) => inout(bx, t, a + 0.9 + i * 0.18, end - 0.45, { dy: 40, s0: 0.9 }));
      },
    });
  }

  // ===================================================================== S08 razón 1: ya no sientes cuando pagas
  {
    const a = c('La primera').s, h1 = c('ya no sientes cuando pagas').s, ef = c('Cuando pagabas en efectivo').s, dol = c('algo parecido al dolor').s,
      dos = c('y eso te hacía pensar dos veces').s, tel = c('Con el teléfono').s, ac = c('acercas').s, su = c('suena').s, ya = c('y ese aviso ya no llega').s,
      est = c('Hay estudios').s, en = c('El efecto no es enorme').s, re = c('pero es real').s, acu = c('y se acumula mes con mes').s, end = c('La segunda').s;
    let K, H1, cash, phone, m1, m2, f1, f2, l1, l2, wave, bars, BL, months = [], W3;
    Scene({
      id: 's08', start: a - 0.2, end: end - 0.25,
      build(root) {
        const L = layer(root);
        K = Box(L, M, V(130, 230), 'kicker acc-k'); K.textContent = 'RAZÓN 01';
        H1 = Words(Box(L, M, V(180, 280), 'col', { width: CW + 'px' }), 'Ya no sientes *cuando pagas.*', 'd2').sync('ya no sientes cuando pagas');
        // dos paneles: efectivo vs teléfono
        cash = Box(L, M, V(400, 560), 'panel', { width: V(700, 870) + 'px' });
        cash.append(h('div', { class: 'panel-k' }, 'EFECTIVO'));
        cash.append(h('div', { class: 'bills' }, h('i'), h('i'), h('i')));
        const me1 = h('div', { class: 'meter' }, h('div', { class: 'meter-k' }, 'Incomodidad al pagar'), h('div', { class: 'meter-bar' }, m1 = h('i')));
        cash.append(me1);
        l1 = h('div', { class: 'panel-note' }, 'algo parecido al dolor → piensas dos veces'); cash.append(l1);
        phone = Box(L, V(1048, 120), V(400, 1180), 'panel', { width: V(764, 870) + 'px' });
        phone.append(h('div', { class: 'panel-k' }, 'TELÉFONO'));
        const ic = h('div', { class: 'tap' }, h('div', { class: 'tap-phone' }), wave = h('div', { class: 'tap-waves' }, h('i'), h('i'), h('i')));
        phone.append(ic);
        const me2 = h('div', { class: 'meter' }, h('div', { class: 'meter-k' }, 'Incomodidad al pagar'), h('div', { class: 'meter-bar' }, m2 = h('i')));
        phone.append(me2);
        l2 = h('div', { class: 'panel-note' }, 'acercas, suena… y ese aviso ya no llega'); phone.append(l2);
        // estudios: barras cualitativas + acumulación mensual
        BL = Box(L, M, V(380, 560), 'study', { width: CW + 'px' });
        BL.append(h('div', { class: 'panel-k' }, 'LO QUE DICEN LOS ESTUDIOS'));
        bars = h('div', { class: 'qbars' },
          h('div', { class: 'qbar' }, h('i', { style: { height: '46%' } }), h('span', {}, 'Con efectivo')),
          h('div', { class: 'qbar hot' }, h('i', { style: { height: '64%' } }), h('span', {}, 'Sin efectivo')));
        BL.append(bars);
        const mm = h('div', { class: 'months' });
        ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN'].forEach((mname, i) => { const col = h('div', { class: 'month' }, h('div', { class: 'mstack' }), h('span', {}, mname)); mm.append(col); months.push(col); });
        BL.append(mm);
        W3 = Words(Box(L, V(1250, 120), V(560, 1640), 'col', { width: V(560, 870) + 'px' }), 'No es enorme. Pero es real *y se acumula.*', 'd3 d3-xl').sync('El efecto no es enorme pero es real y se acumula', en);
        sfx(a, 'tick', 0.6); sfx(ac + 0.05, 'beep', 0.5); sfx(su + 0.05, 'beep', 0.6); sfx(est, 'whoosh', 0.5);
      },
      update(t) {
        const out1 = est - 0.35;
        inout(K, t, a, end - 0.45, { dy: 14 });
        H1.update(t, end - 0.45);
        inout(cash, t, ef - 0.1, out1, { dx: -30, dy: 0 });
        css(m1, { width: (P(t, ef + 2.4, 1.4, Ease.outCubic) * 88).toFixed(2) + '%' });
        css(l1, { opacity: P(t, dol, 0.4) });
        inout(phone, t, tel - 0.1, out1, { dx: 30, dy: 0 });
        css(m2, { width: (P(t, ac, 0.5) * 10).toFixed(2) + '%' });
        const pulse = t > su ? (Math.sin((t - su) * 9) * 0.5 + 0.5) * (1 - P(t, su, 1.6, Ease.linear)) : 0;
        css(wave, { opacity: (P(t, ac, 0.3) * (0.4 + 0.6 * pulse)).toFixed(3) });
        css(l2, { opacity: P(t, ya, 0.4) });
        // estudios
        inout(BL, t, est, end - 0.45, { dy: 30 });
        const bp = P(t, est + 1.2, 0.9);
        bars.querySelectorAll('i').forEach((el, i) => css(el, { transform: `scaleY(${bp.toFixed(4)})` }));
        months.forEach((mo, i) => {
          const st = mo.querySelector('.mstack');
          const p = P(t, acu + i * 0.22, 0.4, Ease.outBack);
          css(st, { height: ((i + 1) * 30 * p).toFixed(1) + 'px' });
          css(mo, { opacity: P(t, acu - 0.2 + i * 0.22, 0.3) });
        });
        W3.update(t, end - 0.45);
      },
    });
  }

  // ===================================================================== S09 razón 2: la quincena (cada bloque es un cargo)
  {
    const a = c('La segunda').s, h2 = c('no gastas igual toda la quincena').s, pr = c('Los primeros días').s, alto = c('porque el saldo está alto').s,
      ul = c('Los últimos días').s, mis = c('Eres la misma persona').s, num = c('nada más cambió el número').s, end = c('Y la tercera').s;
    const N = [5, 4, 4, 3, 3, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1];
    let K, H, W3, chart, cols = [], lab1, lab2, balance, bc;
    Scene({
      id: 's09', start: a - 0.2, end: end - 0.25,
      build(root) {
        const L = layer(root);
        K = Box(L, M, V(176, 300), 'kicker acc-k'); K.textContent = 'RAZÓN 2 DE 3';
        H = Words(Box(L, M, V(214, 340), 'col', { width: V(1100, 870) + 'px' }), 'No gastas igual toda la quincena.', 'd2').sync('no gastas igual toda la quincena');
        W3 = Words(Box(L, M, V(214, 340), 'col', { width: V(1100, 870) + 'px' }), 'Misma persona. *Otro número.*', 'd2').sync('Eres la misma persona nada más cambió el número');
        chart = Box(L, M, V(584, 900), 'qchart', { width: CW + 'px', height: V(378, 560) + 'px' });
        const colsW = h('div', { class: 'qcols' });
        N.forEach((k, i) => { const col = h('div', { class: 'qcol' + (i < 5 ? ' early' : '') }, h('i', { style: { height: (k * 54 - 8) + 'px' } }), h('span', { class: 'num' }, String(i + 1))); colsW.append(col); cols.push(col); });
        chart.append(colsW);
        lab1 = h('div', { class: 'qlab l1' }, 'Primeros días'); chart.append(lab1);
        lab2 = h('div', { class: 'qlab l2' }, 'Últimos días'); chart.append(lab2);
        balance = Box(L, V(1412, 120), V(200, 1560), 'balance-big', { width: V(400, 870) + 'px' });
        balance.append(h('div', { class: 'kicker' }, 'TU SALDO'), bc = h('div', { class: 'num bal-v' }, '$12,480'));
        sfx(a, 'tick', 0.6);
      },
      update(t) {
        const out = end - 0.45;
        inout(K, t, a, out, { dy: 14 });
        H.update(t, mis - 0.3); W3.update(t, out);
        inout(chart, t, pr - 0.3, out, { dy: 24 });
        cols.forEach((col, i) => {
          const ti = i < 5 ? pr + 0.2 + i * 0.14 : i < 10 ? alto + 0.3 + (i - 5) * 0.12 : ul + (i - 10) * 0.12;
          css(col.firstChild, { transform: `scaleY(${P(t, ti, 0.45, Ease.outCubic).toFixed(4)})` });
          col.classList.toggle('late', i >= 10 && t > ul + 0.6);
        });
        css(lab1, { opacity: P(t, pr + 0.3, 0.4) }); css(lab2, { opacity: P(t, ul + 0.2, 0.4) });
        inout(balance, t, pr, out, { dy: 20 });
        const v = lerp(12480, 1215, P(t, pr + 0.4, 9.0, Ease.inOutCubic));
        text(bc, money(v, false));
        css(bc, { color: t > num ? 'var(--verm)' : 'var(--tinta)' });
      },
    });
  }

  // ===================================================================== S10 razón 3: suscripciones 39%
  {
    const a = c('Y la tercera').s, h3 = c('estás pagando cosas que ya no usas').s, mx = c('En México').s, n = c('treinta y nueve por ciento').s,
      lat = c('el porcentaje más alto').s, so = c('Ese cobro sale solo').s, cm = c('cada mes', so).s, si = c('en silencio').s, end = c('Ahora sí').s;
    let K, H, num, cnt, lab, badge, strip, marks = [], W4;
    Scene({
      id: 's10', start: a - 0.2, end: end - 0.25,
      build(root) {
        const L = layer(root);
        K = Box(L, M, V(130, 230), 'kicker acc-k'); K.textContent = 'RAZÓN 03';
        H = Words(Box(L, M, V(180, 280), 'col', { width: CW + 'px' }), 'Pagas cosas que *ya no usas.*', 'd2').sync('estás pagando cosas que ya no usas');
        const nb = Box(L, M - 10, V(330, 470), 'stat mid');
        num = h('span', { class: 'stat-n num' }, '0'); nb.append(num, h('span', { class: 'stat-p' }, '%'));
        cnt = Counter(num, 0, 39);
        lab = Words(Box(L, V(980, 120), V(400, 830), 'col', { width: V(830, 870) + 'px' }), 'de quienes tienen suscripciones paga *alguna que no usa*', 'd3').sync('de quienes tienen suscripciones paga alguna que no usa');
        badge = Box(L, V(980, 120), V(600, 1060), 'badge'); badge.append(h('span', { class: 'num' }, '#1'), h('span', {}, 'el más alto de los países encuestados en América Latina'));
        strip = Box(L, M, V(716, 1300), 'substrip', { width: CW + 'px' });
        ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO'].forEach(mn => {
          const m = h('div', { class: 'sub-m' }, h('span', { class: 'sub-mn' }, mn), h('i', { class: 'sub-dot' }), h('span', { class: 'sub-amt num' }, '−$129'));
          strip.append(m); marks.push(m);
        });
        W4 = Words(Box(L, M, V(852, 1500), 'col', { width: CW + 'px' }), 'Sale solo, cada mes, *en silencio.*', 'd3').sync('Ese cobro sale solo cada mes en silencio');
        sfx(n + 0.1, 'thud', 0.9); sfx(lat + 0.2, 'pop', 0.6);
        marks.forEach((_, i) => sfx(so + 0.3 + i * 0.45, 'blip', 0.25));
      },
      update(t) {
        const out = end - 0.45;
        inout(K, t, a, out, { dy: 14 }); H.update(t, out);
        inout(num.parentNode, t, n - 0.15, out, { dy: 40, s0: 0.92 }); cnt.update(t, n, 1.2);
        lab.update(t, out);
        inout(badge, t, lat, out, { dy: 20, s0: 0.92 });
        inout(strip, t, so - 0.2, out, { dy: 24 });
        marks.forEach((m, i) => { const p = P(t, so + 0.3 + i * 0.45, 0.35); css(m, { opacity: 0.25 + 0.75 * p }); m.classList.toggle('hit', p > 0.5); });
        W4.update(t, out);
      },
    });
  }

  // ===================================================================== S11 ejercicio: buscar en el estado de cuenta
  {
    const a = c('Ahora sí').s, ve = c('Vuelve a tu estado de cuenta').s, rp = c('Busca la palabra Rappi').s, rpW = c('Rappi', rp).s,
      com = c('o el nombre de la aplicación').s, cu = c('Cuenta cuántas veces').s, su = c('y suma el total').s,
      ap = c('Ahora busca la palabra Apple').s, apW = c('Apple', ap).s, ol = c('las suscripciones que activaste').s,
      ti = c('Y busca el nombre de la tienda').s, end = c('Falta una').s;
    let K, H, panel, field, caret, rowsWrap, rows = [], res, side, slots = [], note;
    const DATA = [
      ['02 OCT', 'RAPPI*RESTAURANTES', -236, 'r'], ['03 OCT', 'APPLE.COM/BILL', -129, 'a'], ['04 OCT', 'TIENDA EN LÍNEA', -649, 't'],
      ['06 OCT', 'RAPPI*TURBO', -189, 'r'], ['11 OCT', 'RAPPI*RESTAURANTES', -212, 'r'],
      ['14 OCT', 'APPLE.COM/BILL', -49, 'a'], ['17 OCT', 'TIENDA EN LÍNEA', -399, 't'], ['19 OCT', 'RAPPI*RESTAURANTES', -264, 'r'],
      ['22 OCT', 'APPLE.COM/BILL', -179, 'a'], ['28 OCT', 'TIENDA EN LÍNEA', -1249, 't'],
    ];
    const typeIn = (t, word, t0, d = 0.55) => word.slice(0, Math.round(P(t, t0, d, Ease.linear) * word.length));
    Scene({
      id: 's11', start: a - 0.2, end: end - 0.2,
      build(root) {
        const L = layer(root);
        K = Box(L, M, V(176, 200), 'kicker acc-k'); K.textContent = 'EJERCICIO';
        H = Words(Box(L, M, V(206, 240), 'col', { width: V(1000, 912) + 'px' }), 'Compruébalo *con tu dinero.*', 'd3').sync('vamos a comprobarlo con tu dinero');
        panel = Box(L, M, V(290, 420), 'card statement', { width: V(980, 870) + 'px' });
        panel.append(h('div', { class: 'st-head' }, h('span', {}, 'Estado de cuenta'), h('span', { class: 'muted' }, 'Últimos 3 meses')));
        const search = h('div', { class: 'st-search' }, h('span', { class: 'st-ico' }), field = h('span', { class: 'st-field' }, ''), caret = h('span', { class: 'caret' }));
        panel.append(search);
        rowsWrap = h('div', { class: 'st-rows' }); panel.append(rowsWrap);
        DATA.forEach(d => { const r = Row(rowsWrap, { date: d[0], name: d[1], amount: d[2] }); r.dataset.k = d[3]; rows.push(r); });
        res = h('div', { class: 'st-result' }); panel.append(res);
        side = Box(L, V(1310, 120), V(300, 1340), 'card side', { width: V(470, 870) + 'px' });
        side.append(h('div', { class: 'kicker' }, 'TUS NÚMEROS'));
        [['Comida a domicilio', '4 cargos · $901'], ['Suscripciones', '3 cargos · $357'], ['Tienda en línea', '3 cargos · $2,297'], ['Quincena', 'pendiente']].forEach(([k, v], i) => {
          const s = h('div', { class: 'slot' }, h('span', { class: 'slot-n num' }, String(i + 1)), h('span', { class: 'slot-k' }, k), h('span', { class: 'slot-v num' }, v));
          side.append(s); slots.push(s);
        });
        note = h('div', { class: 'side-note muted' }, 'Cifras de ejemplo. Usa las tuyas.'); side.append(note);
        sfx(ve, 'whoosh', 0.5); sfx(rpW + 0.15, 'type', 0.5); sfx(apW + 0.15, 'type', 0.5); sfx(ti + 1.2, 'type', 0.5);
        sfx(su + 0.4, 'tick', 0.6); sfx(ol + 1.0, 'tick', 0.6); sfx(ti + 2.2, 'tick', 0.6);
      },
      update(t) {
        const out = end - 0.4;
        inout(K, t, a, out, { dy: 14 }); H.update(t, out);
        inout(panel, t, ve - 0.1, 1e9, { dy: 50, din: 0.7 });
        inout(side, t, cu, 1e9, { dx: 40, dy: 0 });
        let q = '', key = '';
        if (t >= ti + 1.0) { q = typeIn(t, 'tienda', ti + 1.0, 0.6); key = 't'; }
        else if (t >= apW) { q = typeIn(t, 'apple', apW + 0.05, 0.45); key = 'a'; }
        else if (t >= rpW) { q = typeIn(t, 'rappi', rpW + 0.05, 0.45); key = 'r'; }
        text(field, q);
        css(caret, { opacity: (Math.floor(t * 2.2) % 2 === 0 || q) ? 1 : 0 });
        const full = (key === 'r' && t > rpW + 0.6) || (key === 'a' && t > apW + 0.6) || (key === 't' && t > ti + 1.7);
        rows.forEach(r => { r.classList.toggle('match', full && r.dataset.k === key); r.classList.toggle('fade', full && r.dataset.k !== key); });
        const summary = key === 'r' && t > su ? '4 cargos · $901 en el mes' : key === 'a' && t > ol + 0.8 ? '3 suscripciones · $357 al mes' : key === 't' && t > ti + 2.0 ? '3 compras · $2,297 en el mes' : '';
        text(res, summary); css(res, { opacity: summary ? 1 : 0 });
        slots.forEach((s, i) => { const on = [su + 0.4, ol + 1.0, ti + 2.2, 1e9][i]; s.classList.toggle('on', t > on); css(s, { opacity: t > on ? 1 : 0.35 }); });
      },
    });
    S.__S11 = { end };
  }

  // ===================================================================== S12 la quincena: primeros 5 vs últimos 5
  {
    const a = c('Falta una').s, lo = c('Localiza el día que te pagaron').s, pr5 = c('los primeros cinco días').s, ul5 = c('Ahora suma los últimos cinco').s,
      cmp = c('Compara los dos números').s, dif = c('Esa diferencia').s, pc = c('en tu propia cuenta').s, end = c('Si en cualquiera').s;
    let W0, cal, days = [], br1, br2, s1, s2, diff, W2;
    Scene({
      id: 's12', start: a - 0.15, end: end - 0.25, pre: 0.1,
      build(root) {
        const L = layer(root);
        W0 = Words(Box(L, M, V(176, 260), 'col', { width: CW + 'px' }), 'Falta una: *la quincena.*', 'd2').sync('Falta una');
        cal = Box(L, M, V(330, 560), 'cal', { width: CW + 'px' });
        for (let i = 1; i <= 15; i++) { const d = h('div', { class: 'day' + (i === 1 ? ' pay' : '') }, h('span', { class: 'num' }, String(i))); cal.append(d); days.push(d); }
        br1 = h('div', { class: 'brk b1' }, s1 = h('span', { class: 'num' }, '$0')); cal.append(br1);
        br2 = h('div', { class: 'brk b2' }, s2 = h('span', { class: 'num' }, '$0')); cal.append(br2);
        diff = Box(L, M, V(660, 1000), 'diff', { width: V(1000, 870) + 'px' });
        diff.append(h('div', { class: 'diff-row' }, h('span', { class: 'kicker' }, 'PRIMEROS 5 DÍAS'), h('span', { class: 'diff-bar a' }), h('span', { class: 'num' }, '$4,820')));
        diff.append(h('div', { class: 'diff-row' }, h('span', { class: 'kicker' }, 'ÚLTIMOS 5 DÍAS'), h('span', { class: 'diff-bar b' }), h('span', { class: 'num' }, '$1,140')));
        diff.append(h('div', { class: 'diff-total' }, h('span', {}, 'Patrón de la quincena'), h('span', { class: 'num acc' }, '+$3,680')));
        W2 = Words(Box(L, V(1340, 120), V(690, 1560), 'col', { width: V(470, 870) + 'px' }), 'En tu *propia cuenta.*', 'd3 d3-xl').sync('en tu propia cuenta');
        sfx(lo + 0.5, 'tick', 0.6); sfx(pr5 + 0.2, 'tick', 0.5); sfx(ul5 + 0.4, 'tick', 0.5); sfx(dif, 'pop', 0.6);
      },
      update(t) {
        const out = end - 0.4;
        W0.update(t, out);
        inout(cal, t, lo - 0.2, out, { dy: 30 });
        days.forEach((d, i) => { const p = P(t, lo + i * 0.04, 0.35); css(d, { opacity: p, transform: tr(0, (1 - p) * 16, 1) }); d.classList.toggle('in1', i < 5 && t > pr5 - 0.2); d.classList.toggle('in2', i >= 10 && t > ul5 + 0.3); });
        const p1 = P(t, pr5 - 0.2, 0.6, Ease.move), p2 = P(t, ul5 + 0.3, 0.6, Ease.move);
        css(br1, { transform: `scaleX(${p1.toFixed(4)})`, opacity: p1 }); css(br2, { transform: `scaleX(${p2.toFixed(4)})`, opacity: p2 });
        text(s1, money(lerp(0, 4820, P(t, pr5, 1.0)), false)); text(s2, money(lerp(0, 1140, P(t, ul5 + 0.5, 0.9)), false));
        inout(diff, t, cmp - 0.1, out, { dy: 30 });
        diff.querySelectorAll('.diff-bar').forEach((b, i) => css(b, { transform: `scaleX(${P(t, cmp + 0.2 + i * 0.15, 0.7).toFixed(4)})` }));
        css(diff.querySelector('.diff-total'), { opacity: P(t, dif, 0.4) });
        W2.update(t, out);
        // 4º número del panel lateral (vive en S11): se completa aquí
        const side = document.querySelector('[data-id="s11"] .side');
        if (side) { const s4 = side.querySelectorAll('.slot')[3]; if (s4) { s4.classList.toggle('on', t > dif); s4.querySelector('.slot-v').textContent = t > dif ? '+$3,680' : 'pendiente'; css(s4, { opacity: t > dif ? 1 : 0.35 }); } }
      },
    });
  }

  // ===================================================================== S13 regla: más de 5 cargos = fuga
  {
    const a = c('Si en cualquiera').s, fu = c('ahí está una parte de tu fuga').s, end = c('Y cuando veas esos números').s;
    let rule, W1, drops = [];
    Scene({
      id: 's13', start: a - 0.2, end: end - 0.25,
      build(root) {
        const L = layer(root);
        rule = Box(L, M, V(250, 420), 'rule', { width: V(1060, 912) + 'px' });
        rule.append(h('div', { class: 'kicker' }, 'REGLA RÁPIDA'));
        rule.append(h('div', { class: 'rule-main' }, h('span', { class: 'num big' }, '+5'), h('span', {}, 'cargos del mismo tipo en un mes')));
        W1 = Words(Box(L, M, V(620, 980), 'col', { width: V(1060, 870) + 'px' }), '= una parte de *!tu! !fuga.!*', 'd2').sync('ahí está una parte de tu fuga');
        const dw = Box(L, V(1380, 760), V(250, 1400), 'drops');
        for (let i = 0; i < 6; i++) { const d = h('i', { class: 'drop' }); dw.append(d); drops.push(d); }
        sfx(a + 0.3, 'tick', 0.6); sfx(fu + 0.3, 'thud', 0.7);
      },
      update(t) {
        const out = end - 0.4;
        inout(rule, t, a, out, { dy: 30 });
        W1.update(t, out);
        drops.forEach((d, i) => {
          const t0 = fu + 0.2 + i * 0.35; const cyc = ((t - t0) % 2.1 + 2.1) % 2.1;
          const vis = t > t0 && t < out;
          css(d, { opacity: vis ? clamp(1 - cyc / 2.1) : 0, transform: tr(i * 34, vis ? cyc * 220 : 0, 1) });
        });
      },
    });
  }
})();
