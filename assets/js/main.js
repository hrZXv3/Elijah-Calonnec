// nav toggle (mobile)
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
if (navToggle) {
  navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));
}

// experience/education tabs
document.querySelectorAll('.tl-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tl-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tl-panel').forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById('tab-' + tab.dataset.tab).classList.add('active');
  });
});

// scroll reveal
const revealEls = document.querySelectorAll('.reveal');
if (revealEls.length) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.15 });
  revealEls.forEach(el => io.observe(el));
}

// footer year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// active nav link on scroll
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
if (sections.length && navAnchors.length) {
  const spy = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const link = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      if (!link) return;
      if (entry.isIntersecting) {
        navAnchors.forEach(a => a.classList.remove('active'));
        link.classList.add('active');
      }
    });
  }, { rootMargin: '-40% 0px -50% 0px' });
  sections.forEach(s => spy.observe(s));
}

// latest writeups preview on homepage
const latestWriteupsEl = document.getElementById('latestWriteups');
if (latestWriteupsEl) {
  let latestPosts = null;
  const renderLatest = () => {
    if (!latestPosts) return;
    if (!latestPosts.length) {
      latestWriteupsEl.innerHTML = `<div class="empty-state">${tr('noWriteups')}</div>`;
      return;
    }
    latestWriteupsEl.innerHTML = latestPosts.map(p => `
        <a class="writeup-row" href="writeup.html?slug=${encodeURIComponent(p.slug)}">
          <div class="wr-main">
            <h4>${escapeHtml(pick(p, 'title'))}</h4>
            <p>${escapeHtml(pick(p, 'summary') || '')}</p>
          </div>
          <div class="wr-meta">
            <span class="wr-date">${formatDate(p.date)}</span>
          </div>
        </a>
      `).join('');
  };
  fetch('writeups/manifest.json')
    .then(r => r.json())
    .then(posts => {
      latestPosts = posts.slice().sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 3);
      renderLatest();
    })
    .catch(() => { latestWriteupsEl.innerHTML = `<div class="empty-state">${tr('loadError')}</div>`; });
  document.addEventListener('langchange', renderLatest);
}

// helpers i18n (fonctionnent aussi si i18n.js n'est pas chargé)
function tr(key) { return window.I18N ? I18N.t(key) : key; }
function pick(obj, field) { return window.I18N ? I18N.pick(obj, field) : obj[field]; }

function formatDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString(window.I18N ? I18N.locale() : 'fr-FR', { year: 'numeric', month: 'short', day: 'numeric' });
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
