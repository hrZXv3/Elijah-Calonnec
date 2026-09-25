// =========================================================
// i18n : bascule FR / EN
// Le français reste dans le HTML. Ce fichier contient uniquement l'anglais.
// Pour traduire un nouveau texte : ajoute data-i18n="ma.cle" sur l'élément
// dans le HTML, puis "ma.cle": "texte anglais" dans EN ci-dessous.
// =========================================================
(function () {
  const EN = {
    // ---- meta / nav (toutes les pages) ----
    'meta.title': 'Elijah Calonnec | CTI & Cybersecurity',
    'nav.platforms': 'platforms',
    'nav.skills': 'skills',
    'nav.experience': 'background',
    'nav.projects': 'projects',

    // ---- hero ----
    'hero.title': 'Elijah Calonnec, specializing in <span class="highlight">Cyber Threat Intelligence</span> &amp; OSINT.',
    'hero.lead': '3<sup>rd</sup>-year cybersecurity student at Oteria (Intelligence &amp; Cyber Threats major), passionate about TTP analysis, threat hunting and OSINT investigation. Former professional esports player, bringing the same standards and composure to threat analysis.',
    'hero.btnWriteups': 'Read my writeups',
    'hero.btnCv': 'Download my CV',
    'hero.btnContact': 'Contact me',
    'hero.available': '<span class="ok">●</span> Available for a CTI apprenticeship, 3 weeks in company / 1 week at school',

    // ---- about ----
    'about.p1': 'I\'m currently in the <strong>3<sup>rd</sup> year of the Cybersecurity Expert program (Master\'s level)</strong> at Oteria Cyber School, majoring in <strong>Intelligence &amp; Cyber Threats</strong>. My playground: TTP analysis (MITRE ATT&amp;CK), OSINT investigation, IOC analysis and writing threat intelligence reports.',
    'about.p2': 'Before cybersecurity, I spent two years as a <strong>professional Valorant player</strong> with the French national team (3DMAX &amp; Akroma), qualifying for France\'s top championship. Competing at that level taught me to analyze under pressure, adapt quickly and work as a team in demanding environments, reflexes that carry over directly to threat hunting and incident analysis.',
    'about.p3': 'Technical background: two years at <strong>EPITECH</strong> (programming and algorithmic fundamentals), then a <strong>BTS SNIR</strong> (two-year degree in networks and systems) at AFORP, before specializing in cybersecurity and CTI at Oteria. I\'m looking for a <strong>CTI apprenticeship starting September 2026</strong>.',
    'facts.lookingFor': 'Looking for',
    'facts.lookingForVal': 'CTI apprenticeship',
    'facts.schedule': 'Schedule',
    'facts.scheduleVal': '3 wks / 1 wk',
    'facts.availability': 'Availability',
    'facts.availabilityVal': 'September 2026',
    'facts.education': 'Education',
    'facts.educationVal': 'Master\'s level · Oteria',
    'facts.location': 'Location',
    'facts.english': 'English',
    'facts.handle': 'Handle',

    // ---- platforms ----
    'platforms.label': 'platforms &amp; challenges',
    'platforms.intro': 'Progress and rankings on the platforms I train on, under the handle <span style="font-family:var(--mono); color:var(--accent);">hrZXv3</span>.',
    'platforms.rank9': 'Rank 9',
    'platforms.rank4523': 'Rank 4523',
    'platforms.opencti': 'Hands-on CTI platform',

    // ---- skills ----
    'skills.label': 'skills',
    'skills.title': 'Stack &amp; areas of expertise',
    'skills.ttp': 'TTP analysis',
    'skills.reports': 'Threat reports',
    'skills.osintTech': 'Technical OSINT',
    'skills.toolsTitle': 'OSINT &amp; Threat Intel: tools',
    'skills.frameworksTitle': 'Frameworks &amp; methodologies',
    'skills.networkTitle': 'Network analysis &amp; investigation',
    'skills.systemsTitle': 'Systems &amp; virtualization',
    'skills.hypervisor': 'Hypervisors',
    'skills.devTitle': 'Development &amp; languages',
    'skills.english': 'English (TOEIC 835/990)',

    // ---- experience / education ----
    'exp.label': 'background',
    'exp.title': 'Education &amp; experience',
    'exp.tabWork': 'Work experience',
    'exp.tabEdu': 'Education',
    'exp.likesec.role': 'Systems &amp; Virtualization Administrator',
    'exp.likesec.1': 'Deployed containerized services with Kubernetes',
    'exp.likesec.2': 'Set up a high-availability Mattermost deployment',
    'exp.likesec.3': 'Deployed HashiCorp Vault for secrets management',
    'exp.esport.role': 'Professional Valorant esports player',
    'exp.esport.org': 'French national team · 3DMAX &amp; Akroma',
    'exp.esport.1': 'Qualified for France\'s top championship',
    'exp.esport.2': 'Analytical thinking under pressure, adaptability, teamwork at a high competitive level',
    'exp.ceciaa.role': 'Software Assistant &amp; After-Sales Technician',
    'exp.ceciaa.1': 'Technical support and software assistance',
    'exp.ceciaa.2': 'Built an intranet accessible to visually impaired users',
    'exp.ceciaa.3': 'Developed an IoT connected scale',
    'edu.oteria.date': '2025 – present',
    'edu.oteria.title': 'Cybersecurity Expert (Master\'s level)',
    'edu.oteria.org': 'Oteria Cyber School · Intelligence &amp; Cyber Threats major',
    'edu.oteria.1': 'CTI, threat and TTP analysis, IOC analysis, forensics, OSINT',
    'edu.oteria.2': 'Digital investigation, Python scripting, Linux/Windows administration',
    'edu.oteria.3': 'IOC analysis (hashes, IPs, domains, malicious URLs), technical report writing',
    'edu.bts.title': 'BTS in Digital Systems, IT and Networks (two-year degree)',
    'edu.bts.1': 'Networking, TCP/IP, DHCP, DNS, NAT',
    'edu.bts.2': 'Configuration and maintenance of network equipment (switches, routers)',
    'edu.epitech.title': 'Foundation program',
    'edu.epitech.2': 'Reimplementation of core functions (printf, etc.)',

    // ---- projects ----
    'projects.label': 'projects',
    'projects.title': 'Personal projects',
    'projects.intro': 'Code available on my GitHub, under the handle <span style="font-family:var(--mono); color:var(--accent);">hrZXv3</span>.',
    'projects.phishing': 'Identified and analyzed infrastructure linked to phishing campaigns: indicator collection, domain analysis and TTP mapping to MITRE ATT&amp;CK.',
    'projects.tracker': 'OSINT investigation on targeted profiles: collecting, correlating and analyzing public information for geolocation and profiling (tracking an APT group).',
    'projects.lab': 'Flask app simulating a login page, built to raise awareness of phishing risks and security best practices.',
    'projects.github': 'View on GitHub →',
    'projects.delivery': 'Connected scale for verifying customer orders in an industrial environment.',
    'projects.intranet': 'Built an intranet accessible to visually impaired users.',
    'projects.wethorse': 'Connected misting system for horses, communicating over MQTT.',

    // ---- writeups preview (accueil) ----
    'latest.title': 'Latest writeups',
    'latest.intro': 'CTF, OSINT and threat intelligence exercises: methodology, tools and lessons learned.',
    'latest.all': 'All writeups →',

    // ---- contact ----
    'contact.title': 'Let\'s work together.',
    'contact.text': 'Actively looking for a CTI apprenticeship starting September 2026 (3 weeks in company / 1 week at school). Feel free to reach out.',
    'contact.badge': '<span class="pulse"></span> Open to opportunities',
    'contact.location': 'LOCATION',

    // ---- page writeups ----
    'writeups.intro': 'Methodology, tools and lessons learned from my challenges: Root-Me, Trace Labs, OSINT CTFs and threat intel exercises.',
    'writeups.search': 'Search writeups (title, platform, tool...)',
    'writeup.back': '← All writeups'
  };

  // Textes générés par le JavaScript (listes, messages d'erreur...)
  const UI = {
    fr: {
      all: 'Tous',
      noMatch: 'Aucun writeup ne correspond.',
      noWriteups: 'Aucun writeup publié pour le moment.',
      loadError: 'Impossible de charger les writeups.',
      loading: 'Chargement…',
      loadingWriteup: 'Chargement du writeup…',
      notFound: 'Writeup introuvable.',
      notWritten: 'Ce writeup est introuvable ou n\'a pas encore été rédigé.',
      frOnly: ''
    },
    en: {
      all: 'All',
      noMatch: 'No writeup matches your search.',
      noWriteups: 'No writeups published yet.',
      loadError: 'Could not load the writeups.',
      loading: 'Loading…',
      loadingWriteup: 'Loading writeup…',
      notFound: 'Writeup not found.',
      notWritten: 'This writeup could not be found or has not been written yet.',
      frOnly: 'This writeup is currently available in French only.'
    }
  };

  const STORAGE_KEY = 'lang';
  const originals = new Map();

  function detectLang() {
    const fromUrl = new URLSearchParams(window.location.search).get('lang');
    if (fromUrl === 'fr' || fromUrl === 'en') {
      save(fromUrl);
      return fromUrl;
    }
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'fr' || stored === 'en') return stored;
    } catch (e) { /* stockage indisponible */ }
    return (navigator.language || 'fr').toLowerCase().startsWith('fr') ? 'fr' : 'en';
  }

  function save(l) {
    try { localStorage.setItem(STORAGE_KEY, l); } catch (e) { /* ignore */ }
  }

  let lang = detectLang();

  function apply() {
    document.documentElement.lang = lang;

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const plain = el.tagName === 'TITLE';
      if (!originals.has(el)) originals.set(el, plain ? el.textContent : el.innerHTML);
      const key = el.dataset.i18n;
      const value = (lang === 'en' && EN[key] !== undefined) ? EN[key] : originals.get(el);
      if (plain) el.textContent = value; else el.innerHTML = value;
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      if (el.dataset.placeholderFr === undefined) el.dataset.placeholderFr = el.placeholder;
      const key = el.dataset.i18nPlaceholder;
      el.placeholder = (lang === 'en' && EN[key] !== undefined) ? EN[key] : el.dataset.placeholderFr;
    });

    document.querySelectorAll('.lang-switch [data-l]').forEach(s => {
      s.classList.toggle('active', s.dataset.l === lang);
    });
  }

  function injectSwitch() {
    const links = document.getElementById('navLinks');
    if (!links || links.querySelector('.lang-switch')) return;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'lang-switch';
    btn.setAttribute('aria-label', 'Changer de langue / Switch language');
    btn.innerHTML = '<span data-l="fr">FR</span><span class="sep">/</span><span data-l="en">EN</span>';
    btn.addEventListener('click', () => I18N.set(lang === 'fr' ? 'en' : 'fr'));
    const cv = links.querySelector('.btn');
    links.insertBefore(btn, cv || null);
  }

  const I18N = {
    get lang() { return lang; },
    t(key) {
      const table = UI[lang] || UI.fr;
      return table[key] !== undefined ? table[key] : (UI.fr[key] !== undefined ? UI.fr[key] : key);
    },
    // Renvoie p.title_en / p.summary_en en anglais si présent, sinon la version FR
    pick(obj, field) {
      if (lang === 'en' && obj[field + '_en']) return obj[field + '_en'];
      return obj[field];
    },
    locale() { return lang === 'en' ? 'en-GB' : 'fr-FR'; },
    set(l) {
      if (l !== 'fr' && l !== 'en') return;
      lang = l;
      save(l);
      apply();
      document.dispatchEvent(new CustomEvent('langchange', { detail: { lang } }));
    }
  };

  window.I18N = I18N;
  injectSwitch();
  apply();
})();
