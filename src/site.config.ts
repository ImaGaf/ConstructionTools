// Configuración central del sitio. Edita aquí y se aplica en todas las páginas.
export const SITE = {
  name: 'BuildCalc AU', // nombre provisional, cámbialo cuando elijas marca
  tagline: 'Free building & renovation calculators for Australians',
  description:
    'Free calculators for Australian building, renovation and plumbing jobs: concrete, tiles, renovation costs, hot water systems and more.',
  contactEmail: 'hello@example.com.au',
  locale: 'en_AU',

  // Persona detrás del sitio (E-E-A-T). Completa antes de publicar.
  author: {
    name: 'Oswaldo Tipán',
    role: 'Software engineering student with residential hydraulic design experience',
    url: '/about/',
  },

  // Cuando AdSense te apruebe, pon aquí tu ID (ca-pub-XXXXXXXXXXXXXXXX).
  // Mientras esté vacío no se carga ningún script de anuncios.
  adsenseClient: '',

  // Analítica opcional. Deja vacío lo que no uses.
  ga4Id: '', // G-XXXXXXXXXX
  cloudflareAnalyticsToken: '', // token de Cloudflare Web Analytics
};

export type Tool = {
  slug: string;
  title: string; // nombre corto para enlaces y migas de pan
  blurb: string;
  category: 'Materials' | 'Renovation costs' | 'Plumbing & hot water';
  ready: boolean;
  related?: string[]; // slugs de otras herramientas
};

export const TOOLS: Tool[] = [
  {
    slug: 'concrete-calculator',
    title: 'Concrete Calculator',
    blurb: 'Cubic metres and premix bags for slabs, footings and post holes.',
    category: 'Materials',
    ready: true,
    related: ['tile-calculator', 'bathroom-renovation-cost-calculator'],
  },
  {
    slug: 'bathroom-renovation-cost-calculator',
    title: 'Bathroom Renovation Cost Calculator',
    blurb: 'Estimate the cost of a bathroom renovation in Australia.',
    category: 'Renovation costs',
    ready: false,
    related: ['kitchen-renovation-cost-calculator', 'tile-calculator'],
  },
  {
    slug: 'kitchen-renovation-cost-calculator',
    title: 'Kitchen Renovation Cost Calculator',
    blurb: 'Budget your kitchen renovation by size and finish level.',
    category: 'Renovation costs',
    ready: false,
    related: ['bathroom-renovation-cost-calculator', 'tile-calculator'],
  },
  {
    slug: 'tile-calculator',
    title: 'Tile Calculator',
    blurb: 'How many tiles and boxes you need, including waste.',
    category: 'Materials',
    ready: false,
    related: ['bathroom-renovation-cost-calculator', 'concrete-calculator'],
  },
  {
    slug: 'hot-water-system-replacement-cost',
    title: 'Hot Water System Replacement Cost',
    blurb: 'Compare electric, gas, heat pump and solar replacement costs.',
    category: 'Plumbing & hot water',
    ready: false,
    related: ['bathroom-renovation-cost-calculator'],
  },
];

export const getTool = (slug: string) => TOOLS.find((t) => t.slug === slug);
