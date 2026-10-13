import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { venue } from './src/data/venue'

const DAY_SCHEMA = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

const toClock = (minutes: number) =>
  `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`

const escapeHtml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

// Restaurant structured data. Address, phone and hours come from their OpenTable listing. VERIFY
function restaurantJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: venue.name,
    description: venue.seo.description,
    url: venue.website,
    servesCuisine: venue.seo.cuisine,
    acceptsReservations: true,
    telephone: venue.phone.tel, // VERIFY
    address: {
      '@type': 'PostalAddress',
      streetAddress: venue.address.streetAddress, // VERIFY
      addressLocality: venue.address.locality,
      postalCode: venue.address.postcode, // VERIFY
      addressCountry: venue.address.country,
    },
    openingHoursSpecification: venue.hours.flatMap((hours, day) => // VERIFY
      hours
        ? [
            {
              '@type': 'OpeningHoursSpecification',
              dayOfWeek: `https://schema.org/${DAY_SCHEMA[day]}`,
              opens: toClock(hours.open),
              closes: toClock(hours.close),
            },
          ]
        : [],
    ),
    sameAs: [venue.social.instagram, venue.social.tiktok],
  }
}

// Fills the page head from src/data/venue.ts so the content stays in one place.
function venueHead(): Plugin {
  return {
    name: 'venue-head',
    transformIndexHtml(html) {
      const jsonLd = JSON.stringify(restaurantJsonLd(), null, 2).replace(/</g, '\\u003c')
      return html
        .replaceAll('__VENUE_TITLE__', escapeHtml(venue.seo.title))
        .replaceAll('__VENUE_DESCRIPTION__', escapeHtml(venue.seo.description))
        .replaceAll('__VENUE_NAME__', escapeHtml(venue.name))
        .replaceAll('__VENUE_LOCALE__', venue.seo.locale)
        .replaceAll('__VENUE_URL__', escapeHtml(venue.seo.siteUrl))
        .replaceAll('__VENUE_IMAGE__', escapeHtml(new URL(venue.seo.image, venue.seo.siteUrl).href))
        .replaceAll('__VENUE_IMAGEALT__', escapeHtml(venue.seo.imageAlt))
        .replace('__VENUE_JSONLD__', jsonLd)
    },
  }
}

export default defineConfig({
  base: './',
  plugins: [react(), venueHead()],
})
