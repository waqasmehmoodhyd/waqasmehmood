// Waqas Mehmood - Smart Redirect Path & Broken Link Checker
// Content Script: DOM Link Extraction & Visual In-Page Highlighter

function getAllPageLinks() {
  const anchors = Array.from(document.querySelectorAll('a[href]'));
  const currentOrigin = window.location.origin;

  const linksData = [];
  const seenUrls = new Set();

  anchors.forEach((a, index) => {
    let rawHref = a.getAttribute('href');
    if (!rawHref) return;

    rawHref = rawHref.trim();
    if (rawHref.startsWith('#') || rawHref.startsWith('javascript:') || rawHref.startsWith('mailto:') || rawHref.startsWith('tel:')) {
      return; // Skip non-HTTP navigations for audit
    }

    let absoluteUrl = '';
    try {
      absoluteUrl = new URL(rawHref, window.location.href).href;
    } catch (e) {
      absoluteUrl = rawHref;
    }

    const text = (a.innerText || a.getAttribute('title') || a.getAttribute('aria-label') || '[Image / Empty Text]').trim().replace(/\s+/g, ' ');
    const isInternal = absoluteUrl.startsWith(currentOrigin);
    const rel = a.getAttribute('rel') || '';
    const isNofollow = rel.toLowerCase().includes('nofollow');

    // Attach unique data attribute for DOM highlighting
    const linkId = `wm-link-${index}`;
    a.setAttribute('data-wm-link-id', linkId);

    linksData.push({
      id: linkId,
      url: absoluteUrl,
      text: text.slice(0, 80),
      isInternal,
      isNofollow,
      rel
    });
  });

  return {
    pageUrl: window.location.href,
    origin: currentOrigin,
    totalCount: linksData.length,
    links: linksData
  };
}

// In-Page Highlighting System
function injectHighlighterStyles() {
  if (document.getElementById('wm-highlighter-styles')) return;

  const style = document.createElement('style');
  style.id = 'wm-highlighter-styles';
  style.textContent = `
    a.wm-highlight-valid {
      outline: 2px solid #10b981 !important;
      outline-offset: 2px !important;
      background-color: rgba(16, 185, 129, 0.08) !important;
      position: relative !important;
    }
    a.wm-highlight-broken {
      outline: 3px solid #f43f5e !important;
      outline-offset: 3px !important;
      background-color: rgba(244, 63, 94, 0.2) !important;
      position: relative !important;
      animation: wmPulseRed 1.5s infinite !important;
    }
    a.wm-highlight-redirect {
      outline: 2px dashed #f59e0b !important;
      outline-offset: 2px !important;
      background-color: rgba(245, 158, 11, 0.12) !important;
      position: relative !important;
    }
    .wm-inline-badge {
      display: inline-block !important;
      font-size: 10px !important;
      font-weight: 800 !important;
      font-family: -apple-system, BlinkMacSystemFont, sans-serif !important;
      padding: 1px 4px !important;
      border-radius: 3px !important;
      margin-left: 4px !important;
      vertical-align: middle !important;
      line-height: 1.2 !important;
      z-index: 999999 !important;
    }
    .wm-badge-broken {
      background: #f43f5e !important;
      color: #fff !important;
      box-shadow: 0 1px 4px rgba(244, 63, 94, 0.5) !important;
    }
    .wm-badge-redirect {
      background: #f59e0b !important;
      color: #000 !important;
    }
    .wm-badge-valid {
      background: #10b981 !important;
      color: #fff !important;
    }
    @keyframes wmPulseRed {
      0% { box-shadow: 0 0 0 0 rgba(244, 63, 94, 0.7); }
      70% { box-shadow: 0 0 0 6px rgba(244, 63, 94, 0); }
      100% { box-shadow: 0 0 0 0 rgba(244, 63, 94, 0); }
    }
  `;
  document.head.appendChild(style);
}

function applyHighlights(results) {
  injectHighlighterStyles();
  clearHighlights();

  results.forEach(item => {
    const el = document.querySelector(`a[data-wm-link-id="${item.id}"]`);
    if (!el) return;

    if (item.status === 'broken') {
      el.classList.add('wm-highlight-broken');
      const badge = document.createElement('span');
      badge.className = 'wm-inline-badge wm-badge-broken wm-temp-badge';
      badge.textContent = `❌ ${item.statusCode || 404}`;
      el.parentNode.insertBefore(badge, el.nextSibling);
    } else if (item.status === 'redirect') {
      el.classList.add('wm-highlight-redirect');
      const badge = document.createElement('span');
      badge.className = 'wm-inline-badge wm-badge-redirect wm-temp-badge';
      badge.textContent = `⚡ ${item.statusCode || 301}`;
      el.parentNode.insertBefore(badge, el.nextSibling);
    } else if (item.status === 'valid') {
      el.classList.add('wm-highlight-valid');
    }
  });
}

function clearHighlights() {
  document.querySelectorAll('.wm-highlight-valid, .wm-highlight-broken, .wm-highlight-redirect').forEach(el => {
    el.classList.remove('wm-highlight-valid', 'wm-highlight-broken', 'wm-highlight-redirect');
  });
  document.querySelectorAll('.wm-temp-badge').forEach(badge => badge.remove());
}

// Runtime Listener
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'GET_DOM_LINKS') {
    try {
      const data = getAllPageLinks();
      sendResponse({ success: true, data });
    } catch (e) {
      sendResponse({ success: false, error: e.message });
    }
    return true;
  }

  if (request.action === 'APPLY_PAGE_HIGHLIGHTS') {
    applyHighlights(request.results || []);
    sendResponse({ success: true });
    return true;
  }

  if (request.action === 'CLEAR_PAGE_HIGHLIGHTS') {
    clearHighlights();
    sendResponse({ success: true });
    return true;
  }

  return true;
});
