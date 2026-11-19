// Diagramas de hormigón: losa en isométrico, zapata corrida y hoyo de poste en corte.
import { canvas, dim, el, label, poly } from './diagrams';
import { fmt } from './calc';

type P = [number, number];
const add2 = (a: P, b: P): P => [a[0] + b[0], a[1] + b[1]];
const mul = (a: P, k: number): P => [a[0] * k, a[1] * k];

/** Losa en isométrico, proporcional al largo y ancho, con base de grava y malla. */
export function drawSlab(id: string, L: number, W: number, Tmm: number, box = { w: 380, h: 170 }) {
  const add = canvas(id);
  if (!add || L <= 0 || W <= 0) return;
  const c = Math.cos(Math.PI / 6), s = Math.sin(Math.PI / 6);
  const k = Math.min((box.w - 110) / ((L + W) * c), (box.h - 70) / ((L + W) * s));
  const h = Math.max(7, Math.min(22, (Tmm / 1000) * k * 4)); // espesor exagerado para que se vea
  const base = 7; // capa de grava
  const A: P = mul([-c, s], L * k), B: P = mul([c, s], W * k);
  const ox = box.w / 2 + (A[0] + B[0]) / -2 + 8;
  const O: P = [ox, (box.h - ((L + W) * s * k + h + base)) / 2 - 2];
  const OA = add2(O, A), OB = add2(O, B), OAB = add2(OA, B);
  const dn = (p: P, d: number): P => [p[0], p[1] + d];

  // Base de grava (debajo de la losa)
  add(el('polygon', { points: poly([dn(OA, h), dn(OAB, h), dn(OAB, h + base), dn(OA, h + base)]), fill: 'url(#pat-gravel)', stroke: '#a8977c', 'stroke-width': 0.8 }));
  add(el('polygon', { points: poly([dn(OAB, h), dn(OB, h), dn(OB, h + base), dn(OAB, h + base)]), fill: 'url(#pat-gravel)', stroke: '#a8977c', 'stroke-width': 0.8 }));
  // Caras laterales en corte
  add(el('polygon', { points: poly([OA, OAB, dn(OAB, h), dn(OA, h)]), fill: 'url(#pat-concrete)', class: 'dg-line' }));
  add(el('polygon', { points: poly([OAB, OB, dn(OB, h), dn(OAB, h)]), fill: 'url(#pat-concrete)', class: 'dg-line' }));
  add(el('polygon', { points: poly([OAB, OB, dn(OB, h), dn(OAB, h)]), fill: '#24456e', opacity: 0.1 }));
  // Cara superior
  add(el('polygon', { points: poly([O, OA, OAB, OB]), fill: 'url(#pat-concrete-top)', class: 'dg-line' }));
  // Malla (oculta, en trazos) cada ~1 m, máximo 8 líneas por lado
  const mesh: string[] = [];
  const nA = Math.min(8, Math.max(2, Math.round(L))), nB = Math.min(8, Math.max(2, Math.round(W)));
  for (let i = 1; i < nA; i++) {
    const p = add2(O, mul(A, i / nA));
    mesh.push(`M${p[0].toFixed(1)} ${p[1].toFixed(1)} l${B[0].toFixed(1)} ${B[1].toFixed(1)}`);
  }
  for (let i = 1; i < nB; i++) {
    const p = add2(O, mul(B, i / nB));
    mesh.push(`M${p[0].toFixed(1)} ${p[1].toFixed(1)} l${A[0].toFixed(1)} ${A[1].toFixed(1)}`);
  }
  add(el('path', { d: mesh.join(' '), stroke: '#24456e', 'stroke-width': 0.6, 'stroke-dasharray': '3 3', opacity: 0.45, fill: 'none' }));

  // Cotas
  dim(add, dn(OA, h + base)[0], dn(OA, h + base)[1], dn(OAB, h + base)[0], dn(OAB, h + base)[1], `${fmt(W, 1)} m`, 12);
  dim(add, dn(OAB, h + base)[0], dn(OAB, h + base)[1], dn(OB, h + base)[0], dn(OB, h + base)[1], `${fmt(L, 1)} m`, 12);
  dim(add, OA[0], OA[1] + h, OA[0], OA[1], `${Math.round(Tmm)} mm`, -14);
}

