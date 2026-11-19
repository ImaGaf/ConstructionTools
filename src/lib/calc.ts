// Utilidades compartidas por todas las calculadoras.

/**
 * Pestañas accesibles: clic y flechas izquierda/derecha.
 * Espera botones [role=tab][data-shape] y paneles [data-panel] dentro de `root`.
 * Llama a onChange con la pestaña inicial y en cada cambio.
 */
export function initTabs(root: HTMLElement, initial: string, onChange: (value: string) => void) {
  const tabs = Array.from(root.querySelectorAll<HTMLButtonElement>('[role="tab"][data-shape]'));
  const panels = Array.from(root.querySelectorAll<HTMLElement>('[data-panel]'));
  if (!tabs.length) return;

  const select = (value: string, focus = false) => {
    const tab = tabs.find((t) => t.dataset.shape === value) ?? tabs[0];
    tabs.forEach((t) => {
      const on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
    });
    panels.forEach((p) => (p.hidden = p.dataset.panel !== tab.dataset.shape));
    if (focus) tab.focus();
    onChange(tab.dataset.shape!);
  };

  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => select(tab.dataset.shape!));
    tab.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      e.preventDefault();
      const next = (i + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
      select(tabs[next].dataset.shape!, true);
    });
  });

  select(initial);
}

/** Lee los valores de una lista de inputs/selects por id. */
export function readInputs(ids: string[]): Record<string, string> {
  const out: Record<string, string> = {};
  ids.forEach((id) => {
    const el = document.getElementById(id) as HTMLInputElement | HTMLSelectElement | null;
    if (el && el.value !== '') out[id] = el.value;
  });
  return out;
}

/** Guarda el estado en la URL (sin recargar) para que el resultado se pueda compartir. */
export function syncUrl(state: Record<string, string>) {
  const params = new URLSearchParams(state);
  const url = `${location.pathname}?${params.toString()}`;
  try {
    history.replaceState(null, '', url);
  } catch {
    /* algunos navegadores limitan replaceState; no es crítico */
  }
}

/** Copia la URL actual y muestra un mensaje corto. */
export async function copyLink(status: HTMLElement) {
  try {
    await navigator.clipboard.writeText(location.href);
    status.textContent = 'Link copied.';
  } catch {
    status.textContent = 'Copy the address from your browser bar to share.';
  }
  setTimeout(() => (status.textContent = ''), 3000);
}
