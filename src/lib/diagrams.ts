// Utilidades para dibujar diagramas SVG estilo plano técnico (cotas, textos, formas).
// Los patrones (#pat-concrete, #pat-earth...) y marcadores (#mk-tick) están en DiagramDefs.astro.

const NS = 'http://www.w3.org/2000/svg';

type Attrs = Record<string, string | number>;

/** Crea un elemento SVG con atributos y, opcionalmente, texto. */
export function el(tag: string, attrs: Attrs = {}, text?: string): SVGElement {
  const e = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, String(v));
  if (text !== undefined) e.textContent = text;
  return e;
}

/** Vacía un grupo y devuelve una función para añadirle hijos. */
export function canvas(id: string) {
  const g = document.getElementById(id);
  if (!g) return null;
  g.replaceChildren();
  return (child: SVGElement) => { g.appendChild(child); return child; };
}

const r1 = (n: number) => Math.round(n * 10) / 10;

/** Polígono a partir de una lista de puntos. */
export const poly = (pts: [number, number][]) => pts.map(([x, y]) => `${r1(x)},${r1(y)}`).join(' ');

/**
 * Cota entre dos puntos, desplazada `off` px en perpendicular (positivo = a la izquierda del
 * sentido p1→p2). Dibuja líneas de referencia, la línea de cota con marcas a 45° y el texto
 * alineado con la cota.
 */
export function dim(
  add: (c: SVGElement) => SVGElement,
  x1: number, y1: number, x2: number, y2: number,
  label: string,
  off = 14,
  opts: { textGap?: number; size?: number } = {},
) {
  const dx = x2 - x1, dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len, ny = dx / len; // normal
  const ax = x1 + nx * off, ay = y1 + ny * off, bx = x2 + nx * off, by = y2 + ny * off;
  const ext = off >= 0 ? 4 : -4;
  add(el('path', { class: 'dg-ext', d: `M${r1(x1 + nx * 3)} ${r1(y1 + ny * 3)} L${r1(ax + nx * ext)} ${r1(ay + ny * ext)} M${r1(x2 + nx * 3)} ${r1(y2 + ny * 3)} L${r1(bx + nx * ext)} ${r1(by + ny * ext)}` }));
  add(el('path', { class: 'dg-dim', d: `M${r1(ax)} ${r1(ay)} L${r1(bx)} ${r1(by)}` }));
  let ang = (Math.atan2(dy, dx) * 180) / Math.PI;
  if (ang > 90) ang -= 180;
  if (ang < -90) ang += 180;
  const gap = opts.textGap ?? (off >= 0 ? 9 : -9);
  // El texto va del lado exterior de la cota
  const tx = (ax + bx) / 2 + nx * gap, ty = (ay + by) / 2 + ny * gap;
  const t = el('text', {
    class: 'dg-dimtxt dg-txtbg', x: r1(tx), y: r1(ty),
    'text-anchor': 'middle', 'dominant-baseline': 'middle',
    transform: `rotate(${r1(ang)} ${r1(tx)} ${r1(ty)})`,
    ...(opts.size ? { 'font-size': opts.size } : {}),
  }, label);
  add(t);
}

/** Texto con halo para leerse sobre tramas. */
export function label(add: (c: SVGElement) => SVGElement, x: number, y: number, text: string, cls = 'dg-label', anchor = 'middle') {
  return add(el('text', { class: `${cls} dg-txtbg`, x: r1(x), y: r1(y), 'text-anchor': anchor }, text));
}
