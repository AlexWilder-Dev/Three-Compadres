// Everything about Boom Bap Burger lives here: brand, both sites, menu, drinks, events and media.
// Lines marked VERIFY need confirming with the venue before this goes anywhere near live.

/** Every photo, graphic and video is hotlinked from the venue's own site. */
export const IMG = 'https://boombapburger.com/wp-content/uploads/'

export const media = {
  logo: `${IMG}2023/12/boom-bap-burger-london.png`, // white on transparent, 280x96
  stickers: {
    beerCocktails: `${IMG}2023/12/Boom-Bap-Burger-Beer-Cocktails.png`,
    londonBeer: `${IMG}2023/12/Boom-Bap-Burger-London-Beer.png`,
  },
  leadenhall: {
    market: `${IMG}2023/12/boom-bap-burger-leadenhall-market.jpeg`,
    restaurantBar: `${IMG}2023/12/Boom-Bap-Burger-Restaurant-Bar-Leadenhall-Market-768x768.jpeg`,
    lunch: `${IMG}2023/12/Boom-Bap-Leadenhall-Market-Lunch.jpeg`,
    frontage: `${IMG}2023/12/Boom-Bap-Burger-Leadenahall-Market.jpeg`, // their spelling
  },
  tooting: {
    market: `${IMG}2023/12/Boom-Bap-Burger-Tooting-Market-919x1024.jpeg`,
  },
  vibe: {
    insta: `${IMG}2024/01/240124_BB_Insta-1-1024x1024.jpg`,
    beastieBoys: `${IMG}2024/01/Beastie-Boys-2-1024x768.jpg`,
    beers: `${IMG}2023/12/Boom-Bap-Burger-Beers-1024x768.jpg`,
  },
  video: {
    leadenhall: `${IMG}2023/12/Boom-Bap-Burger-Hip-hop-is-taking-over.webm`,
    cocktails: `${IMG}2023/12/Cock-Tails.webm`,
    tooting: `${IMG}2023/12/BOOMBAP.webm`,
  },
}

export const brand = {
  name: 'Boom Bap Burger',
  tagline: 'beers + burgers + cocktails',
  strapline: "Flippin' meats, droppin' beats",
  website: 'https://boombapburger.com',
  founded: 2015, // VERIFY
  timeZone: 'Europe/London',
  locale: 'en_GB',
  description:
    'Hip-hop burger bar with two London sites, Leadenhall Market EC3 and Tooting Market SW17. 28-day aged beef from HG Walter, beers, cocktails and Friday DJs.',
  social: {
    instagram: { label: 'Instagram', handle: '@boombapburger', url: 'https://www.instagram.com/boombapburger/' },
    tiktok: { label: 'TikTok', handle: '@boom.bap.burger', url: 'https://www.tiktok.com/@boom.bap.burger' },
    facebook: { label: 'Facebook', handle: 'BoomBapBurger', url: 'https://www.facebook.com/BoomBapBurger' },
  },
  newsletter:
    'https://boombapburger.us5.list-manage.com/subscribe?u=57b4b99973a998a4c5427ad4e&id=8be396e7a6',
  artistsEmail: 'paradise@boombapburger.com',
  marquee: ['Beers + burgers + cocktails', '28-day aged beef', "Flippin' meats, droppin' beats"],
}

export const story = {
  heading: 'It all starts with a great burger…',
  paragraphs: [
    'Ours starts at HG Walter, a family butcher that has been cutting meat in London since the 70s. They source our beef from British free-range farmers, and we keep it that way: sustainable sourcing is sacrosanct.',
    "From there it's 28-day aged beef, double cheese, Boom Bap sauce and the volume turned up. Cold beers, cocktails shaken, hip hop on the speakers.",
  ],
  facts: [
    { value: "Since the '70s", label: 'HG Walter, London family butchers' },
    { value: 'British', label: 'Free-range farmers, sustainably sourced' },
    { value: '28-day', label: 'Aged beef, every patty' },
  ],
}

/* ------------------------------------------------------------------ */
/* Locations                                                           */
/* ------------------------------------------------------------------ */

export interface OpeningHours {
  /** Minutes after midnight. */
  open: number
  close: number
  /** Shown in place of the closing time, e.g. "late". */
  closeLabel?: string
}

export type LocationId = 'leadenhall' | 'tooting'

