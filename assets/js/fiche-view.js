// =========================================================
// Page d'une fiche méthode : fiche.html?slug=<slug>
// Lit fiches/manifest.json puis fiches/<slug>.md (ou <slug>.en.md en anglais).
// =========================================================
const FICHE_UI = {
  fr: {
    loading: 'Chargement…', loadingFiche: 'Chargement de la fiche…',
    notFound: 'Fiche introuvable.', notWritten: 'Cette fiche est introuvable ou n\'a pas encore été rédigée.',
    frOnly: ''
  },
  en: {
    loading: 'Loading…', loadingFiche: 'Loading cheatsheet…',
    notFound: 'Cheatsheet not found.', notWritten: 'This cheatsheet could not be found or has not been written yet.',
    frOnly: 'This cheatsheet is currently available in French only.'
  }
};
const ficheT = key => (FICHE_UI[window.I18N ? I18N.lang : 'fr'] || FICHE_UI.fr)[key];

const params = new URLSearchParams(window.location.search);
const slug = params.get('slug');

const wrBody = document.getElementById('wrBody');
const wrTitle = document.getElementById('wrTitle');
const wrDate = document.getElementById('wrDate');
const wrPlatform = document.getElementById('wrPlatform');
const wrTags = document.getElementById('wrTags');
const pageTitle = document.getElementById('pageTitle');

let loadId = 0;

// En anglais : essaie fiches/<slug>.en.md, sinon retombe sur la version FR
function fetchMarkdown() {
  const fetchMd = path => fetch(path).then(r => {
    if (!r.ok) throw new Error('md not found');
    return r.text();
  });
  const fr = () => fetchMd(`fiches/${slug}.md`);
  if (window.I18N && I18N.lang === 'en') {
    return fetchMd(`fiches/${slug}.en.md`)
      .then(md => ({ md, fallback: false }))
      .catch(() => fr().then(md => ({ md, fallback: true })));
  }
  return fr().then(md => ({ md, fallback: false }));
}

function loadFiche() {
  const id = ++loadId;

  if (!slug) {
    wrTitle.textContent = ficheT('notFound');
    wrBody.innerHTML = `<p>${ficheT('notFound')}</p>`;
    return;
  }

  wrTitle.textContent = ficheT('loading');
  wrBody.innerHTML = `<p style="color:var(--text-faint);">${ficheT('loadingFiche')}</p>`;

  fetch('fiches/manifest.json')
    .then(r => r.json())
    .then(posts => {
      const meta = posts.find(p => p.slug === slug);
      if (!meta) throw new Error('not found');

      const title = pick(meta, 'title');
      pageTitle.textContent = title + ' | hrZXv3';
      wrTitle.textContent = title;
      wrDate.textContent = formatDate(meta.date);
      if (meta.platform) wrPlatform.textContent = meta.platform;
      wrTags.innerHTML = (meta.tags || []).map(t => `<span class="tag">${escapeHtml(t)}</span>`).join('');

      return fetchMarkdown();
    })
    .then(({ md, fallback }) => {
      if (id !== loadId) return; // la langue a changé entre-temps
      const notice = fallback ? `<p class="lang-notice">${ficheT('frOnly')}</p>` : '';
      wrBody.innerHTML = notice + marked.parse(md);
      wrBody.querySelectorAll('pre code').forEach(block => hljs.highlightElement(block));
    })
    .catch(() => {
      if (id !== loadId) return;
      wrTitle.textContent = ficheT('notFound');
      wrBody.innerHTML = `<p>${ficheT('notWritten')}</p>`;
    });
}

loadFiche();
document.addEventListener('langchange', loadFiche);
