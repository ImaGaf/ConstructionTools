// Utilidades compartidas por todas las calculadoras.
//
// Convención: cada control que forma parte del estado lleva `data-state`.
//   - <input type="number" id="s-l" data-state>         → clave = id
//   - <input type="radio" name="shape" value="slab" data-state> → clave = name
// `bindCalculator` lee la URL al cargar, llama a `render(state)` en cada cambio
// y guarda el estado en la URL para que el resultado se pueda compartir.

export type State = Record<string, string>;

function controls(root: HTMLElement) {
  return Array.from(root.querySelectorAll<HTMLInputElement | HTMLSelectElement>('[data-state]'));
}

/** Lee el estado actual de todos los controles con data-state. */
export function readState(root: HTMLElement): State {
  const out: State = {};
  controls(root).forEach((el) => {
    if (el instanceof HTMLInputElement && el.type === 'radio') {
      if (el.checked) out[el.name] = el.value;
    } else if (el.value !== '') {
      out[el.id] = el.value;
    }
  });
  return out;
}

/** Aplica valores (por ejemplo, de la URL) a los controles. */
function applyState(root: HTMLElement, params: URLSearchParams) {
  controls(root).forEach((el) => {
    if (el instanceof HTMLInputElement && el.type === 'radio') {
      const v = params.get(el.name);
      if (v !== null) el.checked = el.value === v;
    } else {
      const v = params.get(el.id);
      if (v !== null) el.value = v;
    }
  });
}

/** Guarda el estado en la URL sin recargar la página. */
export function syncUrl(state: State) {
  const url = `${location.pathname}?${new URLSearchParams(state).toString()}`;
  try {
    history.replaceState(null, '', url);
  } catch {
    /* algunos navegadores limitan replaceState; no es crítico */
  }
}

/**
 * Conecta una calculadora: estado inicial desde la URL, render en cada cambio,
 * URL compartible y botones de copiar enlace / imprimir si existen
 * (#copy-link, #copy-status, #print).
 */
export function bindCalculator(root: HTMLElement, render: (s: State) => void) {
  applyState(root, new URLSearchParams(location.search));
  const run = () => {
    const s = readState(root);
    render(s);
    syncUrl(s);
  };
  root.addEventListener('input', run);
  root.addEventListener('change', run);
  run();

  document.getElementById('copy-link')?.addEventListener('click', () => {
    const status = document.getElementById('copy-status');
    copyLink(status);
  });
  document.getElementById('print')?.addEventListener('click', () => window.print());
}

/** Copia la URL actual y muestra un mensaje corto. */
export async function copyLink(status: HTMLElement | null) {
  try {
    await navigator.clipboard.writeText(location.href);
    if (status) status.textContent = 'Link copied. Paste it anywhere to share this result.';
  } catch {
    if (status) status.textContent = 'Copy the address from your browser bar to share.';
  }
  if (status) setTimeout(() => (status.textContent = ''), 3500);
}

/** Número positivo desde un string (vacío o inválido = 0). */
export const num = (v: string | undefined) => Math.max(0, parseFloat(v ?? '') || 0);

/** Formato australiano con decimales fijos. */
export const fmt = (n: number, d = 2) =>
  n.toLocaleString('en-AU', { minimumFractionDigits: d, maximumFractionDigits: d });

/** Escribe texto en un elemento por id, si existe. */
export const setText = (id: string, text: string) => {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
};
