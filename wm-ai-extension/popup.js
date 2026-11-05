// Waqas Mehmood - Detailed SEO & AI AEO Engine 2026
// Complete Tabbed Controller, Live Data Renderer, CSV & Executive PDF Generator

let currentData = null;

document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  initCopyButtons();
  initExportButtons();
  initActionButtons();
  requestPageAnalysis();
});

// =========================================================================
// 1. TAB SWITCHING SYSTEM
// =========================================================================
function initTabs() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTabId = btn.getAttribute('data-tab');

      tabButtons.forEach(b => b.classList.remove('active'));
      tabPanes.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetPane = document.getElementById(targetTabId);
      if (targetPane) {
        targetPane.classList.add('active');
      }
    });
  });
}

// =========================================================================
// 2. ACTIVE TAB ANALYSIS INVOCATION
// =========================================================================
async function getActiveTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab;
}

async function requestPageAnalysis() {
  const urlDisplay = document.getElementById('ribbon-url');
  urlDisplay.textContent = 'Inspecting live DOM & Schema markup...';

  try {
    const tab = await getActiveTab();
    if (!tab || !tab.id) {
      showFatalError('Unable to identify active browser tab.');
      return;
    }

    if (tab.url.startsWith('chrome://') || tab.url.startsWith('chrome-extension://') || tab.url.startsWith('edge://')) {
      showFatalError('Browser system pages cannot be audited for security reasons.');
      return;
    }

    chrome.tabs.sendMessage(tab.id, { action: 'ANALYZE_PAGE' }, async (response) => {
      if (chrome.runtime.lastError || !response || !response.success) {
        try {
          await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ['content.js']
          });

          chrome.tabs.sendMessage(tab.id, { action: 'ANALYZE_PAGE' }, (retryResponse) => {
            if (retryResponse && retryResponse.success) {
              renderAllData(retryResponse.data);
            } else {
              showFatalError('Target webpage is restricting content script execution.');
            }
          });
        } catch (injectionErr) {
          showFatalError('Could not inject inspector: ' + injectionErr.message);
        }
      } else {
        renderAllData(response.data);
      }
    });
  } catch (err) {
    showFatalError(err.message);
  }
}

function showFatalError(msg) {
  const urlDisplay = document.getElementById('ribbon-url');
  if (urlDisplay) urlDisplay.textContent = 'Audit Failed: ' + msg;
  const overviewTitle = document.getElementById('title-text');
  if (overviewTitle) overviewTitle.textContent = msg;
}

// =========================================================================
// 3. MASTER RENDER CONTROLLER (ALL 8 TABS)
// =========================================================================
function renderAllData(data) {
  currentData = data;

  // Ribbon Header
  document.getElementById('ribbon-url').textContent = data.url;
  document.getElementById('ribbon-url').title = data.url;

  document.getElementById('mini-seo').textContent = data.scores.seo;
  document.getElementById('mini-aeo').textContent = data.scores.aeo;
  document.getElementById('mini-geo').textContent = data.scores.geo;
  document.getElementById('mini-overall').textContent = data.scores.overall;

  document.getElementById('footer-analyzed-time').textContent = 'Live Inspected at ' + data.analyzedAt;

  renderOverviewTab(data);
  renderHeadingsTab(data);
  renderSchemaTab(data);
  renderLinksTab(data);
  renderImagesTab(data);
  renderSocialTab(data);
  renderAiAeoTab(data);
}

