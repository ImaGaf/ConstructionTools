// Exportar el cálculo a PDF o Excel.
//
// Funciona igual en todas las calculadoras sin tocar cada página: lee del DOM las
// entradas (controles con data-state dentro de #calc) y los resultados visibles
// (.big, .stat, .checks, .breakdown, avisos, .working) dentro de #result.
// Las librerías (jsPDF, write-excel-file) se cargan solo al hacer clic.

type Row = { label: string; value: string };
interface Report {
  title: string;
  slug: string;
  url: string;
  date: string;
  inputs: Row[];
  results: Row[];
  checks: Row[];
  breakdown: Row[];
  notes: string[];
  working: string;
  disclaimer: string;
}

const clean = (s: string | null | undefined) => (s ?? '').replace(/\s+/g, ' ').replace(/\(optional\)/i, '').trim();
const visible = (el: Element | null): el is HTMLElement =>
  !!el && !(el as HTMLElement).closest('[hidden]') && (el as HTMLElement).getClientRects().length > 0;

function groupLabel(el: HTMLElement): string {
  const group = el.closest<HTMLElement>('[aria-labelledby], fieldset, .seg, [role="radiogroup"]');
  const by = group?.getAttribute('aria-labelledby');
  if (by) return clean(document.getElementById(by)?.textContent);
  const legend = group?.querySelector('legend');
  if (legend) return clean(legend.textContent);
  const prev = group?.previousElementSibling;
  if (prev?.classList.contains('opt-label')) return clean(prev.textContent);
  return clean(el.closest('.step')?.querySelector('.step-head h2')?.textContent);
}

function readInputs(root: HTMLElement): Row[] {
  const rows: Row[] = [];
  root.querySelectorAll<HTMLInputElement | HTMLSelectElement>('[data-state]').forEach((el) => {
    if (el.closest('[hidden]')) return;
    if (el instanceof HTMLInputElement && el.type === 'radio') {
      if (!el.checked) return;
      const lab = el.closest('label');
      const t = lab?.querySelector('.t')?.textContent ?? lab?.textContent;
      rows.push({ label: groupLabel(el), value: clean(t) });
    } else if (el instanceof HTMLInputElement && el.type === 'checkbox') {
      if (!el.checked) return;
      const lab = el.closest('label');
      rows.push({ label: clean(lab?.querySelector('.t')?.textContent ?? lab?.textContent), value: 'Yes' });
    } else if (el instanceof HTMLSelectElement) {
      rows.push({ label: clean(document.querySelector(`label[for="${el.id}"]`)?.textContent), value: clean(el.selectedOptions[0]?.textContent) });
    } else if (el.value !== '') {
      const label = clean(document.querySelector(`label[for="${el.id}"]`)?.textContent) || el.id;
      const unitEl = el.parentElement?.querySelector('.unit');
      const unit = clean(unitEl?.textContent);
      const before = unitEl && unitEl.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING;
      const value = before ? `${unit}${el.value}` : `${el.value}${unit ? ` ${unit}` : ''}`;
      rows.push({ label: el.id.startsWith('q-') ? `Your quote: ${label}` : label, value });
    }
  });
  return rows.filter((r) => r.label && r.value);
}

function readResults(root: HTMLElement) {
  const results: Row[] = [];
  const checks: Row[] = [];
  const breakdown: Row[] = [];
  const notes: string[] = [];
  root.querySelectorAll<HTMLElement>('.big, .stat').forEach((b) => {
    if (!visible(b)) return;
    const k = clean(b.querySelector('.k')?.textContent);
    const v = clean(b.querySelector('.v')?.textContent);
    if (k && v && v !== '–') results.push({ label: k, value: v });
  });
  root.querySelectorAll<HTMLElement>('.checks li').forEach((li) => {
    if (!visible(li)) return;
    const label = clean(li.firstElementChild?.textContent);
    const v = clean(li.querySelector('strong')?.textContent);
    const tag = clean(li.querySelector('.tag')?.textContent);
    checks.push({ label, value: [v, tag].filter(Boolean).join(' · ') });
  });
  root.querySelectorAll<HTMLElement>('.breakdown li').forEach((li) => {
    const row = li.querySelector('.row');
    if (!row) return;
    breakdown.push({ label: clean(row.firstElementChild?.textContent), value: clean(row.querySelector('strong')?.textContent) });
  });
  root.querySelectorAll<HTMLElement>('.range-note, .alert, .hint').forEach((n) => {
    if (visible(n) && clean(n.textContent)) notes.push(clean(n.textContent));
  });
  const working = clean(root.querySelector('.working')?.textContent);
  return { results, checks, breakdown, notes, working };
}

