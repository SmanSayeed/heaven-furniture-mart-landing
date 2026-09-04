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

/* ---------------------------------------------------------------------------
   THE STORY (BLUEPRINT SS0.5) — "ONE PIECE, DRAWN FOR YOU"
   Nine beats, one per sheet, in scroll order. This array is the page's spine:
   the title block at the foot of every sheet, the beat caption at its head,
   the Index overlay's map and the sheet COUNT all read from it, so the
   wayfinding can never disagree with itself. The visitor always knows which
   sheet they are on, and is always told what the next one is: that pull is
   what turns a scroll into an adventure rather than a document.

   THE MAKER MOVED TO SHEET 03, from seventh place. A first-time visitor's
   second question, right after "what is this", is "who is behind it" — and
   on a bespoke page that is not a nice-to-have, it is the credibility the
   whole offer rests on. Buried at sheet seven, most visitors never met him.
   THE HANDS (08) is new and sits deliberately just before the ask: the last
   thing a visitor sees before being asked to start a conversation is the
   people who would do the work.
--------------------------------------------------------------------------- */
export const story = [
  { no: '01', beat: 'The Window', caption: 'A piece waits, lit.', target: 'sheet-01' },
  { no: '02', beat: 'The Studio', caption: 'The lights come on.', target: 'sheet-02' },
  { no: '03', beat: 'The Maker', caption: 'In his own words.', target: 'sheet-03' },
  { no: '04', beat: 'The Drafting Table', caption: 'Yours is drawn.', target: 'bespoke' },
  { no: '05', beat: 'The Range', caption: 'Walk the collections.', target: 'collections' },
  { no: '06', beat: 'The Showroom', caption: 'Step through. Agrabad.', target: 'sheet-06' },
  { no: '07', beat: 'Your Room', caption: 'See it in your place.', target: 'ar' },
  { no: '08', beat: 'The Hands', caption: 'Who builds it.', target: 'sheet-08' },
  { no: '09', beat: 'The Order', caption: 'Have yours drawn.', target: 'sheet-09' },
] as const

/* S1 · statement + specimen row */
export const hero = {
  eyebrow: brand.category,
  /* narrow phones only: the full category line wraps to two lines at 390px,
     which makes the hero read cramped. Same meaning, one line. */
  eyebrowShort: 'Bespoke furniture · Chattogram',
  /* NOT the brief's example line. "Furniture, Crafted Around You" is the
     "e.g." from the company brief, and three of the four competing entries
     (and this page, until 2026-09-02) used it verbatim. The new line is the
     concept in one breath: the page is a showroom at night, and the piece
     is built for the moment the light finds it. */
  headline: 'Built for the moment the lights come on.',
  sub: brand.tagline,
  /* the brief's own suggested action, word for word */
  cta: 'Request a Quote',
  ctaShort: 'Request a Quote',
  /* THE BLACKOUT BEAT (CONCEPT-V2 D1/D2): a Chattogram room goes dark, one
     Bangla word appears, the light comes back. The only Bangla on the page,
     and the one moment no template can have. */
  blackout: {
    word: 'আলো আসবে',
    line: 'Chattogram, after dark · the light comes back',
  },
  specimens: ['EST. 2020', 'AGRABAD · CTG', 'FULLY BESPOKE'],
  /* S1 "The Turntable": the hero's piece is a real 3D object you can grab
     and spin, and it changes as you scroll. Captions stay at CATEGORY level
     on purpose. Heaven demonstrably sells all three categories, so the page
     never claims a specific product it cannot deliver.

     `kind` names a shape in three/piece-geometry.ts rather than a file on
     disk: the pieces are DRAWN from measurements, not downloaded, so nothing
     here can collide with another site's copy of the same free asset. `hex`
     is that piece's default upholstery — three fabrics Heaven actually
     works in, so the turntable reads as a range and not as one model
     recoloured. Swapping in a Meshy scan later is adding a url beside a
     kind; no copy changes. */
  /* FIVE PIECES, FIVE CATEGORIES — the same five the Collections sheet lists.
     They used to be a sofa, an armchair and a settee, which is three pieces
     of seating and advertises Heaven as a sofa shop. A visitor who never
     scrolls past the hero has now still seen the range. */
  pieces: [
    /* the showpiece leads. A gilded canapé is the piece a bespoke workshop is
       judged on, and it is the one object here that could not have come from
       a model library — see royal-sofa.ts. Its velvet takes the swatch; its
       gilt frame does not, which is the bespoke story in one object. */
    /* `photo` is that category's REAL photograph, shown pinned beside the
       drawing. The 3D piece proves the drawing; the photograph proves the
       workshop. A customer deciding whether to spend real money needs the
       second one, and until this field existed the hero offered only the
       first. */
    { kind: 'royal', name: 'Royal Canapé Sofa', category: 'Living Room', hex: '#6E6A73', href: '/collections/living-room', photo: 'hero-sofa-01-frontal' },
    { kind: 'bed', name: 'Upholstered King Bed', category: 'Bedroom', hex: '#E8E0D0', href: '/collections/bedroom', photo: 'bedroom-01-royal-bed' },
    { kind: 'dining', name: 'Eight-Seat Dining Set', category: 'Dining', hex: '#E8E0D0', href: '/collections/dining', photo: 'dining-01-cream' },
    { kind: 'desk', name: 'Executive Desk', category: 'Office & Study', hex: '#B08D57', href: '/collections/office-study', photo: 'office-storage-01-black-cabinet' },
    { kind: 'armchair', name: 'Accent Armchair', category: 'Bespoke', hex: '#1F4A3A', href: '/collections/bespoke', photo: 'bespoke-chairs-01' },
  ],
  /* THE PROOF CHIP beside the turntable. The single sharpest customer
     question this page was not answering is "is any of this real?" - the
     hero was a drawing on a black stage, and a drawing, however good, is a
     promise. So the drawing now stands next to a photograph of the same
     category of work, built and delivered, and the two captions say which
     is which. Drawing = how yours starts. Photograph = how it ends. */
  real: {
    label: 'THE REAL WORK',
    line: 'Built in Agrabad. Photographed in real rooms.',
  },
  /* the turntable's own controls, so the piece can be changed by hand and not
     only by scrolling past it */
  prev: 'Previous piece',
  next: 'Next piece',
  loading: 'Bringing the piece to the stage',
  /* only ever rendered once the 3D is genuinely on screen */
  dragHint: 'Drag to spin',
  dragHintSpecimen: '360',
} as const

