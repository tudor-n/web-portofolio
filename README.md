# Web Portofolio — Nicolescu Tudor

A dynamic personal portfolio / CV that loads my projects **live from the GitHub API** and
displays them as responsive cards. Built with plain HTML, CSS and JavaScript — no framework,
no build step — and deployed on Vercel.

🔗 **Live demo:** https://web-portofolio-git-main-tudor-ns-projects.vercel.app/

## Features

- **Profile / About** section with name, role, short bio and GitHub profile photo.
- **Experience** and **Education** sections.
- **Projects pulled live from GitHub** via `fetch` against
  `https://api.github.com/users/tudor-n/repos`.
- **Project cards** showing the repository name, description (with a `Fără descriere
  disponibilă` fallback), main language, star count, fork count and a link to the source.
- **Forks excluded** (`fork === false`) and projects **sorted by last updated**.
- **Live search box** and **language filter buttons** that filter the cards in real time,
  without reloading the page.
- **Loading state** with animated skeleton cards and a spinner.
- **Error handling** — if the API is unreachable or rate-limited, the page shows a friendly
  message instead of crashing.
- **JSON fallback** — if fewer than 5 repositories are returned, or the API call fails, a
  saved list of projects from `projects.json` is shown so the page is never empty.
- **Fully responsive** layout (mobile, tablet, desktop) using CSS Grid and Flexbox.
- Respects `prefers-reduced-motion` for accessibility.

## How it works

On page load, `app.js`:

1. renders skeleton placeholder cards while the request is in flight;
2. fetches the repository list from the public GitHub API;
3. filters out forks and sorts the remaining repos by `updated_at` (newest first);
4. if fewer than 5 own-repos come back, merges in the saved projects from `projects.json`
   (de-duplicated by name);
5. builds the language filter buttons and renders the cards.

If the API call throws (no network, or rate limit reached), the saved `projects.json` list
is shown instead; if even that is unavailable, a friendly error message is displayed.

### A note on rate limiting

The GitHub API is called **directly from the browser**, without an access token. Unauthenticated
requests are limited to **60 per hour per IP**. That limit is normally fine for a portfolio page,
and if it is ever hit the `projects.json` fallback keeps the page populated. Moving the request
behind a token-authenticated proxy (to raise the limit and keep a token out of the frontend) is a
possible next step but is **not implemented in this version**.

## Tech stack

- **HTML5**
- **CSS3** — custom properties, Grid, Flexbox, `clamp()`, animations
- **Vanilla JavaScript** — `fetch`, `async/await`, DOM rendering
- **GitHub REST API**
- **Vercel** — static hosting / deployment
- Fonts: Fraunces, Hanken Grotesk, JetBrains Mono (Google Fonts)

## Project structure

```
web-portofolio/
├── index.html      # page markup and all sections
├── styles.css      # styling (theme variables, responsive grid, animations)
├── app.js          # GitHub fetch, rendering, search, filtering, fallback
├── projects.json   # hardcoded fallback project list
├── vercel.json     # static deploy config (clean URLs)
└── package.json
```

## Run locally

This is a static site, so any static server works. The simplest option:

```bash
npm start
```

This runs `npx serve .` and opens the site on a local port (e.g. http://localhost:3000).

You can also just open `index.html` directly in a browser — note that some browsers
restrict `fetch` for `projects.json` over the `file://` protocol, so a local server is
recommended.

## Deploy on Vercel

1. Push this repository to GitHub.
2. Go to [vercel.com](https://vercel.com) and import the repository.
3. Keep the default settings (no build command needed — the static files live at the repo root).
4. Deploy. Vercel gives you a live URL; paste it at the top of this README.

## Customization

- Edit the profile, experience and education text in `index.html`.
- Change the GitHub username in `app.js` (the `USERNAME` constant).
- Reskin the whole page by changing the `--accent` (and other) CSS variables at the top of
  `styles.css`.
- Update the fallback projects in `projects.json`.