export type Takeaway =
  | { kind: 'call'; label: string; detail: string; cta: string }
  | { kind: 'delivery'; label: string; detail: string; cta: string; href: string }

export interface Location {
  id: LocationId
  name: string
  short: string
  code: string
  area: string
  blurb: string
  address: { street: string; extra?: string; locality: string; postcode: string }
  phone: { display: string; tel: string }
  email: string
  bookUrl: string
  geo: { lat: number; lng: number }
  /** Index 0 = Sunday. `null` = closed all day. */
  hours: (OpeningHours | null)[]
  hoursTitle: string
  /** Label for today's hours on cards. */
  todayLabel: string
  /** First word of the live badge, e.g. "Open now" or "Kitchen open". */
  openWord: string
  closedWord: string
  hoursNote?: string
  takeaway: Takeaway
  video: string
  poster: string
  photos: { card: string; gallery: { src: string; alt: string }[] }
}

const t = (clock: string) => {
  const [h, m = '0'] = clock.split(':')
  return Number(h) * 60 + Number(m)
}
const hrs = (open: string, close: string, closeLabel?: string): OpeningHours => ({
  open: t(open),
  close: t(close),
  closeLabel,
})

const leadenhallWeekday = hrs('11:30', '23:00', 'late') // "late" treated as 11pm. VERIFY

export const locations: Record<LocationId, Location> = {
  leadenhall: {
    id: 'leadenhall',
    name: 'Leadenhall Market',
    short: 'Leadenhall',
    code: 'EC3',
    area: 'The City',
    blurb: 'Burgers, beers and cocktails in the middle of the City, inside Leadenhall Market.',
    address: { street: '29–30 Leadenhall Market', locality: 'London', postcode: 'EC3V 1LR' },
    phone: { display: '020 7623 4494', tel: '+442076234494' },
    email: 'ec3bookings@boombapburger.com',
    bookUrl:
      'https://web.dojo.app/create_booking/vendor/x0PPmUM0mOIAnq5junj67DB_4BgwnUtkLiwVwXf3QP4_restaurant',
    geo: { lat: 51.5126609, lng: -0.0832931 },
    hours: [
      hrs('12:00', '16:00'), // Sun
      leadenhallWeekday, // Mon
      leadenhallWeekday, // Tue
      leadenhallWeekday, // Wed
      leadenhallWeekday, // Thu
      leadenhallWeekday, // Fri
      hrs('12:00', '18:00'), // Sat
    ],
    hoursTitle: 'Opening hours',
    todayLabel: 'Today',
    openWord: 'Open now',
    closedWord: 'Closed',
    takeaway: {
      kind: 'call',
      label: 'Takeaway',
      detail: 'Call ahead and we’ll have it ready.',
      cta: 'Call to order',
    },
    video: media.video.leadenhall,
    poster: media.leadenhall.market,
    photos: {
      card: media.leadenhall.frontage,
      gallery: [
        { src: media.leadenhall.frontage, alt: 'Boom Bap Burger in Leadenhall Market' },
        { src: media.leadenhall.restaurantBar, alt: 'The restaurant and bar at Leadenhall Market' },
        { src: media.leadenhall.lunch, alt: 'Lunch at Boom Bap Burger, Leadenhall Market' },
      ],
    },
  },
  tooting: {
    id: 'tooting',
    name: 'Tooting Market',
    short: 'Tooting',
    code: 'SW17',
    area: 'South London',
    blurb: 'Our south London home inside Tooting Market, with a DJ every Friday and the football on.',
    address: {
      street: 'Unit 2, Tooting Market',
      extra: '20 Totterdown St',
      locality: 'London',
      postcode: 'SW17 8TA',
    },
    phone: { display: '020 8672 8065', tel: '+442086728065' },
    email: 'sw17bookings@boombapburger.com',
    bookUrl:
      'https://web.dojo.app/create_booking/vendor/Nd-2aPsQhc8aHGCE8udzkvnjtHht_uuUMjhX5koHVlU_restaurant',
    geo: { lat: 51.4290647, lng: -0.1656204 },
    hours: [
      hrs('12:00', '21:00'), // Sun
      hrs('12:00', '21:00'), // Mon
      hrs('12:00', '21:00'), // Tue
      hrs('12:00', '22:00'), // Wed
      hrs('12:00', '22:00'), // Thu
      hrs('12:00', '22:30'), // Fri
      hrs('12:00', '22:30'), // Sat
    ],
    hoursTitle: 'Kitchen hours',
    todayLabel: 'Kitchen today',
    openWord: 'Kitchen open',
    closedWord: 'Kitchen closed',
    hoursNote: 'The bar stays open after the kitchen closes.',
    takeaway: {
      kind: 'delivery',
      label: 'Delivery',
      detail: 'Get it delivered with Deliveroo.',
      cta: 'Order on Deliveroo',
      href: 'https://deliveroo.co.uk/menu/london/tooting/boom-bap-burger',
    },
    video: media.video.tooting,
    poster: media.tooting.market,
    photos: {
      card: media.tooting.market,
      gallery: [{ src: media.tooting.market, alt: 'Boom Bap Burger in Tooting Market' }],
    },
  },
}

