/* ============================================================================
   MAINTENANCE (DedSec Blog)
   - This file renders the Blog listing.
   - Primary mode: fetch posts from GitHub (auto-detects repo on *.github.io).
   - Offline fallback: EMBEDDED_POSTS below (update when you add/remove posts).
   ============================================================================ */
(() => {
  'use strict';

  const GRID_ID = 'blog-posts-grid';
  const DEFAULT_CFG = {
    github: {
      owner: 'dedsec1121fk',
      repo: 'dedsec1121fk.github.io',
      branch: 'main',
      blogDir: 'Blog'
    }
  };

  const EMBEDDED_POSTS = [
  {
    "file": "watch-dogs-vs-real-life-2026.html",
    "href": "../Blog/watch-dogs-vs-real-life-2026.html",
    "titleEn": "Watch Dogs vs Real Life (2026): What’s Accurate, What’s Not",
    "titleGr": "Watch Dogs vs Real Life (2026): What’s Accurate, What’s Not",
    "descEn": "A grounded comparison between the games’ ctOS fantasy and the real-world tech landscape of 2026.",
    "descGr": "A grounded comparison between the games’ ctOS fantasy and the real-world tech landscape of 2026.",
    "date": "2026-01-10"
  },
  {
    "file": "termux-new-user-guide.html",
    "href": "../Blog/termux-new-user-guide.html",
    "titleEn": "Termux: All a New User Needs to Know",
    "titleGr": "Termux: All a New User Needs to Know",
    "descEn": "A practical starter guide: setup, packages, storage, and good habits.",
    "descGr": "A practical starter guide: setup, packages, storage, and good habits.",
    "date": "2026-01-10"
  },
  {
    "file": "termux-errors-fixes.html",
    "href": "../Blog/termux-errors-fixes.html",
    "titleEn": "Termux Errors and How to Solve Them",
    "titleGr": "Termux Errors and How to Solve Them",
    "descEn": "Common errors explained with quick fixes and commands.",
    "descGr": "Common errors explained with quick fixes and commands.",
    "date": "2026-01-10"
  },
  {
    "file": "termux-run-distros.html",
    "href": "../Blog/termux-run-distros.html",
    "titleEn": "Run Distros & OSes in Termux Using Only Your Phone",
    "titleGr": "Run Distros & OSes in Termux Using Only Your Phone",
    "descEn": "Use proot-distro to run Debian/Ubuntu/Alpine safely without root.",
    "descGr": "Use proot-distro to run Debian/Ubuntu/Alpine safely without root.",
    "date": "2026-01-10"
  },
  {
    "file": "mass-surveillance-digital-id.html",
    "href": "../Blog/mass-surveillance-digital-id.html",
    "titleEn": "Mass Surveillance Through Technology & Digital ID",
    "titleGr": "Mass Surveillance Through Technology & Digital ID",
    "descEn": "How modern tracking works, where digital ID fits in, and practical privacy steps.",
    "descGr": "How modern tracking works, where digital ID fits in, and practical privacy steps.",
    "date": "2026-01-10"
  },
  {
    "file": "learn-python-in-termux.html",
    "href": "../Blog/learn-python-in-termux.html",
    "titleEn": "Learn Python Using Termux: Getting Started",
    "titleGr": "Learn Python Using Termux: Getting Started",
    "descEn": "Install Python, create projects, and build a daily learning routine on Android.",
    "descGr": "Install Python, create projects, and build a daily learning routine on Android.",
    "date": "2026-01-10"
  }
];

  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function fileNameToTitle(name) {
    return String(name || '')
      .replace(/\.html?$/i, '')
      .replace(/[-_]+/g, ' ')
      .replace(/\b\w/g, (m) => m.toUpperCase());
  }

  function getCurrentLang() {
    return (localStorage.getItem('language') || 'en').toLowerCase();
  }

  async function loadConfig() {
    try {
      const res = await fetch('../site-config.json', { cache: 'no-store' });
      if (!res.ok) throw new Error('config fetch failed');
      const cfg = await res.json();
      return { ...DEFAULT_CFG, ...cfg, github: { ...DEFAULT_CFG.github, ...(cfg.github || {}) } };
    } catch (_) {
      return DEFAULT_CFG;
    }
  }
function detectGitHubRepoFromLocation() {
  // If the site is hosted on *.github.io, derive owner/repo from the URL so copied repos work automatically.
  const host = String(location.hostname || '').toLowerCase();
  if (!host.endsWith('github.io')) return null;

  const owner = host.split('.')[0];
  const parts = String(location.pathname || '').split('/').filter(Boolean);

  // User/organization site: https://owner.github.io/  => repo is owner.github.io
  // Project site:          https://owner.github.io/repo/ => repo is the first path segment
  const repo = parts.length ? parts[0] : `${owner}.github.io`;

  return { owner, repo };
}


  async function fetchRepoDirectory({ owner, repo, branch, blogDir }) {
  const base = `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/contents/${encodeURIComponent(blogDir)}`;
  const withRef = branch ? `${base}?ref=${encodeURIComponent(branch)}` : base;

  let res = await fetch(withRef, {
    headers: { Accept: 'application/vnd.github+json' },
    cache: 'no-store'
  });

  // If the branch name is wrong (common when copying the site to a new repo),
  // retry without specifying a ref so GitHub uses the repo’s default branch.
  if (!res.ok && branch) {
    res = await fetch(base, {
      headers: { Accept: 'application/vnd.github+json' },
      cache: 'no-store'
    });
  }

  if (!res.ok) {
    throw new Error(`GitHub API returned ${res.status}`);
  }

  const data = await res.json();
  if (!Array.isArray(data)) return [];
  return data.filter((x) => x && x.type === 'file' && /\.html?$/i.test(x.name));
}


  async function fetchPostMeta(entry) {
    let titleEn = fileNameToTitle(entry.name);
    let titleGr = titleEn;
    let descEn = '';
    let descGr = '';
    let date = '';
    let section = '';
    let tags = [];
try {
      const html = await (await fetch(entry.download_url, { cache: 'no-store' })).text();
      const doc = new DOMParser().parseFromString(html, 'text/html');

      const h1 = doc.querySelector('.page-header h1');
      const p = doc.querySelector('.page-header p');

      const metaDesc = doc.querySelector('meta[name="description"]');
      const published = doc.querySelector('meta[property="article:published_time"]');
      const sectionMeta = doc.querySelector('meta[property="article:section"]');
      const tagMetas = Array.from(doc.querySelectorAll('meta[property="article:tag"]'));
if (h1) {
        titleEn = (h1.getAttribute('data-en') || h1.textContent || titleEn).trim();
        titleGr = (h1.getAttribute('data-gr') || titleGr).trim();
      }
      if (p) {
        descEn = (p.getAttribute('data-en') || p.textContent || '').trim();
        descGr = (p.getAttribute('data-gr') || descGr).trim();
      } else if (metaDesc) {
        descEn = (metaDesc.getAttribute('content') || '').trim();
        descGr = descEn;
      }

      if (published) date = (published.getAttribute('content') || '').trim();

      if (sectionMeta) {
        section = String(sectionMeta.getAttribute('content') || '').trim();
      }
      if (tagMetas && tagMetas.length) {
        tags = tagMetas.map(m => String(m.getAttribute('content') || '').trim()).filter(Boolean);
      }
    } catch (_) {
      // keep fallbacks
    }

    return {
      file: entry.name,
      href: `../Blog/${entry.name}`,
      titleEn,
      titleGr,
      descEn,
      descGr,
      date,
      section,
      tags
    };
  }

  function renderPosts(grid, posts) {
    if (!posts.length) {
      grid.innerHTML = `
        <div class="feature-card" style="grid-column: 1 / -1;">
          <h3 class="feature-title" data-en="No posts found" data-gr="Δεν βρέθηκαν άρθρα">No posts found</h3>
          <p data-en="Upload an HTML file into the /Blog folder and it will appear here automatically." data-gr="Ανέβασε ένα HTML αρχείο στον φάκελο /Blog και θα εμφανιστεί εδώ αυτόματα.">
            Upload an HTML file into the /Blog folder and it will appear here automatically.
          </p>
        </div>`;
      return;
    }

    const cards = posts.map((p) => {
      const titleEn = escapeHtml(p.titleEn);
      const titleGr = escapeHtml(p.titleGr || p.titleEn);
      const descEn = escapeHtml(p.descEn || '');
      const descGr = escapeHtml(p.descGr || p.descEn || '');

      const taxonomy = (() => {
        const out = [];
        if (p.section) out.push(`<span class="badge">${escapeHtml(p.section)}</span>`);
        if (Array.isArray(p.tags)) {
          p.tags.slice(0, 3).forEach(t => out.push(`<span class="badge">#${escapeHtml(t)}</span>`));
        }
        return out.length
          ? `<div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:10px">${out.join('')}</div>`
          : '';
      })();

      const badge = p.date
        ? `<span class="badge" data-en="Updated ${escapeHtml(p.date)}" data-gr="Ενημέρωση ${escapeHtml(p.date)}">Updated ${escapeHtml(p.date)}</span>`
        : '';

      return `
        <a class="feature-card" href="${escapeHtml(p.href)}">
          <div class="feature-icon"><i class="fas fa-book-open"></i></div>
          <h3 class="feature-title" data-en="${titleEn}" data-gr="${titleGr}">${titleEn}</h3>
          <p data-en="${descEn}" data-gr="${descGr}">${descEn}</p>
          ${taxonomy}
          ${badge}
        </a>`;
    });

    grid.innerHTML = cards.join('');
 


  function setupFilters(posts, grid) {
    const catWrap = document.getElementById('category-chips');
    const tagWrap = document.getElementById('tag-chips');
    if (!catWrap || !tagWrap) return () => {};

    const allCats = Array.from(new Set(posts.map(p => (p.section || '').trim()).filter(Boolean))).sort((a,b)=>a.localeCompare(b));
    const allTags = Array.from(new Set(posts.flatMap(p => Array.isArray(p.tags) ? p.tags : []).map(t => String(t).trim()).filter(Boolean))).sort((a,b)=>a.localeCompare(b));

    const params = new URLSearchParams(location.search || '');
    let selectedCat = params.get('cat') || 'All';
    let selectedTag = params.get('tag') || 'All';

    function renderChips(wrap, items, selected, onPick) {
      wrap.innerHTML = '';
      const mk = (label, value) => {
        const b = document.createElement('span');
        b.className = 'chip' + (selected === value ? ' is-active' : '');
        b.textContent = label;
        b.addEventListener('click', () => onPick(value));
        return b;
      };
      wrap.appendChild(mk('All', 'All'));
      items.forEach(v => wrap.appendChild(mk(v, v)));
    }

    function apply() {
      const filtered = posts.filter(p => {
        const okCat = (selectedCat === 'All') || (String(p.section || '') === selectedCat);
        const okTag = (selectedTag === 'All') || (Array.isArray(p.tags) && p.tags.includes(selectedTag));
        return okCat && okTag;
      });

      // keep query params in sync (clean URLs)
      const next = new URLSearchParams(location.search || '');
      if (selectedCat === 'All') next.delete('cat'); else next.set('cat', selectedCat);
      if (selectedTag === 'All') next.delete('tag'); else next.set('tag', selectedTag);
      const nextStr = next.toString();
      const nextUrl = nextStr ? `${location.pathname}?${nextStr}` : location.pathname;
      history.replaceState(null, '', nextUrl);

      renderChips(catWrap, allCats, selectedCat, (v) => { selectedCat = v; render(); apply(); });
      renderChips(tagWrap, allTags, selectedTag, (v) => { selectedTag = v; render(); apply(); });

      renderPosts(grid, filtered);
      if (typeof window.applyLanguage === 'function') window.applyLanguage();
      return filtered;
    }

    function render() {
      // no-op placeholder (chips rerender in apply)
    }

    // initial apply
    apply();
  }
 }

  async function main() {
    const grid = document.getElementById(GRID_ID);
    if (!grid) return;

    const cfg = await loadConfig();

    // If this is a GitHub Pages URL (owner.github.io[/repo]/...), auto-detect the repo so the blog works in any copied/testing repository.
    const detected = detectGitHubRepoFromLocation();
    if (detected) {
      cfg.github = { ...cfg.github, ...detected, branch: '' };
    }
    
let posts = [];
try {
  const entries = await fetchRepoDirectory(cfg.github);
  const metas = await Promise.all(entries.map(fetchPostMeta));

  metas.sort((a, b) => {
    const d = (b.date || '').localeCompare(a.date || '');
    if (d) return d;
    return (a.titleEn || '').localeCompare(b.titleEn || '');
  });

  posts = metas;
} catch (_) {
  // ignore and fall back to embedded list
}

// If GitHub API failed (offline / rate limit), use embedded posts from the ZIP build.
if (!posts.length && Array.isArray(EMBEDDED_POSTS) && EMBEDDED_POSTS.length) {
  posts = EMBEDDED_POSTS.slice();
}

if (!posts.length) {
  grid.innerHTML = `
    <div class="feature-card" style="grid-column: 1 / -1;">
      <h3 class="feature-title" data-en="Couldn’t load posts" data-gr="Αδυναμία φόρτωσης άρθρων">Couldn’t load posts</h3>
      <p data-en="Posts exist, but the list couldn’t be generated. If you’re viewing locally, open the site with a local server (not file://). On GitHub Pages, try refreshing." data-gr="Τα άρθρα υπάρχουν, αλλά η λίστα δεν μπόρεσε να δημιουργηθεί. Αν το βλέπεις τοπικά, άνοιξε το site με local server (όχι file://). Στο GitHub Pages δοκίμασε ανανέωση.">
        Posts exist, but the list couldn’t be generated. If you’re viewing locally, open the site with a local server (not file://). On GitHub Pages, try refreshing.
      </p>
    </div>`;
} else {
  renderPosts(grid, posts);
  try { setupFilters(posts, grid); } catch (_) {}

  // Apply the saved language after rendering
  if (typeof window.changeLanguage === 'function') {
    window.changeLanguage(getCurrentLang());
  }
}
  }

  document.addEventListener('DOMContentLoaded', main);
})();