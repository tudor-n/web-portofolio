const USERNAME = "tudor-n";
const API_ENDPOINT = `https://api.github.com/users/${USERNAME}/repos?per_page=100&sort=updated`;
const FALLBACK_FILE = "projects.json";
const MIN_PROJECTS = 5;
const SKELETON_COUNT = 6;

const grid = document.getElementById("projects");
const statusEl = document.getElementById("status");
const filtersEl = document.getElementById("filters");
const searchEl = document.getElementById("search");

let allRepos = [];
let activeLanguage = "All";
let searchTerm = "";

document.addEventListener("DOMContentLoaded", init);

async function init() {
  showSkeletons();
  try {
    const repos = await fetchRepos();
    let projects = repos.filter((repo) => repo.fork === false);
    projects.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

    if (projects.length < MIN_PROJECTS) {
      setStatus(
        `Only ${projects.length} GitHub project(s) found — showing a few highlighted projects as well.`
      );
      const fallback = await loadFallback();
      projects = mergeUnique(projects, fallback);
    } else {
      setStatus(`Showing ${projects.length} projects, most recently updated first.`);
    }

    allRepos = projects;
    buildFilters();
    render();
  } catch (error) {
    handleError(error);
  }
}

async function fetchRepos() {
  const response = await fetch(API_ENDPOINT);
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
  const data = await response.json();
  if (!Array.isArray(data)) {
    throw new Error("Unexpected response shape from the API.");
  }
  return data;
}

async function loadFallback() {
  try {
    const response = await fetch(FALLBACK_FILE);
    if (!response.ok) return [];
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

async function handleError(error) {
  console.error(error);
  const fallback = await loadFallback();
  if (fallback.length) {
    allRepos = fallback;
    setStatus("Couldn't reach GitHub right now — showing a saved list of projects instead.");
    buildFilters();
    render();
  } else {
    grid.innerHTML = "";
    setStatus("Ups! Nu am putut încărca proiectele momentan. Please try again later.");
  }
}

function mergeUnique(primary, extra) {
  const seen = new Set(primary.map((repo) => repo.name.toLowerCase()));
  const merged = primary.slice();
  for (const repo of extra) {
    if (!seen.has(repo.name.toLowerCase())) {
      merged.push(repo);
      seen.add(repo.name.toLowerCase());
    }
  }
  return merged;
}

function render() {
  const visible = allRepos.filter((repo) => {
    const matchesLanguage = activeLanguage === "All" || repo.language === activeLanguage;
    const haystack = `${repo.name} ${repo.description || ""}`.toLowerCase();
    const matchesSearch = haystack.includes(searchTerm.toLowerCase());
    return matchesLanguage && matchesSearch;
  });

  grid.innerHTML = "";

  if (!visible.length) {
    grid.appendChild(emptyState());
    return;
  }

  for (const repo of visible) {
    grid.appendChild(buildCard(repo));
  }
}

function buildCard(repo) {
  const card = document.createElement("article");
  card.className = "card";

  const title = document.createElement("h3");
  title.textContent = repo.name;

  const desc = document.createElement("p");
  desc.className = "desc";
  desc.textContent = repo.description || "Fără descriere disponibilă";

  const meta = document.createElement("div");
  meta.className = "meta";

  if (repo.language) {
    const lang = document.createElement("span");
    lang.className = "lang";
    const dot = document.createElement("span");
    dot.className = "dot";
    const langName = document.createElement("span");
    langName.textContent = repo.language;
    lang.append(dot, langName);
    meta.appendChild(lang);
  }

  const stars = document.createElement("span");
  stars.textContent = `★ ${repo.stargazers_count ?? 0}`;
  const forks = document.createElement("span");
  forks.textContent = `⑂ ${repo.forks_count ?? 0}`;
  meta.append(stars, forks);

  const link = document.createElement("a");
  link.className = "repo-link";
  link.href = repo.html_url;
  link.target = "_blank";
  link.rel = "noopener";
  link.textContent = "View source →";

  card.append(title, desc, meta, link);
  return card;
}

function buildFilters() {
  const languages = Array.from(
    new Set(allRepos.map((repo) => repo.language).filter(Boolean))
  ).sort();
  const options = ["All", ...languages];

  filtersEl.innerHTML = "";
  for (const label of options) {
    const button = document.createElement("button");
    button.className = "filter-btn" + (label === activeLanguage ? " active" : "");
    button.textContent = label;
    button.addEventListener("click", () => {
      activeLanguage = label;
      buildFilters();
      render();
    });
    filtersEl.appendChild(button);
  }
}

searchEl.addEventListener("input", (event) => {
  searchTerm = event.target.value.trim();
  render();
});

function emptyState() {
  const message = document.createElement("p");
  message.id = "status";
  message.textContent = "No projects match your search.";
  return message;
}

function showSkeletons() {
  setStatus("");
  statusEl.innerHTML = '<span class="spinner"></span>Loading projects…';
  grid.innerHTML = "";
  for (let i = 0; i < SKELETON_COUNT; i++) {
    const card = document.createElement("article");
    card.className = "card skeleton";
    card.innerHTML =
      '<div class="bar" style="width:60%"></div>' +
      '<div class="bar"></div>' +
      '<div class="bar" style="width:80%"></div>' +
      '<div class="bar" style="width:40%"></div>';
    grid.appendChild(card);
  }
}

function setStatus(text) {
  statusEl.textContent = text;
}