function collect(): Report {
  const calc = document.getElementById('calc')!;
  const result = document.getElementById('result')!;
  const slug = location.pathname.replace(/\//g, '') || 'calculator';
  return {
    title: clean(document.querySelector('h1')?.textContent),
    slug,
    url: location.href,
    date: new Date().toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' }),
    inputs: readInputs(calc),
    ...readResults(result),
    disclaimer: clean(document.getElementById('disclaimer')?.textContent) ||
      'Results are estimates to help you plan and compare quotes. They are not a substitute for advice from a licensed tradesperson or engineer.',
  };
}

const fileName = (r: Report, ext: string) => `site-sums-${r.slug}-${new Date().toISOString().slice(0, 10)}.${ext}`;

// ---------- Diagrama a PNG (para el PDF) ----------
const STYLE_PROPS = ['fill', 'stroke', 'stroke-width', 'stroke-dasharray', 'stroke-linejoin', 'opacity', 'font-size', 'font-weight', 'font-family', 'letter-spacing', 'paint-order', 'marker-start', 'marker-end'];

async function diagramPng(): Promise<{ data: string; w: number; h: number } | null> {
  const svg = Array.from(document.querySelectorAll<SVGSVGElement>('#result .diagram svg[role="img"]')).find((s) => visible(s));
  if (!svg) return null;
  const vb = svg.viewBox.baseVal;
  if (!vb || !vb.width) return null;
  const clone = svg.cloneNode(true) as SVGSVGElement;
  // Copia los estilos calculados (las clases .dg-* viven en el CSS de la página)
  const src = svg.querySelectorAll<SVGElement>('*');
  const dst = clone.querySelectorAll<SVGElement>('*');
  src.forEach((el, i) => {
    if (!el.getAttribute('class')) return;
    const cs = getComputedStyle(el);
    const style = STYLE_PROPS.map((p) => `${p}:${cs.getPropertyValue(p)}`).join(';');
    dst[i].setAttribute('style', `${style};${dst[i].getAttribute('style') ?? ''}`);
  });
  clone.querySelectorAll('text').forEach((t) => t.setAttribute('font-family', 'Helvetica, Arial, sans-serif'));
  // Patrones y marcadores compartidos
  const defs = document.querySelector('.diagram svg defs, .preview-body svg defs');
  if (defs) clone.insertBefore(defs.cloneNode(true), clone.firstChild);
  const scale = 3;
  clone.setAttribute('width', String(vb.width * scale));
  clone.setAttribute('height', String(vb.height * scale));
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  const xml = new XMLSerializer().serializeToString(clone);
  const url = URL.createObjectURL(new Blob([xml], { type: 'image/svg+xml' }));
  try {
    const img = new Image();
    await new Promise<void>((ok, fail) => { img.onload = () => ok(); img.onerror = () => fail(); img.src = url; });
    const canvas = document.createElement('canvas');
    canvas.width = vb.width * scale;
    canvas.height = vb.height * scale;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#fbfaf7';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    return { data: canvas.toDataURL('image/png'), w: vb.width, h: vb.height };
  } catch {
    return null;
  } finally {
    URL.revokeObjectURL(url);
  }
}

// La fuente estándar del PDF (Helvetica) solo cubre Latin-1: sustituimos lo demás.
const pdfText = (s: string) =>
  s.replace(/⌀/g, 'dia. ').replace(/≥/g, '>=').replace(/≤/g, '<=').replace(/→/g, '->').replace(/−/g, '-')
    .replace(/Σ/g, 'sum ').replace(/[“”]/g, '"').replace(/[‘’]/g, "'").replace(/[^\x00-\xFF–—•…€·×÷²³]/g, '');

async function exportPdf(r: Report) {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const W = 210, M = 14, R = W - M;
  let y = 0;
  const INK: [number, number, number] = [23, 25, 27];
  const ORANGE: [number, number, number] = [242, 107, 29];
  const MUTED: [number, number, number] = [91, 96, 102];

  const header = () => {
    doc.setFillColor(...INK); doc.rect(0, 0, W, 22, 'F');
    doc.setFillColor(...ORANGE); doc.rect(M, 5, 12, 12, 'F');
    doc.setDrawColor(...INK); doc.setLineWidth(1);
    doc.line(M + 2.5, 11, M + 6, 8); doc.line(M + 6, 8, M + 9.5, 11);
    doc.line(M + 2.5, 11, M + 2.5, 15); doc.line(M + 9.5, 11, M + 9.5, 15);
    doc.setFont('helvetica', 'bold'); doc.setFontSize(15);
    doc.setTextColor(242, 239, 233); doc.text('SITE', M + 16, 13.6);
    doc.setTextColor(...ORANGE); doc.text('SUMS', M + 16 + doc.getTextWidth('SITE '), 13.6);
    doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.setTextColor(201, 196, 187);
    doc.text('getsitesums.com', R, 13.4, { align: 'right' });
    y = 32;
  };
  const ensure = (h: number) => { if (y + h > 280) { doc.addPage(); header(); } };
  const section = (name: string) => {
    ensure(14);
    y += 4;
    doc.setFont('helvetica', 'bold'); doc.setFontSize(10.5); doc.setTextColor(194, 65, 12);
    doc.text(name.toUpperCase(), M, y);
    doc.setDrawColor(221, 216, 206); doc.setLineWidth(0.3); doc.line(M, y + 2, R, y + 2);
    y += 8;
  };
  const rows = (list: Row[]) => {
    list.forEach((row) => {
      const val = doc.splitTextToSize(pdfText(row.value), 80) as string[];
      const lab = doc.splitTextToSize(pdfText(row.label), 95) as string[];
      const h = Math.max(val.length, lab.length) * 4.6 + 2.4;
      ensure(h);
      doc.setFont('helvetica', 'normal'); doc.setFontSize(10); doc.setTextColor(...MUTED);
      doc.text(lab, M, y);
      doc.setFont('helvetica', 'bold'); doc.setTextColor(...INK);
      doc.text(val, R, y, { align: 'right' });
      y += h - 2.4;
      doc.setDrawColor(236, 232, 224); doc.setLineWidth(0.2); doc.line(M, y, R, y);
      y += 5;
    });
  };
  const para = (text: string, size = 9.5, font: 'helvetica' | 'courier' = 'helvetica') => {
    doc.setFont(font, 'normal'); doc.setFontSize(size); doc.setTextColor(...MUTED);
    const lines = doc.splitTextToSize(pdfText(text), R - M) as string[];
    lines.forEach((l) => { ensure(5); doc.text(l, M, y); y += size * 0.45; });
    y += 3;
  };

  header();
  doc.setFont('helvetica', 'bold'); doc.setFontSize(20); doc.setTextColor(...INK);
  const tl = doc.splitTextToSize(pdfText(r.title.toUpperCase()), R - M) as string[];
  doc.text(tl, M, y); y += tl.length * 8;
  doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.setTextColor(...MUTED);
  doc.text(`Estimate created ${r.date}`, M, y); y += 4.6;
  doc.setTextColor(194, 65, 12);
  const shortUrl = r.url.length > 110 ? `${r.url.slice(0, 107)}...` : r.url;
  doc.textWithLink('Open this result online: ' + shortUrl, M, y, { url: r.url }); y += 8;

  // Resultado principal destacado
  const main = r.results[0];
  if (main) {
    ensure(26);
    doc.setFillColor(31, 34, 37); doc.rect(M, y, R - M, 22, 'F');
    doc.setFont('helvetica', 'bold'); doc.setFontSize(8.5); doc.setTextColor(201, 196, 187);
    doc.text(pdfText(main.label).toUpperCase(), M + 6, y + 7);
    doc.setFontSize(20); doc.setTextColor(...ORANGE);
    doc.text(pdfText(main.value), M + 6, y + 17);
    y += 28;
  }

  const png = await diagramPng();
  if (png) {
    const w = R - M, h = Math.min(70, (png.h / png.w) * w);
    ensure(h + 4);
    doc.addImage(png.data, 'PNG', M, y, (png.w / png.h) * h, h);
    y += h + 6;
  }

  if (r.results.length > 1) { section('Results'); rows(r.results.slice(1)); }
  if (r.checks.length) { section('Checks'); rows(r.checks); }
  if (r.breakdown.length) { section('Breakdown'); rows(r.breakdown); }
  if (r.inputs.length) { section('Your inputs'); rows(r.inputs); }
  if (r.notes.length) { section('Notes'); r.notes.forEach((n) => para(n)); }
  if (r.working) { section('Working'); para(r.working, 8.5, 'courier'); }
  section('Important'); para(r.disclaimer, 8.5);

  const pages = doc.getNumberOfPages();
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal'); doc.setFontSize(8); doc.setTextColor(...MUTED);
    doc.text(`Site Sums · ${pdfText(r.title)} · page ${i} of ${pages}`, M, 290);
  }
  doc.save(fileName(r, 'pdf'));
}

