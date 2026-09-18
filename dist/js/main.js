"use strict";
// Replace these values when personal contact links are ready.
const profile = { telegram: "https://t.me/qwelskw211", email: "qwelskw211@gmail.com", github: "https://github.com/23DP3DBesp", instagram: "https://www.instagram.com/qwelskw211/" };
const projects = [
  {
    category: "web",
    name: "E-CATALOG",
    description: "AI powered product catalog",
    tech: ["Vue", "JavaScript", "Database", "AI"],
    image: "assets/images/project-01.jpg",
    story:
      "A product discovery concept for a tire catalog. The interface explores natural-language search, clear product comparisons and a focused path from browsing to finding the right fit.",
    detail:
      "The proposed stack connects a Vue interface to a searchable product database and an AI-assisted discovery layer.",
  },
  {
    category: "web",
    name: "MUSIC PLAYER",
    description: "Modern web music experience",
    tech: ["JavaScript", "API", "UI"],
    image: "assets/images/project-02.jpg",
    story:
      "A music player concept built around a distraction-free listening experience. Album artwork, a clear playback hierarchy and a responsive library give the music room to breathe.",
    detail:
      "The design explores playlist navigation, track discovery and accessible playback controls.",
  },
  {
    category: "web",
    name: "WEB APPLICATION",
    description: "Full stack project",
    tech: ["C#", ".NET", "SQL"],
    image: "assets/images/project-03.jpg",
    story:
      "A full stack application concept bringing a structured backend and a clear frontend together. The focus is predictable navigation and readable information.",
    detail:
      "The proposed architecture uses a .NET API, C# business logic and a SQL data layer.",
  },
  {
    category: "design",
    name: "EXPERIMENTS",
    description: "UI and frontend experiments",
    tech: ["HTML", "CSS", "JavaScript"],
    image: "assets/images/project-04.jpg",
    story:
      "A collection of interface explorations: typography, layout, motion and small interactions. A space to question familiar patterns and make the web feel more considered.",
    detail:
      "Built around browser-native capabilities, responsive CSS and lightweight JavaScript.",
  },
];
// Keep each icon next to its label so changing the order cannot mismatch them.
const skills = [
  { title: "HTML / CSS / VUE", description: "Structure & style", icon: "web" },
  { title: "JAVASCRIPT", description: "Interactive experiences", icon: "javascript" },
  { title: "ADOBE PHOTOSHOP", description: "Visual design & editing", icon: "photoshop" },
  { title: "ADOBE AFTER EFFECTS", description: "Motion graphics & video", icon: "after-effects" },
  { title: "ADOBE LIGHTROOM", description: "Photo editing & color grading", icon: "lightroom" },
  { title: "GIT", description: "Version control", icon: "git" },
];
document.querySelector(".skills").innerHTML = skills
  .map(
    ({ title, description, icon }) =>
      `<div class="skill"><img class="skill-icon" src="assets/icons/${icon}.svg" alt="" aria-hidden="true" width="28" height="28"><div><h3>${title}</h3><p>${description}</p></div></div>`,
  )
  .join("");
document.querySelector("#project-grid").innerHTML = projects
  .map(
    (p, i) =>
      `<article class="project-card" data-category="${p.category}"><div class="project-image"><img src="${p.image}" alt="${p.name} concept preview" loading="lazy"></div><div class="project-body"><span class="project-index">PROJECT 0${i + 1}</span><h3>${p.name}</h3><p>${p.description}</p><div class="project-tech">${p.tech.join(" / ")}</div><button data-project="${i}" aria-label="View ${p.name}">VIEW PROJECT <span>→</span></button></div></article>`,
  )
  .join("");
const filterButtons = document.querySelectorAll("[data-filter]");
function filterProjects(category) {
  let count = 0;
  document.querySelectorAll(".project-card").forEach(card => {
    card.hidden = category !== "all" && card.dataset.category !== category;
    if (!card.hidden) { count++; card.classList.add("is-visible"); }
  });
  filterButtons.forEach(button => button.setAttribute("aria-pressed", String(button.dataset.filter === category)));
  document.querySelector("#project-empty").hidden = count !== 0;
  document.querySelector("#project-count").textContent = window.portfolioLanguage === "ru" ? `Работ: ${count}` : `Projects: ${count}`;
}
filterButtons.forEach(button => button.addEventListener("click", () => filterProjects(button.dataset.filter)));
document.querySelector('.section-heading a').addEventListener('click', () => filterProjects('all'));
document.addEventListener('languagechange', () => filterProjects(document.querySelector('[data-filter][aria-pressed="true"]').dataset.filter));
filterProjects('all');
const menu = document.querySelector(".menu-toggle"),
  nav = document.querySelector(".navigation");
