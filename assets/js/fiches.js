// =========================================================
// Page liste des fiches méthode : lit fiches/manifest.json.
// Pour ajouter une fiche : un fichier fiches/<slug>.md
// + une entrée dans fiches/manifest.json (même format que les writeups).
// =========================================================
const FICHE_UI = {
  fr: { noMatch: 'Aucune fiche ne correspond.', loadError: 'Impossible de charger les fiches.' },
  en: { noMatch: 'No cheatsheet matches your search.', loadError: 'Could not load the cheatsheets.' }
};
const ficheT = key => (FICHE_UI[window.I18N ? I18N.lang : 'fr'] || FICHE_UI.fr)[key];

const listEl = document.getElementById('ficheList');
const searchEl = document.getElementById('searchBox');
const filterTagsEl = document.getElementById('filterTags');

let allPosts = [];
let activeTag = null;

fetch('fiches/manifest.json')
  .then(r => r.json())
  .then(posts => {
    allPosts = posts.slice().sort((a, b) => new Date(b.date) - new Date(a.date));
    buildTagFilters();
    render();
  })
  .catch(() => { listEl.innerHTML = `<div class="empty-state">${ficheT('loadError')}</div>`; });

document.addEventListener('langchange', () => {
  if (!allPosts.length) return;
  buildTagFilters();
  render();
});

function buildTagFilters() {
  const tags = new Set();
  allPosts.forEach(p => (p.tags || []).forEach(t => tags.add(t)));
  const ALL = '__all__';
  filterTagsEl.innerHTML = [ALL, ...Array.from(tags).sort()].map(t => {
    const isAll = t === ALL;
    const isActive = isAll ? !activeTag : activeTag === t;
    return `<button class="filter-tag ${isActive ? 'active' : ''}" data-tag="${isAll ? '' : t}">${isAll ? tr('all') : t}</button>`;
  }).join('');
  filterTagsEl.querySelectorAll('.filter-tag').forEach(btn => {
    btn.addEventListener('click', () => {
      filterTagsEl.querySelectorAll('.filter-tag').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeTag = btn.dataset.tag || null;
      render();
    });
  });
}

searchEl.addEventListener('input', render);

function render() {
  const q = searchEl.value.trim().toLowerCase();
  const filtered = allPosts.filter(p => {
    const matchesTag = !activeTag || (p.tags || []).includes(activeTag);
    const haystack = [pick(p, 'title'), pick(p, 'summary'), p.platform, ...(p.tags || [])].join(' ').toLowerCase();
    const matchesSearch = !q || haystack.includes(q);
    return matchesTag && matchesSearch;
  });

  if (!filtered.length) {
    listEl.innerHTML = `<div class="empty-state">${ficheT('noMatch')}</div>`;
    return;
  }

  listEl.innerHTML = filtered.map(p => `
    <a class="writeup-row" href="fiche.html?slug=${encodeURIComponent(p.slug)}">
      <div class="wr-main">
        <h4>${escapeHtml(pick(p, 'title'))}</h4>
        <p>${escapeHtml(pick(p, 'summary') || '')}</p>
        <div class="tag-row" style="margin-top:8px;">${(p.tags || []).map(t => `<span class="tag">${escapeHtml(t)}</span>`).join('')}</div>
      </div>
      <div class="wr-meta">
        <span class="wr-date">${formatDate(p.date)}</span>
      </div>
    </a>
  `).join('');
}