// =========================================================================
// TAB 1: OVERVIEW & META
// =========================================================================
function renderOverviewTab(data) {
  const meta = data.meta;
  const content = data.contentStats;

  // Title
  const titleBox = document.getElementById('title-text');
  titleBox.textContent = meta.title || '(No Title Tag Detected)';
  document.getElementById('title-char-count').textContent = `${meta.titleLength} chars`;
  document.getElementById('title-pixel-count').textContent = `~${meta.estimatedPixelWidth} px`;

  const titleBar = document.getElementById('title-progress');
  const titlePercent = Math.min(100, Math.round((meta.titleLength / 60) * 100));
  titleBar.style.width = `${titlePercent}%`;
  titleBar.style.backgroundColor = (meta.titleLength >= 40 && meta.titleLength <= 65) ? '#10b981' : (meta.titleLength > 65 ? '#f59e0b' : '#ef4444');

  // Description
  const descBox = document.getElementById('desc-text');
  descBox.textContent = meta.description || '(No Meta Description Tag Detected)';
  document.getElementById('desc-char-count').textContent = `${meta.descriptionLength} chars`;

  const descBar = document.getElementById('desc-progress');
  const descPercent = Math.min(100, Math.round((meta.descriptionLength / 160) * 100));
  descBar.style.width = `${descPercent}%`;
  descBar.style.backgroundColor = (meta.descriptionLength >= 120 && meta.descriptionLength <= 170) ? '#10b981' : (meta.descriptionLength > 170 ? '#f59e0b' : '#ef4444');

  // Canonical
  const canonicalBox = document.getElementById('canonical-text');
  canonicalBox.textContent = meta.canonical || '(No Canonical URL Tag Specified)';
  const canonicalBadge = document.getElementById('canonical-status-badge');
  if (meta.canonicalStatus === 'match') {
    canonicalBadge.textContent = 'Self-Referencing (Valid)';
    canonicalBadge.className = 'pill-status status-success';
  } else if (meta.canonicalStatus === 'mismatch') {
    canonicalBadge.textContent = 'Points Elsewhere';
    canonicalBadge.className = 'pill-status status-warning';
  } else {
    canonicalBadge.textContent = 'Missing Canonical';
    canonicalBadge.className = 'pill-status status-danger';
  }

  // Robots
  const robotsWrap = document.getElementById('robots-badges');
  robotsWrap.innerHTML = '';
  const directives = meta.robots.split(',').map(s => s.trim()).filter(Boolean);
  directives.forEach(d => {
    const span = document.createElement('span');
    span.className = 'pill-tag';
    if (d.includes('noindex') || d.includes('nofollow')) {
      span.classList.add('tag-danger');
    } else {
      span.classList.add('tag-success');
    }
    span.textContent = d;
    robotsWrap.appendChild(span);
  });

  // Content stats
  document.getElementById('stat-words').textContent = content.wordCount.toLocaleString();
  document.getElementById('stat-reading').textContent = `${content.readingTimeMinutes} min`;
  document.getElementById('stat-ratio').textContent = `${content.textToHtmlRatio}%`;

  // Doc Chips
  document.getElementById('chip-lang').textContent = meta.lang;
  document.getElementById('chip-charset').textContent = meta.charset;
  document.getElementById('chip-viewport').textContent = meta.viewport === 'Missing' ? 'Missing' : 'Responsive';
  document.getElementById('chip-author').textContent = meta.author || 'None';
}

// =========================================================================
// TAB 2: HEADINGS TREE
// =========================================================================
function renderHeadingsTab(data) {
  const h = data.headings;
  document.getElementById('cnt-h1').textContent = h.counts.h1 || 0;
  document.getElementById('cnt-h2').textContent = h.counts.h2 || 0;
  document.getElementById('cnt-h3').textContent = h.counts.h3 || 0;
  document.getElementById('cnt-h4').textContent = h.counts.h4 || 0;
  document.getElementById('cnt-h5').textContent = h.counts.h5 || 0;
  document.getElementById('cnt-h6').textContent = h.counts.h6 || 0;

  const alertBox = document.getElementById('headings-alert-box');
  alertBox.innerHTML = '';
  if (h.counts.h1 === 0) {
    alertBox.innerHTML = '<span class="alert-icon">⚠️</span><span><strong>Missing H1:</strong> Page lacks a top-level primary &lt;h1&gt; headline.</span>';
    alertBox.className = 'alert-box-notice alert-danger';
  } else if (h.counts.h1 > 1) {
    alertBox.innerHTML = `<span class="alert-icon">⚠️</span><span><strong>Multiple H1s:</strong> Found ${h.counts.h1} &lt;h1&gt; tags. Best practice is exactly 1 primary H1.</span>`;
    alertBox.className = 'alert-box-notice alert-warning';
  } else if (h.hierarchySkips > 0) {
    alertBox.innerHTML = `<span class="alert-icon">ℹ️</span><span><strong>Heading Hierarchy Skips:</strong> ${h.hierarchySkips} instances where levels skip (e.g. H2 to H4).</span>`;
    alertBox.className = 'alert-box-notice alert-warning';
  } else {
    alertBox.innerHTML = '<span class="alert-icon">✅</span><span><strong>Perfect Hierarchy:</strong> Exactly 1 H1 tag and structured hierarchy detected.</span>';
    alertBox.className = 'alert-box-notice alert-success';
  }

  const treeList = document.getElementById('headings-tree-list');
  treeList.innerHTML = '';

  if (h.list.length === 0) {
    treeList.innerHTML = '<div class="empty-state">No heading tags (H1–H6) detected on this page.</div>';
    return;
  }

  h.list.forEach(item => {
    const row = document.createElement('div');
    row.className = `heading-tree-item h-level-${item.level}`;

    const tagBadge = document.createElement('span');
    tagBadge.className = `h-tag-pill h-tag-${item.tag.toLowerCase()}`;
    tagBadge.textContent = item.tag;

    const textBox = document.createElement('span');
    textBox.className = 'h-item-text';
    textBox.textContent = item.text || '(Empty Heading Text)';
    textBox.title = item.text;

    const copyBtn = document.createElement('button');
    copyBtn.className = 'btn-copy-mini';
    copyBtn.textContent = 'Copy';
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(item.text);
      copyBtn.textContent = 'Copied!';
      setTimeout(() => copyBtn.textContent = 'Copy', 1500);
    });

    row.appendChild(tagBadge);
    row.appendChild(textBox);
    row.appendChild(copyBtn);
    treeList.appendChild(row);
  });
}

