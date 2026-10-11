# Three Compadres — demo site

Speculative one-page site for Three Compadres, the Latin fusion restaurant and bar inside Broadway Market, Tooting.
Static front end only: no backend, CMS, payments or embeds. "Book a table" opens the venue's existing Easytable and TheFork pages.

Built with Vite, React, TypeScript and Framer Motion.

## Run it

```bash
npm install
npm run dev      # local dev server
npm run build    # type-check and build to dist/
npm run preview  # serve the build
```

## Content

Everything about the venue (copy, menu, drinks, hours, links, offers, reviews, photos) lives in
[`src/data/venue.ts`](src/data/venue.ts). Lines marked `// VERIFY` aren't on the venue's own site and need
confirming with them. The page title, meta description and Restaurant JSON-LD are generated from the same file
at build time (see `vite.config.ts`).

- **Logo:** `public/images/logo.png` (transparent PNG). The nav and footer fall back to the name in text if it's missing.
- **Hero:** `venue.heroArt` picks the animated SVG faces (`'faces'`) or the static logo (`'logo'`).
- **Photos:** `scripts/fetch-images.sh` downloads the venue's photos into `public/images/site/`. Add them to
  `photos` in `venue.ts`: `barrel` and `welcome` slots, plus `gallery` (the gallery section only shows when it has photos).
- **Reviews:** add Google reviews to `reviews` in `venue.ts`, word for word. The section stays hidden while it's empty.

## Deploy

`.github/workflows/deploy.yml` builds and deploys to GitHub Pages on every push to `main`, and can be run by hand
from the Actions tab. In the repo settings, set **Pages → Source** to **GitHub Actions**.

## Also in this repo

[`mimos/`](mimos/) is a separate static demo for Mimo's Lounge, Bar & Grill, Tooting. No build step: the deploy
workflow copies it into the Pages build, where it's served at `/mimos/`. See [`mimos/README.md`](mimos/README.md).

---

Site by AlexWilder-Dev
