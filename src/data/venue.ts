// All venue content for the site lives in this file.
// Anything marked `// VERIFY` is not on the venue's own website and needs confirming with them.

export type DietTag = 'GF' | 'V option'

export interface Dish {
  id: string
  name: string
  price: number
  /** Printed after the name, e.g. "3 pcs" or "for 2". */
  note?: string
  description: string
  tags: DietTag[]
  featured?: boolean
}

export interface PriceItem {
  name: string
  price: number
}

export interface Taco {
  id: string
  name: string
  description: string
  /** Extra charge on top of the taco price. */
  supplement: number
}

export interface Cocktail {
  id: string
  name: string
  description: string
  /** Swapped in when "Make it spicy" is on. */
  spicy?: { name: string; addition: string }
  /** Optional variant chips. */
  variants?: { id: string; label: string; name: string; addition: string }[]
}

export interface OpeningHours {
  /** Minutes after midnight, Europe/London. */
  open: number
  close: number
}

export interface Review {
  name: string
  text: string
}

export interface Photo {
  src: string
  alt: string
  width: number
  height: number
}

const h = (hours: number, minutes = 0) => hours * 60 + minutes

export const venue = {
  name: 'Three Compadres',
  tagline: 'Latin Fusion & Barril Grill',
  headline: 'A vibrant Mexican kitchen and bar in the heart of Tooting Broadway Market',
  welcome:
    'With a lively atmosphere, great music, and a focus on simple, well-executed food and drinks, Three Compadres is the go-to spot for a casual bite, drinks with friends, or a laid-back night out in the market. Our menu is built around high-quality meats, including our signature sharing platters, tacos, steak, pork belly, and handmade arepas—designed to be generous, satisfying, and perfect for sharing.',
  motto: 'Fire, flavour and friendship', // VERIFY (from their OpenTable listing)
  logo: 'images/logo.png',
  // Hero centrepiece. 'faces' = animated SVG faces drawn in the logo's style; 'logo' = the static logo PNG.
  // Switch to 'logo' if the drawn faces don't match the real logo closely enough.
  heroArt: 'faces' as 'faces' | 'logo',
  website: 'https://threecompadres.co.uk/',

  address: {
    lines: ['Units 60–62, Broadway Market', '29 Tooting High Street', 'London SW17 0RJ'], // VERIFY
    streetAddress: 'Units 60–62, Broadway Market, 29 Tooting High Street', // VERIFY
    locality: 'London',
    postcode: 'SW17 0RJ', // VERIFY
    country: 'GB',
    tube: 'Tooting Broadway', // VERIFY
    marketNote: 'Inside Broadway Market, not Tooting Market a few doors along.',
  },
  directionsUrl:
    'https://www.google.com/maps/dir/?api=1&destination=Three+Compadres+Broadway+Market+29+Tooting+High+Street+SW17+0RJ',

  phone: {
    display: '07915 110872', // VERIFY
    tel: '+447915110872', // VERIFY
  },

  timeZone: 'Europe/London',
  // Index 0 = Sunday. null = closed.
  hours: [
    { open: h(12), close: h(17, 30) }, // Sun // VERIFY
    null, // Mon // VERIFY
    null, // Tue // VERIFY
    { open: h(18), close: h(22) }, // Wed // VERIFY
    { open: h(17), close: h(22) }, // Thu // VERIFY
    { open: h(17), close: h(22) }, // Fri // VERIFY
    { open: h(12), close: h(23) }, // Sat // VERIFY
  ] as (OpeningHours | null)[],

  booking: {
    easytable: 'https://book.easytable.com/book/?id=fc2c2&lang=auto',
    thefork: 'https://widget.thefork.com/7a61cc7e-369d-4ab8-8015-1ea940df020b',
  },

  social: {
    instagram: 'https://www.instagram.com/threecompadresuk/',
    tiktok: 'https://www.tiktok.com/@threecompadresuk',
  },

  serviceCharge: 'A discretionary 12.5% service charge is added; all tips go directly to the team.',
  allergyNote: 'Please tell your server about any allergies before ordering.',
  credit: 'Site by AlexWilder-Dev',

  barrel: {
    title: 'From the barrel',
    strap: 'Cooked in our authentic charcoal barrel',
    // Paraphrased from their OpenTable listing.
    method:
      'We cook the traditional barril way: meat over open-flame charcoal, inside a barrel grill. The fire and the smoke give it a deep, smoky flavour.', // VERIFY
    mission: 'Bringing the taste of Mexico and South America to South London.', // VERIFY
  },

  seo: {
    title: 'Three Compadres | Latin Fusion & Barril Grill | Broadway Market, Tooting',
    description:
      'With a lively atmosphere, great music, and a focus on simple, well-executed food and drinks, Three Compadres is the go-to spot for a casual bite, drinks with friends, or a laid-back night out in the market.',
    locale: 'en_GB',
    cuisine: ['Mexican', 'Latin American'],
    // Where this site is published. Link previews (WhatsApp, iMessage, socials) need absolute URLs.
    siteUrl: 'https://alexwilder-dev.github.io/Three-Compadres/',
    // Share image in public/, 1200 × 630.
    image: 'og-image.jpg',
    imageAlt: 'Three Compadres: Latin Fusion & Barril Grill, Broadway Market, Tooting',
  },
}