// =========================================================================
// TAB 3: SCHEMA (JSON-LD)
// =========================================================================
function renderSchemaTab(data) {
  const schemas = data.schemas;
  document.getElementById('schema-count-title').textContent = `${schemas.totalScripts} JSON-LD Scripts (${schemas.types.length} Types Found)`;

  const typesBadges = document.getElementById('schema-types-badges');
  typesBadges.innerHTML = '';
  schemas.types.forEach(t => {
    const span = document.createElement('span');
    span.className = 'pill-tag tag-cyan';
    span.textContent = t;
    typesBadges.appendChild(span);
  });

  const accordion = document.getElementById('schema-details-accordion');
  accordion.innerHTML = '';

  if (schemas.details.length === 0) {
    accordion.innerHTML = '<div class="empty-state">No JSON-LD structured data detected on this page.</div>';
    return;
  }

  schemas.details.forEach((item, idx) => {
    const box = document.createElement('div');
    box.className = 'schema-accordion-item';

    const header = document.createElement('div');
    header.className = 'schema-acc-header';
    header.innerHTML = `
      <div class="schema-acc-title">#${idx + 1}: ${item.types.join(', ') || 'Schema Object'}</div>
      <span class="acc-toggle-arrow">▼</span>
    `;

    const codeBody = document.createElement('div');
    codeBody.className = 'schema-acc-body';
    
    const pre = document.createElement('pre');
    pre.className = 'schema-code-block';
    pre.textContent = item.rawFormatted;

    const copyCodeBtn = document.createElement('button');
    copyCodeBtn.className = 'btn-copy-mini';
    copyCodeBtn.style.marginTop = '6px';
    copyCodeBtn.textContent = 'Copy Schema Code';
    copyCodeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      navigator.clipboard.writeText(item.rawFormatted);
      copyCodeBtn.textContent = 'Copied JSON!';
      setTimeout(() => copyCodeBtn.textContent = 'Copy Schema Code', 1500);
    });

    codeBody.appendChild(pre);
    codeBody.appendChild(copyCodeBtn);

    header.addEventListener('click', () => {
      box.classList.toggle('open');
    });

    // Open first schema by default
    if (idx === 0) box.classList.add('open');

    box.appendChild(header);
    box.appendChild(codeBody);
    accordion.appendChild(box);
  });
}

// =========================================================================
// TAB 4: LINKS ARCHITECTURE
// =========================================================================
function renderLinksTab(data) {
  const l = data.links;
  document.getElementById('links-total').textContent = l.total;
  document.getElementById('links-internal').textContent = l.internal;
  document.getElementById('links-external').textContent = l.external;
  document.getElementById('links-nofollow').textContent = `${l.nofollow} nofollow`;
  document.getElementById('domains-count').textContent = l.uniqueDomainsCount;

  const list = document.getElementById('external-links-list');
  list.innerHTML = '';

  if (l.sampleExternal.length === 0) {
    list.innerHTML = '<div class="empty-state">No external links found on this page.</div>';
    return;
  }

  l.sampleExternal.forEach(item => {
    const row = document.createElement('div');
    row.className = 'link-row-item';
    row.innerHTML = `
      <div class="link-domain-badge">${item.domain}</div>
      <div class="link-detail-col">
        <a href="${item.href}" target="_blank" class="link-anchor-text">${item.text}</a>
        <span class="link-target-url">${item.href}</span>
      </div>
      ${item.nofollow ? '<span class="pill-tag tag-warning">nofollow</span>' : ''}
    `;
    list.appendChild(row);
  });
}