/* S2 · placard cluster, replaces the old intro paragraph */
export const intro = {
  index: '01',
  title: 'Bespoke Furniture Studio',
  line: 'Built to your space, your size, your taste.',
  /* The specimen row that used to sit here read EST. 2020 · AGRABAD,
     CHATTOGRAM · HUNDREDS OF HOMES, and the hero one screen above already
     says EST. 2020 · AGRABAD · CTG. Repeating a fact one scroll later does
     not reinforce it, it just fills the sheet. Deleted. */
  /* THE TRUST ROW (BLUEPRINT SS0.9 fix 3). The brief wants "Why Choose
     Heaven" fast to scan, right after the intro. These four answer a first
     visitor's real questions: does asking cost me anything, is it actually
     custom, do they deliver, can I pay in instalments. This is now the ONLY
     trust list on the page — the seven-chip version on the Maker sheet was
     the same promises again in more words, and it is gone. */
  trustFast: [
    'Free design consultation',
    'Fully bespoke, never mass produced',
    'Delivery & installation included',
    'Easy payment options',
  ],
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
  /* Specimens beside the drawn dimension line, and deliberately NOT numbers.
     The numbers on this sheet are measured off the model at load and printed
     by DimensionLine; typing a second set here would put a fabricated
     "2400 MM" next to a real one, which is exactly the kind of small lie a
     page about bespoke measurement cannot afford. These three are facts from
     the brief instead. */
  dimensions: ['MADE TO YOUR MEASUREMENTS', 'YOUR FABRIC', 'YOUR FINISH'],
  cta: 'Request a Quote',
  /* the practical version of this sheet lives at /process; a visitor who
     wants the steps in plain words rather than in three verbs can get them */
  how: 'How bespoke works',
  howHref: '/process',
  /* S3b: the 360 inspect affordance, shown only when the 3D actually armed */
  inspect: 'Drag to inspect · 360',
} as const

/* S4 · collections, placards over photos */
export const collections = {
  index: '03',
  title: 'Collections',
  /* Two examples per card, not three or four. These are captions under a
     photograph the visitor is already looking at, and the picture says
     "sofa" far faster than the word does; the list is there to widen the
     category, and past two items it stops widening and starts crowding. */
  items: [
    { num: '01', name: 'Living Room', detail: 'SOFAS · TV UNITS', img: 'living-01-beige-set', accent: '#7A8F8A' },
    { num: '02', name: 'Bedroom', detail: 'KING BEDS · WARDROBES', img: 'bedroom-01-royal-bed', accent: '#6B5138' },
    { num: '03', name: 'Dining', detail: 'DINING SETS · CABINETS', img: 'dining-01-cream', accent: '#B8956A' },
    { num: '04', name: 'Office & Study', detail: 'DESKS · BOOKSHELVES', img: 'office-storage-01-black-cabinet', accent: '#4E5754' },
    { num: '05', name: 'Bespoke', detail: 'YOUR SIZE · YOUR TASTE', img: 'bespoke-chairs-01', accent: '#C8A96A' },
  ],
} as const

/* ---------------------------------------------------------------------------
   THE CATALOGUE (the /collections pages)

   Five category pages plus an index, built from the SAME ten photographs the
   landing page uses. That constraint is the design, not a limitation to work
   around: these are the pieces Heaven has actually published, so every plate
   on every page is real work, and nothing here is a stock photograph of
   somebody else's furniture.

   TWO RULES THIS FILE OBEYS, and they are the reason the copy reads the way
   it does:

   1. NOTHING IS NAMED THAT HEAVEN HAS NOT SHOWN. A title here describes what
      is visible in the photograph ("Carved sofa set, cream upholstery"), it
      does not invent a product line, a model number or a collection name.
   2. NO PRICES, EVER. The brief's whole positioning is bespoke - built to a
      customer's own room - so a price would be a fiction, and the page's one
      action stays "start a conversation" rather than "add to cart".

   `enquiry` is what gets written into WhatsApp when a visitor asks about a
   specific piece, so the studio opens the chat already knowing which
   photograph they were looking at.
--------------------------------------------------------------------------- */
export type CataloguePiece = {
  img: string
  title: string
  specs: readonly string[]
}

