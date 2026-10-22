// =========================================================
// Page du CTI Challenge : lit les README du repo cti-challenge sur GitHub.
//   challenge.html              -> README principal (présentation + 25 projets)
//   challenge.html?p=J01-xxx    -> README du dossier J01-xxx
// Rien à modifier ici pendant le défi : un git push sur cti-challenge suffit
// (GitHub met jusqu'à ~5 min à servir la nouvelle version).
// =========================================================
// CH_REPO, CH_BRANCH, CH_RAW, CH_TOTAL, chStatus et chParseProjects sont dans main.js
const CH_GITHUB = `https://github.com/${CH_REPO}`;
// Sections du README principal utiles sur GitHub mais pas sur le site
const CH_HIDDEN_SECTIONS = ['installation', 'structure'];
// Phrase présente dans le modèle de README vide d'un projet
const CH_TEMPLATE_MARKER = '_Ce que le projet doit produire';

const CH_UI = {
  fr: {
    week: 'Semaine', done: 'fait', doing: 'en cours', todo: 'à venir',
    projects: 'Les 25 projets', pipeline: 'Le fil rouge',
    pipe: ['Collecte', 'Enrichissement', 'Visualisation', 'STIX 2.1', 'OpenCTI'],
    progress: 'projets terminés',
    notPublished: 'Ce projet n\'est pas encore publié. Il arrive le',
    loadError: 'Impossible de charger le contenu depuis GitHub pour le moment.',
    frOnly: '',
    backChallenge: '← Tous les projets du défi',
    day: 'Jour', github: 'Voir le code sur GitHub ↗', githubProject: 'Voir ce projet sur GitHub ↗'
  },
  en: {
    week: 'Week', done: 'done', doing: 'in progress', todo: 'upcoming',
    projects: 'The 25 projects', pipeline: 'The common thread',
    pipe: ['Collection', 'Enrichment', 'Visualization', 'STIX 2.1', 'OpenCTI'],
    progress: 'projects completed',
    notPublished: 'This project hasn\'t been published yet. Scheduled for',
    loadError: 'Could not load the content from GitHub right now.',
    frOnly: 'The challenge write-ups are currently available in French only.',
    backChallenge: '← All challenge projects',
    day: 'Day', github: 'View the code on GitHub ↗', githubProject: 'View this project on GitHub ↗'
  }
};
const chT = key => (CH_UI[window.I18N ? I18N.lang : 'fr'] || CH_UI.fr)[key];

const chProject = new URLSearchParams(window.location.search).get('p');
const chValidProject = chProject && /^J\d{2}-[a-z0-9-]+$/i.test(chProject);
const chBody = document.getElementById('chBody');
const chTitle = document.getElementById('chTitle');
const chBack = document.getElementById('chBack');
const chGithub = document.getElementById('chGithub');
const chPageTitle = document.getElementById('pageTitle');
let chLoadId = 0;

function chFetch(path) {
  return fetch(CH_RAW + path, { cache: 'no-cache' }).then(r => {
    if (!r.ok) throw new Error(r.status);
    return r.text();
  });
}