function closeMenu() {
  nav.classList.remove("is-open");
  menu.setAttribute("aria-expanded", "false");
  menu.setAttribute("aria-label", "Open navigation");
}
menu.addEventListener("click", () => {
  const open = menu.getAttribute("aria-expanded") !== "true";
  nav.classList.toggle("is-open", open);
  menu.setAttribute("aria-expanded", String(open));
  menu.setAttribute(
    "aria-label",
    open ? "Close navigation" : "Open navigation",
  );
});
nav
  .querySelectorAll("a")
  .forEach((a) => a.addEventListener("click", closeMenu));
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeMenu();
});
const detail = document.querySelector("#detail-dialog"),
  content = document.querySelector("#dialog-content"),
  search = document.querySelector("#search-dialog");
function showDetail(html) {
  if (search.open) search.close();
  content.innerHTML = html;
  detail.showModal();
}
function showProject(i) {
  const p = projects[i];
  showDetail(
    `<img class="dialog-image" src="${p.image}" alt="${p.name} concept"><p class="eyebrow">PROJECT 0${i + 1} / CONCEPT STUDY</p><h2 id="dialog-title">${p.name}</h2><p>${p.story}</p><p>${p.detail}</p><p class="eyebrow">${p.tech.join(" / ")}</p><p>Live demo and source code will be linked when this project is published.</p>`,
  );
}
document.addEventListener("click", (e) => {
  const project = e.target.closest("[data-project]");
  if (project) showProject(Number(project.dataset.project));
  const social = e.target.closest("[data-social]");
  if (social) {
    e.preventDefault();
    const kind = social.dataset.social,
      url = profile[kind.toLowerCase()];
    if (url) {
      if (kind === "Email") location.href = `mailto:${url}`;
      else window.open(url, "_blank", "noopener,noreferrer");
    } else
      showDetail(
        `<p class="eyebrow">LET'S CONNECT</p><h2 id="dialog-title">${kind === "Email" ? "GET IN TOUCH." : kind.toUpperCase() + "."}</h2><p>Qwelskw's ${kind === "Email" ? "email address" : kind + " profile"} hasn't been added yet.</p><p>Check back soon for contact details and new project updates.</p>`,
      );
  }
});
document
  .querySelector("#story-open")
  .addEventListener("click", () =>
    showDetail(
      `<p class="eyebrow">ABOUT ME</p><h2 id="dialog-title">THOUGHTFUL BY DESIGN.</h2><p>I'm Qwelskw, a web developer, designer and video maker based in Europe. I turn ideas into digital experiences and visual stories — from the first sketch to the final frame.</p><p>My work brings together three disciplines: building responsive websites, designing clear and expressive visuals, and shaping stories through video editing and motion. I approach each medium with the same attention to detail.</p><p>My approach is simple: understand the idea, choose the right medium and refine every detail — whether it is an interaction, a composition or a cut.</p>`,
    ),
  );
document.querySelectorAll("dialog").forEach((dialog) => {
  dialog
    .querySelector(".dialog-close")
    .addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (e) => {
    if (e.target === dialog) {
      const r = dialog.getBoundingClientRect();
      if (
        e.clientX < r.left ||
        e.clientX > r.right ||
        e.clientY < r.top ||
        e.clientY > r.bottom
      )
        dialog.close();
    }
  });
});
const searchInput = document.querySelector("#project-search");
function renderSearch() {
  const q = searchInput.value.trim().toLowerCase();
  const matches = projects
    .map((p, i) => ({ p, i }))
    .filter(({ p }) =>
      [p.name, p.description, window.translatePortfolio(p.description), p.category, ...p.tech].join(" ").toLowerCase().includes(q),
    );
  document.querySelector("#search-results").innerHTML = matches.length
    ? matches
        .map(
          ({ p, i }) =>
            `<button class="search-result" data-project="${i}"><span>${p.name} ↗</span><small>${p.tech.join(" / ")}</small></button>`,
        )
        .join("")
    : "<p>No projects found. Try “JavaScript” or “Vue”.</p>";
}
document.querySelector("#search-open").addEventListener("click", () => {
  search.showModal();
  renderSearch();
  searchInput.focus();
});
searchInput.addEventListener("input", renderSearch);
// Missing replaceable portraits remain decorative; the layout retains its size.
document.querySelectorAll("img").forEach((img) =>
  img.addEventListener("error", () => {
    img.style.visibility = "hidden";
  }),
);
if ("IntersectionObserver" in window) {
  document.body.classList.add("js-ready");
  const observer = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      }),
    { threshold: 0.08 },
  );
  document
    .querySelectorAll(".fade-up,.reveal,.project-card")
    .forEach((el) => observer.observe(el));
}