export const locationIds: LocationId[] = ['leadenhall', 'tooting']
export const DEFAULT_LOCATION: LocationId = 'leadenhall'

/* ------------------------------------------------------------------ */
/* Menu: Burgers & B-Sides                                             */
/* ------------------------------------------------------------------ */

export type Diet = 'veggie' | 'plant-based' | 'halal'

export const dietLabels: Record<Diet, string> = {
  veggie: 'Veggie',
  'plant-based': 'Plant-based',
  halal: 'Halal',
}

/** Layers for the illustrated burger stacks, bottom to top. */
export type BurgerLayer =
  | 'bunBottom'
  | 'bunTop'
  | 'patty'
  | 'smash'
  | 'cheese'
  | 'bacon'
  | 'pork'
  | 'lettuce'
  | 'onion'
  | 'pickles'
  | 'chilli'
  | 'sauce'

export interface MenuItem {
  id: string
  name: string
  price: number
  description?: string
  diet?: Diet[]
  signature?: boolean
  layers?: BurgerLayer[]
}

// VERIFY: prices come from the Tooting delivery listing; dine-in prices may differ.
export const aSide: MenuItem[] = [
  {
    id: 'notorious-pig',
    name: 'The Notorious P.I.G.',
    price: 14.5,
    description:
      'Dry-aged beef patty, slow-roasted shredded pork shoulder, streaky bacon, double cheese, Boom Bap sauce',
    signature: true,
    layers: ['bunBottom', 'sauce', 'patty', 'cheese', 'pork', 'bacon', 'cheese', 'bunTop'],
  },
  {
    id: 'smashed-burger',
    name: 'Smashed Burger',
    price: 12,
    description: 'Two smashed patties, double cheese, Boom Bap sauce',
  },
  {
    id: '2-pac-smash',
    name: '2 Pac Smash',
    price: 12,
    description: 'Two smashed patties, pickled white onion, bacon, cheese',
    layers: ['bunBottom', 'smash', 'cheese', 'smash', 'bacon', 'onion', 'bunTop'],
  },
  {
    id: 'cheese-burger',
    name: 'Cheese Burger',
    price: 11,
    description: 'Dry-aged beef, double cheese, lettuce, onion, pickles, Boom Bap sauce',
  },
  {
    id: 'bacon-cheese-burger',
    name: 'Bacon Cheese Burger',
    price: 12,
    description: 'Dry-aged beef, bacon, double cheese, lettuce, red onion, pickles, Boom Bap sauce',
  },
  {
    id: 'green-chilli-cheese',
    name: 'Green Chilli Cheese Burger',
    price: 12.5,
    description: 'Aged beef, double cheese, green chilli, lettuce, onion, pickles, burger sauce',
    layers: ['bunBottom', 'lettuce', 'patty', 'cheese', 'cheese', 'chilli', 'onion', 'pickles', 'bunTop'],
  },
  {
    id: 'blue-cheese-burger',
    name: 'Blue Cheese Burger',
    price: 12.5,
    description: 'Dry-aged beef, blue cheese, lettuce, onion, pickles, burger sauce',
  },
  {
    id: 'chicken-burger',
    name: 'Chicken Burger',
    price: 14,
    description: 'Buttermilk-fried chicken thigh, lettuce, tomato, pickles, Boom Slap sauce',
    diet: ['halal'],
  },
  {
    id: 'mushroom-halloumi',
    name: 'Mushroom & Halloumi',
    price: 12,
    description:
      'Portobello mushroom, sun-dried tomato, grilled halloumi, tomato, lettuce, onion, pickles, Boom Bap sauce',
    diet: ['veggie'],
  },
  {
    id: 'plant-based-bacon-cheese',
    name: 'Plant Based Bacon Cheese',
    price: 15,
    description: 'Plant patty, vegan bacon, vegan cheese, vegan ranch, lettuce, onion, pickles',
    diet: ['plant-based'],
    layers: ['bunBottom', 'lettuce', 'patty', 'cheese', 'bacon', 'sauce', 'onion', 'pickles', 'bunTop'],
  },
]