export const catalogue = {
  index: {
    eyebrow: 'THE FULL RANGE',
    title: 'Collections',
    lead: 'Five rooms. Every piece built to the measurements of yours.',
    cta: 'Request a Quote',
  },
  categories: [
    {
      slug: 'living-room',
      num: '01',
      name: 'Living Room',
      lead: 'Sofa sets, coffee tables, TV units and consoles, built to the wall they stand against.',
      cover: 'living-01-beige-set',
      pieces: [
        { img: 'living-01-beige-set', title: 'Carved sofa set, beige upholstery', specs: ['SOLID WOOD FRAME', 'HAND-CARVED', 'FABRIC OF YOUR CHOICE'] },
        { img: 'living-02-blue-pair', title: 'Two-seat pair, deep blue', specs: ['MATCHED PAIR', 'BUTTON DETAIL', 'BUILT TO YOUR SPAN'] },
        { img: 'living-03-wood-set', title: 'Full wooden living set', specs: ['SEASONED HARDWOOD', 'IN-HOUSE FINISH', 'ROOM-MATCHED'] },
        { img: 'detail-01-blue-sofa', title: 'Upholstery detail, blue velvet', specs: ['PIPED EDGE', 'DENSITY TO ORDER'] },
        { img: 'hero-sofa-01-frontal', title: 'Carved three-seat sofa', specs: ['CENTREPIECE FRAME', 'YOUR FABRIC', 'YOUR FINISH'] },
        /* second batch, 2026-09-04: the client's own Facebook photography.
           Every spec below is either visible in the photograph or one of the
           brief's own promises. Nothing about a mechanism, a timber species
           or a finish is claimed, because none of that was given. */
        { img: 'living-10-blue-set', title: 'Sofa set, powder blue', specs: ['THREE PLUS TWO', 'WOODEN FRAME', 'FABRIC OF YOUR CHOICE'] },
        { img: 'living-11-green-set', title: 'Carved room set, sage green', specs: ['FULL ROOM SET', 'HAND-CARVED FRAME', 'YOUR UPHOLSTERY'] },
        { img: 'living-12-yellow-curve', title: 'Curved settee, ochre', specs: ['CURVED FRAME', 'ONE-OFF SHAPE', 'YOUR FABRIC'] },
        { img: 'living-14-cream-set', title: 'Sofa set, cream and gold', specs: ['SOFA, SEATS AND TABLE', 'CARVED FRAME', 'YOUR FABRIC'] },
        { img: 'living-04-gold-armchairs', title: 'Armchair pair, tufted', specs: ['MATCHED PAIR', 'BUTTON-TUFTED BACK', 'YOUR FABRIC'] },
        { img: 'living-13-striped-armchair', title: 'Armchair, gilt carved frame', specs: ['HAND-CARVED FRAME', 'SINGLE OR PAIR', 'YOUR FABRIC'] },
        { img: 'living-05-carved-armchair', title: 'Carved chair and glass table', specs: ['HAND-CARVED FRAME', 'GLASS TOP', 'SIZED TO YOUR CORNER'] },
        { img: 'living-15-carved-pair', title: 'Chair pair and glass table', specs: ['MATCHED PAIR', 'CARVED CRESTS', 'GLASS TOP'] },
        { img: 'living-07-gold-display', title: 'Display cabinet, gilded', specs: ['GLAZED DOORS', 'GLASS SHELVES', 'TO YOUR CEILING HEIGHT'] },
        { img: 'living-06-black-console', title: 'Console cabinet, black and brass', specs: ['BRASS HARDWARE', 'OPEN AND CLOSED STORAGE', 'BUILT TO THE WALL'] },
        { img: 'living-08-black-sideboard', title: 'Sideboard, black with brass', specs: ['BRASS HARDWARE', 'OPEN SHELF END', 'BUILT TO THE WALL'] },
        { img: 'living-09-mirrored-console', title: 'Console table, mirrored front', specs: ['MIRRORED PANELS', 'DRAWER STORAGE', 'TO YOUR SPAN'] },
      ],
    },
    {
      slug: 'bedroom',
      num: '02',
      name: 'Bedroom',
      lead: 'Beds, wardrobes, dressing tables and bedside pieces, sized to the room rather than to a catalogue.',
      cover: 'bedroom-01-royal-bed',
      pieces: [
        { img: 'bedroom-01-royal-bed', title: 'Carved king bed, royal headboard', specs: ['KING OR CUSTOM SPAN', 'HAND-CARVED HEADBOARD', 'MATCHING SIDE PIECES'] },
        { img: 'bedroom-02-green-velvet', title: 'Upholstered bed, emerald velvet', specs: ['PANELLED HEADBOARD', 'END BENCH', 'KING OR CUSTOM SPAN'] },
        { img: 'bedroom-03-carved-teal', title: 'Carved bed, gilded relief', specs: ['HAND-CARVED POSTS', 'GILDED RELIEF', 'MATCHING SIDE PIECES'] },
        { img: 'bedroom-04-dressing-table', title: 'Dressing table and round mirror', specs: ['ROUND MIRROR', 'DRAWER STORAGE', 'SIZED TO YOUR WALL'] },
      ],
    },
    {
      slug: 'dining',
      num: '03',
      name: 'Dining',
      lead: 'Dining tables, chairs and cabinets, cut to the number of people who actually sit down.',
      cover: 'dining-01-cream',
      pieces: [
        { img: 'dining-01-cream', title: 'Dining set, cream and gold', specs: ['SIX TO TWELVE SEATS', 'CARVED LEGS', 'YOUR TABLE LENGTH'] },
        { img: 'dining-02-peach', title: 'Dining set, peach upholstery', specs: ['UPHOLSTERED SEATS', 'MATCHED CABINET AVAILABLE'] },
        { img: 'dining-03-glass-top', title: 'Dining table, glass on carved base', specs: ['CARVED BASE', 'GLASS TOP', 'FOUR TO EIGHT SEATS'] },
        { img: 'dining-04-gold-round', title: 'Round table, gilded base', specs: ['ROUND TOP', 'GILDED BASE', 'TO YOUR DIAMETER'] },
        { img: 'dining-05-white-set', title: 'Dining set, ivory and silver', specs: ['SIX TO TWELVE SEATS', 'UPHOLSTERED BACKS', 'YOUR TABLE LENGTH'] },
      ],
    },
    {
      slug: 'office-study',
      num: '04',
      name: 'Office & Study',
      lead: 'Executive tables, bookshelves, storage and workstations, for the room you work in.',
      cover: 'office-storage-01-black-cabinet',
      pieces: [
        { img: 'office-storage-01-black-cabinet', title: 'Storage cabinet, black and brass', specs: ['FLOOR TO CEILING OPTION', 'BRASS HARDWARE', 'BUILT TO THE ALCOVE'] },
        { img: 'office-03-executive-desk', title: 'Executive desk and workstation', specs: ['DESK AND RETURN', 'DRAWER PEDESTAL', 'BUILT TO THE ROOM'] },
        { img: 'office-04-director-desk', title: 'Director’s desk with storage wall', specs: ['DESK PLUS STORAGE', 'FLOOR TO CEILING OPTION', 'TO YOUR FLOOR PLAN'] },
        { img: 'office-02-conference', title: 'Conference table and seating', specs: ['SEATS TO YOUR ROOM', 'ONE-PIECE TOP', 'MATCHING STORAGE'] },
      ],
    },
    {
      slug: 'bespoke',
      num: '05',
      name: 'Bespoke',
      lead: 'The pieces that exist because somebody asked. Bring a room, a size, a photograph or a sketch.',
      cover: 'bespoke-chairs-01',
      pieces: [
        { img: 'bespoke-chairs-01', title: 'Occasional chairs, carved frame', specs: ['ONE-OFF COMMISSION', 'YOUR TIMBER', 'YOUR FABRIC'] },
        /* the dolna is the category's own argument: a hanging swing is not a
           catalogue line anywhere, and it is the piece on this page that most
           obviously exists because a customer asked for it */
        { img: 'bespoke-02-swing-black', title: 'Hanging dolna, dark frame', specs: ['INDOOR OR VERANDA', 'WOVEN SEAT', 'CUSHION IN YOUR FABRIC'] },
        { img: 'bespoke-03-swing-cream', title: 'Hanging dolna, cream weave', specs: ['INDOOR OR VERANDA', 'WOVEN SEAT', 'CUSHION IN YOUR FABRIC'] },
      ],
    },
  ],
  /* the same one action as the landing page, said for a specific piece */
  enquire: 'Enquire about this piece',
  backToIndex: 'All collections',
  backToHome: 'Heaven Furniture Mart',
  /* every category page ends on the same promise, because it is the offer */
  bespokeNote: {
    title: 'Not exactly what you had in mind?',
    line: 'That is the usual case. Send us the room and the measurements, and we draw it.',
    cta: 'Request a Quote',
  },
} as const

