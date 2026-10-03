# WeatherRing site

Public marketing site for **WeatherRing** — a 24-hour climate ring for round Wear OS 6+ watches.

- Canonical: https://weatherring.net
- Privacy: https://weatherring.net/privacy
- Contact: support@weatherring.net

This repository is the website only (static HTML/CSS/JS). It is **not** the Android / Wear OS app.

## Pages

- `/` — product
- `/how-to-read/` — how to read the ring
- `/privacy/` — privacy policy (12 September 2026)
- `/llms.txt` — machine-readable facts

## Google Play

Live listing: https://play.google.com/store/apps/details?id=com.climatedayring.phone

All Get WeatherRing buttons, the Google Play badge in the homepage `#get` section, the footer "Google Play" link and the JSON-LD (`downloadUrl`, `installUrl`, `offers.url`) point straight to it.

## Deploy

Source of truth is this repo. Production is served at https://weatherring.net via Caddy on a VPS (not auto GitHub Pages). Sync or pull `main` onto the host and let Caddy serve the static files; there is no `CNAME` / Pages handoff for production.
