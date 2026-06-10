# Web Portofolio — Nicolescu Tudor

A dynamic personal portfolio / CV that loads my projects **live from the GitHub API** and
displays them as responsive cards. Built with plain HTML, CSS and JavaScript — no framework,
no build step — and deployed on Vercel.

🔗 **Live demo:** https://web-portofolio.vercel.app  <!-- replace with your real Vercel URL after deploy -->

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
- **JSON fallback** — if fewer than 5 repositories are returned (or the API fails), a saved
  list of projects from `projects.json` is shown.
- **Fully responsive** layout (mobile, tablet, desktop) using CSS Grid and Flexbox.
- Respects `prefers-reduced-motion` for accessibility.

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
├── public/
│   ├── index.html      # page markup and all sections
│   ├── styles.css      # styling (theme variables, responsive grid, animations)
│   ├── app.js          # GitHub fetch, rendering, search, filtering, fallback
│   └── projects.json   # hardcoded fallback project list
├── vercel.json         # serves the public/ folder as a static site
└── package.json
```

## Run locally

This is a static site, so any static server works. The simplest option:

```bash
npm start
```

This runs `npx serve public` and opens the site on a local port (e.g. http://localhost:3000).

You can also just open `public/index.html` directly in a browser — note that some browsers
restrict `fetch` for `projects.json` over the `file://` protocol, so a local server is
recommended.

## Deploy on Vercel

1. Push this repository to GitHub.
2. Go to [vercel.com](https://vercel.com) and import the repository.
3. Keep the default settings (no build command needed — `vercel.json` serves `public/`).
4. Deploy. Vercel gives you a live URL; paste it at the top of this README.

## Customization

- Edit the profile, experience and education text in `public/index.html`.
- Change the GitHub username in `public/app.js` (the `USERNAME` constant).
- Reskin the whole page by changing the `--accent` (and other) CSS variables at the top of
  `public/styles.css`.
- Update the fallback projects in `public/projects.json`.
