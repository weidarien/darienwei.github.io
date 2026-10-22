
(() => {
  const panels = [...document.querySelectorAll('.content-panel')];
  const sections = panels.map(panel => panel.id);
  const links = [...document.querySelectorAll('a[data-section]')];
  const highlights = [...document.querySelectorAll('[data-section]')];
  const legacySections = { methods: 'research-techniques', notes: 'tutoring-notes' };
  const atlasLinks = [...document.querySelectorAll('a[href="#atlas"]')];
  const atlasHeading = document.getElementById('atlas-heading');
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  const atlasTitle = 'Darien Wei — An Atlas of Curiosity';
  atlasHeading.tabIndex = -1;

  function updateBrowserTheme() {
    themeMeta.content = getComputedStyle(document.body).getPropertyValue('--paper').trim();
  }

  function sectionFromHash() {
    const hash = window.location.hash.slice(1);
    const section = legacySections[hash] || hash;
    return sections.includes(section) ? section : null;
  }

  function selectSection(section, moveToContent = false) {
    if (!sections.includes(section)) return;
    const selectedPanel = document.getElementById(section);
    document.body.dataset.view = 'section';
    document.body.dataset.theme = selectedPanel.dataset.organ;
    document.title = document.getElementById(section + '-title').textContent.trim() + ' — Darien Wei';
    atlasLinks.forEach(link => link.removeAttribute('aria-current'));
    panels.forEach(panel => { panel.hidden = panel.id !== section; });
    const illustration = selectedPanel.querySelector('.organ-detail-art img');
    if (illustration) illustration.loading = 'eager';
    links.forEach(link => {
      const active = link.dataset.section === section;
      link.classList.toggle('is-active', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    updateBrowserTheme();
    if (moveToContent) {
      document.getElementById(section + '-title').focus({ preventScroll: true });
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }

  function showAtlas(moveToTop = false) {
    document.body.dataset.view = 'atlas';
    delete document.body.dataset.theme;
    document.title = atlasTitle;
    links.forEach(link => {
      link.classList.remove('is-active', 'is-hovered');
      link.removeAttribute('aria-current');
    });
    highlights.forEach(item => item.classList.remove('is-hovered'));
    document.querySelector('.atlas-nav').setAttribute('aria-current', 'page');
    updateBrowserTheme();
    if (moveToTop) {
      atlasHeading.focus({ preventScroll: true });
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }

  links.forEach(link => {
    link.addEventListener('click', event => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const section = link.dataset.section;
      if (!sections.includes(section)) return;
      event.preventDefault();
      if (window.location.hash !== '#' + section) {
        window.history.pushState(null, '', '#' + section);
      }
      selectSection(section, true);
    });
    const highlight = state => {
      highlights.filter(item => item.dataset.section === link.dataset.section)
        .forEach(item => item.classList.toggle('is-hovered', state));
    };
    link.addEventListener('pointerenter', () => highlight(true));
    link.addEventListener('pointerleave', () => highlight(false));
    link.addEventListener('focus', () => highlight(true));
    link.addEventListener('blur', () => highlight(false));
  });

  atlasLinks.forEach(link => {
    link.addEventListener('click', event => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      if (window.location.hash !== '#atlas') window.history.pushState(null, '', '#atlas');
      showAtlas(true);
    });
  });

  function restoreLocation() {
    const section = sectionFromHash();
    if (section) selectSection(section, true);
    else if (window.location.hash !== '#field-index') showAtlas(true);
  }

  document.documentElement.classList.add('js-enabled');
  if (sectionFromHash()) selectSection(sectionFromHash());
  else showAtlas();
  window.addEventListener('hashchange', restoreLocation);
  if (sectionFromHash()) {
    window.addEventListener('load', () => selectSection(sectionFromHash(), true), { once: true });
  }
  document.getElementById('year').textContent = new Date().getFullYear();
})();