export const menu = {
  starters: [
    {
      id: 'tostaditas',
      name: 'Three Mini Tostaditas',
      note: '3 pcs',
      price: 7,
      description:
        'Topped with a layer of black beans, lettuce, chicken tinga, sour cream and fresh cheese.',
      tags: ['GF', 'V option'],
    },
    {
      id: 'empanadas',
      name: 'Three Mini Empanadas',
      note: '3 pcs',
      price: 7.5,
      description:
        'Crispy fried corn mini empanadas stuffed with tender pork belly in green sauce and melted cheese. Mexican Colombian fusion.',
      tags: ['GF'],
    },
    {
      id: 'arepas',
      name: 'Three Mini Arepas',
      note: '3 pcs',
      price: 8,
      description:
        'Filled with chorizo, garnished with sour cream, pickled onion and coriander for a fusion twist. Mexican Venezuelan.',
      tags: ['GF', 'V option'],
    },
    {
      id: 'tequenos',
      name: 'Three Mini Tequeños',
      note: '3 pcs',
      price: 8,
      // "red beads" is as printed on their menu. VERIFY
      description:
        'Strips of pork belly and cheese wrapped in blue corn dough, accompanied by red beads and árbol chilli sauce. It is our fusion of the most Mexican Venezuelan Tequeños.',
      tags: ['GF'],
    },
  ] as Dish[],

  mains: [
    {
      id: 'mole-short-ribs',
      name: 'Mole Short Ribs',
      price: 22,
      description:
        'Braised beef short rib slow-cooked, served on a bed of black beans and smothered in rich Mexican mole sauce, and 3 corn tortillas.',
      // Printed "(G)" on their menu, which isn't one of their tags. Left untagged. VERIFY
      tags: [],
    },
    {
      id: 'chilaquiles',
      name: 'Chilaquiles Diablo with Chicken Tinga',
      price: 16,
      description:
        'Red chilaquiles, black beans, sour cream, queso fresco, pickled onions, coriander and fried egg.',
      tags: ['GF', 'V option'],
    },
    {
      id: 'al-pastor-rib',
      name: '“Al Pastor” Rib',
      price: 20,
      description:
        'Slow-roasted pork ribs marinated in Al Pastor blend (achiote, guajillo chile, garlic and citrus), served with fire-blistered pineapple tossed in árbol chilli for a sweet-spicy finish and 3 corn tortillas.',
      tags: ['GF'],
    },
    {
      id: 'chicharron-ceviche',
      name: 'Chicharron Ceviche',
      price: 16,
      description:
        'Pieces of chicharron, mixed in a special 3 Compadres ceviche sauce with rocket leaves, cherry tomatoes and red onions. Our version of the “mero mero Colombian”.',
      tags: ['GF'],
    },
  ] as Dish[],

  barrel: [
    {
      id: 'pork-belly-chicharron',
      name: 'Pork Belly Chicharron',
      price: 16,
      description:
        'Slow roasted, served with crispy rosemary potatoes with Three Compadres sauce and 3 corn tortillas.',
      tags: ['GF'],
    },
    {
      id: 'picanha',
      name: 'Picanha',
      price: 18.5,
      description:
        'Premium picanha steak, slow roasted, served with Parmesan crispy rosemary baby potatoes and zesty house-made chimichurri.',
      tags: ['GF'],
    },
    {
      id: 'half-chicken',
      name: 'Barrel Roasted Half Chicken',
      price: 15,
      description: 'Barrel-roasted half chicken, tajín, baby potatoes and chile de árbol sauce.',
      tags: ['GF'],
    },
    {
      id: 'three-compadres-plate',
      name: 'Three Compadres Plate',
      note: 'for 2',
      price: 48,
      description:
        'Pork belly chicharron, picanha, half chicken, chorizo, tajín yuca fries, a variety of 3 sauces and 8 corn tortillas.',
      tags: ['GF'],
      featured: true,
    },
  ] as Dish[],

  sides: [
    { name: 'Yuca fries with tajín', price: 5 },
    { name: 'Green salad', price: 5 },
    { name: 'Rosemary potatoes', price: 4 },
    { name: 'Parmesan rosemary potatoes', price: 5 },
    { name: 'Chorizo', price: 6 },
    { name: 'Fried egg', price: 3 },
  ] as PriceItem[],

  sauces: [
    { name: 'Green tomato sauce', price: 2.5 },
    { name: 'Chile de árbol sauce', price: 2.5 },
    { name: 'Three Compadres sauce', price: 2.5 },
  ] as PriceItem[],
}