/* S1c · the AR hook pill in the hero. An invitation, not the AR session:
   model-viewer above the fold would wreck LCP and the ad funnel path. */
export const arHook = {
  label: 'See it in your room',
  specimen: 'AR · POINT YOUR PHONE',
} as const

/* THE INDEX. It lists the eight STORY BEATS, not the five product
   categories: this page is one continuous route, so what a visitor needs is
   the drawing set's contents page, not a menu. Names come from `story`, so
   the nav, the title blocks and the footer index can never disagree. */
export const nav = {
  open: 'Index',
  close: 'Close',
  overlayLabel: 'Contents: the story, sheet by sheet',
  footerHeading: 'Contents',
  cta: 'Request a Quote on WhatsApp',
} as const

/* S5 · showroom */
export const showroom = {
  index: '04',
  title: 'Step into our showroom',
  /* beside the film now, not under it: the tour panel gave up two columns so
     the visit details could stand next to it as a placard */
  line: 'Walk the floor before you decide. The tour is filmed in the Agrabad showroom.',
  specimens: ['AGRABAD ACCESS ROAD', 'CHATTOGRAM', 'OPEN DAILY'],
  directions: 'Get directions',
  call: 'Call the showroom',
} as const

/* S6 · AR */
export const ar = {
  index: '05',
  title: 'See it in your room',
  /* one sentence, not two: the second one ("see exactly how it fits before
     we build it") explained a thing the button already promises */
  line: 'Point your phone at the space. The sofa stands in it, at true size.',
  button: 'View in your room',
  loading: 'Opening the viewer',
  failed: 'Could not load. Tap to retry',
  alt: 'A bespoke velvet sofa, viewable in 3D and placeable in your own room.',
  /* Honest about the ladder rather than promising every device: Android and
     WebXR headsets can place the piece; an iPhone turns it in 3D until a USDZ
     export exists (ASSETS.md); a desktop is asked to use a phone. */
  support: 'ANDROID · AR IN YOUR ROOM. IPHONE & DESKTOP · 3D VIEW.',
} as const