// =========================================================================
// TAB 5: IMAGES & VISUAL ASSETS
// =========================================================================
function renderImagesTab(data) {
  const img = data.images;
  document.getElementById('img-total').textContent = img.total;
  document.getElementById('img-missing-alt').textContent = img.missingAlt;
  document.getElementById('img-modern-percent').textContent = `${img.modernFormatsPercent}%`;
  document.getElementById('img-missing-dims').textContent = img.missingDimensions;

  const previewList = document.getElementById('missing-alt-images-list');
  previewList.innerHTML = '';

  if (img.missingAlt === 0) {
    previewList.innerHTML = '<div class="empty-state text-success">✅ Great job! All images have descriptive ALT attributes.</div>';
    return;
  }

  img.missingAltSample.forEach(item => {
    const row = document.createElement('div');
    row.className = 'img-missing-row';
    row.innerHTML = `
      <div class="img-thumb-col">
        <img src="${item.src}" class="img-thumb" onerror="this.style.display='none'" />
      </div>
      <div class="img-detail-col">
        <span class="img-src-text" title="${item.src}">${item.src}</span>
        <span class="img-dim-text">${item.width} x ${item.height} px &bull; <strong class="text-rose">Missing ALT</strong></span>
      </div>
    `;
    previewList.appendChild(row);
  });
}

// =========================================================================
// TAB 6: SOCIAL & OPEN GRAPH
// =========================================================================
function renderSocialTab(data) {
  const og = data.social.og;
  const tw = data.social.twitter;

  // Open Graph Box
  document.getElementById('og-site').textContent = og.siteName || data.hostname.toUpperCase();
  document.getElementById('og-title').textContent = og.title || data.meta.title || 'No Open Graph Title Detected';
  document.getElementById('og-desc').textContent = og.description || data.meta.description || 'No og:description specified.';

  const ogImgBox = document.getElementById('og-img-box');
  if (og.image) {
    ogImgBox.innerHTML = `<img src="${og.image}" class="og-hero-image" onerror="this.parentElement.innerHTML='<span class=no-img-text>Image Failed to Load</span>'" />`;
  } else {
    ogImgBox.innerHTML = '<span class="no-img-text">No og:image tag found</span>';
  }

  // Twitter Box
  document.getElementById('tw-type').textContent = tw.card ? `Card: ${tw.card}` : 'Card: None specified';
  document.getElementById('tw-title').textContent = tw.title || og.title || data.meta.title || 'No Twitter Title';
  document.getElementById('tw-desc').textContent = tw.description || og.description || data.meta.description || 'No Twitter Description';
}

