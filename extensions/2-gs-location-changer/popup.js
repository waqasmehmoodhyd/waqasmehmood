// Waqas Mehmood - GS Location Changer & Local 3-Pack Spy
// Engine & UI Controller (100% Robust, No CSV Clutter, Pure PDF Report)

document.addEventListener('DOMContentLoaded', async () => {
  // Navigation & Control Elements
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');
  const inputQuery = document.getElementById('input-query');
  const inputCustomCity = document.getElementById('input-custom-city');
  const selectDomain = document.getElementById('select-domain');
  const selectHl = document.getElementById('select-hl');
  const btnRunSearch = document.getElementById('btn-run-search');
  const cityChips = document.querySelectorAll('.city-chip');
  
  // 3-Pack Elements
  const packQueryLabel = document.getElementById('pack-query-label');
  const packLocLabel = document.getElementById('pack-loc-label');
  const competitorsList = document.getElementById('competitors-cards-list');
  const btnRefreshPack = document.getElementById('btn-refresh-pack');
  const btnHeaderExportPdf = document.getElementById('btn-header-export-pdf');
  const btnTabExportPdf = document.getElementById('btn-tab-export-pdf');

  let latestPackData = null;

  // GLOBAL LINK INTERCEPTOR:
  // Fixes broken clicks in Chrome extension popup so ALL links open reliably in a new tab!
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (!link) return;

    const href = link.getAttribute('href');
    if (!href) return;

    if (href.startsWith('http://') || href.startsWith('https://')) {
      e.preventDefault();
      chrome.tabs.create({ url: href });
    } else if (href.startsWith('tel:')) {
      e.preventDefault();
      const phoneNum = href.replace(/^tel:/i, '').trim();
      navigator.clipboard.writeText(phoneNum);
      alert(`Copied phone number: ${phoneNum}`);
    } else if (href.startsWith('mailto:')) {
      e.preventDefault();
      chrome.tabs.create({ url: href });
    }
  });

  // Tab Switching
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.remove('active'));
      tabPanes.forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const targetId = btn.getAttribute('data-tab');
      const targetPane = document.getElementById(targetId);
      if (targetPane) targetPane.classList.add('active');

      if (targetId === 'tab-pack') {
        scanActiveSerpPack();
      }
    });
  });

  // UULE Encoder for Google canonical geo locations
  function generateGoogleUule(locationStr) {
    if (!locationStr || !locationStr.trim()) return '';
    const loc = locationStr.trim();
    const lengthKeys = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
    if (loc.length >= lengthKeys.length) return '';
    
    const lengthChar = lengthKeys[loc.length];
    const base64Loc = btoa(unescape(encodeURIComponent(loc)));
    return `w+CAIQICI${lengthChar}${base64Loc}`;
  }

  // Restore stored preferences
  chrome.storage.local.get(['wm_loc_city', 'wm_loc_domain', 'wm_loc_hl', 'wm_loc_query'], (res) => {
    if (res.wm_loc_city) inputCustomCity.value = res.wm_loc_city;
    if (res.wm_loc_domain) selectDomain.value = res.wm_loc_domain;
    if (res.wm_loc_hl) selectHl.value = res.wm_loc_hl;
    if (res.wm_loc_query) inputQuery.value = res.wm_loc_query;
  });

  // Popular City Chips Click
  cityChips.forEach(chip => {
    chip.addEventListener('click', () => {
      cityChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');

      const loc = chip.getAttribute('data-loc');
      const hl = chip.getAttribute('data-hl') || 'en';
      const domain = chip.getAttribute('data-domain') || 'google.com';

      inputCustomCity.value = loc;
      selectHl.value = hl;
      selectDomain.value = domain;

      chrome.storage.local.set({
        wm_loc_city: loc,
        wm_loc_hl: hl,
        wm_loc_domain: domain
      });
    });
  });

  inputCustomCity.addEventListener('input', () => {
    const val = inputCustomCity.value.toLowerCase();
    if (val.includes('united kingdom') || val.includes('london') || val.includes('manchester') || val.includes('birmingham') || val.includes(' uk')) {
      selectDomain.value = 'google.co.uk';
    } else if (val.includes('dubai') || val.includes('abu dhabi') || val.includes('united arab emirates') || val.includes(' uae')) {
      selectDomain.value = 'google.ae';
    } else if (val.includes('pakistan') || val.includes('karachi') || val.includes('lahore') || val.includes('islamabad')) {
      selectDomain.value = 'google.com.pk';
    } else if (val.includes('canada') || val.includes('toronto') || val.includes('vancouver')) {
      selectDomain.value = 'google.ca';
    } else if (val.includes('australia') || val.includes('sydney') || val.includes('melbourne')) {
      selectDomain.value = 'google.com.au';
    }
  });

  // Launch Google Search with Safe Local Parameters (No gl= parameter to prevent 403 blocks)
  btnRunSearch.addEventListener('click', () => {
    const query = inputQuery.value.trim() || 'plumber near me';
    const city = inputCustomCity.value.trim();
    let domain = selectDomain.value || 'google.com';
    const hl = selectHl.value || 'en';

    const qLower = query.toLowerCase();
    const cLower = city.toLowerCase();

    if (domain === 'google.co.uk' || qLower.includes('in uk') || qLower.includes('uk') || qLower.includes('london') || cLower.includes('united kingdom') || cLower.includes('london')) {
      domain = 'google.co.uk';
    } else if (domain === 'google.ae' || qLower.includes('dubai') || cLower.includes('dubai') || cLower.includes('uae')) {
      domain = 'google.ae';
    } else if (domain === 'google.com.pk' || qLower.includes('pakistan') || cLower.includes('karachi') || cLower.includes('lahore')) {
      domain = 'google.com.pk';
    } else if (domain === 'google.ca' || cLower.includes('canada') || cLower.includes('toronto')) {
      domain = 'google.ca';
    } else if (domain === 'google.com.au' || cLower.includes('australia') || cLower.includes('sydney')) {
      domain = 'google.com.au';
    }

    let searchUrl = `https://www.${domain}/search?q=${encodeURIComponent(query)}`;

    if (city) {
      const uule = generateGoogleUule(city);
      if (uule) {
        searchUrl += `&uule=${uule}`;
      }
    }

    if (hl && hl !== 'en') {
      searchUrl += `&hl=${encodeURIComponent(hl)}`;
    }

    chrome.storage.local.set({
      wm_loc_city: city,
      wm_loc_domain: domain,
      wm_loc_query: query
    });

    chrome.tabs.create({ url: searchUrl });
  });

  // Local 3-Pack Spy Scanning
  async function scanActiveSerpPack(onDone) {
    packQueryLabel.textContent = 'Scanning current tab...';
    packLocLabel.textContent = 'Looking for Google SERP 3-Pack elements...';

    const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!activeTab || !activeTab.id) {
      showEmptyState('No active tab detected.');
      if (onDone) onDone(false, null);
      return;
    }

    if (!activeTab.url || !activeTab.url.includes('google.') || !activeTab.url.includes('/search')) {
      showEmptyState('Active tab is not a Google Search page. Open or launch a Google search tab above to inspect its Local 3-Pack competitors.');
      packQueryLabel.textContent = 'Not a Google SERP Tab';
      packLocLabel.textContent = 'Navigate to a Google search results page.';
      if (onDone) onDone(false, null);
      return;
    }

    try {
      chrome.tabs.sendMessage(activeTab.id, { action: 'GET_SERP_PACK' }, (response) => {
        if (chrome.runtime.lastError || !response || !response.success) {
          // Inject content script on the fly if needed
          chrome.scripting.executeScript({
            target: { tabId: activeTab.id },
            files: ['content.js']
          }, () => {
            if (chrome.runtime.lastError) {
              showEmptyState('Could not read Google search tab. Please refresh the Google tab.');
              if (onDone) onDone(false, null);
              return;
            }
            setTimeout(() => {
              chrome.tabs.sendMessage(activeTab.id, { action: 'GET_SERP_PACK' }, (retryRes) => {
                if (retryRes && retryRes.success) {
                  renderPackData(retryRes.data);
                  if (onDone) onDone(true, retryRes.data);
                } else {
                  showEmptyState('No Local 3-Pack found on this query. Try a query with local intent (e.g. "plumber in london" or "dentist near me").');
                  if (onDone) onDone(false, null);
                }
              });
            }, 300);
          });
          return;
        }

        renderPackData(response.data);
        if (onDone) onDone(true, response.data);
      });
    } catch (err) {
      showEmptyState(`Error connecting to tab: ${err.message}`);
      if (onDone) onDone(false, null);
    }
  }

  function renderPackData(data) {
    latestPackData = data;
    packQueryLabel.textContent = `"${data.currentQuery || 'Google Search'}"`;
    packLocLabel.textContent = `Geo: ${data.googleDetectedLocation || 'Detected'} &bull; ${data.competitors.length} Competitors`;

    if (!data.competitors || data.competitors.length === 0) {
      showEmptyState('No Local 3-Pack found on this search page. Try queries with local intent like "hvac repair", "electrician near me", or "plumber near me".');
      return;
    }

    competitorsList.innerHTML = '';

    data.competitors.forEach((c) => {
      const card = document.createElement('div');
      card.className = 'competitor-card';
      const cleanRating = (c.rating || '').replace(/[^0-9.]/g, '') || '5.0';
      const cleanReviews = (c.reviews || '').replace(/[^0-9]/g, '') || '0';
      const webUrl = c.websiteUrl || 'Not Listed';
      const phoneNum = c.phone || 'Not Listed';

      card.innerHTML = `
        <div class="comp-header">
          <span class="comp-rank-badge">#${c.rank}</span>
          <span class="comp-name">${escapeHtml(c.name)}</span>
          <span class="comp-rating">★ ${cleanRating}</span>
        </div>
        <div class="comp-meta">
          <span>${cleanReviews} reviews</span>
          <span>&bull;</span>
          <span class="comp-category">${escapeHtml(c.category)}</span>
        </div>
        <div style="margin-top:8px; padding-top:6px; border-top:1px dashed #334155; font-size:11px; display:flex; flex-direction:column; gap:4px;">
          <div style="display:flex; align-items:center; gap:6px;">
            <span style="color:#94a3b8; font-weight:600;">📞 Phone:</span>
            ${phoneNum !== 'Not Listed' ? `<a href="tel:${escapeHtml(phoneNum)}" style="color:#38bdf8; font-family:monospace; font-weight:700; text-decoration:none;">${escapeHtml(phoneNum)}</a>` : '<span style="color:#64748b;">Not Listed</span>'}
          </div>
          <div style="display:flex; align-items:center; gap:6px;">
            <span style="color:#94a3b8; font-weight:600;">🌐 Website:</span>
            ${webUrl !== 'Not Listed' ? `<a href="${escapeHtml(webUrl)}" target="_blank" style="color:#34d399; text-decoration:underline; max-width:240px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${escapeHtml(webUrl.replace(/^https?:\/\/(www\.)?/, ''))}</a>` : '<span style="color:#ef4444; font-weight:600;">Not Listed</span>'}
          </div>
        </div>
      `;
      competitorsList.appendChild(card);
    });
  }

  // Pure PDF Report Generation (Opens dedicated tab, no popup blockers, no glitching)
  function openPdfReport() {
    if (!latestPackData || !latestPackData.competitors || latestPackData.competitors.length === 0) {
      scanActiveSerpPack((success, scannedData) => {
        if (success && scannedData && scannedData.competitors && scannedData.competitors.length > 0) {
          launchReportTab(scannedData);
        } else {
          alert('📄 PDF Report:\n\nGoogle Search par koi local query open karein (jaise "plumber in london" ya "dentist near me").\nUske baad "PDF Report" dabayein taake ranking 3-Pack businesses ki PDF report open ho sake!');
        }
      });
      return;
    }
    launchReportTab(latestPackData);
  }

  function launchReportTab(data) {
    chrome.storage.local.set({ wm_latest_report: data }, () => {
      chrome.tabs.create({ url: chrome.runtime.getURL('report.html') });
    });
  }

  if (btnHeaderExportPdf) {
    btnHeaderExportPdf.addEventListener('click', openPdfReport);
  }

  if (btnTabExportPdf) {
    btnTabExportPdf.addEventListener('click', openPdfReport);
  }

  if (btnRefreshPack) {
    btnRefreshPack.addEventListener('click', () => {
      scanActiveSerpPack();
    });
  }

  function showEmptyState(msg) {
    competitorsList.innerHTML = `<div class="empty-state">${escapeHtml(msg)}</div>`;
  }

  function escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
});