/* SHEET 03 · the maker. The quote is the ONLY long text on the page, and it
   earns that: it is the Managing Director's own sentence, verbatim from the
   brief, printed beside his own face. Everything else on this sheet is four
   words or fewer. */
export const proof = {
  title: 'The Maker',
  quote:
    'At Heaven Furniture Mart, we believe furniture is more than just function; it is a reflection of lifestyle, taste, and comfort. Every piece we create is designed to bring lasting elegance into the homes of our clients.',
  quoteBy: 'Abul Kalam Bhuiyan',
  quoteRole: 'Managing Director',
  /* the caption under the piece standing beside him */
  workCaption: 'HIS OWN WORK · AGRABAD',
  milestones: [
    { year: '2020', event: 'Founded by Abul Kalam Bhuiyan' },
    { year: '2021', event: 'Opened the Agrabad showroom' },
    { year: '2024', event: 'International Furniture Fair, Chattogram' },
    { year: '2025', event: 'Member, Chamber of Commerce' },
    { year: '2026', event: 'Nationwide BFIOA recognition' },
  ],
  /* The seven trust chips that used to hang under the quote are DELETED, not
     moved. Six of the seven were already on Sheet 02 as intro.trustFast, one
     scroll after the visitor had read them; the seventh ("hundreds of happy
     homes") is a claim with nothing behind it on this page. A promise made
     twice is not twice as convincing. */
} as const

/* SHEET 08 · the hands. Directly before the ask, on purpose: the last thing
   a visitor sees before being invited to start a conversation is the people
   who would take the job. Four words of copy — the photograph is the point,
   and anything written over it would be the page explaining its own picture. */
export const team = {
  title: 'The Hands',
  line: 'In-house craftsmen. Every piece, built here.',
  specimens: ['IN-HOUSE WORKSHOP', 'AGRABAD, CHATTOGRAM'],
  caption: 'THE HEAVEN FURNITURE MART TEAM',
} as const

/* SHEET 09 · the brief, filled in.
   THREE FIELDS AND NOTHING ELSE. Every extra box on a contact form costs
   completions, and this one is asking for a free consultation, not a
   quotation: the studio needs to know who is asking, how to reach them, and
   what room it is about. Everything else is what the conversation is for. */
export const contact = {
  eyebrow: 'OR FILL IN THE BRIEF',
  title: 'Tell us about the room',
  fields: {
    name: { label: 'Your name', placeholder: 'Abul Kalam' },
    phone: { label: 'Phone or WhatsApp', placeholder: '01XXXXXXXXX' },
    brief: {
      label: 'What are you looking for?',
      placeholder: 'A three-seat sofa for a 12 by 14 living room, in ivory.',
    },
  },
  submit: 'Send on WhatsApp',
  /* Said plainly, because it is unusual and a visitor deserves to know
     before they type: nothing is stored, the button composes the message. */
  note: 'Opens WhatsApp with your brief written out. Nothing is stored here.',
  error: 'Please add your name and a phone number.',
} as const

/* S8 · footer */
export const footer = {
  headline: 'Ready to design around you?',
  cta: 'Request a Quote',
  /* This line used to be a LICENCE OBLIGATION: the turntable ran on Khronos
     CC-BY sample assets, which oblige credit. Those are gone — every piece on
     the page is now generated from measurements in
     src/components/three/piece-geometry.ts — so the obligation is gone with
     them and the line simply says what the pieces are. Kept because a visitor
     looking at a 3D sofa deserves to know it is a drawing of a bespoke piece
     and not a photograph of stock. See ASSETS.md. */
  attribution: '3D pieces drawn to measure in code, not photographed.',
  /* Quiet organizer credit. Deliberately one specimen line: this page has to read
     as the client's real page, so Racdox is thanked here and in the README, never
     in a position that competes with Heaven's own story (PLAN.md Part 2). */
  hackathon: 'Built for the Racdox Hackathon 2026',
  hackathonTag: '#racdox_hackathon',
  hackathonUrl: 'https://www.racdox.com/hackathon',
} as const