// VERIFY: prices come from the Tooting delivery listing; dine-in prices may differ.
export const bSides: MenuItem[] = [
  { id: 'fries', name: 'Fries', price: 4 },
  { id: 'sweet-potato-fries', name: 'Sweet Potato Fries', price: 4.5 },
  { id: 'onion-rings', name: 'Onion Rings', price: 4 },
  { id: 'cheesy-fries', name: 'Cheesy Fries', price: 6.5 },
  { id: 'pulled-pork-fries', name: 'Pulled Pork Fries', price: 9 },
  {
    id: 'beef-chilli-fries',
    name: 'Beef Chilli Fries',
    price: 9,
    description: '28-day aged beef, 6-hour chilli, cheddar, fresh chillies',
  },
  { id: 'chicken-wings', name: 'Chicken Wings', price: 8, description: '24-hour confit, buffalo sauce. Very hot.' },
  { id: 'slaw', name: 'Slaw', price: 3.5 },
  { id: 'green-chilli-relish', name: 'Green Chilli Relish', price: 1.5 },
  { id: 'burger-sauce', name: 'Burger Sauce / Spicy Burger Sauce', price: 1 },
]

/** The four on the home page, in order. */
export const signatureIds = ['notorious-pig', '2-pac-smash', 'green-chilli-cheese', 'plant-based-bacon-cheese']

/* ------------------------------------------------------------------ */
/* Drinks (no prices published, so none shown)                         */
/* ------------------------------------------------------------------ */

export const drinks = {
  houseBeers: [
    { name: 'Boom Bap Lager', note: 'House lager' },
    { name: 'Boom Bap Pale', note: 'House pale ale' },
  ],
  beers: ['Guinness', 'Stella Artois', 'Mahou', 'Camden Hells', 'Camden Pale'],
  cocktails: 'All the classics, plus house specials. Ask the bar what’s shaking.',
  spirits: ['Gins', 'Rums', 'Vodkas', 'Tequilas'],
}

/* ------------------------------------------------------------------ */
/* Events                                                              */
/* ------------------------------------------------------------------ */

export type EventIcon = 'decks' | 'football' | 'group' | 'door'

export interface VenueEvent {
  id: string
  title: string
  when: string
  blurb: string
  icon: EventIcon
  /** Weekly repeat, 0 = Sunday. Used to show the next date. */
  weekday?: number
  tags?: string[]
}

export const events: Record<LocationId, VenueEvent[]> = {
  leadenhall: [],
  tooting: [
    {
      id: 'dj-fridays',
      title: 'Live DJ every Friday',
      when: 'Every Friday',
      blurb: 'Burgers, beers and a DJ on the decks. Bring your crew.',
      icon: 'decks',
      weekday: 5,
      tags: ['Old skool', 'New skool', 'Hip hop', 'Funk', 'House'],
    },
    {
      id: 'football',
      title: 'Live Premier League football',
      when: 'Matchdays',
      blurb: 'Catch the Premier League live with a burger in one hand and a pint in the other.',
      icon: 'football',
    },
  ],
}

/** True at both sites. */
export const everywhere: VenueEvent[] = [
  {
    id: 'groups',
    title: 'Groups & exclusive hire',
    when: 'Drop us a line',
    blurb:
      'Birthdays, leaving dos, work lunches or the whole place to yourselves. Both sites take groups and private or exclusive hire.',
    icon: 'group',
  },
  {
    id: 'walk-ins',
    title: 'Walk-ins welcome',
    when: 'When there’s space',
    blurb: 'No booking? Swing by. If there’s a table, it’s yours.',
    icon: 'door',
  },
]
