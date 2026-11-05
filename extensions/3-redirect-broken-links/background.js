// Waqas Mehmood - Smart Redirect Path & Broken Link Checker
// Background Service Worker: HTTP Navigation & Redirect Chain Inspector

const tabRedirectChains = new Map();

// Helper to sanitize headers
function extractKeyHeaders(responseHeaders) {
  if (!responseHeaders) return {};
  const map = {};
  const targets = ['server', 'cache-control', 'x-robots-tag', 'strict-transport-security', 'location', 'content-type'];
  responseHeaders.forEach(h => {
    const name = h.name.toLowerCase();
    if (targets.includes(name)) {
      map[name] = h.value;
    }
  });
  return map;
}

// 1. Intercept HTTP Redirects (301, 302, 307, 308)
chrome.webRequest.onBeforeRedirect.addListener(
  (details) => {
    if (details.type !== 'main_frame') return;

    const tabId = details.tabId;
    if (!tabRedirectChains.has(tabId)) {
      tabRedirectChains.set(tabId, []);
    }

    const chain = tabRedirectChains.get(tabId);
    chain.push({
      step: chain.length + 1,
      url: details.url,
      statusCode: details.statusCode,
      statusLine: details.statusLine || `${details.statusCode} Redirect`,
      redirectUrl: details.redirectUrl,
      ip: details.ip || 'Unknown',
      headers: extractKeyHeaders(details.responseHeaders),
      timestamp: Date.now()
    });

    // Update Action Badge
    try {
      chrome.action.setBadgeText({ tabId, text: `${details.statusCode}` });
      chrome.action.setBadgeBackgroundColor({ tabId, color: '#f59e0b' }); // Amber for redirects
    } catch (e) {}
  },
  { urls: ['<all_urls>'], types: ['main_frame'] },
  ['responseHeaders']
);

// 2. Intercept Final Main Frame Landing
chrome.webRequest.onCompleted.addListener(
  (details) => {
    if (details.type !== 'main_frame') return;

    const tabId = details.tabId;
    if (!tabRedirectChains.has(tabId)) {
      tabRedirectChains.set(tabId, []);
    }

    const chain = tabRedirectChains.get(tabId);
    
    // Add final destination
    chain.push({
      step: chain.length + 1,
      url: details.url,
      statusCode: details.statusCode,
      statusLine: details.statusLine || `${details.statusCode} OK`,
      redirectUrl: null,
      ip: details.ip || 'Unknown',
      headers: extractKeyHeaders(details.responseHeaders),
      timestamp: Date.now()
    });

    // Badge styling based on final status
    try {
      if (details.statusCode >= 200 && details.statusCode < 300) {
        if (chain.length > 1) {
          chrome.action.setBadgeText({ tabId, text: `${chain.length - 1}R` }); // e.g. 1R for 1 redirect
          chrome.action.setBadgeBackgroundColor({ tabId, color: '#3b82f6' });
        } else {
          chrome.action.setBadgeText({ tabId, text: '200' });
          chrome.action.setBadgeBackgroundColor({ tabId, color: '#10b981' }); // Green OK
        }
      } else if (details.statusCode >= 400) {
        chrome.action.setBadgeText({ tabId, text: `${details.statusCode}` });
        chrome.action.setBadgeBackgroundColor({ tabId, color: '#f43f5e' }); // Red Error
      }
    } catch (e) {}
  },
  { urls: ['<all_urls>'], types: ['main_frame'] },
  ['responseHeaders']
);

// 3. Reset chain when navigation restarts
chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.status === 'loading' && changeInfo.url) {
    tabRedirectChains.set(tabId, []);
  }
});

chrome.tabs.onRemoved.addListener((tabId) => {
  tabRedirectChains.delete(tabId);
});

// 4. Message API for Popup & Content Script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'GET_REDIRECT_CHAIN') {
    const tabId = request.tabId;
    const chain = tabRedirectChains.get(tabId) || [];
    sendResponse({ success: true, chain });
    return true;
  }

  // Cross-Origin Link Checker endpoint (bypasses CORS using extension host permissions)
  if (request.action === 'CHECK_SINGLE_LINK') {
    const targetUrl = request.url;
    fetch(targetUrl, { method: 'HEAD', redirect: 'follow' })
      .then(res => {
        sendResponse({ success: true, status: res.status, ok: res.ok, redirected: res.redirected, finalUrl: res.url });
      })
      .catch(() => {
        // Fallback to GET in case server blocks HEAD
        fetch(targetUrl, { method: 'GET', redirect: 'follow' })
          .then(res => {
            sendResponse({ success: true, status: res.status, ok: res.ok, redirected: res.redirected, finalUrl: res.url });
          })
          .catch(err => {
            sendResponse({ success: false, status: 0, error: err.message });
          });
      });
    return true; // keep channel open for async response
  }

  return true;
});
