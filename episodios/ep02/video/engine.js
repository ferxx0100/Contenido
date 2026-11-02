/* SISTEMA · motor de animación determinista.
 * Todo lo que se ve es función del tiempo t (segundos). window.__seek(t) pinta el estado exacto,
 * así el render cuadro por cuadro es reproducible y queda sincronizado con la voz.
 */
(() => {
  'use strict';
  const Q = new URLSearchParams(location.search);
  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const lerp = (a, b, p) => a + (b - a) * p;

  function cubicBezier(x1, y1, x2, y2) {
    const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
    const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
    const sx = t => ((ax * t + bx) * t + cx) * t, sy = t => ((ay * t + by) * t + cy) * t;
    const dx = t => (3 * ax * t + 2 * bx) * t + cx;
    return x => {
      if (x <= 0) return 0; if (x >= 1) return 1;
      let t = x;
      for (let i = 0; i < 8; i++) { const e = sx(t) - x; const d = dx(t); if (Math.abs(e) < 1e-5 || Math.abs(d) < 1e-6) break; t -= e / d; }
      return sy(clamp(t));
    };
  }
  const Ease = {
    linear: t => t,
    outQuad: t => 1 - (1 - t) * (1 - t),
    inQuad: t => t * t,
    outCubic: t => 1 - Math.pow(1 - t, 3),
    inCubic: t => t * t * t,
    inOutCubic: t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
    outQuart: t => 1 - Math.pow(1 - t, 4),
    outQuint: t => 1 - Math.pow(1 - t, 5),
    outExpo: t => t >= 1 ? 1 : 1 - Math.pow(2, -10 * t),
    inOutExpo: t => t <= 0 ? 0 : t >= 1 ? 1 : t < .5 ? Math.pow(2, 20 * t - 10) / 2 : (2 - Math.pow(2, -20 * t + 10)) / 2,
    outBack: t => { const s = 1.4; return 1 + (s + 1) * Math.pow(t - 1, 3) + s * Math.pow(t - 1, 2); },
    // curvas de marca (definidas también en spec): entrada decidida, salida rápida
    enter: cubicBezier(0.16, 1, 0.3, 1),
    exit: cubicBezier(0.7, 0, 0.84, 0),
    move: cubicBezier(0.65, 0, 0.35, 1),
    snap: cubicBezier(0.2, 0.9, 0.1, 1),
  };
  // progreso 0..1 de una animación que empieza en t0 y dura d
  const P = (t, t0, d, e = Ease.enter) => e(clamp((t - t0) / Math.max(1e-6, d)));
  // envolvente entrada/salida
  const env = (t, a, b, din = .45, dout = .3, ei = Ease.enter, eo = Ease.exit) =>
    Math.min(P(t, a, din, ei), 1 - P(t, b - dout, dout, eo));
  // keyframes: [[t, v, ease?], ...]
  function kf(t, frames) {
    if (t <= frames[0][0]) return frames[0][1];
    for (let i = 1; i < frames.length; i++) {
      const [t1, v1, e = Ease.move] = frames[i];
      const [t0, v0] = frames[i - 1];
      if (t <= t1) return lerp(v0, v1, e(clamp((t - t0) / Math.max(1e-6, t1 - t0))));
    }
    return frames[frames.length - 1][1];
  }

  // ---------- DOM ----------
  const SVGNS = 'http://www.w3.org/2000/svg';
  const SVG_TAGS = new Set(['svg', 'g', 'path', 'rect', 'circle', 'line', 'polyline', 'polygon', 'text', 'tspan', 'defs', 'clipPath', 'mask', 'linearGradient', 'stop', 'ellipse', 'pattern', 'use']);
  function h(tag, attrs = {}, ...kids) {
    const isSvg = SVG_TAGS.has(tag);
    const el = isSvg ? document.createElementNS(SVGNS, tag) : document.createElement(tag);
    for (const [k, v] of Object.entries(attrs || {})) {
      if (v == null || v === false) continue;
      if (k === 'class') el.setAttribute('class', v);
      else if (k === 'style' && typeof v === 'object') Object.assign(el.style, v);
      else if (k === 'text') el.textContent = v;
      else if (k === 'html') el.innerHTML = v;
      else el.setAttribute(k, v);
    }
    for (const c of kids.flat()) if (c != null) el.append(c.nodeType ? c : document.createTextNode(String(c)));
    return el;
  }
  // escritura de estilos con caché (evita trabajo de layout si el valor no cambió)
  const CACHE = new WeakMap();
  function css(el, obj) {
    if (!el) return;
    let c = CACHE.get(el); if (!c) { c = {}; CACHE.set(el, c); }
    for (const k in obj) {
      let v = obj[k];
      if (typeof v === 'number' && !['opacity', 'zIndex', 'flexGrow', 'fontWeight'].includes(k)) v = v + 'px';
      if (c[k] !== v) { c[k] = v; el.style[k] = v; }
    }
  }
  function attr(el, obj) {
    let c = CACHE.get(el); if (!c) { c = {}; CACHE.set(el, c); }
    for (const k in obj) { const v = String(obj[k]); if (c['@' + k] !== v) { c['@' + k] = v; el.setAttribute(k, v); } }
  }
  function text(el, s) { let c = CACHE.get(el); if (!c) { c = {}; CACHE.set(el, c); } if (c.__t !== s) { c.__t = s; el.textContent = s; } }
  const tr = (x = 0, y = 0, s = 1, r = 0) => `translate3d(${x.toFixed(2)}px,${y.toFixed(2)}px,0) scale(${s.toFixed(4)}) rotate(${r.toFixed(2)}deg)`;

  // divide un texto en palabras, cada una dentro de una máscara (para revelar desde abajo)
  function splitWords(el, str, cls = 'w') {
    el.textContent = '';
    const out = [];
    str.split(/(\s+)/).forEach(tok => {
      if (/^\s+$/.test(tok)) { el.append(document.createTextNode(' ')); return; }
      if (!tok) return;
      const inner = h('span', { class: cls + '-i' }, tok);
      const mask = h('span', { class: cls + '-m' }, inner);
      el.append(mask); out.push(inner);
    });
    return out;
  }

  // ---------- tiempos de la narración ----------
  const T = window.TIMING;
  const norm = s => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9ñ ]/g, '');
  const WN = T.words.map(w => norm(w.c));
  // cue('cincuenta y cuatro', 40) -> {s, e} del primer match después de t=40
  function cue(phrase, after = 0) {
    const p = norm(phrase).split(/\s+/).filter(Boolean);
    for (let i = 0; i < WN.length; i++) {
      if (T.words[i].s < after - 0.05) continue;
      let ok = true;
      for (let j = 0; j < p.length; j++) if (WN[i + j] !== p[j]) { ok = false; break; }
      if (ok) return { s: T.words[i].s, e: T.words[i + p.length - 1].e, i };
    }
    console.error('cue no encontrado: ' + phrase + ' @' + after);
    return { s: after, e: after + 1, i: -1 };
  }

  // ---------- escenas ----------
  const scenes = [];
  const SFX = [];   // eventos de sonido declarados por las escenas: {t, type, gain}
  const stage = () => document.getElementById('stage');
  function Scene(def) { def.pre ??= 0.5; def.post ??= 0.5; scenes.push(def); return def; }
  function sfx(t, type, gain = 1) { SFX.push({ t: +t.toFixed(3), type, gain }); }

  const FMT = Q.get('fmt') || '16x9';
  const CLIP = { start: +(Q.get('t0') || 0), freeze: +(Q.get('freeze') || 0) };
  const ctx = { fmt: FMT, vertical: FMT === '9x16', Q, cue, sfx };

  let built = false;
  function buildAll() {
    if (built) return; built = true;
    for (const sc of scenes) {
      sc.root = h('div', { class: 'scene', 'data-id': sc.id });
      sc.root.style.display = 'none';
      stage().append(sc.root);
      sc.build(sc.root, ctx);
    }
    for (const fn of (window.__afterBuild || [])) fn(ctx);
  }
  window.__seek = t0 => {
    const tReal = t0 + CLIP.start;
    const t = CLIP.freeze ? Math.min(tReal, CLIP.freeze) : tReal;   // los clips congelan la escena al terminar la narración
    for (const sc of scenes) {
      const vis = t >= sc.start - sc.pre && t <= sc.end + sc.post;
      css(sc.root, { display: vis ? 'block' : 'none' });
      if (vis) sc.update(t, t - sc.start, ctx);
    }
    for (const fn of (window.__overlays || [])) fn(tReal, ctx);
  };
  window.__ready = (async () => {
    await new Promise(r => document.readyState === 'complete' ? r() : addEventListener('load', r));
    buildAll();
    await document.fonts.ready;
  })();

  window.S = { Q, clamp, lerp, Ease, cubicBezier, P, env, kf, h, css, attr, text, tr, splitWords, cue, Scene, scenes, sfx, SFX, ctx, T };
})();
