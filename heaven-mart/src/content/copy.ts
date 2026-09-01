/**
 * Every user-facing string on the page, in one file.
 * Content model (PLAN.md Part 1.6): STATEMENT, PLACARD, SPECIMEN, TICKER, QUOTE.
 * No paragraphs. HARD RULE: no em or en dashes anywhere in this file; use '.', ',' or '·'.
 * Facts come verbatim from the client brief; never invent beyond it.
 */

export const brand = {
  name: 'Heaven Furniture Mart',
  tagline: 'Designed. Crafted. Customized.',
  category: 'Bespoke furniture & interior styling · Chattogram',
  phoneDisplay: '+880 1960-481983',
  phoneTel: '+8801960481983',
  whatsappNumber: '8801960481983',
  email: 'heavenfurnituremart@gmail.com',
  address: 'Agrabad Access Road, Chattogram, Bangladesh',
  mapsQuery: 'Heaven Furniture Mart, Agrabad Access Road, Chattogram',
  social: {
    facebook: 'https://facebook.com/HeavenFurnitureMart',
    instagram: 'https://instagram.com/heaven_furniture_ltd',
    youtube: 'https://youtube.com/@HeavenFurnitureMart',
  },
} as const

/* S1 · statement + specimen row */
export const hero = {
  eyebrow: brand.category,
  /* narrow phones only: the full category line wraps to two lines at 390px,
     which makes the hero read cramped. Same meaning, one line. */
  eyebrowShort: 'Bespoke furniture · Chattogram',
  headline: 'Furniture, Crafted Around You.',
  sub: brand.tagline,
  cta: 'Get a Free Design Consultation',
  /* the same action, short enough not to wrap inside the pill at 390px */
  ctaShort: 'Free Design Consultation',
  specimens: ['EST. 2020', 'AGRABAD · CTG', 'FULLY BESPOKE'],
  /* S1 "The Turntable": the hero's piece is a real 3D object you can grab
     and spin, and it changes as you scroll. Captions stay at CATEGORY level
     on purpose. Heaven demonstrably sells all three categories, so the page
     never claims a specific product it cannot deliver, and the models can be
     swapped for Meshy scans of Heaven's own pieces without touching copy. */
  pieces: [
    { id: 'sofa-velvet', name: 'Velvet Sofa', category: 'Living Room', accent: '#7A8F8A' },
    { id: 'chair-damask', name: 'Accent Armchair', category: 'Bespoke', accent: '#C8A96A' },
    { id: 'sofa-leather', name: 'Leather Lounge', category: 'Office & Study', accent: '#B8956A' },
  ],
  /* only ever rendered once the 3D is genuinely on screen */
  dragHint: 'Drag to spin',
  dragHintSpecimen: '360',
} as const

/* S2 · placard cluster, replaces the old intro paragraph */
export const intro = {
  index: '01',
  title: 'Bespoke Furniture Studio',
  line: 'Built to your space, your size, your taste.',
  specimens: ['EST. 2020', 'AGRABAD, CHATTOGRAM', 'HUNDREDS OF HOMES'],
} as const

/* The one ticker on the page, between S2 and S3 */
export const ticker = ['Designed', 'Crafted', 'Customized'] as const

/* S3 · the pinned bespoke moment */
export const bespoke = {
  index: '02',
  title: 'Bespoke',
  steps: [
    { word: 'Designed.', line: 'Every piece starts with your room and your measurements.' },
    { word: 'Crafted.', line: 'Premium wood. In-house craftsmanship.' },
    { word: 'Customized.', line: 'Your fabric, your finish, your colour.' },
  ],
  /* fabrics Heaven demonstrably sells (their FB albums, 2026-09-01) */
  swatches: [
    { id: 'ivory-boucle', name: 'Ivory Bouclé', hex: '#E8E0D0', accent: '#C8A96A' },
    { id: 'royal-blue-velvet', name: 'Royal Blue Velvet', hex: '#2B3F8F', accent: '#5D74D6' },
    { id: 'emerald-velvet', name: 'Emerald Velvet', hex: '#1F4A3A', accent: '#5E8C7A' },
  ],
  /* specimen: fed live by the 3D model's real bounding box later */
  dimensions: ['2400 MM', 'SEAT H 430 MM', 'YOUR SIZE, ALWAYS'],
  cta: 'Get my free design consultation',
  /* S3b: the 360 inspect affordance, shown only when the 3D actually armed */
  inspect: 'Drag to inspect · 360',
} as const

