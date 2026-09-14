# WeatherRing site

Public marketing site for **WeatherRing** — a 24-hour climate ring for round Wear OS watches.

- Canonical: https://climatedayring.app
- Privacy: https://climatedayring.app/privacy
- Contact: weatherring@protoart.net

This repository is the website only (static HTML/CSS/JS). It is **not** the Android / Wear OS app, and it is not a fork of ClimateDayRing.

## Pages

- `/` — product
- `/how-to-read/` — how to read the ring
- `/privacy/` — privacy policy (12 September 2026)
- `/llms.txt` — machine-readable facts

## Deploy

GitHub Pages from branch `main`, folder `/` (root). `CNAME` is already `climatedayring.app`.

1. Repo **Settings → Pages**
2. Source: **Deploy from a branch**
3. Branch: `main` / `/` (root)
4. Save. Point the domain’s DNS at GitHub Pages if it is not already.
