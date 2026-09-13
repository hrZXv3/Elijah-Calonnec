const params = new URLSearchParams(window.location.search);
const slug = params.get('slug');

const wrBody = document.getElementById('wrBody');
const wrTitle = document.getElementById('wrTitle');
const wrDate = document.getElementById('wrDate');
const wrPlatform = document.getElementById('wrPlatform');
const wrTags = document.getElementById('wrTags');
const pageTitle = document.getElementById('pageTitle');

if (!slug) {
  wrBody.innerHTML = '<p>Writeup introuvable.</p>';
} else {
  fetch('writeups/manifest.json')
    .then(r => r.json())
    .then(posts => {
      const meta = posts.find(p => p.slug === slug);
      if (!meta) throw new Error('not found');

      pageTitle.textContent = meta.title + ' | hrZXv3';
      wrTitle.textContent = meta.title;
      wrDate.textContent = formatDate(meta.date);
      if (meta.platform) wrPlatform.textContent = meta.platform;
      wrTags.innerHTML = (meta.tags || []).map(t => `<span class="tag">${escapeHtml(t)}</span>`).join('');

      return fetch(`writeups/${slug}.md`).then(r => {
        if (!r.ok) throw new Error('md not found');
        return r.text();
      });
    })
    .then(md => {
      wrBody.innerHTML = marked.parse(md);
      wrBody.querySelectorAll('pre code').forEach(block => hljs.highlightElement(block));
    })
    .catch(() => {
      wrBody.innerHTML = '<p>Ce writeup est introuvable ou n\'a pas encore été rédigé.</p>';
    });
}