/* S4 · collections, placards over photos */
export const collections = {
  index: '03',
  title: 'Collections',
  /* detail chips reflect Heaven's real premium ranges seen on their Facebook */
  items: [
    { num: '01', name: 'Living Room', detail: 'SOFA SETS · COFFEE TABLES · TV UNITS', img: 'living-01-beige-set', accent: '#7A8F8A' },
    { num: '02', name: 'Bedroom', detail: 'PREMIUM KING BEDS · WARDROBES · DRESSERS', img: 'bedroom-01-royal-bed', accent: '#6B5138' },
    { num: '03', name: 'Dining', detail: 'KING DINING SETS · CHAIRS · CABINETS', img: 'dining-01-cream', accent: '#B8956A' },
    { num: '04', name: 'Office & Study', detail: 'EXECUTIVE DESKS · BOOKSHELVES', img: 'office-storage-01-black-cabinet', accent: '#4E5754' },
    { num: '05', name: 'Bespoke', detail: 'FULL ROOMS · YOUR SIZE · YOUR TASTE', img: 'bespoke-chairs-01', accent: '#C8A96A' },
  ],
} as const

/* S1c · the AR hook pill in the hero. An invitation, not the AR session:
   model-viewer above the fold would wreck LCP and the ad funnel path. */
export const arHook = {
  label: 'See it in your room',
  specimen: 'AR · POINT YOUR PHONE',
} as const

/* S1d · "The Index" navigation. Category names come from collections.items
   so the nav and S4 can never disagree. */
export const nav = {
  open: 'Index',
  close: 'Close',
  overlayLabel: 'Browse collections',
  footerHeading: 'Collections',
  cta: 'Consult on WhatsApp',
} as const

/* S5 · showroom */
export const showroom = {
  index: '04',
  title: 'Step into our showroom',
  specimens: ['AGRABAD ACCESS ROAD', 'CHATTOGRAM', 'OPEN DAILY'],
  directions: 'Get directions',
} as const

/* S6 · AR */
export const ar = {
  index: '05',
  title: 'See it in your room',
  line: 'Point your phone at your living room. See exactly how it fits before we build it.',
  button: 'View in your room',
  loading: 'Opening the viewer',
  failed: 'Could not load. Tap to retry',
  alt: 'A bespoke velvet sofa, viewable in 3D and placeable in your own room.',
  /* Honest about the ladder rather than promising every device: Android and
     WebXR headsets can place the piece; an iPhone turns it in 3D until a USDZ
     export exists (ASSETS.md); a desktop is asked to use a phone. */
  support: 'ANDROID · AR IN YOUR ROOM. IPHONE & DESKTOP · 3D VIEW.',
} as const

/* S7 · proof. The quote is the ONLY long text on the page. */
export const proof = {
  quote:
    'At Heaven Furniture Mart, we believe furniture is more than just function; it is a reflection of lifestyle, taste, and comfort. Every piece we create is designed to bring lasting elegance into the homes of our clients.',
  quoteBy: 'Abul Kalam Bhuiyan',
  quoteRole: 'Managing Director',
  milestones: [
    { year: '2020', event: 'Founded by Abul Kalam Bhuiyan' },
    { year: '2021', event: 'Opened the Agrabad showroom' },
    { year: '2024', event: 'International Furniture Fair, Chattogram' },
    { year: '2025', event: 'Member, Chamber of Commerce' },
    { year: '2026', event: 'Nationwide BFIOA recognition' },
  ],
  /* trust points as specimen chips, not bullets */
  trust: [
    'Free design consultation',
    'Fully bespoke, never mass produced',
    'Premium wood · in-house craft',
    'Large Agrabad showroom',
    'Delivery & installation included',
    'Easy payment options',
    'Hundreds of happy homes',
  ],
} as const

/* S8 · footer */
export const footer = {
  headline: 'Ready to design around you?',
  cta: 'Get a Free Design Consultation',
  /* Accurate, and legally required: the placeholder pieces on the turntable
     are Khronos glTF sample assets under CC-BY-4.0, which obliges credit.
     When Meshy scans of Heaven's own pieces replace them, this line becomes
     '3D models generated with Meshy AI from Heaven Furniture Mart
     photography.' and the credit goes with the models. See ASSETS.md. */
  attribution: '3D placeholder models by Eric Chadwick, CC BY 4.0.',
  /* Quiet organizer credit. Deliberately one specimen line: this page has to read
     as the client's real page, so Racdox is thanked here and in the README, never
     in a position that competes with Heaven's own story (PLAN.md Part 2). */
  hackathon: 'Built for the Racdox Hackathon 2026',
  hackathonTag: '#racdox_hackathon',
  hackathonUrl: 'https://www.racdox.com/hackathon',
} as const

export const whatsappMessages = {
  default:
    "Hi Heaven, I'd like a free design consultation for a bespoke piece. My space is ",
  withSwatch: (swatch: string) =>
    `Hi Heaven, I'd like a free design consultation for a bespoke sofa in ${swatch}. My space is `,
} as const