export const forbiddenTaco = {
  title: 'The Forbidden Taco',
  warning: 'You weren’t supposed to find this.',
  revealButton: 'I didn’t see anything',
  afterReveal: 'These tacos don’t exist. You didn’t eat here. Enjoy.',
  trayLine: 'Tell your server your three.',
  single: 5.5,
  three: 15,
  tacos: [
    {
      id: 'carnitas',
      name: 'Carnitas',
      description:
        'Slow-cooked Mexican-style pork carnitas, with chopped cilantro and pickled red onion.',
      supplement: 0,
    },
    {
      id: 'alambre',
      name: 'Alambre',
      description: 'Homemade chorizo, bacon, bell peppers, onion and cheese, with chopped cilantro.',
      supplement: 0,
    },
    {
      id: 'chicken-guajillo',
      name: 'Chicken Guajillo',
      description:
        'Grilled chicken thighs wrapped in guajillo chilli adobo, with chopped cilantro and pickled red onion.',
      supplement: 0,
    },
    {
      id: 'fish',
      name: 'Fish Taco',
      description:
        'Seasoned slaw base, fish fried in a batter of corn flour, mustard, oregano and light beer, salsa 3 compadres and chopped cilantro.',
      supplement: 1,
    },
    {
      id: 'portobello',
      name: 'Portobello Taco',
      description:
        'Seasoned slaw base, portobello mushroom fried in a batter of corn flour, mustard, oregano and light beer, roasted tortilla salsa with chipotle and chopped cilantro.',
      supplement: 1,
    },
    {
      id: 'pork-belly',
      name: 'Pork Belly Taco',
      description:
        'Double corn tortilla with a cheese crust, thinly sliced pork belly and jalapeño slices.',
      supplement: 1,
    },
  ] as Taco[],
  quesadillas: {
    name: 'Quesadillas',
    price: 12,
    extra: 'extra filling +£3',
    description: 'Tortilla, mozzarella cheese, black beans and cilantro, served with red salsa.',
  },
}

