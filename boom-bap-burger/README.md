# Boom Bap Burger — demo site

Speculative front end for Boom Bap Burger, the hip-hop burger bar at Leadenhall Market (EC3) and Tooting Market (SW17).
Static data only: no CMS, database, payments or backend. Booking, delivery and the mailing list are plain links to the
venue's existing Dojo, Deliveroo and Mailchimp pages.

Built with Vite, React, TypeScript, React Router (hash routing, so refreshes work on GitHub Pages) and Framer Motion.

## Run it

```bash
npm install
npm run dev      # local dev server
npm run build    # type-check and build to dist/
npm run preview  # serve the build
```

## Pages

- **Home:** hero with the chosen site's video, signature burgers, marquee, story, both sites, Instagram strip
- **Menu:** "Burgers & B-Sides" as a record. A-Side burgers, B-Side sides, Veggie / Plant-based / Halal filters, drinks
- **Locations:** illustrated London map with both pins, full hours, contact, takeaway or delivery
- **Events:** Friday DJ and Premier League football at Tooting, groups and hire at both, artist contact
- **Book:** one card per site with its Dojo link, email and phone

The header switch (Leadenhall / Tooting) is remembered in `localStorage` and swaps hours, phone, booking link,
takeaway option, hero video and events across the site. On phones a bottom bar keeps Book and Call for that site in reach.

## Content

Everything about the venue (both sites, hours, menu, drinks, events, links, copy) lives in
[`src/data/venue.ts`](src/data/venue.ts). Lines marked `// VERIFY` need confirming with the venue:

- Leadenhall's weekday closing is listed as "late"; the live open/closed badge treats it as 11pm
- "Est. 2015"
- Menu prices come from the Tooting delivery listing and may differ for dine-in

Photos, stickers, the logo and videos are hotlinked from boombapburger.com through the single `IMG` base constant.
If any of them fail to load, the layout falls back to a halftone panel (photos), the name in the display face (logo)
or the poster image (videos), and stickers are simply left out.

The page title, description and Restaurant JSON-LD for both sites are generated from the same file at build time
(see `vite.config.ts`).

## Deploy

In this repo, `.github/workflows/deploy.yml` at the root builds this folder alongside the main site and publishes it
under `/boom-bap-burger/`. The build uses a relative base path, so it works from any subfolder.

If this folder is moved into a repo of its own, its `.github/workflows/deploy.yml` deploys it to GitHub Pages on every
push to `main`. In the repo settings, set **Pages → Source** to **GitHub Actions**.

---

Site by AlexWilder-Dev