/** Zapata corrida en corte transversal, a escala, con terreno y armadura. */
export function drawFooting(id: string, Lm: number, Wmm: number, Dmm: number) {
  const add = canvas(id);
  if (!add || Wmm <= 0 || Dmm <= 0) return;
  const gy = 42; // nivel de terreno
  const k = Math.min(170 / Wmm, 100 / Dmm);
  const w = Wmm * k, d = Dmm * k, x = 190 - w / 2;
  add(el('rect', { x: 10, y: gy, width: 360, height: 128, fill: 'url(#pat-earth)' }));
  add(el('rect', { x: 10, y: gy - 6, width: 360, height: 6, fill: 'url(#pat-grass)' }));
  add(el('path', { d: `M10 ${gy} H370`, stroke: '#6f8f5a', 'stroke-width': 1.5 }));
  add(el('rect', { x, y: gy, width: w, height: d, fill: 'url(#pat-concrete)', class: 'dg-line' }));
  // Armadura: barras inferiores a 50 mm de recubrimiento y estribo superior
  const cover = Math.min(50 * k, d / 4);
  const n = Math.max(2, Math.min(4, Math.round(Wmm / 120)));
  for (let i = 0; i < n; i++) {
    const bx = x + cover + ((w - 2 * cover) * i) / (n - 1);
    add(el('circle', { cx: bx, cy: gy + d - cover, r: 3.2, fill: '#24456e' }));
  }
  add(el('path', { d: `M${x + cover} ${gy + d - cover} H${x + w - cover}`, stroke: '#24456e', 'stroke-width': 1, 'stroke-dasharray': '2 2' }));
  dim(add, x, gy + d, x + w, gy + d, `${Math.round(Wmm)} mm`, 14);
  dim(add, x + w, gy, x + w, gy + d, `${Math.round(Dmm)} mm`, -16);
  label(add, 20, 22, `SECTION · ${fmt(Lm, 1)} m LONG`, 'dg-label', 'start');
  label(add, 366, gy - 10, 'Ground level', 'dg-note', 'end');
}

/** Hoyo de poste en corte, con poste de madera y hormigón a escala. */
export function drawPost(id: string, n: number, diaMm: number, depthMm: number, postMm: number) {
  const add = canvas(id);
  if (!add || diaMm <= 0 || depthMm <= 0) return;
  const gy = 46;
  const k = Math.min(88 / depthMm, 120 / diaMm);
  const w = diaMm * k, d = depthMm * k, x = 170 - w / 2;
  const pw = Math.max(6, Math.min(w - 6, postMm * k));
  add(el('rect', { x: 10, y: gy, width: 360, height: 120, fill: 'url(#pat-earth)' }));
  add(el('rect', { x: 10, y: gy - 6, width: 360, height: 6, fill: 'url(#pat-grass)' }));
  add(el('path', { d: `M10 ${gy} H370`, stroke: '#6f8f5a', 'stroke-width': 1.5 }));
  // Hormigón con la parte superior abombada para escurrir el agua
  add(el('path', { d: `M${x} ${gy} V${gy + d} H${x + w} V${gy} L${170 + pw / 2} ${gy - 5} H${170 - pw / 2} Z`, fill: 'url(#pat-concrete)', class: 'dg-line' }));
  // Poste
  add(el('rect', { x: 170 - pw / 2, y: 8, width: pw, height: gy + d - 8, fill: 'url(#pat-timber)', stroke: '#8a6a45', 'stroke-width': 1.2 }));
  dim(add, x, gy + d, x + w, gy + d, `⌀ ${Math.round(diaMm)} mm`, 13);
  dim(add, x + w, gy, x + w, gy + d, `${Math.round(depthMm)} mm`, -18);
  label(add, 250, 20, `× ${n} ${n === 1 ? 'hole' : 'holes'}`, 'dg-label', 'start');
  label(add, 250, 33, `${Math.round(postMm)} mm post`, 'dg-note', 'start');
}