// =========================================================================
// TAB 7: AI, AEO & GEO 2026 EXCLUSIVE ENGINE
// =========================================================================
function renderAiAeoTab(data) {
  const ai = data.aiEngine;
  document.getElementById('ai-aeo-hero-score').textContent = `${data.scores.aeo}%`;

  document.getElementById('ai-questions-cnt').textContent = ai.questionHeadings;
  document.getElementById('ai-answers-cnt').textContent = ai.conciseAnswersCount;
  document.getElementById('ai-tables-cnt').textContent = `${ai.tablesWithHeaders} / ${ai.tablesTotal}`;
  document.getElementById('ai-stats-density').textContent = `${ai.statisticsDensity}%`;

  // Snippets List
  const snippetsList = document.getElementById('ai-snippets-list');
  snippetsList.innerHTML = '';
  if (ai.directAnswers.length === 0) {
    snippetsList.innerHTML = `
      <div class="empty-state">
        No 40–60 word direct definitions found immediately after question headings.
        <br><small style="color: #64748b; margin-top: 4px; display: block;">Format question headings followed by a concise 45-word direct answer for Google AI Overviews.</small>
      </div>
    `;
  } else {
    ai.directAnswers.forEach(ans => {
      const box = document.createElement('div');
      box.className = 'snippet-item-box';
      box.innerHTML = `
        <div class="snippet-q">🎯 ${ans.question}</div>
        <div class="snippet-a">"${ans.answer}"</div>
        <div class="snippet-meta">Length: ${ans.wordCount} words (Ideal AEO range: 35–65 words)</div>
      `;
      snippetsList.appendChild(box);
    });
  }

  // Action Checklist
  const checklist = document.getElementById('ai-action-checklist');
  checklist.innerHTML = '';

  const checks = [
    { title: 'FAQPage / QA Schema Structured Data', passed: ai.faqSchemaFound, desc: 'Enables rich expandable Q&A cards in search and machine knowledge graphs.' },
    { title: 'Factual Comparison Tables (th headers)', passed: ai.tablesWithHeaders > 0, desc: 'LLMs like Perplexity pull structured tables 4x more frequently than raw paragraphs.' },
    { title: 'Numbered / Bulleted Lists (> 2)', passed: ai.listsCount >= 2, desc: 'Step-by-step ordered lists win AI Overviews snippet slots.' },
    { title: 'Deep Section Anchor IDs on Headings', passed: ai.headingsWithId > 0, desc: 'Allows AI agents to cite specific jump anchors on your page.' },
    { title: 'Entity sameAs Verification Links', passed: data.schemas.sameAsCount > 0, desc: 'Connects entity profiles across LinkedIn, GMB, and Wikipedia.' }
  ];

  checks.forEach(c => {
    const item = document.createElement('div');
    item.className = `check-item ${c.passed ? 'check-passed' : 'check-missing'}`;
    item.innerHTML = `
      <div class="check-status-icon">${c.passed ? '✅' : '⚠️'}</div>
      <div class="check-body">
        <div class="check-title">${c.title}</div>
        <div class="check-desc">${c.desc}</div>
      </div>
    `;
    checklist.appendChild(item);
  });
}

// =========================================================================
// 4. COPY BUTTONS & UTILITIES
// =========================================================================
function initCopyButtons() {
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const copyTargetId = btn.getAttribute('data-copy');
      if (copyTargetId) {
        const el = document.getElementById(copyTargetId);
        if (el) {
          navigator.clipboard.writeText(el.textContent.trim());
          const oldText = btn.textContent;
          btn.textContent = 'Copied!';
          setTimeout(() => btn.textContent = oldText, 1500);
        }
      }
    });
  });

  const copyHeadingsBtn = document.getElementById('btn-copy-headings');
  if (copyHeadingsBtn) {
    copyHeadingsBtn.addEventListener('click', () => {
      if (!currentData || !currentData.headings.list) return;
      const text = currentData.headings.list.map(h => `${'  '.repeat(h.level - 1)}[${h.tag}] ${h.text}`).join('\n');
      navigator.clipboard.writeText(text);
      copyHeadingsBtn.textContent = 'All Headings Copied!';
      setTimeout(() => copyHeadingsBtn.textContent = 'Copy All Headings', 1800);
    });
  }

  const copySchemasBtn = document.getElementById('btn-copy-schemas');
  if (copySchemasBtn) {
    copySchemasBtn.addEventListener('click', () => {
      if (!currentData || !currentData.schemas.details) return;
      const text = currentData.schemas.details.map(d => d.rawFormatted).join('\n\n');
      navigator.clipboard.writeText(text);
      copySchemasBtn.textContent = 'JSON-LD Copied!';
      setTimeout(() => copySchemasBtn.textContent = 'Copy JSON-LD', 1800);
    });
  }
}

// =========================================================================
// 5. EXPORT CSV & PDF REPORT GENERATOR
// =========================================================================
function initExportButtons() {
  // CSV Export
  const btnCsv = document.getElementById('btn-export-csv');
  if (btnCsv) {
    btnCsv.addEventListener('click', () => {
      if (!currentData) return;
      exportToCsv(currentData);
    });
  }

  // PDF Report Export
  const btnPdf = document.getElementById('btn-export-pdf');
  if (btnPdf) {
    btnPdf.addEventListener('click', () => {
      if (!currentData) return;
      generateExecutivePdf(currentData);
    });
  }
}

function initActionButtons() {
  const rescanBtn = document.getElementById('btn-rescan');
  if (rescanBtn) {
    rescanBtn.addEventListener('click', () => {
      requestPageAnalysis();
    });
  }
}

