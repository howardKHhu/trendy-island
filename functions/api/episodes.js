/**
 * Cloudflare Pages Function — /api/episodes
 *
 * Flow:
 *  1. Look up the podcast RSS feed URL via Apple iTunes API (CORS-enabled, public)
 *  2. Fetch and parse the RSS XML server-side (avoids browser CORS restrictions)
 *  3. Return a clean JSON array of episodes
 *  4. Response is cached for 1 hour at Cloudflare edge
 */

const APPLE_PODCAST_ID = '1866784652';
const CACHE_TTL = 3600; // seconds

export async function onRequest(context) {
  const cacheKey = new Request('https://trendyisland-episodes-cache/v3', context.request);
  const cache = caches.default;

  // Serve from edge cache if available
  const cached = await cache.match(cacheKey);
  if (cached) return cached;

  try {
    const feedUrl = await getRssFeedUrl();
    if (!feedUrl) return jsonResponse({ error: 'RSS feed URL not found' }, 404);

    const rssText = await fetchRss(feedUrl);
    const episodes = parseRss(rssText);

    const response = jsonResponse(episodes, 200, {
      'Cache-Control': `public, max-age=${CACHE_TTL}`,
    });

    // Store in edge cache
    context.waitUntil(cache.put(cacheKey, response.clone()));
    return response;
  } catch (err) {
    return jsonResponse({ error: err.message }, 500);
  }
}

// ─── Helpers ────────────────────────────────────────────────────────────────

async function getRssFeedUrl() {
  const res = await fetch(
    `https://itunes.apple.com/lookup?id=${APPLE_PODCAST_ID}&entity=podcast`,
    { headers: { 'User-Agent': 'TrendyIsland/1.0' } }
  );
  const data = await res.json();
  return data.results?.[0]?.feedUrl ?? null;
}

async function fetchRss(feedUrl) {
  const res = await fetch(feedUrl, {
    headers: { 'User-Agent': 'TrendyIsland/1.0' },
  });
  if (!res.ok) throw new Error(`RSS fetch failed: ${res.status}`);
  return res.text();
}

function parseRss(xml) {
  // Split into <item> blocks
  const rawItems = xml.split(/<item[\s>]/i).slice(1);

  return rawItems
    .map((raw, index) => {
      const end = raw.indexOf('</item>');
      const item = end > -1 ? raw.slice(0, end) : raw;

      const title       = extractTag(item, 'title');
      const description = extractTag(item, 'description') || extractTag(item, 'itunes:summary');
      const pubDate     = extractTag(item, 'pubDate');
      const link        = extractTag(item, 'link') || extractAttr(item, 'enclosure', 'url');
      const guid        = extractTag(item, 'guid');
      const episodeNum  = extractTag(item, 'itunes:episode');
      const duration    = extractTag(item, 'itunes:duration');

      // Prefer a Spotify/http link over a bare guid
      const listenUrl = [link, guid].find(u => u?.startsWith('http')) ?? '';

      // Strip HTML tags and truncate description
      const cleanDesc = description
        .replace(/<[^>]+>/g, '')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&nbsp;/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

      // Format date as YYYY-MM-DD
      let date = '';
      if (pubDate) {
        try { date = new Date(pubDate).toISOString().split('T')[0]; } catch {}
      }

      return {
        episode: episodeNum || String(rawItems.length - index),
        title,
        description: cleanDesc.length > 280
          ? cleanDesc.slice(0, 280).trimEnd() + '...'
          : cleanDesc,
        date,
        duration: formatDuration(duration),
        url: listenUrl,
      };
    })
    .filter(ep => ep.title);
}

function extractTag(xml, tag) {
  // Use (?:\s[^>]*)? so the tag name must be followed by > or whitespace,
  // preventing <itunes:episode...> from matching <itunes:episodetype>
  const re = new RegExp(
    `<${tag}(?:\\s[^>]*)?>(?:<!\\[CDATA\\[([\\s\\S]*?)\\]\\]>|([\\s\\S]*?))<\\/${tag}>`,
    'i'
  );
  const m = xml.match(re);
  if (!m) return '';
  return (m[1] ?? m[2] ?? '').trim();
}

function extractAttr(xml, tag, attr) {
  const m = xml.match(new RegExp(`<${tag}[^>]*\\s${attr}="([^"]*)"`, 'i'));
  return m ? m[1] : '';
}

function formatDuration(raw) {
  if (!raw) return '';
  // Already formatted as HH:MM:SS or MM:SS
  if (raw.includes(':')) return raw;
  // Plain seconds
  const secs = parseInt(raw, 10);
  if (isNaN(secs)) return '';
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  return h > 0
    ? `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
    : `${m}:${String(s).padStart(2, '0')}`;
}

function jsonResponse(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      ...extraHeaders,
    },
  });
}