// Découpe le README en { title, preamble, sections: [{ heading, body }] }
function chSplit(md) {
  const parts = md.split(/^## /m);
  let preamble = parts.shift();
  let title = '';
  preamble = preamble.replace(/^# (.+)$/m, (_, t) => { title = t.trim(); return ''; });
  const sections = parts.map(p => {
    const nl = p.indexOf('\n');
    return { heading: p.slice(0, nl).trim(), body: p.slice(nl + 1) };
  });
  return { title, preamble, sections };
}

function chRender(md) {
  return DOMPurify.sanitize(marked.parse(md));
}

// Liens et images relatifs -> GitHub, liens vers un dossier JXX -> page du projet
function chFixLinks(root, baseDir) {
  const base = 'https://repo.invalid/' + (baseDir ? baseDir + '/' : '');
  // a.ch-day : cases de la grille générées par ce script, déjà correctes
  root.querySelectorAll('a[href]:not(.ch-day), img[src]').forEach(el => {
    const attr = el.tagName === 'IMG' ? 'src' : 'href';
    const value = el.getAttribute(attr);
    if (/^([a-z]+:|#|\/\/)/i.test(value)) {
      if (el.tagName === 'A' && /^https?:/i.test(value)) { el.target = '_blank'; el.rel = 'noopener'; }
      return;
    }
    const path = new URL(value, base).pathname.replace(/^\//, '');
    const project = path.match(/^(J\d{2}-[a-z0-9-]+)\/?$/i);
    if (el.tagName === 'A' && project) { el.href = 'challenge.html?p=' + project[1]; return; }
    if (el.tagName === 'IMG') { el.src = CH_RAW + path; return; }
    el.href = `${CH_GITHUB}/${path.endsWith('/') ? 'tree' : 'blob'}/${CH_BRANCH}/${path}`;
    el.target = '_blank'; el.rel = 'noopener';
  });
}

function chProgressHtml(projects) {
  const done = projects.filter(p => p.status === 'done').length;
  return `
    <div class="challenge-progress ch-progress">
      <div class="cp-meta"><span>${chT('progress')}</span><span><span data-challenge-day>${String(done).padStart(2, '0')}</span>/${CH_TOTAL}</span></div>
      <div class="cp-bar"><span class="cp-fill" style="width:${done / CH_TOTAL * 100}%"></span></div>
    </div>`;
}

function chPipelineHtml() {
  return `
    <h2>${chT('pipeline')}</h2>
    <div class="ch-pipeline">${chT('pipe').map(s => `<span class="ch-step">${s}</span>`).join('<span class="ch-arrow">→</span>')}</div>`;
}

function chGridHtml(projects) {
  let html = `<h2>${chT('projects')}</h2>`;
  for (let w = 0; w * 5 < projects.length; w++) {
    const week = projects.slice(w * 5, w * 5 + 5);
    html += `<div class="ch-week"><div class="ch-week-label">${chT('week')} ${w + 1} <span>${escapeHtml(week[0].date)} → ${escapeHtml(week[week.length - 1].date)}</span></div><div class="ch-days">`;
    html += week.map(p => {
      const inner = `
        <div class="ch-day-top"><span class="ch-day-num">${escapeHtml(p.day)}</span><span class="ch-status">${chT(p.status)}</span></div>
        <div class="ch-day-title">${escapeHtml(p.title)}</div>
        <div class="ch-day-skills">${escapeHtml(p.skills)}</div>`;
      return p.status === 'todo'
        ? `<div class="ch-day is-todo">${inner}</div>`
        : `<a class="ch-day is-${p.status}" href="challenge.html?p=${encodeURIComponent(p.dir)}">${inner}</a>`;
    }).join('');
    html += '</div></div>';
  }
  return html;
}

function chNotice() {
  const msg = chT('frOnly');
  return msg ? `<p class="lang-notice">${msg}</p>` : '';
}

function chShowError(id) {
  if (id !== chLoadId) return;
  chBody.innerHTML = `<p>${chT('loadError')}</p>`;
}

// ---- README principal ----
function chLoadOverview() {
  const id = ++chLoadId;
  chGithub.textContent = chT('github');
  chFetch('README.md').then(md => {
    if (id !== chLoadId) return;
    const { title, preamble, sections } = chSplit(md);
    if (title) chTitle.textContent = title;

    // On retire le bloc "Auteur" (on est déjà sur le portfolio)
    const intro = preamble.split(/\n\s*\n/).filter(p => !/^\s*\*\*Auteur/.test(p)).join('\n\n');

    let html = chNotice() + chRender(intro);
    let projects = [];
    sections.forEach(s => {
      const key = s.heading.toLowerCase();
      if (CH_HIDDEN_SECTIONS.includes(key)) return;
      const rows = chParseProjects(s.body);
      if (rows.length) {
        projects = rows;
        html += chPipelineHtml() + chGridHtml(rows);
      } else {
        html += chRender(`## ${s.heading}\n${s.body}`);
      }
    });

    document.querySelector('.ch-progress')?.remove();
    if (projects.length) chGithub.parentElement.insertAdjacentHTML('beforebegin', chProgressHtml(projects));

    chBody.innerHTML = html;
    chFixLinks(chBody, '');
  }).catch(() => chShowError(id));
}

// ---- README d'un projet ----
function chLoadProject() {
  const id = ++chLoadId;
  chBack.removeAttribute('data-i18n');
  chBack.textContent = chT('backChallenge');
  chBack.href = 'challenge.html';
  chGithub.textContent = chT('githubProject');
  chGithub.href = `${CH_GITHUB}/tree/${CH_BRANCH}/${chProject}`;

  chFetch('README.md').then(md => {
    const meta = chParseProjects(md).find(p => p.dir.toLowerCase() === chProject.toLowerCase());
    if (!meta) throw new Error('unknown project');
    if (id !== chLoadId) return;
    chTitle.textContent = `${meta.day} · ${meta.title}`;
    chPageTitle.textContent = `${meta.day} · ${meta.title} | CTI Challenge`;

    const notPublished = () => {
      chBody.innerHTML = `<p class="ch-empty">${chT('notPublished')} ${escapeHtml(meta.date)}.</p>`;
    };
    if (meta.status === 'todo') return notPublished();

    return chFetch(chProject + '/README.md')
      .then(projectMd => {
        if (id !== chLoadId) return;
        if (projectMd.includes(CH_TEMPLATE_MARKER)) return notPublished();
        const { title, preamble, sections } = chSplit(projectMd);
        if (title) chTitle.textContent = title;
        const body = preamble + sections.map(s => `## ${s.heading}\n${s.body}`).join('');
        chBody.innerHTML = chNotice() + chRender(body);
        chFixLinks(chBody, chProject);
        chBody.querySelectorAll('pre code').forEach(b => hljs.highlightElement(b));
      })
      .catch(() => { if (id === chLoadId) notPublished(); });
  }).catch(() => chShowError(id));
}

function chLoad() {
  if (chValidProject) chLoadProject(); else chLoadOverview();
}

chLoad();
document.addEventListener('langchange', chLoad);