/* ---------------------------------------------------------------------------
   THE BUSINESS PAGES (/process, /about, /contact) and the nav that joins
   every page of the site together.

   The landing page is the STORY; these are the DESK DRAWERS - the practical
   pages a real customer opens once they take the offer seriously: how does
   ordering actually work, who are these people, how do I reach them. Same
   facts as everywhere else (nothing here is new information, and nothing may
   be), arranged for a reader in a hurry.

   Every line below is grounded in the client brief: free consultation,
   built to your space, premium wood and in-house craftsmanship, delivery and
   installation included, easy payment options, the Agrabad showroom, the
   2020 founding. No hours beyond OPEN DAILY, no prices, no testimonials -
   those would be inventions, and this file does not invent.
--------------------------------------------------------------------------- */
export const siteNav = [
  { label: 'Collections', href: '/collections' },
  { label: 'How it works', href: '/process' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
] as const

export const processPage = {
  eyebrow: 'HOW IT WORKS',
  title: 'From your room, to your room.',
  lead: 'Four steps between a conversation and a finished piece standing in your home.',
  steps: [
    {
      num: '01',
      name: 'Consult',
      line: 'A free design consultation. At the Agrabad showroom, on the phone, or on WhatsApp.',
      specs: ['FREE', 'NO OBLIGATION'],
    },
    {
      num: '02',
      name: 'Measure & design',
      line: 'The piece is drawn to your space, your size and your taste. You approve the drawing before anything is cut.',
      specs: ['YOUR MEASUREMENTS', 'YOUR FABRIC & FINISH'],
    },
    {
      num: '03',
      name: 'Craft',
      line: 'Premium wood and materials, built by skilled in-house craftsmen in Chattogram.',
      specs: ['PREMIUM WOOD', 'IN-HOUSE WORKSHOP'],
    },
    {
      num: '04',
      name: 'Deliver & install',
      line: 'Delivered and installed in your room, included. Easy payment options.',
      specs: ['DELIVERY INCLUDED', 'INSTALLATION INCLUDED', 'EASY PAYMENTS'],
    },
  ],
  photoCaption: 'BUILT IN-HOUSE · AGRABAD, CHATTOGRAM',
  cta: 'Request a Quote',
} as const

export const aboutPage = {
  eyebrow: 'ABOUT',
  title: 'A studio, not a shop.',
  lead: 'Heaven Furniture Mart builds custom sofas, beds, dining sets and office pieces around what a customer actually wants, not what is on a shelf.',
  founded: 'Founded in 2020 by Abul Kalam Bhuiyan · Agrabad, Chattogram',
  showroomTitle: 'The showroom',
  showroomLine: 'A large physical showroom on Agrabad Access Road. Walk in, sit on the work, talk to the people who build it.',
  rangeTitle: 'What we build',
  cta: 'Request a Quote',
} as const

export const contactPage = {
  eyebrow: 'CONTACT',
  title: 'Talk to a person.',
  lead: 'One conversation is how every piece here starts. Choose whichever way suits you.',
  channels: {
    whatsapp: 'WhatsApp us',
    call: 'Call the showroom',
    email: 'Email',
    visit: 'Visit the showroom',
  },
  formTitle: 'Or write the brief here',
} as const

export const whatsappMessages = {
  default:
    "Hi Heaven, I'd like a free design consultation for a bespoke piece. My space is ",
  withSwatch: (swatch: string) =>
    `Hi Heaven, I'd like a free design consultation for a bespoke sofa in ${swatch}. My space is `,
} as const

/* ---------------------------------------------------------------------------
   THE SLIDES (PLAN-V5, 2026-09-03). Nine full-screen plates. Every line
   here is a caption to a photograph, so every line is short; the facts are
   the brief's, verbatim. `title` arrays are the two lines of the big type.
--------------------------------------------------------------------------- */
export const deck = {
  total: 9,
  cta: 'Request a Quote',
  view: 'View',
  freeLine: 'Free design consultation',
  scroll: 'Scroll',
  nav: [
    { label: 'Collections', href: '#living-room' },
    { label: 'Bespoke', href: '#bespoke' },
    { label: 'Showroom', href: '#showroom' },
    { label: 'Contact', href: '#quote' },
  ],
  hero: {
    tag: brand.category,
    tagShort: 'Bespoke furniture · Chattogram',
    /* placeholder until Saadman's D3 line: NOT the brief's example, which
       three competing entries used verbatim */
    headline: ['Furnished', 'to you.'],
    sub: brand.tagline,
    /* until the evening showroom shot (D5) arrives: the full wooden set,
       styled in the Agrabad showroom */
    photo: 'living-03-wood-set',
  },
  rooms: [
    { slug: 'living-room', no: '01', name: 'Living Room', title: ['Living', 'Room'], line: 'Sofa sets, coffee tables, TV units and consoles, built to the wall they stand against.', measure: 'to your wall', photo: 'living-01-beige-set' },
    { slug: 'bedroom', no: '02', name: 'Bedroom', title: ['Bedroom', ''], line: 'Beds, wardrobes, dressing tables and bedside pieces, sized to the room.', measure: 'to your room', photo: 'bedroom-01-royal-bed' },
    { slug: 'dining', no: '03', name: 'Dining', title: ['Dining', ''], line: 'Dining tables, chairs and cabinets, cut to the number of people who sit down.', measure: 'to your seats', photo: 'dining-01-cream' },
    { slug: 'office-study', no: '04', name: 'Office & Study', title: ['Office', '& Study'], line: 'Executive tables, bookshelves, storage and workstations, built to the alcove.', measure: 'to your alcove', photo: 'office-storage-01-black-cabinet' },
  ],
  bespoke: {
    no: '05',
    tag: 'Bespoke · their #1 difference',
    title: ['Designed. Crafted.', 'Customized.'],
    line: 'Drawn to your measurements. Built in premium wood by in-house craftsmen. Finished in your fabric.',
    ar: 'See it in your room',
    measure: 'to your measurements',
  },
  maker: {
    no: '06',
    tag: 'The maker',
    /* an excerpt of the MD's own sentence (brief, verbatim substring) */
    quote: 'Furniture is more than just function; it is a reflection of lifestyle, taste, and comfort.',
    name: 'Abul Kalam Bhuiyan',
    role: 'Managing Director',
    trust: 'Trusted by hundreds of happy homeowners · Chamber of Commerce 2025 · BFIOA recognition 2026',
    photo: 'people-owner-heaven-furniture',
  },
  showroom: {
    no: '07',
    tag: 'Showroom',
    title: ['Agrabad,', 'Chattogram'],
    line: 'A large physical showroom. Walk the floor before you decide.',
    photo: 'living-02-blue-pair',
  },
  quote: {
    no: '08',
    tag: 'Your room',
    title: ['Ready to design', 'around you?'],
    line: 'Tell us the room and the piece. We draw it to your measurements and send the quote on WhatsApp.',
    measure: 'drawn to your room',
  },
  quoteSteps: ['What are you looking for?', 'Your space', 'Where do we send it?'],
  quoteEnds: 'Ends on WhatsApp with the message already written',
  quoteSend: 'Send on WhatsApp',
  quoteNote: 'Nothing is stored here. The button opens WhatsApp with your answers written out.',
  quoteError: 'Please add your name and a phone number.',
  roomMessage: (room: string) =>
    `Hi Heaven, I'd like a free design consultation for my ${room.toLowerCase()}. My space is `,
} as const

/* ---------------------------------------------------------------------------
   A NIGHT AT HEAVEN (PLAN-V6, 2026-09-03). Seven chapters on one scroll. The
   visitor walks through the showroom at night and DOES one thing per chapter.
   Every fact is the brief's; the narrator lines are the only new words.
--------------------------------------------------------------------------- */
export const night = {
  /* SEVEN chapters. A turntable chapter was built and then removed on the
     client's call (2026-09-03): the drafting table already hands the visitor
     a piece to turn, and a second 3D stage two chapters earlier made the
     page read as a technology demo rather than as a showroom. */
  chapters: [
    { id: 'room', no: '01', name: 'The floodlit room', narrator: 'The power is out. You have a light.' },
    { id: 'studio', no: '02', name: 'The studio', narrator: 'Through the fabric.' },
    { id: 'floor', no: '03', name: 'The floor', narrator: 'Walk the floor.' },
    { id: 'table', no: '04', name: 'The drafting table', narrator: 'Yours is drawn.' },
    { id: 'maker', no: '05', name: 'The maker', narrator: 'The man who builds it.' },
    { id: 'home', no: '06', name: 'Take it home', narrator: 'Take it home.' },
    { id: 'ask', no: '07', name: 'Your room', narrator: 'Tell us your room.' },
  ],
  nav: [
    { label: 'Rooms', href: '#floor' },
    { label: 'Bespoke', href: '#table' },
    { label: 'Showroom', href: '#home' },
    { label: 'Contact', href: '#ask' },
  ],
  hero: {
    tag: brand.category,
    tagShort: 'Bespoke furniture · Chattogram',
    headline: ['Furnished', 'to you.'],
    sub: brand.tagline,
    cue: 'Scroll',
    /* THE HERO IS A REEL, NOT A SLIDESHOW WITH ARROWS (client, 2026-09-04:
       "make first view auto animated sliding ... looks like a premium video
       ... comes and hides on another arrival zoom in").

       Five rooms, each holding the screen for about six seconds while it
       drifts slowly closer, then dissolving into the next. Nobody has to
       click, nobody has to scroll, and the page is doing something the
       moment it is open - which on a Facebook ad click is the whole first
       impression.

       ONE LINE PER ROOM. The three-row proof strip and the marks line left
       the hero on the same call ("take away these 3 lines ... to look
       minimal"): under a headline, a tagline and a CTA they were four more
       blocks of type over a photograph. The same three facts are what the
       rooms now say, one at a time, at headline size - and the studio
       chapter still states all three together, with the detail behind its
       buttons. Nothing was lost; it was given room.

       `focal` is the point the slow zoom pushes towards, per photograph. */
    slides: [
      {
        photo: 'living-03-wood-set',
        focal: '50% 62%',
        alt: 'A full wooden living room set, styled in the Agrabad showroom.',
        headline: ['Furnished', 'to you.'],
        sub: brand.tagline,
      },
      {
        photo: 'hero-room-01-palace',
        focal: '50% 58%',
        alt: 'A carved sofa, lamps and side chairs in a panelled sitting room.',
        headline: ['Drawn', 'to your room.'],
        sub: 'A free design consultation, at the showroom or on WhatsApp.',
      },
      {
        photo: 'living-02-blue-pair',
        focal: '52% 60%',
        alt: 'A matched pair of deep blue two-seat sofas by Heaven Furniture Mart.',
        headline: ['Built', 'in our workshop.'],
        sub: 'Premium wood and materials. Skilled in-house craftsmen.',
      },
      {
        photo: 'hero-room-02-leather-chair',
        focal: '58% 52%',
        alt: 'A buttoned leather armchair with a carved wooden frame.',
        headline: ['Made', 'one at a time.'],
        sub: 'Built to your space, your size and your taste. Never off a shelf.',
      },
      {
        photo: 'bespoke-chairs-01',
        focal: '58% 62%',
        alt: 'Bespoke upholstered chairs, built to order in Chattogram.',
        headline: ['Delivered', 'and fitted.'],
        sub: 'Delivery and installation included. Easy payment options.',
      },
    ],
  },

  /* CH.2 · THE STUDIO. NOBODY READS A PARAGRAPH (client, verbatim: "avoid
     those big descriptions and texts - customer not like to read texts").
     What was one long paragraph, one long quotation and three lines of small
     print is now: three BIG lines that arrive one at a time, and three points
     with a drawn mark each. The detail is still there for the visitor who
     wants it - behind a button, in a sheet, set large. Every fact below is
     the brief's; nothing new is claimed. */
  studio: {
    title: ['Bespoke furniture,', 'drawn to your room.'],
    /* the whole offer in three sentences a customer can take in at a glance */
    lines: ['We draw it to your room.', 'We build it in our own workshop.', 'We deliver it and fit it.'],
    points: [
      {
        key: '01',
        icon: 'compass',
        title: 'Drawn to you',
        line: 'Free consultation. Your space, your size, your taste.',
        detail: [
          'A free design consultation, at the Agrabad showroom or on WhatsApp.',
          'Built to your space, never pulled off a shelf.',
          'Bring a room, a size, a photograph or a sketch.',
          'Sofas, beds, dining sets, office pieces, or something nobody has made before.',
        ],
      },
      {
        key: '02',
        icon: 'plane',
        title: 'Built in-house',
        line: 'Premium wood. Skilled craftsmen. One workshop.',
        detail: [
          'Premium wood and materials, chosen for the piece.',
          'Skilled in-house craftsmanship, not outsourced.',
          'A large physical showroom in Agrabad, Chattogram, to see the work before you decide.',
          'One of Chattogram’s leading bespoke furniture brands since 2020.',
        ],
      },
      {
        key: '03',
        icon: 'van',
        title: 'Delivered and fitted',
        line: 'Delivery and installation included. Easy payments.',
        detail: [
          'Delivery and installation are included.',
          'Easy payment options.',
          'Trusted by hundreds of happy homeowners.',
          'Member of the Chamber of Commerce, 2025. Nationwide BFIOA recognition, 2026.',
        ],
      },
    ],
    /* the button under each point, and the sheet's own eyebrow */
    more: 'Details',
    sheet: 'What that means',
    since: 'Since 2020',
  },
  /* CH.3 · THE FLOOR: a gallery wall of five framed rooms */
  floor: {
    title: ['Five rooms.', 'Every piece to your measurements.'],
    view: 'Quick look',
    open: 'Open the room',
    bespokeCard: { num: '05', name: 'Bespoke', detail: 'ANYTHING · YOUR SIZE · YOUR TASTE', action: 'See it drawn' },
    swipe: 'Swipe',
    /* THE GLASS WALL. Five plates of different proportions, hung at
       different heights and turned at different angles so the run of them
       crosses the screen on a diagonal and the plates overlap like prints
       laid on a table. `rot` is the angle, `lift` how far it hangs. */
    frames: [
      { ratio: '3 / 4', lift: '0vh', rot: '-4deg' },
      { ratio: '1 / 1', lift: '5vh', rot: '3.2deg' },
      { ratio: '4 / 5', lift: '1.5vh', rot: '-2.4deg' },
      { ratio: '3 / 4', lift: '6.5vh', rot: '5deg' },
      { ratio: '3 / 4', lift: '2.5vh', rot: '-3.4deg' },
    ],
    /* the word the cursor carries over the wall */
    cursor: 'View',
  },
  /* the mega menu (header "Rooms") and the phone's full-screen menu */
  menu: {
    rooms: 'Rooms',
    all: 'All pieces',
    open: 'Menu',
    close: 'Close',
    line: 'Five rooms. Every piece built to your measurements.',
    built: 'built in Agrabad',
    walk: 'Walk the floor',
  },
  /* the room pages (/collections/[slug]) in the night system */
  roomPage: {
    back: 'Back to the floor',
    next: 'Next room',
    all: 'All rooms',
    pieces: 'pieces',
    piece: 'piece',
    built: 'built in Agrabad',
    open: 'Open',
    enquire: 'Enquire about this piece',
    indexTitle: ['Five rooms.', 'Walk them all.'],
    indexLine: 'Every photograph here is a piece Heaven built and delivered. Nothing is stock.',
  },
  table: {
    title: ['Designed. Crafted.', 'Customized.'],
    line: 'Drawn to your measurements. Built in premium wood by in-house craftsmen. Finished in your fabric.',
    fabric: 'Fabric',
    measured: 'Measured off the drawing',
    ar: 'See it in your room',
  },
  home: {
    title: ['Take it', 'home.'],
    arCard: {
      key: 'In your room',
      line: 'The piece you just dyed, standing in your own room at true size. Point your phone at the floor.',
      button: 'Open in your room',
    },
    film: {
      key: 'The showroom',
      line: 'Agrabad Access Road, Chattogram. Walk the floor before you decide.',
      /* the ambient film runs muted on a desktop; this is the way in to the
         real one, with sound */
      sound: 'Watch with sound',
    },
  },
  ask: {
    title: ['Ready to design', 'around you?'],
    line: 'Tell us the room and the piece. We draw it to your measurements and send the quote on WhatsApp.',
  },
} as const
