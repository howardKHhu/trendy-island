/**
 * episodes.js — Bilingual episode list renderer + live search
 *
 * Fetches grouped bilingual episodes from /api/episodes (Cloudflare Pages Function).
 * Each episode object has: { episode, date, en: {...}, zh: {...} }
 *
 * Display language (epLang) defaults to site language if zh, otherwise en.
 * User can override via the EN / 中文 toggle buttons in the episodes header.
 *
 * Public API (called by script.js):
 *   window.updateEpisodeLang(langData, siteLang) — called on language switch
 *   window.setEpLang(lang)                        — called by toggle buttons
 */

(function () {
  const listEl    = document.getElementById('episode-list');
  const searchEl  = document.getElementById('episode-search');
  const loadingEl = document.getElementById('episodes-loading');
  const countEl   = document.getElementById('episodes-count');

  let allEpisodes = [];
  let langData    = {};
  // Default episode language: follow site lang if zh, otherwise en
  let epLang = (document.documentElement.lang === 'zh') ? 'zh' : 'en';

  // ─── Public API ──────────────────────────────────────────────────────────

  window.updateEpisodeLang = function (data, siteLang) {
    langData = data;
    if (searchEl) searchEl.placeholder = data.episodes_search_placeholder;
    // Follow site language switch (zh ↔ everything else)
    const newEpLang = (siteLang === 'zh') ? 'zh' : 'en';
    if (newEpLang !== epLang) {
      epLang = newEpLang;
      updateToggleUI();
    }
    if (allEpisodes.length > 0) renderFiltered(searchEl ? searchEl.value : '');
  };

  window.setEpLang = function (lang) {
    epLang = lang;
    updateToggleUI();
    renderFiltered(searchEl ? searchEl.value : '');
  };

  function updateToggleUI() {
    const enBtn = document.getElementById('ep-lang-en');
    const zhBtn = document.getElementById('ep-lang-zh');
    if (enBtn) enBtn.classList.toggle('active', epLang === 'en');
    if (zhBtn) zhBtn.classList.toggle('active', epLang === 'zh');
  }

  // ─── Fetch ───────────────────────────────────────────────────────────────

  async function loadEpisodes() {
    try {
      const res = await fetch('/api/episodes');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      allEpisodes = await res.json();
      if (!Array.isArray(allEpisodes)) throw new Error('Invalid response');
      renderFiltered('');
    } catch {
      if (loadingEl) {
        loadingEl.textContent = langData.episodes_error || 'Failed to load episodes.';
      }
    }
  }

  // ─── Render ──────────────────────────────────────────────────────────────

  function renderFiltered(query) {
    const q = query.toLowerCase().trim();

    // Filter by search query against the active language content
    const results = q
      ? allEpisodes.filter(ep => {
          const content = ep[epLang] || ep.en || ep.zh;
          if (!content) return false;
          return (
            content.title.toLowerCase().includes(q) ||
            content.description.toLowerCase().includes(q)
          );
        })
      : allEpisodes;

    if (loadingEl) loadingEl.style.display = 'none';
    listEl.innerHTML = '';

    if (countEl) {
      countEl.textContent = q
        ? `${results.length} / ${allEpisodes.length}`
        : `${allEpisodes.length}`;
    }

    if (results.length === 0) {
      const empty = document.createElement('p');
      empty.className = 'episodes-empty';
      empty.textContent = langData.episodes_no_results || 'No results found.';
      listEl.appendChild(empty);
      return;
    }

    const fragment = document.createDocumentFragment();
    results.forEach(ep => {
      const card = buildCard(ep, q);
      if (card) fragment.appendChild(card);
    });
    listEl.appendChild(fragment);
  }

  function buildCard(ep, query) {
    // Pick content for active language, fall back to whichever exists
    const content = ep[epLang] || ep.en || ep.zh;
    if (!content) return null;

    const card = document.createElement('div');
    card.className = 'episode-card';

    const listenText = langData.episodes_listen || 'Listen →';

    card.innerHTML = `
      <div class="episode-meta">
        <span class="episode-num">EP.${escHtml(ep.episode)}</span>
        ${ep.date ? `<span class="episode-date">${escHtml(ep.date)}</span>` : ''}
        ${content.duration ? `<span class="episode-duration">${escHtml(content.duration)}</span>` : ''}
      </div>
      <h3 class="episode-title">${highlight(escHtml(content.title), query)}</h3>
      ${content.description ? `<p class="episode-desc">${highlight(escHtml(content.description), query)}</p>` : ''}
      ${content.url ? `<a href="${escHtml(content.url)}" target="_blank" rel="noopener noreferrer" class="episode-listen">${escHtml(listenText)}</a>` : ''}
    `;
    return card;
  }

  // Wrap matched text in <mark> for visual highlighting
  function highlight(text, query) {
    if (!query) return text;
    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return text.replace(new RegExp(`(${escaped})`, 'gi'), '<mark>$1</mark>');
  }

  function escHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // ─── Search ──────────────────────────────────────────────────────────────

  if (searchEl) {
    searchEl.addEventListener('input', e => renderFiltered(e.target.value));
  }

  // ─── Init ────────────────────────────────────────────────────────────────

  updateToggleUI();
  loadEpisodes();
})();
