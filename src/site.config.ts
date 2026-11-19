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
    initials: 'OT',
    role: 'Software engineering student with residential hydraulic design experience',
  },

  // Cuando AdSense te apruebe, pon aquí tu ID (ca-pub-XXXXXXXXXXXXXXXX).
  // Mientras esté vacío no se carga ningún script de anuncios.
  adsenseClient: '',

  // Analítica opcional. Deja vacío lo que no uses.
  ga4Id: '', // G-XXXXXXXXXX
  cloudflareAnalyticsToken: '', // token de Cloudflare Web Analytics
};

export type IconName =
  | 'slab' | 'driveway' | 'stairs' | 'tile' | 'bath' | 'kitchen' | 'hotwater' | 'gravel' | 'pipe'
  | 'dollar' | 'search' | 'arrow' | 'check' | 'info' | 'link' | 'print' | 'menu' | 'shield' | 'ruler' | 'grid';

export type Category = {
  slug: string;
  name: string;
  short: string; // etiqueta corta para filtros
  intro: string; // texto original para la página de categoría (150–300 palabras ideal)
};

export const CATEGORIES: Category[] = [
  {
    slug: 'materials',
    name: 'Materials',
    short: 'Materials',
    intro:
      'Work out how much concrete, tile, gravel and other materials to order before you head to the supplier. Each calculator uses metric units, shows its working, and adds a sensible allowance for waste so you are not caught short halfway through a job. Order a little over rather than under: a second delivery or a trip back to the hardware store usually costs more than the extra material.',
  },
  {
    slug: 'renovation-costs',
    name: 'Renovation costs',
    short: 'Costs',
    intro:
      'Estimate what a renovation is likely to cost in Australia before you ask for quotes. These tools break a project into its main parts so you can see where the money goes and which choices move the total the most. Use the estimates to set a realistic budget and to compare quotes, not as a replacement for them.',
  },
  {
    slug: 'plumbing-hot-water',
    name: 'Plumbing & hot water',
    short: 'Plumbing',
    intro:
      'Calculators and cost guides for plumbing and hot water in Australian homes, from sizing and replacing a hot water system to drainage falls. Plumbing and gas work in Australia must be done by a licensed plumber, so use these tools to understand your options and the numbers before you talk to one.',
  },
];

export type Tool = {
  slug: string;
  title: string; // nombre corto para enlaces y migas de pan
  blurb: string;
  category: string; // slug de CATEGORIES
  icon: IconName;
  ready: boolean;
  featured?: boolean;
  related?: string[]; // slugs de otras herramientas
};

export const TOOLS: Tool[] = [
  {
    slug: 'concrete-calculator',
    title: 'Concrete Calculator',
    blurb: 'Cubic metres and premix bags for slabs, footings and post holes.',
    category: 'materials',
    icon: 'slab',
    ready: true,
    featured: true,
    related: ['concrete-price-per-m3', 'concrete-steps-calculator', 'tile-calculator'],
  },
  {
    slug: 'concrete-price-per-m3',
    title: 'Concrete Price per m³',
    blurb: 'Delivered ready-mix cost by city and strength, with short-load and pump fees.',
    category: 'materials',
    icon: 'dollar',
    ready: true,
    related: ['concrete-calculator', 'concrete-steps-calculator'],
  },
  {
    slug: 'concrete-steps-calculator',
    title: 'Concrete Steps Calculator',
    blurb: 'Number of steps, riser and going, and the concrete to pour them.',
    category: 'materials',
    icon: 'stairs',
    ready: true,
    related: ['concrete-calculator', 'tile-calculator'],
  },
  {
    slug: 'bathroom-renovation-cost-calculator',
    title: 'Bathroom Renovation Cost',
    blurb: 'Budget by size, finish level and what you keep.',
    category: 'renovation-costs',
    icon: 'bath',
    ready: true,
    related: ['kitchen-renovation-cost-calculator', 'tile-calculator'],
  },
  {
    slug: 'concrete-driveway-cost',
    title: 'Concrete Driveway Cost',
    blurb: 'Plain, coloured, stamped or exposed aggregate, by city, with removal and crossover.',
    category: 'renovation-costs',
    icon: 'driveway',
    ready: true,
    related: ['concrete-price-per-m3', 'concrete-calculator'],
  },
  {
    slug: 'tile-calculator',
    title: 'Tile Calculator',
    blurb: 'Tiles and boxes for floors and walls, with waste.',
    category: 'materials',
    icon: 'tile',
    ready: true,
    related: ['bathroom-renovation-cost-calculator', 'concrete-calculator'],
  },
  {
    slug: 'kitchen-renovation-cost-calculator',
    title: 'Kitchen Renovation Cost',
    blurb: 'Estimate by kitchen size and finish level.',
    category: 'renovation-costs',
    icon: 'kitchen',
    ready: false,
    related: ['bathroom-renovation-cost-calculator', 'tile-calculator'],
  },
  {
    slug: 'hot-water-system-replacement-cost',
    title: 'Hot Water Replacement Cost',
    blurb: 'Compare electric, gas, heat pump and solar, with rebates and running costs.',
    category: 'plumbing-hot-water',
    icon: 'hotwater',
    ready: true,
    related: ['bathroom-renovation-cost-calculator'],
  },
  {
    slug: 'gravel-calculator',
    title: 'Gravel, Soil & Sand',
    blurb: 'Cubic metres and tonnes for landscaping.',
    category: 'materials',
    icon: 'gravel',
    ready: false,
    related: ['concrete-calculator'],
  },
];

export const getTool = (slug: string) => TOOLS.find((t) => t.slug === slug);
export const getCategory = (slug: string) => CATEGORIES.find((c) => c.slug === slug);
export const toolsIn = (cat: string) => TOOLS.filter((t) => t.category === cat);
