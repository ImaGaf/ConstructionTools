// Configuración central del sitio. Edita aquí y se aplica en todas las páginas.
export const SITE = {
  name: 'Site Sums',
  tagline: 'Free building & renovation calculators for Australians',
  description:
    'Free calculators for Australian building, renovation and plumbing jobs: concrete, tiles, renovation costs, hot water systems and more.',
  contactEmail: 'oswaldoj.tipan@gmail.com',
  locale: 'en_AU',

  // Persona detrás del sitio (E-E-A-T). Completa antes de publicar.
  author: {
    name: 'Oswaldo Tipán',
    initials: 'OT',
    role: 'Software engineering student with residential hydraulic design experience',
    url: '/about/',
  },

  // Cuando AdSense te apruebe, pon aquí tu ID (ca-pub-XXXXXXXXXXXXXXXX).
  // Mientras esté vacío no se carga ningún script de anuncios.
  adsenseClient: '',

  // Analítica opcional. Deja vacío lo que no uses.
  // GA4 directo (gtag.js): vistas de página + eventos de calculadora sin configurar nada más.
  ga4Id: 'G-MXQGSH8YF1',
  // Google Tag Manager: solo si algún día se gestiona todo desde GTM (entonces vaciar ga4Id
  // y configurar GA4 dentro del contenedor). Contenedor creado: GTM-59PV9XBQ.
  gtmId: '',
  cloudflareAnalyticsToken: '', // token de Cloudflare Web Analytics
};

export type IconName =
  | 'slab' | 'driveway' | 'stairs' | 'tile' | 'bath' | 'kitchen' | 'hotwater' | 'gravel' | 'pipe'
  | 'file' | 'sheet' | 'dollar' | 'search' | 'arrow' | 'check' | 'info' | 'link' | 'print' | 'menu' | 'shield' | 'ruler' | 'grid';

export type Category = {
  slug: string;
  name: string;
  title: string; // <title> de la página de categoría
  short: string; // etiqueta corta para filtros
  intro: string; // texto original para la página de categoría (150–300 palabras ideal)
};

export const CATEGORIES: Category[] = [
  {
    slug: 'materials',
    name: 'Materials',
    title: 'Building Materials Calculators (Australia)',
    short: 'Materials',
    intro:
      'Work out how much concrete, tile, gravel and other materials to order before you head to the supplier. Each calculator uses metric units, shows its working, and adds a sensible allowance for waste so you are not caught short halfway through a job. Order a little over rather than under: a second delivery or a trip back to the hardware store usually costs more than the extra material.',
  },
  {
    slug: 'renovation-costs',
    name: 'Renovation costs',
    title: 'Renovation Cost Calculators & Estimators (Australia)',
    short: 'Costs',
    intro:
      'Estimate what a home renovation is likely to cost in Australia before you ask for quotes. These renovation calculators break a project into its main parts so you can see where the money goes and which choices move the total the most. Use the estimates to set a realistic budget and to compare quotes, not as a replacement for them.',
  },
  {
    slug: 'plumbing-hot-water',
    name: 'Plumbing & hot water',
    title: 'Plumbing & Hot Water Calculators (Australia)',
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
    blurb: 'Budget by finish level, benchtop and size, with your own quotes.',
    category: 'renovation-costs',
    icon: 'kitchen',
    ready: true,
    related: ['bathroom-renovation-cost-calculator', 'tile-calculator'],
  },
  {
    slug: 'hot-water-system-replacement-cost',
    title: 'Hot Water Replacement Cost',
    blurb: 'Compare electric, gas, heat pump and solar, with rebates and running costs.',
    category: 'plumbing-hot-water',
    icon: 'hotwater',
    ready: true,
    related: ['bathroom-renovation-cost-calculator', 'pipe-fall-calculator'],
  },
  {
    slug: 'pipe-fall-calculator',
    title: 'Pipe Fall Calculator',
    blurb: 'Fall, grade or run length for drains, with minimum grades by pipe size.',
    category: 'plumbing-hot-water',
    icon: 'pipe',
    ready: true,
    related: ['hot-water-system-replacement-cost', 'bathroom-renovation-cost-calculator'],
  },
  {
    slug: 'gravel-calculator',
    title: 'Gravel, Soil & Sand',
    blurb: 'Cubic metres and tonnes of gravel, road base, sand, soil or mulch.',
    category: 'materials',
    icon: 'gravel',
    ready: true,
    related: ['concrete-calculator', 'concrete-driveway-cost'],
  },
];

// Fotos (Unsplash License: uso comercial gratis, sin atribución obligatoria; igual damos crédito).
// Archivo en /public/images/<clave>.webp (1600 px) y <clave>-sm.webp (800 px).
export const PHOTOS: Record<string, { by: string; alt: string }> = {
  'home-hero': { by: 'Troy Mortier', alt: 'Timber house frame and roof trusses on a new home build in Clyde North, Victoria' },
  'home-band': { by: 'immo RENOVATION', alt: 'Kitchen under renovation with cabinets wrapped in plastic' },
  'about-measure': { by: 'Jimmy Nilsson Masth', alt: 'Tradesperson measuring with a folding rule' },
  'cta-tiler': { by: 'charlesdeluvio', alt: 'Tiler pressing a wall tile into place' },
  'cat-materials': { by: 'Mugabi Owen', alt: 'Workers pouring concrete with a wheelbarrow' },
  'cat-renovation-costs': { by: 'immo RENOVATION', alt: 'Kitchen under renovation' },
  'cat-plumbing-hot-water': { by: 'Rose Galloway Green', alt: 'Blue water pipe and valves in an open trench' },
  'concrete-calculator': { by: 'Hammilton Ojijo', alt: 'Construction workers pouring and levelling a concrete slab' },
  'concrete-price-per-m3': { by: 'Turquo Cabbit', alt: 'Concrete agitator truck on a building site' },
  'concrete-steps-calculator': { by: 'Tile Merchant Ireland', alt: 'Wide outdoor steps leading to a house' },
  'tile-calculator': { by: 'charlesdeluvio', alt: 'Hand holding a white wall tile' },
  'bathroom-renovation-cost-calculator': { by: 'Ela De Pure', alt: 'Finished bathroom with freestanding bath and neutral tiles' },
  'kitchen-renovation-cost-calculator': { by: 'Smart Renovations', alt: 'Renovated white kitchen with black benchtop' },
  'concrete-driveway-cost': { by: 'Salvo Media', alt: 'Modern house with a wide concrete driveway' },
  'hot-water-system-replacement-cost': { by: 'Sergio Martins', alt: 'Hot water tank and heat pump unit on an exterior wall' },
  'pipe-fall-calculator': { by: 'Rose Galloway Green', alt: 'Water pipe laid in an open trench' },
  'gravel-calculator': { by: 'Zoshua Colah', alt: 'Close-up of a pile of light grey crushed gravel' },
};
export const photo = (key: string) => (PHOTOS[key] ? { key, ...PHOTOS[key] } : undefined);

export const getTool = (slug: string) => TOOLS.find((t) => t.slug === slug);
export const getCategory = (slug: string) => CATEGORIES.find((c) => c.slug === slug);
export const toolsIn = (cat: string) => TOOLS.filter((t) => t.category === cat);
