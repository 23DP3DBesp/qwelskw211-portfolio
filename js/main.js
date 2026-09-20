"use strict";
// Replace these values when personal contact links are ready.
(async () => {
const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let site;
try { site = await portfolioAPI('/api/content'); if (!Array.isArray(site.projects) || !site.settings?.contacts) throw new Error(); }
catch { const message=document.createElement('p'); message.className='content-error'; message.textContent='Projects are temporarily unavailable. / Проекты временно недоступны.'; document.querySelector('#project-grid').before(message); site={projects:[],settings:{contacts:{email:'qwelskw211@gmail.com',telegram:'https://t.me/qwelskw211',instagram:'https://www.instagram.com/qwelskw211/',github:'https://github.com/23DP3DBesp'},copy:{}}}; }
const profile=site.settings.contacts;
window.setPortfolioCopy(site.settings.copy);
const localized=value => value?.[window.portfolioLanguage] || value?.en || value?.ru || '';
const projects=site.projects.map(p=>({...p,name:p.title.en,image:p.cover,tech:typeof p.tech==='string'?p.tech.split(' / '):p.tech}));
document.querySelectorAll('.contact-copy dd [data-social]').forEach(button=>{const key=button.dataset.social.toLowerCase();button.setAttribute('data-cms','');button.textContent=profile[key]||'—';});
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
function renderProjects() {
 document.querySelector('#project-grid').innerHTML=projects.map((p,i)=>`<article class="project-card is-visible" data-cms data-category="${p.category}"><div class="project-image"><img src="${escapeHTML(p.cover)}" alt="${escapeHTML(localized(p.title))}" loading="lazy"></div><div class="project-body"><span class="project-index">${p.category.toUpperCase()} / ${String(i+1).padStart(2,'0')}</span><h3>${escapeHTML(localized(p.title))}</h3><p>${escapeHTML(localized(p.description))}</p><div class="project-tech">${escapeHTML(p.tech.join(' / '))}</div><a class="project-open" href="/work/?id=${encodeURIComponent(p.id)}&lang=${window.portfolioLanguage}">${window.portfolioLanguage==='ru'?'СМОТРЕТЬ РЕЗУЛЬТАТ':'VIEW RESULT'} <span>→</span></a></div></article>`).join('');
 const feature=document.querySelector('.featured');const p=projects[0];feature.hidden=!p;
 if(p){feature.querySelector('img').src=p.cover;feature.querySelector('img').alt=localized(p.title);feature.querySelector('.featured-copy>.eyebrow').textContent=localized(p.title);feature.querySelector('.featured-copy>.eyebrow').setAttribute('data-cms','');const description=feature.querySelector('.featured-copy>p:not(.eyebrow):not(.tech-line)');description.textContent=localized(p.description);description.setAttribute('data-cms','');feature.querySelector('.tech-line').textContent=p.tech.join(' / ');}
}
renderProjects();
const filterButtons = document.querySelectorAll("[data-filter]");
function filterProjects(category) {
  let count = 0;
  document.querySelectorAll(".project-card").forEach(card => {
    card.hidden = category !== "all" && card.dataset.category !== category;
    if (!card.hidden) { count++; card.classList.add("is-visible"); }
  });
  filterButtons.forEach(button => button.setAttribute("aria-pressed", String(button.dataset.filter === category)));
  const empty=document.querySelector("#project-empty");empty.hidden = count !== 0;
  empty.setAttribute('data-cms','');
  if (!count) { const ru=window.portfolioLanguage==='ru';empty.querySelector('.eyebrow').textContent=category==='all'?(ru?'ПРОЕКТЫ':'PROJECTS'):category.toUpperCase();empty.querySelector('h3').textContent=ru?'НОВЫЕ РАБОТЫ СКОРО.':'NEW WORK IS COMING.';empty.querySelector('p:not(.eyebrow)').textContent=ru?'Работы появятся здесь после публикации. Обсудим ваш проект?':'Work will appear here once published. Have a project in mind?';empty.querySelector('a').textContent=ru?'ОБСУДИМ ПРОЕКТ →':'LET’S TALK →'; }
  document.querySelector("#project-count").textContent = window.portfolioLanguage === "ru" ? `Работ: ${count}` : `Projects: ${count}`;
}
filterButtons.forEach(button => button.addEventListener("click", () => filterProjects(button.dataset.filter)));
document.querySelector('.section-heading a').addEventListener('click', () => filterProjects('all'));
document.addEventListener('languagechange', () => { renderProjects(); filterProjects(document.querySelector('[data-filter][aria-pressed="true"]').dataset.filter); });
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
function showProject(i) { const p=projects[i];if(p) location.href=`/work/?id=${encodeURIComponent(p.id)}&lang=${window.portfolioLanguage}`; }
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
      [p.name, localized(p.title), localized(p.description), p.category, ...p.tech].join(" ").toLowerCase().includes(q),
    );
  document.querySelector("#search-results").innerHTML = matches.length
    ? matches
        .map(
          ({ p, i }) =>
            `<button class="search-result" data-project="${i}"><span>${escapeHTML(localized(p.title))} ↗</span><small>${escapeHTML(p.tech.join(" / "))}</small></button>`,
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

})();