// ---------- Excel ----------
type Cell = Record<string, unknown> | null;

function valueCells(v: string): [Cell, Cell] {
  const m = v.match(/^\s*(\$)?\s*(-?[\d,]+(?:\.\d+)?)\s*(.*)$/);
  if (!m) return [{ value: v }, null];
  const n = parseFloat(m[2].replace(/,/g, ''));
  const decimals = (m[2].split('.')[1] ?? '').length;
  const fmt = `${m[1] ? '"$"' : ''}#,##0${decimals ? '.' + '0'.repeat(decimals) : ''}`;
  const unit = m[1] ? 'AUD' : m[3].trim();
  return [{ value: n, type: Number, format: fmt, align: 'right' }, unit ? { value: unit, textColor: '#5b6066' } : null];
}

async function exportXlsx(r: Report) {
  const { default: writeExcelFile } = await import('write-excel-file/browser');
  const head = (t: string): Cell[] => [
    { value: t.toUpperCase(), fontWeight: 'bold', textColor: '#f2efe9', backgroundColor: '#17191b', columnSpan: 3 }, null, null,
  ];
  const sub: Cell[] = [
    { value: 'Item', fontWeight: 'bold', backgroundColor: '#ebe7df' },
    { value: 'Value', fontWeight: 'bold', backgroundColor: '#ebe7df', align: 'right' },
    { value: 'Unit / note', fontWeight: 'bold', backgroundColor: '#ebe7df' },
  ];
  const data: Cell[][] = [
    [{ value: `Site Sums · ${r.title}`, fontWeight: 'bold', fontSize: 14, columnSpan: 3 }, null, null],
    [{ value: 'Created' }, { value: r.date }, null],
    [{ value: 'Online result' }, { value: r.url, textColor: '#c2410c', columnSpan: 2 }, null],
    [],
  ];
  const block = (name: string, list: Row[]) => {
    if (!list.length) return;
    data.push(head(name), sub);
    list.forEach((row) => data.push([{ value: row.label, wrap: true }, ...valueCells(row.value)]));
    data.push([]);
  };
  block('Results', r.results);
  block('Checks', r.checks);
  block('Breakdown', r.breakdown);
  block('Your inputs', r.inputs);
  if (r.notes.length) { data.push(head('Notes')); r.notes.forEach((n) => data.push([{ value: n, wrap: true, columnSpan: 3 }, null, null])); data.push([]); }
  if (r.working) { data.push(head('Working')); data.push([{ value: r.working, wrap: true, columnSpan: 3, fontFamily: 'Consolas' }, null, null]); data.push([]); }
  data.push([{ value: r.disclaimer, wrap: true, columnSpan: 3, textColor: '#5b6066' }, null, null]);

  // Las filas vacías necesitan al menos una celda nula
  const sheet = data.map((row) => (row.length ? row : [null]));
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await writeExcelFile(sheet as any, { sheet: 'Estimate', columns: [{ width: 46 }, { width: 18 }, { width: 22 }] }).toFile(fileName(r, 'xlsx'));
}

/** Conecta los botones #export-pdf y #export-xlsx. */
export function setupExport() {
  const status = document.getElementById('export-status');
  const run = async (btn: HTMLButtonElement, kind: 'pdf' | 'xlsx') => {
    btn.disabled = true;
    if (status) status.textContent = kind === 'pdf' ? 'Preparing your PDF…' : 'Preparing your Excel file…';
    try {
      const report = collect();
      if (kind === 'pdf') await exportPdf(report); else await exportXlsx(report);
      if (status) status.textContent = 'Downloaded. Check your downloads folder.';
    } catch (e) {
      console.error(e);
      if (status) status.textContent = 'Sorry, the download failed. Try again, or use the print button.';
    } finally {
      btn.disabled = false;
      if (status) setTimeout(() => (status.textContent = ''), 4000);
    }
  };
  const pdf = document.getElementById('export-pdf') as HTMLButtonElement | null;
  const xlsx = document.getElementById('export-xlsx') as HTMLButtonElement | null;
  pdf?.addEventListener('click', () => run(pdf, 'pdf'));
  xlsx?.addEventListener('click', () => run(xlsx, 'xlsx'));
}

// Para pruebas: expone la recolección de datos.
export { collect as collectReport };