export const drinks = {
  cocktailPrice: 12,
  cocktails: [
    {
      id: 'lavender-mezcal',
      name: 'Lavender Mezcal',
      description: 'Blend of gin and mezcal, lavender syrup, lime and bitters.',
    },
    {
      id: 'margarita',
      name: 'Margarita',
      description: 'Tequila, triple sec, agave syrup and citrus.',
      spicy: { name: 'Margarita Picante', addition: 'chilli' },
    },
    {
      id: 'vesper-lychee',
      name: 'Vesper Lychee Martini',
      description: 'Gin and vodka blend, Lillet Rosé vermouth, lychee liqueur and citrus.',
    },
    {
      id: 'porn-star',
      name: 'Porn Star Actual Martini',
      description: 'Vanilla vodka, passion fruit liqueur and syrup, citrus and bitters.',
    },
    {
      id: 'pineapple-mojito',
      name: 'Pineapple Mojito',
      description: 'White rum, citrus, mint and pineapple syrup with a splash of soda water.',
    },
    {
      id: 'caipirinha',
      name: 'Straight Up Caipirinha',
      description: 'Cachaça, sweet and citrus.',
      spicy: { name: 'Spicy Caipirinha', addition: 'chilli' },
    },
    {
      id: 'basil-pisco',
      name: 'Basil Pisco',
      description: 'Peach schnapps, pisco, basil syrup, citrus and bitters.',
      variants: [
        { id: 'sour', label: 'Sour', name: 'Basil Pisco Sour', addition: 'egg white' },
        { id: 'spritz', label: 'Spritz', name: 'Basil Pisco Spritz', addition: 'Prosecco' },
      ],
    },
    {
      id: 'new-york-sour',
      name: 'New York Sour Twist',
      description: 'Whiskey, simple syrup, citrus and red wine on top.',
    },
    {
      id: 'dry-vodka',
      name: 'Dry Vodka',
      description: 'Peach schnapps and vodka blend, pineapple syrup, citrus and bitters.',
      variants: [{ id: 'spritz', label: 'Spritz', name: 'Dry Vodka Spritz', addition: 'Prosecco' }],
    },
    {
      id: 'white-mezcal-negroni',
      name: 'White Mezcal Negroni',
      description:
        'Italicus bergamot liqueur, lime-leaf-infused mezcal and Lillet Rosé vermouth.',
    },
  ] as Cocktail[],
  shots: [
    { name: 'Tequila', price: 5 },
    { name: 'Mezcal', price: 5.5 },
    { name: 'Michelada', price: 7 },
  ] as PriceItem[],
  beer: [
    { name: 'Corona', price: 4.5 },
    { name: 'Modelo Especial', price: 5 },
  ] as PriceItem[],
  wine: { kinds: 'White / red / rosé', glass: 6, bottle: 22 },
  soft: {
    items: ['Coca-Cola', 'Coca-Cola Zero', 'Diet Coke', 'Sprite', 'Still water', 'Sparkling water'],
    price: 2.5,
  },
}

export const offers = [
  {
    id: 'bottomless',
    title: 'Bottomless Barril & Bebidas', // VERIFY
    body: '90 minutes of unlimited Palomas, Encocado and Guarapita cocktails with our signature barrel dishes.', // VERIFY
    cta: 'Ask us for prices and times',
  },
  {
    id: 'friday',
    title: 'Friday Experience', // VERIFY
    big: '30% off', // VERIFY
    cta: 'Ask for details',
  },
]

// Google reviews from the review block on threecompadres.co.uk, exact and unedited,
// names as displayed there. The section stays hidden while this list is empty.
export const reviews: Review[] = []

// Photos from public/images/site/. Sections fall back to illustration when a slot is null,
// and the gallery only shows when it has photos.
export const photos: {
  barrel: Photo | null
  welcome: Photo | null
  gallery: Photo[]
} = {
  barrel: null,
  welcome: null,
  gallery: [],
}
