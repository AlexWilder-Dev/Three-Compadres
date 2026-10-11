import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { brand, locationIds, locations, media } from './src/data/venue'

const DAY_SCHEMA = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

const toClock = (minutes: number) =>
  `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`

const escapeHtml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

// One Restaurant entry per site, under the brand.
function jsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: brand.name,
    url: brand.website,
    logo: media.logo,
    foundingDate: String(brand.founded), // VERIFY
    sameAs: Object.values(brand.social).map((s) => s.url),
    subOrganization: locationIds.map((id) => {
      const site = locations[id]
      return {
        '@type': 'Restaurant',
        name: `${brand.name} ${site.name}`,
        servesCuisine: ['Burgers', 'American'],
        acceptsReservations: site.bookUrl,
        telephone: site.phone.tel,
        email: site.email,
        image: site.poster,
        address: {
          '@type': 'PostalAddress',
          streetAddress: [site.address.street, site.address.extra].filter(Boolean).join(', '),
          addressLocality: site.address.locality,
          postalCode: site.address.postcode,
          addressCountry: 'GB',
        },
        geo: { '@type': 'GeoCoordinates', latitude: site.geo.lat, longitude: site.geo.lng },
        // Leadenhall's weekday "late" is entered as 11pm. VERIFY
        openingHoursSpecification: site.hours.flatMap((hours, day) =>
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
      }
    }),
  }
}

// Fills the page head from src/data/venue.ts so the content stays in one place.
function siteHead(): Plugin {
  return {
    name: 'site-head',
    transformIndexHtml(html) {
      const json = JSON.stringify(jsonLd(), null, 2).replace(/</g, '\\u003c')
      return html
        .replaceAll('__SITE_TITLE__', escapeHtml(`${brand.name} · ${brand.tagline}`))
        .replaceAll('__SITE_DESCRIPTION__', escapeHtml(brand.description))
        .replaceAll('__SITE_NAME__', escapeHtml(brand.name))
        .replaceAll('__SITE_IMAGE__', escapeHtml(media.leadenhall.market))
        .replaceAll('__SITE_LOCALE__', brand.locale)
        .replace('__SITE_JSONLD__', json)
    },
  }
}

export default defineConfig({
  base: './',
  plugins: [react(), siteHead()],
})
