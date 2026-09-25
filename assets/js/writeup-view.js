const params = new URLSearchParams(window.location.search);
const slug = params.get('slug');

const wrBody = document.getElementById('wrBody');
const wrTitle = document.getElementById('wrTitle');
const wrDate = document.getElementById('wrDate');
const wrPlatform = document.getElementById('wrPlatform');
const wrTags = document.getElementById('wrTags');
const pageTitle = document.getElementById('pageTitle');

let loadId = 0;

// En anglais : essaie writeups/<slug>.en.md, sinon retombe sur la version FR
function fetchMarkdown() {
  const fetchMd = path => fetch(path).then(r => {
    if (!r.ok) throw new Error('md not found');
    return r.text();
  });
  const fr = () => fetchMd(`writeups/${slug}.md`);
  if (window.I18N && I18N.lang === 'en') {
    return fetchMd(`writeups/${slug}.en.md`)
      .then(md => ({ md, fallback: false }))
      .catch(() => fr().then(md => ({ md, fallback: true })));
  }
  return fr().then(md => ({ md, fallback: false }));
}

function loadWriteup() {
  const id = ++loadId;

  if (!slug) {
    wrTitle.textContent = tr('notFound');
    wrBody.innerHTML = `<p>${tr('notFound')}</p>`;
    return;
  }

  wrTitle.textContent = tr('loading');
  wrBody.innerHTML = `<p style="color:var(--text-faint);">${tr('loadingWriteup')}</p>`;

  fetch('writeups/manifest.json')
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
      const notice = fallback ? `<p class="lang-notice">${tr('frOnly')}</p>` : '';
      wrBody.innerHTML = notice + marked.parse(md);
      wrBody.querySelectorAll('pre code').forEach(block => hljs.highlightElement(block));
    })
    .catch(() => {
      if (id !== loadId) return;
      wrTitle.textContent = tr('notFound');
      wrBody.innerHTML = `<p>${tr('notWritten')}</p>`;
    });
}

loadWriteup();
document.addEventListener('langchange', loadWriteup);
