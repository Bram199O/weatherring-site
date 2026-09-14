# WeatherRing site

Public marketing site for **WeatherRing** — a 24-hour climate ring for round Wear OS watches.

- Canonical: https://weatherring.net
- Privacy: https://weatherring.net/privacy
- Contact: weatherring@protoart.net

This repository is the website only (static HTML/CSS/JS). It is **not** the Android / Wear OS app.

## Pages

- `/` — product
- `/how-to-read/` — how to read the ring
- `/privacy/` — privacy policy (12 September 2026)
- `/llms.txt` — machine-readable facts

## Google Play

The Get WeatherRing CTA is a Play Store placeholder until the listing is live. Set `PLAY_STORE_URL` in the exporter (or replace the `#get` badge href) when you have the URL. No email waitlist.

## Deploy

Source of truth is this repo. Production is served at https://weatherring.net via Caddy on a VPS (not auto GitHub Pages). Sync or pull `main` onto the host and let Caddy serve the static files; there is no `CNAME` / Pages handoff for production.