function exportToCsv(data) {
  const headers = ['URL', 'Page Title', 'Title Length', 'Meta Description', 'Description Length', 'Canonical URL', 'Robots', 'Word Count', 'H1 Count', 'Missing ALT Images', 'SEO Score', 'AEO Score', 'GEO Score', 'Overall Score'];
  const row = [
    `"${data.url}"`,
    `"${(data.meta.title || '').replace(/"/g, '""')}"`,
    data.meta.titleLength,
    `"${(data.meta.description || '').replace(/"/g, '""')}"`,
    data.meta.descriptionLength,
    `"${data.meta.canonical}"`,
    `"${data.meta.robots}"`,
    data.contentStats.wordCount,
    data.headings.counts.h1,
    data.images.missingAlt,
    data.scores.seo,
    data.scores.aeo,
    data.scores.geo,
    data.scores.overall
  ];

  const csvContent = headers.join(',') + '\n' + row.join(',');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const downloadUrl = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = downloadUrl;
  a.download = `SEO_Audit_${data.hostname}_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// =========================================================================
// EXECUTIVE PDF REPORT GENERATOR (PRINT WINDOW)
// =========================================================================
function generateExecutivePdf(d) {
  const printWin = window.open('', '_blank');
  if (!printWin) {
    alert('Please allow popups to generate the PDF Audit Report.');
    return;
  }

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>SEO & AI Search Audit Report - ${d.hostname}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #0f172a; padding: 40px; background: #fff; line-height: 1.5; font-size: 13px; }
    .report-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #0284c7; padding-bottom: 18px; margin-bottom: 24px; }
    .logo-badge { font-size: 22px; font-weight: 900; color: #0284c7; letter-spacing: -0.5px; }
    .logo-sub { font-size: 11px; color: #64748b; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; }
    .audit-target { font-size: 12px; color: #334155; text-align: right; }
    .score-cards-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 24px; }
    .score-card { border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px; text-align: center; background: #f8fafc; }
    .score-num { font-size: 28px; font-weight: 900; }
    .score-lbl { font-size: 11px; text-transform: uppercase; font-weight: bold; color: #64748b; }
    .score-seo { color: #0284c7; }
    .score-aeo { color: #10b981; }
    .score-geo { color: #8b5cf6; }
    .score-overall { color: #0f172a; border: 2px solid #0284c7; background: #e0f2fe; }
    .section-title { font-size: 15px; font-weight: 800; text-transform: uppercase; margin: 20px 0 10px; border-left: 4px solid #0284c7; padding-left: 8px; color: #0f172a; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 16px; font-size: 12px; }
    th, td { border: 1px solid #cbd5e1; padding: 8px 10px; text-align: left; }
    th { background: #f1f5f9; font-weight: 700; width: 25%; }
    .badge { display: inline-block; padding: 2px 7px; border-radius: 4px; font-size: 10px; font-weight: bold; }
    .badge-ok { background: #dcfce7; color: #166534; }
    .badge-warn { background: #fef3c7; color: #92400e; }
    .badge-err { background: #fee2e2; color: #991b1b; }
    .footer-box { margin-top: 35px; border-top: 2px solid #e2e8f0; padding-top: 16px; display: flex; justify-content: space-between; font-size: 11px; color: #64748b; }
    .contact-cta { background: #0f172a; color: #fff; padding: 16px; border-radius: 8px; margin-top: 24px; text-align: center; }
    .contact-cta h3 { font-size: 16px; margin-bottom: 4px; color: #38bdf8; }
    .contact-cta p { font-size: 12px; margin-bottom: 8px; color: #cbd5e1; }
    @media print {
      body { padding: 15px; }
      .contact-cta { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }
  </style>
</head>
<body>

  <div class="report-header">
    <div>
      <div class="logo-badge">WAQAS MEHMOOD</div>
      <div class="logo-sub">Executive SEO & AI Search Audit Report</div>
    </div>
    <div class="audit-target">
      <div><strong>Target:</strong> ${d.url}</div>
      <div><strong>Generated:</strong> ${new Date().toLocaleDateString()} at ${d.analyzedAt}</div>
    </div>
  </div>

  <div class="score-cards-row">
    <div class="score-card"><div class="score-num score-seo">${d.scores.seo}%</div><div class="score-lbl">SEO Visibility</div></div>
    <div class="score-card"><div class="score-num score-aeo">${d.scores.aeo}%</div><div class="score-lbl">AEO Targeting</div></div>
    <div class="score-card"><div class="score-num score-geo">${d.scores.geo}%</div><div class="score-lbl">GEO Entity Score</div></div>
    <div class="score-card score-overall"><div class="score-num">${d.scores.overall}%</div><div class="score-lbl">Overall Health</div></div>
  </div>

  <div class="section-title">1. Meta & Core Indexability Signals</div>
  <table>
    <tr><th>Page Title</th><td>${d.meta.title || 'Missing'} (${d.meta.titleLength} chars, ~${d.meta.estimatedPixelWidth}px)</td></tr>
    <tr><th>Meta Description</th><td>${d.meta.description || 'Missing'} (${d.meta.descriptionLength} chars)</td></tr>
    <tr><th>Canonical Tag</th><td>${d.meta.canonical || 'Missing'} <span class="badge ${d.meta.isCanonicalMatch ? 'badge-ok' : 'badge-warn'}">${d.meta.canonicalStatus}</span></td></tr>
    <tr><th>Robots Directives</th><td>${d.meta.robots}</td></tr>
    <tr><th>Content Volume</th><td>${d.contentStats.wordCount.toLocaleString()} words &bull; ~${d.contentStats.readingTimeMinutes} min reading time</td></tr>
  </table>

  <div class="section-title">2. Heading Hierarchy Architecture</div>
  <table>
    <tr><th>Heading Counts</th><td>H1: <strong>${d.headings.counts.h1}</strong> &bull; H2: <strong>${d.headings.counts.h2}</strong> &bull; H3: <strong>${d.headings.counts.h3}</strong> &bull; H4: <strong>${d.headings.counts.h4}</strong></td></tr>
    <tr><th>H1 Status</th><td><span class="badge ${d.headings.h1Status === 'optimal' ? 'badge-ok' : 'badge-warn'}">${d.headings.h1Status.toUpperCase()}</span></td></tr>
    <tr><th>Primary H1 Text</th><td>${d.headings.list.find(h => h.tag === 'H1')?.text || 'None detected'}</td></tr>
  </table>

  <div class="section-title">3. Structured Data & Machine Schema</div>
  <table>
    <tr><th>JSON-LD Schemas</th><td>${d.schemas.totalScripts} scripts detected (${d.schemas.types.join(', ') || 'None'})</td></tr>
    <tr><th>Verified sameAs Profiles</th><td>${d.schemas.sameAsCount} authority citation links</td></tr>
  </table>

  <div class="section-title">4. Links & Visual Performance</div>
  <table>
    <tr><th>Links Breakdown</th><td>Total: ${d.links.total} &bull; Internal: ${d.links.internal} &bull; External: ${d.links.external} (${d.links.uniqueDomainsCount} unique domains)</td></tr>
    <tr><th>Images Audit</th><td>Total: ${d.images.total} &bull; Missing ALT: <strong style="color: ${d.images.missingAlt > 0 ? '#b91c1c' : '#166534'}">${d.images.missingAlt}</strong> &bull; Modern Formats: ${d.images.modernFormatsPercent}%</td></tr>
  </table>

  <div class="section-title">5. AI, AEO & Perplexity Citability Signals</div>
  <table>
    <tr><th>AEO Snippets (40–60 words)</th><td>${d.aiEngine.conciseAnswersCount} direct answer definitions detected following questions</td></tr>
    <tr><th>Factual Data Tables</th><td>${d.aiEngine.tablesWithHeaders} tables with &lt;th&gt; headers found</td></tr>
    <tr><th>Entity Trust Signals</th><td>About Page: ${d.links.hasAbout ? 'Yes' : 'No'} &bull; Contact Page: ${d.links.hasContact ? 'Yes' : 'No'} &bull; Privacy Page: ${d.links.hasPrivacy ? 'Yes' : 'No'}</td></tr>
  </table>

  <div class="contact-cta">
    <h3>Professional SEO & Growth Engineering Consultation</h3>
    <p>Report compiled by <strong>Waqas Mehmood</strong> &mdash; Senior SEO Specialist & Full-Stack Growth Engineer.</p>
    <p>WhatsApp: <strong>+92 303 3111126</strong> &bull; Email: <strong>waqasmehmoodhyd@gmail.com</strong> &bull; Web: <strong>waqasmehmood.com</strong></p>
  </div>

  <div class="footer-box">
    <div>Generated by Waqas Mehmood AI & SEO Engine 2026</div>
    <div>Page 1 of 1</div>
  </div>

</body>
</html>
  `;

  printWin.document.open();
  printWin.document.write(html);
  printWin.document.close();

  // Print dialogue trigger after render
  printWin.onload = function() {
    printWin.focus();
    printWin.print();
  };
}
