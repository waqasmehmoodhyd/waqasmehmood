// Waqas Mehmood - GS Location Changer & Local 3-Pack Spy
// Engine & UI Controller

document.addEventListener('DOMContentLoaded', async () => {
  // Elements
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');
  const inputQuery = document.getElementById('input-query');
  const inputCustomCity = document.getElementById('input-custom-city');
  const selectDomain = document.getElementById('select-domain');
  const selectGl = document.getElementById('select-gl');
  const selectHl = document.getElementById('select-hl');
  const btnRunSearch = document.getElementById('btn-run-search');
  const cityChips = document.querySelectorAll('.city-chip');
  const headerLocName = document.getElementById('header-loc-name');
  
  // 3-Pack Elements
  const packQueryLabel = document.getElementById('pack-query-label');
  const packLocLabel = document.getElementById('pack-loc-label');
  const competitorsList = document.getElementById('competitors-cards-list');
  const btnRefreshPack = document.getElementById('btn-refresh-pack');

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
  // Standard Google length secret lookup table
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
  chrome.storage.local.get(['wm_loc_city', 'wm_loc_domain', 'wm_loc_gl', 'wm_loc_hl', 'wm_loc_query'], (res) => {
    if (res.wm_loc_city) inputCustomCity.value = res.wm_loc_city;
    if (res.wm_loc_domain) selectDomain.value = res.wm_loc_domain;
    if (res.wm_loc_gl) selectGl.value = res.wm_loc_gl;
    if (res.wm_loc_hl) selectHl.value = res.wm_loc_hl;
    if (res.wm_loc_query) inputQuery.value = res.wm_loc_query;

    updateHeaderCityDisplay(inputCustomCity.value);
  });

  function updateHeaderCityDisplay(cityText) {
    if (!cityText) {
      headerLocName.textContent = 'Worldwide';
      return;
    }
    const parts = cityText.split(',');
    headerLocName.textContent = parts[0].trim();
  }

  // Popular City Chips Click
  cityChips.forEach(chip => {
    chip.addEventListener('click', () => {
      cityChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');

      const loc = chip.getAttribute('data-loc');
      const gl = chip.getAttribute('data-gl');
      const hl = chip.getAttribute('data-hl');
      const domain = chip.getAttribute('data-domain');

      inputCustomCity.value = loc;
      selectGl.value = gl;
      selectHl.value = hl;
      selectDomain.value = domain;

      updateHeaderCityDisplay(loc);

      chrome.storage.local.set({
        wm_loc_city: loc,
        wm_loc_gl: gl,
        wm_loc_hl: hl,
        wm_loc_domain: domain
      });
    });
  });

  inputCustomCity.addEventListener('input', () => {
    updateHeaderCityDisplay(inputCustomCity.value);
  });

  // Launch Google Search with UULE
  btnRunSearch.addEventListener('click', () => {
    const query = inputQuery.value.trim() || 'plumber near me';
    const city = inputCustomCity.value.trim();
    const domain = selectDomain.value || 'google.com';
    const gl = selectGl.value || 'us';
    const hl = selectHl.value || 'en';

    let searchUrl = `https://www.${domain}/search?q=${encodeURIComponent(query)}&gl=${encodeURIComponent(gl)}&hl=${encodeURIComponent(hl)}`;

    if (city) {
      const uule = generateGoogleUule(city);
      if (uule) {
        searchUrl += `&uule=${encodeURIComponent(uule)}`;
      }
    }

    // Save state
    chrome.storage.local.set({
      wm_loc_city: city,
      wm_loc_gl: gl,
      wm_loc_hl: hl,
      wm_loc_domain: domain,
      wm_loc_query: query
    });

    // Open target search in a fresh tab
    chrome.tabs.create({ url: searchUrl });
  });

  // Local 3-Pack Spy Scanning
  async function scanActiveSerpPack() {
    packQueryLabel.textContent = 'Scanning current tab...';
    packLocLabel.textContent = 'Looking for Google SERP 3-Pack elements...';

    const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!activeTab || !activeTab.id) {
      showEmptyState('No active tab detected.');
      return;
    }

    if (!activeTab.url || !activeTab.url.includes('google.') || !activeTab.url.includes('/search')) {
      showEmptyState('Active tab is not a Google Search page. Open or launch a Google search tab above to inspect its Local 3-Pack competitors.');
      packQueryLabel.textContent = 'Not a Google SERP Tab';
      packLocLabel.textContent = 'Navigate to a Google search results page.';
      return;
    }

    try {
      chrome.tabs.sendMessage(activeTab.id, { action: 'GET_SERP_PACK' }, (response) => {
        if (chrome.runtime.lastError || !response || !response.success) {
          // If content script was not injected on an already-open tab, try injecting it on the fly
          chrome.scripting.executeScript({
            target: { tabId: activeTab.id },
            files: ['content.js']
          }, () => {
            if (chrome.runtime.lastError) {
              showEmptyState('Could not read Google search tab. Please refresh the Google tab.');
              return;
            }
            // Retry message
            setTimeout(() => {
              chrome.tabs.sendMessage(activeTab.id, { action: 'GET_SERP_PACK' }, (retryRes) => {
                if (retryRes && retryRes.success) {
                  renderPackData(retryRes.data);
                } else {
                  showEmptyState('No Local 3-Pack found on this query. Try a query with local intent (e.g. "lawyer in chicago" or "dentist near me").');
                }
              });
            }, 300);
          });
          return;
        }

        renderPackData(response.data);
      });
    } catch (err) {
      showEmptyState(`Error connecting to tab: ${err.message}`);
    }
  }

  function renderPackData(data) {
    packQueryLabel.textContent = `Query: "${data.currentQuery || 'Google Search'}"`;
    packLocLabel.textContent = `SERP Geo: ${data.googleDetectedLocation || 'Detected'}`;

    if (!data.competitors || data.competitors.length === 0) {
      showEmptyState('No Local 3-Pack found on this search page. Try queries with local intent like "hvac repair", "electrician near me", or "seo company".');
      return;
    }

    competitorsList.innerHTML = '';
    
    // Header row with Export CSV button
    const toolsRow = document.createElement('div');
    toolsRow.style.cssText = 'display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;';
    toolsRow.innerHTML = `
      <span style="font-size:11px; font-weight:700; color:#38bdf8;">Found ${data.competitors.length} Ranking Competitors:</span>
      <button id="btn-export-pack-csv" class="btn-chip" style="color:#34d399; border-color:#10b981;">Export to CSV 📥</button>
    `;
    competitorsList.appendChild(toolsRow);

    document.getElementById('btn-export-pack-csv').addEventListener('click', () => {
      exportPackToCsv(data);
    });

    data.competitors.forEach((c) => {
      const card = document.createElement('div');
      card.className = 'competitor-card';
      card.innerHTML = `
        <div class="comp-header">
          <span class="comp-rank-badge">#${c.rank}</span>
          <span class="comp-name">${escapeHtml(c.name)}</span>
          <span class="comp-rating">★ ${escapeHtml(c.rating.replace(/[^0-9.]/g, '') || '5.0')}</span>
        </div>
        <div class="comp-meta">
          <span>${escapeHtml(c.reviews)} reviews</span>
          <span>&bull;</span>
          <span class="comp-category">${escapeHtml(c.category)}</span>
        </div>
        <div class="comp-signals">
          <span class="signal-pill ${c.hasWebsite ? 'yes' : 'no'}">${c.hasWebsite ? '✓ Website Linked' : '✗ No Website'}</span>
          <span class="signal-pill ${c.hasPhone ? 'yes' : 'no'}">${c.hasPhone ? '✓ Phone Signal' : '✗ No Phone'}</span>
        </div>
      `;
      competitorsList.appendChild(card);
    });
  }

  function exportPackToCsv(data) {
    let csv = 'Rank,Business Name,Rating,Reviews,Category,Has Website,Has Phone,Search Query\n';
    data.competitors.forEach(c => {
      csv += `"${c.rank}","${(c.name || '').replace(/"/g, '""')}","${(c.rating || '').replace(/"/g, '""')}","${(c.reviews || '').replace(/"/g, '""')}","${(c.category || '').replace(/"/g, '""')}","${c.hasWebsite ? 'Yes' : 'No'}","${c.hasPhone ? 'Yes' : 'No'}","${(data.currentQuery || '').replace(/"/g, '""')}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `local-3pack-${(data.currentQuery || 'query').replace(/[^a-z0-9]/gi, '_')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function showEmptyState(msg) {
    competitorsList.innerHTML = `<div class="empty-state">${escapeHtml(msg)}</div>`;
  }

  if (btnRefreshPack) {
    btnRefreshPack.addEventListener('click', () => {
      scanActiveSerpPack();
    });
  }

  function escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
});
