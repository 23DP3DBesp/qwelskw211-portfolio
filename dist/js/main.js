"use strict";
// Replace these values when personal contact links are ready.
const profile = { email: "", github: "", linkedin: "" };
const projects = [
  {
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
const paths = [
  "M4 5h24v22H4zM4 11h24m-18 5-4 3 4 3m12-6 4 3-4 3",
  "M5 4h22v24H5zM12 12v10c0 3-4 3-4 0m15-8c-5-4-9 3-3 5s2 8-3 5",
  "m3 5 13 23L29 5h-6l-7 12L9 5z",
  "M23 7a12 12 0 1 0 0 18M24 10v12m5-12v12m-8-8h11m-11 5h11",
  "M4 25V7l12 18V7m6 0v18m-3-18h10",
  "m16 2 14 14-14 14L2 16zM12 9v11m0-7 8 8M12 9a2 2 0 1 0 0 .1M12 21a2 2 0 1 0 0 .1M21 21a2 2 0 1 0 0 .1",
];
const skills = [
  ["HTML / CSS", "Structure & style"],
  ["JAVASCRIPT", "Interactive experiences"],
  ["VUE", "Modern web interfaces"],
  ["C#", "Backend development"],
  [".NET", "Web applications"],
  ["GIT", "Version control"],
];
document.querySelector(".skills").innerHTML = skills
  .map(
    (s, i) =>
      `<div class="skill"><svg aria-hidden="true" viewBox="0 0 32 32"><path d="${paths[i]}"/></svg><div><h3>${s[0]}</h3><p>${s[1]}</p></div></div>`,
  )
  .join("");
document.querySelector("#project-grid").innerHTML = projects
  .map(
    (p, i) =>
      `<article class="project-card"><div class="project-image"><img src="${p.image}" alt="${p.name} concept preview" loading="lazy"></div><div class="project-body"><span class="project-index">PROJECT 0${i + 1}</span><h3>${p.name}</h3><p>${p.description}</p><div class="project-tech">${p.tech.join(" / ")}</div><button data-project="${i}" aria-label="View ${p.name}">VIEW PROJECT <span>→</span></button></div></article>`,
  )
  .join("");
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
        `<p class="eyebrow">LET'S CONNECT</p><h2 id="dialog-title">${kind === "Email" ? "GET IN TOUCH." : kind.toUpperCase() + "."}</h2><p>Deniss's ${kind === "Email" ? "email address" : kind + " profile"} hasn't been added yet.</p><p>Check back soon for contact details and new project updates.</p>`,
      );
  }
});
document
  .querySelector("#story-open")
  .addEventListener("click", () =>
    showDetail(
      `<p class="eyebrow">ABOUT ME</p><h2 id="dialog-title">THOUGHTFUL BY DESIGN.</h2><p>I'm Deniss, a web developer based in Europe. I enjoy turning ideas into clear, useful digital experiences — from the first layout to the details of an interaction.</p><p>My interests span frontend development, interface design and backend systems. I work with HTML, CSS, JavaScript and Vue, and explore C# and .NET to connect the whole experience.</p><p>My approach is simple: understand the problem, build with intention and keep refining the details.</p>`,
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
      [p.name, p.description, ...p.tech].join(" ").toLowerCase().includes(q),
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
