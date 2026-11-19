// Configuración central del sitio. Edita aquí y se aplica en todas las páginas.
export const SITE = {
  name: 'BuildCalc AU', // nombre provisional, cámbialo cuando elijas marca
  tagline: 'Free building & renovation calculators for Australians',
  contactEmail: 'hello@example.com.au',
  // Cuando AdSense te apruebe, pon aquí tu ID (ca-pub-XXXXXXXXXXXXXXXX).
  // Mientras esté vacío no se carga ningún script de anuncios.
  adsenseClient: '',
};

export const TOOLS = [
  {
    slug: 'concrete-calculator',
    title: 'Concrete Calculator',
    blurb: 'Cubic metres and 20 kg bags for slabs, footings and post holes.',
    ready: true,
  },
  {
    slug: 'bathroom-renovation-cost-calculator',
    title: 'Bathroom Renovation Cost Calculator',
    blurb: 'Estimate the cost of a bathroom renovation in Australia.',
    ready: false,
  },
  {
    slug: 'kitchen-renovation-cost-calculator',
    title: 'Kitchen Renovation Cost Calculator',
    blurb: 'Budget your kitchen renovation by size and finish level.',
    ready: false,
  },
  {
    slug: 'tile-calculator',
    title: 'Tile Calculator',
    blurb: 'How many tiles and boxes you need, including waste.',
    ready: false,
  },
  {
    slug: 'hot-water-system-replacement-cost',
    title: 'Hot Water System Replacement Cost',
    blurb: 'Compare electric, gas, heat pump and solar replacement costs.',
    ready: false,
  },
];
