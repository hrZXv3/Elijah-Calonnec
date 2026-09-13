const listEl = document.getElementById('writeupList');
const searchEl = document.getElementById('searchBox');
const filterTagsEl = document.getElementById('filterTags');

let allPosts = [];
let activeTag = null;

fetch('writeups/manifest.json')
  .then(r => r.json())
  .then(posts => {
    allPosts = posts.slice().sort((a, b) => new Date(b.date) - new Date(a.date));
    buildTagFilters();
    render();
  })
  .catch(() => { listEl.innerHTML = '<div class="empty-state">Impossible de charger les writeups.</div>'; });

function buildTagFilters() {
  const tags = new Set();
  allPosts.forEach(p => (p.tags || []).forEach(t => tags.add(t)));
  filterTagsEl.innerHTML = ['Tous', ...Array.from(tags).sort()].map(t =>
    `<button class="filter-tag ${t === 'Tous' ? 'active' : ''}" data-tag="${t === 'Tous' ? '' : t}">${t}</button>`
  ).join('');
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
    const haystack = [p.title, p.summary, p.platform, ...(p.tags || [])].join(' ').toLowerCase();
    const matchesSearch = !q || haystack.includes(q);
    return matchesTag && matchesSearch;
  });

  if (!filtered.length) {
    listEl.innerHTML = '<div class="empty-state">Aucun writeup ne correspond.</div>';
    return;
  }

  listEl.innerHTML = filtered.map(p => `
    <a class="writeup-row" href="writeup.html?slug=${encodeURIComponent(p.slug)}">
      <div class="wr-main">
        <h4>${escapeHtml(p.title)}</h4>
        <p>${escapeHtml(p.summary || '')}</p>
        <div class="tag-row" style="margin-top:8px;">${(p.tags || []).map(t => `<span class="tag">${escapeHtml(t)}</span>`).join('')}</div>
      </div>
      <div class="wr-meta">
        <span class="wr-date">${formatDate(p.date)}</span>
      </div>
    </a>
  `).join('');
}
