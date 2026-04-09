/**
 * episodes.js — Episode list renderer + live search
 *
 * Fetches from /api/episodes (Cloudflare Pages Function),
 * renders episode cards, and handles keyword search.
 *
 * Exposes window.updateEpisodeLang(langData) so script.js can
 * push updated translations when the user switches language.
 */

(function () {
  const listEl     = document.getElementById('episode-list');
  const searchEl   = document.getElementById('episode-search');
  const loadingEl  = document.getElementById('episodes-loading');
  const countEl    = document.getElementById('episodes-count');

  let allEpisodes  = [];
  let langData     = {};

  // ─── Public API (called by script.js updateContent) ─────────────────────
  window.updateEpisodeLang = function (data) {
    langData = data;
    if (searchEl) searchEl.placeholder = data.episodes_search_placeholder;
    // Re-render if episodes are already loaded
    if (allEpisodes.length > 0) {
      renderFiltered(searchEl ? searchEl.value : '');
    }
  };

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
    const results = q
      ? allEpisodes.filter(ep =>
          ep.title.toLowerCase().includes(q) ||
          ep.description.toLowerCase().includes(q)
        )
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
    results.forEach(ep => fragment.appendChild(buildCard(ep, q)));
    listEl.appendChild(fragment);
  }

  function buildCard(ep, query) {
    const card = document.createElement('div');
    card.className = 'episode-card';

    const listenText = langData.episodes_listen || 'Listen →';

    card.innerHTML = `
      <div class="episode-meta">
        <span class="episode-num">EP.${escHtml(ep.episode)}</span>
        ${ep.date ? `<span class="episode-date">${escHtml(ep.date)}</span>` : ''}
        ${ep.duration ? `<span class="episode-duration">${escHtml(ep.duration)}</span>` : ''}
      </div>
      <h3 class="episode-title">${highlight(escHtml(ep.title), query)}</h3>
      ${ep.description ? `<p class="episode-desc">${highlight(escHtml(ep.description), query)}</p>` : ''}
      ${ep.url ? `<a href="${escHtml(ep.url)}" target="_blank" rel="noopener noreferrer" class="episode-listen">${escHtml(listenText)}</a>` : ''}
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
  loadEpisodes();
})();
