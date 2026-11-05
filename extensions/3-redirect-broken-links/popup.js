// Waqas Mehmood - Smart Redirect Path & Broken Link Checker
// Popup Controller

document.addEventListener('DOMContentLoaded', async () => {
  // Navigation elements
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');
  const activeTabUrlEl = document.getElementById('active-tab-url');

  // Tab 1 Elements
  const metricHopsCount = document.getElementById('metric-hops-count');
  const metricFinalStatus = document.getElementById('metric-final-status');
  const metricServerIp = document.getElementById('metric-server-ip');
  const chainTimeline = document.getElementById('chain-timeline-container');

  // Tab 2 Elements
  const btnStartScan = document.getElementById('btn-start-scan');
  const scanMetricsGrid = document.getElementById('scan-metrics-grid');
  const progressContainer = document.getElementById('progress-container');
  const scanProgressBar = document.getElementById('scan-progress-bar');
  const scanProgressText = document.getElementById('scan-progress-text');
  const actionsRow = document.getElementById('actions-row');
  const filterStrip = document.getElementById('filter-strip');
  const linksListContainer = document.getElementById('links-list-container');
  const statTotal = document.getElementById('stat-total');
  const statValid = document.getElementById('stat-valid');
  const statRedirect = document.getElementById('stat-redirect');
  const statBroken = document.getElementById('stat-broken');
  const countAll = document.getElementById('count-all');
  const countBroken = document.getElementById('count-broken');
  const countRedirect = document.getElementById('count-redirect');
  const btnToggleHighlight = document.getElementById('btn-toggle-highlight');
  const btnExportBroken = document.getElementById('btn-export-broken');
  const btnExportAll = document.getElementById('btn-export-all');
  const filterChips = document.querySelectorAll('.filter-chip');

  let activeTab = null;
  let scannedLinks = [];
  let isHighlightActive = false;
  let currentFilter = 'all';

  // 1. Get Active Tab
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  activeTab = tab;

  if (activeTab && activeTab.url) {
    activeTabUrlEl.textContent = activeTab.url;
    loadRedirectChain(activeTab.id, activeTab.url);
  } else {
    activeTabUrlEl.textContent = 'No active HTTP page detected.';
  }

  // Tab Switching
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.remove('active'));
      tabPanes.forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const targetId = btn.getAttribute('data-tab');
      const targetPane = document.getElementById(targetId);
      if (targetPane) targetPane.classList.add('active');
    });
  });

  // ================= LOAD REDIRECT CHAIN =================
  function loadRedirectChain(tabId, currentUrl) {
    chrome.runtime.sendMessage({ action: 'GET_REDIRECT_CHAIN', tabId }, (response) => {
      if (chrome.runtime.lastError || !response || !response.success || !response.chain || response.chain.length === 0) {
        // Fallback: direct page without recorded redirects
        metricHopsCount.textContent = '0';
        metricFinalStatus.textContent = '200 OK (Direct)';
        metricServerIp.textContent = 'Direct Hop';

        chainTimeline.innerHTML = `
          <div class="hop-card">
            <div class="hop-header">
              <span class="hop-step-pill ok">Landing Step 1</span>
              <span class="hop-status-code">200 Direct Load</span>
            </div>
            <div class="hop-url">${escapeHtml(currentUrl)}</div>
            <div class="hop-headers-grid">
              <span class="header-tag">Status: <strong>Direct Response</strong></span>
              <span class="header-tag">Tip: <strong>Refresh page to trace active redirect stream</strong></span>
            </div>
          </div>
        `;
        return;
      }

      const chain = response.chain;
      const hopsCount = chain.length > 1 ? chain.length - 1 : 0;
      const finalHop = chain[chain.length - 1];

      metricHopsCount.textContent = `${hopsCount} ${hopsCount === 1 ? 'hop' : 'hops'}`;
      metricFinalStatus.textContent = `${finalHop.statusCode || 200}`;
      metricServerIp.textContent = finalHop.ip || 'Resolved';

      renderChainTimeline(chain);
    });
  }

  function renderChainTimeline(chain) {
    chainTimeline.innerHTML = '';

    chain.forEach((hop, idx) => {
      const isRedirect = hop.statusCode >= 300 && hop.statusCode < 400;
      const isOk = hop.statusCode >= 200 && hop.statusCode < 300;
      const isError = hop.statusCode >= 400;

      let pillClass = 'ok';
      if (isRedirect) pillClass = 'redirect';
      if (isError) pillClass = 'error';

      const card = document.createElement('div');
      card.className = 'hop-card';

      let headersHtml = '';
      if (hop.headers) {
        for (const [key, val] of Object.entries(hop.headers)) {
          headersHtml += `<span class="header-tag">${escapeHtml(key)}: <strong>${escapeHtml(val)}</strong></span> `;
        }
      }
      if (!headersHtml) {
        headersHtml = `<span class="header-tag">IP: <strong>${escapeHtml(hop.ip)}</strong></span>`;
      }

      card.innerHTML = `
        <div class="hop-header">
          <span class="hop-step-pill ${pillClass}">Step ${hop.step}: ${isRedirect ? 'Redirect Hop' : 'Final Landing'}</span>
          <span class="hop-status-code">${escapeHtml(hop.statusLine || hop.statusCode)}</span>
        </div>
        <div class="hop-url">${escapeHtml(hop.url)}</div>
        <div class="hop-headers-grid">${headersHtml}</div>
      `;

      chainTimeline.appendChild(card);

      if (idx < chain.length - 1) {
        const connector = document.createElement('div');
        connector.className = 'hop-connector';
        connector.innerHTML = `&darr; 301/302 Redirect to next target &darr;`;
        chainTimeline.appendChild(connector);
      }
    });
  }

  // ================= TAB 2: BROKEN LINKS SCANNER =================
  btnStartScan.addEventListener('click', async () => {
    if (!activeTab || !activeTab.id) return;

    btnStartScan.disabled = true;
    btnStartScan.innerHTML = '<span>⏳ Extracting links from DOM...</span>';

    try {
      chrome.tabs.sendMessage(activeTab.id, { action: 'GET_DOM_LINKS' }, (response) => {
        if (chrome.runtime.lastError || !response || !response.success) {
          // If content script was not injected yet, inject dynamically
          chrome.scripting.executeScript({
            target: { tabId: activeTab.id },
            files: ['content.js']
          }, () => {
            if (chrome.runtime.lastError) {
              linksListContainer.innerHTML = `<div class="empty-state">Could not connect to this page. Please refresh tab.</div>`;
              btnStartScan.disabled = false;
              btnStartScan.innerHTML = '<span>🚀 SCAN ALL LINKS ON THIS PAGE</span>';
              return;
            }
            setTimeout(() => {
              chrome.tabs.sendMessage(activeTab.id, { action: 'GET_DOM_LINKS' }, (retryRes) => {
                if (retryRes && retryRes.success) {
                  runLinkAudit(retryRes.data.links);
                } else {
                  linksListContainer.innerHTML = `<div class="empty-state">No links found on this page.</div>`;
                  btnStartScan.disabled = false;
                  btnStartScan.innerHTML = '<span>🚀 SCAN ALL LINKS ON THIS PAGE</span>';
                }
              });
            }, 300);
          });
          return;
        }

        runLinkAudit(response.data.links);
      });
    } catch (err) {
      linksListContainer.innerHTML = `<div class="empty-state">Scan error: ${escapeHtml(err.message)}</div>`;
      btnStartScan.disabled = false;
      btnStartScan.innerHTML = '<span>🚀 SCAN ALL LINKS ON THIS PAGE</span>';
    }
  });

  async function runLinkAudit(links) {
    if (!links || links.length === 0) {
      linksListContainer.innerHTML = `<div class="empty-state">No links found on this page.</div>`;
      btnStartScan.disabled = false;
      btnStartScan.innerHTML = '<span>🚀 SCAN ALL LINKS ON THIS PAGE</span>';
      return;
    }

    scanMetricsGrid.style.display = 'grid';
    progressContainer.style.display = 'block';
    actionsRow.style.display = 'flex';
    filterStrip.style.display = 'flex';

    statTotal.textContent = links.length;
    statValid.textContent = '0';
    statRedirect.textContent = '0';
    statBroken.textContent = '0';

    linksListContainer.innerHTML = '';
    scannedLinks = [];

    let completed = 0;
    let validCount = 0;
    let redirectCount = 0;
    let brokenCount = 0;

    const total = links.length;

    // Concurrency pool
    const concurrency = 6;
    let currentIndex = 0;

    async function checkNext() {
      if (currentIndex >= total) return;
      const item = links[currentIndex++];

      try {
        const res = await checkLinkStatus(item.url);
        let status = 'valid';
        let statusCode = res.status || 200;

        if (statusCode >= 300 && statusCode < 400) {
          status = 'redirect';
          redirectCount++;
        } else if (statusCode >= 400 || statusCode === 0) {
          status = 'broken';
          brokenCount++;
        } else {
          validCount++;
        }

        const enriched = {
          ...item,
          status,
          statusCode,
          finalUrl: res.finalUrl || item.url
        };

        scannedLinks.push(enriched);
      } catch (e) {
        brokenCount++;
        scannedLinks.push({
          ...item,
          status: 'broken',
          statusCode: 0
        });
      }

      completed++;
      const pct = Math.round((completed / total) * 100);
      scanProgressBar.style.width = `${pct}%`;
      scanProgressText.textContent = `Audited ${completed} of ${total} links (${pct}%)`;

      statValid.textContent = validCount;
      statRedirect.textContent = redirectCount;
      statBroken.textContent = brokenCount;
      countAll.textContent = scannedLinks.length;
      countBroken.textContent = brokenCount;
      countRedirect.textContent = redirectCount;

      renderFilteredLinks();

      await checkNext();
    }

    // Launch initial workers
    const workers = [];
    for (let i = 0; i < Math.min(concurrency, total); i++) {
      workers.push(checkNext());
    }

    await Promise.all(workers);

    btnStartScan.disabled = false;
    btnStartScan.innerHTML = '<span>🔄 RE-SCAN LINKS</span>';
    scanProgressText.textContent = `Completed! ${total} links verified.`;
  }

  function checkLinkStatus(url) {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage({ action: 'CHECK_SINGLE_LINK', url }, (res) => {
        if (chrome.runtime.lastError || !res || !res.success) {
          resolve({ status: 0, ok: false });
        } else {
          resolve(res);
        }
      });
    });
  }

  // Render & Filter Links
  function renderFilteredLinks() {
    linksListContainer.innerHTML = '';

    const filtered = scannedLinks.filter(item => {
      if (currentFilter === 'broken') return item.status === 'broken';
      if (currentFilter === 'redirect') return item.status === 'redirect';
      return true;
    });

    if (filtered.length === 0) {
      linksListContainer.innerHTML = `<div class="empty-state">No links found under "${currentFilter}" filter.</div>`;
      return;
    }

    filtered.slice(0, 80).forEach(item => {
      const row = document.createElement('div');
      row.className = 'link-item-row';

      let statusBadgeClass = `status-${item.statusCode}`;
      let statusLabel = `${item.statusCode}`;
      if (item.status === 'broken') statusLabel = `❌ ${item.statusCode || 'Broken'}`;
      if (item.status === 'redirect') statusLabel = `⚡ ${item.statusCode || '301'}`;
      if (item.status === 'valid') statusLabel = `✓ ${item.statusCode || '200'}`;

      row.innerHTML = `
        <div class="link-item-header">
          <span class="link-anchor-txt">${escapeHtml(item.text || item.url)}</span>
          <span class="link-status-badge ${statusBadgeClass}">${statusLabel}</span>
        </div>
        <div class="link-url-dest">${escapeHtml(item.url)}</div>
      `;

      linksListContainer.appendChild(row);
    });

    if (filtered.length > 80) {
      const note = document.createElement('div');
      note.style.cssText = 'text-align:center; font-size:10px; color:#94a3b8; padding:6px;';
      note.textContent = `Showing first 80 of ${filtered.length} links. Export CSV to see full list.`;
      linksListContainer.appendChild(note);
    }
  }

  // Filter Chips Click
  filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      filterChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      currentFilter = chip.getAttribute('data-filter');
      renderFilteredLinks();
    });
  });

  // Toggle In-Page Highlighting
  btnToggleHighlight.addEventListener('click', () => {
    if (!activeTab || !activeTab.id) return;

    if (!isHighlightActive) {
      chrome.tabs.sendMessage(activeTab.id, {
        action: 'APPLY_PAGE_HIGHLIGHTS',
        results: scannedLinks
      }, () => {
        isHighlightActive = true;
        btnToggleHighlight.classList.add('active');
        btnToggleHighlight.innerHTML = '<span>👁️ Highlights Active (Click to Clear)</span>';
      });
    } else {
      chrome.tabs.sendMessage(activeTab.id, {
        action: 'CLEAR_PAGE_HIGHLIGHTS'
      }, () => {
        isHighlightActive = false;
        btnToggleHighlight.classList.remove('active');
        btnToggleHighlight.innerHTML = '<span>👁️ Highlight On Page</span>';
      });
    }
  });

  // CSV Exports
  btnExportBroken.addEventListener('click', () => {
    const broken = scannedLinks.filter(i => i.status === 'broken');
    if (broken.length === 0) {
      alert('Great news! No broken links were found on this page.');
      return;
    }
    exportToCsv(broken, 'broken-links-report.csv');
  });

  btnExportAll.addEventListener('click', () => {
    if (scannedLinks.length === 0) return;
    exportToCsv(scannedLinks, 'all-links-audit.csv');
  });

  function exportToCsv(items, filename) {
    let csv = 'Status Code,Status,Anchor Text,Target URL,Internal\n';
    items.forEach(i => {
      csv += `"${i.statusCode}","${i.status}","${(i.text || '').replace(/"/g, '""')}","${(i.url || '').replace(/"/g, '""')}","${i.isInternal ? 'Internal' : 'External'}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  function escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
});
