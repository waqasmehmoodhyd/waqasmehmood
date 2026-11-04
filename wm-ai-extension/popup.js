// Waqas Mehmood AI Engine - Popup Controller
let currentAuditData = null;

const iconMap = {
  code: '⚡',
  layout: '📐',
  target: '🎯',
  table: '📊',
  shield: '🛡️',
  link: '🔗',
  search: '🔍',
  zap: '⚡',
  bot: '🤖'
};

async function getActiveTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab;
}

async function requestAudit() {
  const categoriesList = document.getElementById('categories-list');
  categoriesList.innerHTML = `
    <div class="loading-state">
      <div class="spinner"></div>
      <span>Inspecting live DOM & Schema markup...</span>
    </div>
  `;

  try {
    const tab = await getActiveTab();
    if (!tab || !tab.id) {
      showError('Unable to access current tab.');
      return;
    }

    // Attempt to send message to existing content script
    chrome.tabs.sendMessage(tab.id, { action: 'ANALYZE_PAGE' }, async (response) => {
      if (chrome.runtime.lastError || !response || !response.success) {
        // If content script was not ready, inject dynamically
        try {
          await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ['content.js']
          });
          // Retry message
          chrome.tabs.sendMessage(tab.id, { action: 'ANALYZE_PAGE' }, (secondResponse) => {
            if (secondResponse && secondResponse.success) {
              renderAudit(secondResponse.data);
            } else {
              showError('Cannot analyze restricted browser page (e.g., chrome://, extensions store).');
            }
          });
        } catch (e) {
          showError('Cannot analyze this tab: ' + e.message);
        }
      } else {
        renderAudit(response.data);
      }
    });
  } catch (err) {
    showError(err.message);
  }
}

function renderAudit(data) {
  currentAuditData = data;

  // 1. Top 4 Badges
  document.getElementById('val-seo').textContent = data.scores.seo;
  document.getElementById('val-geo').textContent = data.scores.geo;
  document.getElementById('val-aeo').textContent = data.scores.aeo;
  document.getElementById('val-aiview').textContent = data.scores.aiView;

  // 2. Center Gauge & URL
  document.getElementById('val-overall').textContent = data.scores.overall;
  
  // Format URL cleanly
  const cleanUrl = data.hostname + (data.pathname !== '/' ? data.pathname : '');
  document.getElementById('target-url').textContent = cleanUrl;
  document.getElementById('target-url').title = data.url;

  // Determine site type guess
  let typeTag = 'WEB PAGE';
  if (data.pathname.includes('/blog') || data.pathname.includes('/post')) typeTag = 'BLOG';
  else if (data.pathname.includes('/product') || data.pathname.includes('/shop')) typeTag = 'ECOMMERCE';
  else if (data.pathname.includes('/tool')) typeTag = 'SAAS / TOOL';
  document.getElementById('page-type').textContent = typeTag;

  // Status message
  const statusHeadline = document.getElementById('status-headline');
  const statusSub = document.getElementById('status-sub');
  
  if (data.scores.overall >= 80) {
    statusHeadline.textContent = `Good – Solid foundation`;
    statusHeadline.style.color = '#34d399';
  } else if (data.scores.overall >= 60) {
    statusHeadline.textContent = `Moderate – Key signals missing`;
    statusHeadline.style.color = '#fbbf24';
  } else {
    statusHeadline.textContent = `Needs Attention – Low AI citability`;
    statusHeadline.style.color = '#f87171';
  }

  statusSub.textContent = `${data.summary.passingCategories} of ${data.summary.totalCategories} categories passing`;

  // 3. Render Categories List
  const listContainer = document.getElementById('categories-list');
  listContainer.innerHTML = '';

  data.categories.forEach(cat => {
    const item = document.createElement('div');
    item.className = 'cat-item';

    const colorClass = cat.score >= 80 ? 'green' : cat.score >= 60 ? 'amber' : 'red';
    const iconChar = iconMap[cat.icon] || '⚡';

    item.innerHTML = `
      <div class="cat-header">
        <div class="cat-left">
          <span class="cat-icon">${iconChar}</span>
          <span class="cat-name">${cat.name}</span>
        </div>
        <div class="cat-right">
          <span class="cat-score score-${colorClass}">${cat.score}</span>
          <div class="cat-bar-container">
            <div class="cat-bar bar-${colorClass}" style="width: ${cat.score}%"></div>
          </div>
          <span class="cat-arrow">›</span>
        </div>
      </div>
      <div class="cat-details">
        <div class="detail-line"><strong>Status:</strong> ${cat.detail}</div>
        ${cat.issues.length > 0 ? `
          <ul class="issue-list">
            ${cat.issues.map(iss => `<li class="issue-item">${iss}</li>`).join('')}
          </ul>
        ` : `<div class="pass-item">✓ Fully optimized for this criteria</div>`}
      </div>
    `;

    // Toggle dropdown
    const header = item.querySelector('.cat-header');
    header.addEventListener('click', () => {
      item.classList.toggle('open');
    });

    listContainer.appendChild(item);
  });
}

function showError(msg) {
  const categoriesList = document.getElementById('categories-list');
  categoriesList.innerHTML = `
    <div style="padding: 20px; text-align: center; color: #f87171; font-size: 11.5px;">
      <div style="font-size: 20px; margin-bottom: 6px;">⚠️</div>
      <strong>Analysis Notice</strong>
      <p style="color: #94a3b8; margin-top: 4px;">${msg}</p>
    </div>
  `;
}

// Waqas Mehmood Category Resolutions Knowledge Base (Actionable Exact Fixes & Code)
const RESOLUTIONS_DB = {
  'Structured Data & Schema': {
    priority: 'Critical',
    fix: 'Implement an authoritative JSON-LD @graph block containing Person, ProfessionalService/Organization, and FAQPage schemas. Add verified sameAs links to establish real-world entity confidence.',
    code: `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://example.com/#person",
      "name": "Author / Founder Name",
      "jobTitle": "Senior SEO Specialist & Growth Engineer",
      "sameAs": ["https://linkedin.com/in/...", "https://github.com/..."]
    },
    {
      "@type": "FAQPage",
      "@id": "https://example.com/#faq",
      "mainEntity": [...]
    }
  ]
}
</script>`,
    validation: 'Validate on Google Rich Results Test (https://search.google.com/test/rich-results) and Schema.org Validator.'
  },
  'Answer Targeting & Snippets': {
    priority: 'Critical',
    fix: 'Place a concise 40-60 word standalone definition immediately under question headings (What is..., How to...). Avoid marketing fluff in the first 2 sentences so AI models can quote it directly as an authoritative answer.',
    code: `<h2>What Is a Technical SEO Audit?</h2>
<p>A technical SEO audit is a comprehensive diagnostic evaluation of website infrastructure factors affecting crawlability, indexation, rendering, and Core Web Vitals. It checks canonical tags, status codes, robots.txt, XML sitemaps, and structured schema to eliminate ranking barriers.</p>`,
    validation: 'Ensure direct definition is 35 to 65 words and answers the question independently.'
  },
  'Citability & Formatting': {
    priority: 'High',
    fix: 'Add unique id attributes to all major section headings (e.g. id="technical-seo"). Include multi-column comparison tables with <th> headers and ordered lists for step-by-step processes.',
    code: `<section id="seo-vs-google-ads">
  <h2>SEO vs. Google Ads: Core Differences</h2>
  <table>
    <thead><tr><th>Metric</th><th>Organic SEO</th><th>Google Ads</th></tr></thead>
    <tbody><tr><td>Traffic Longevity</td><td>Compounding equity</td><td>Stops when budget ends</td></tr></tbody>
  </table>
</section>`,
    validation: 'Ensure all tables have semantic <th> headers and key sections have linkable anchor IDs.'
  },
  'Entity & Authority (GEO)': {
    priority: 'High',
    fix: 'Link visible About and Contact pages in header and footer navigation. Display verifiable credentials, real client case studies, and clear author bios. Avoid unverified superlative claims.',
    code: `<nav>
  <a href="/about">About Waqas Mehmood</a>
  <a href="/contact">Request Consultation</a>
</nav>`,
    validation: 'Confirm About, Contact, and Privacy Policy return 200 HTTP status and are easily discoverable.'
  },
  'Internal Linking': {
    priority: 'Critical',
    fix: 'Convert JavaScript click handlers (<button onClick>) into crawlable standard <a href="..."> links. Ensure descriptive anchor text instead of generic "click here".',
    code: `<!-- DO NOT USE: <button onClick="goTo('services')">Services</button> -->
<!-- USE CRAWLABLE ANCHOR: -->
<a href="/services" class="nav-link">Explore SEO Services & Management</a>`,
    validation: 'Run a site crawler to verify all navigation and footer routes are discovered as internal links.'
  },
  'Performance & Assets': {
    priority: 'Medium',
    fix: 'Add explicit width and height attributes to all <img> tags to eliminate Cumulative Layout Shift (CLS). Convert images to WebP or AVIF and use loading="lazy" decoding="async".',
    code: `<img src="/images/seo-audit.webp" width="800" height="450" alt="Technical SEO Audit Report" loading="lazy" decoding="async" />`,
    validation: 'Check Core Web Vitals on PageSpeed Insights and confirm CLS score is below 0.1.'
  },
  'Semantic HTML': {
    priority: 'Medium',
    fix: 'Maintain exactly one <h1> per page. Follow strict heading hierarchy (H1 -> H2 -> H3) without skipping levels for visual styling.',
    code: `<h1>Primary Keyword Focused Page Title</h1>
  <h2>Core Section Heading</h2>
    <h3>Detailed Subsection</h3>`,
    validation: 'Inspect heading tree in browser to ensure no heading levels are skipped.'
  },
  'Meta & Discoverability': {
    priority: 'High',
    fix: 'Optimize title tag between 50-60 characters with primary keyword. Keep meta description between 130-160 characters. Ensure self-referencing canonical tag is present.',
    code: `<title>Waqas Mehmood | Senior SEO Specialist & Growth Engineer</title>
<meta name="description" content="Technical SEO audits, Local SEO management, and full-funnel organic search architectures for sustainable revenue growth." />
<link rel="canonical" href="https://waqasmehmood.com/" />`,
    validation: 'Inspect SERP snippet preview to ensure no title truncation or description clipping.'
  },
  'Accessibility for Agents': {
    priority: 'Medium',
    fix: 'Associate all form fields with explicit <label for="..."> or aria-label attributes so automated AI browser agents can parse form inputs.',
    code: `<label for="audit-url">Enter Target Website URL:</label>
<input id="audit-url" type="url" name="url" required />`,
    validation: 'Test form navigation using keyboard-only tab index.'
  }
};

// Export Graphical PDF Report Functionality
function exportPdfReport() {
  if (!currentAuditData) return;

  const data = currentAuditData;
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow popups to generate the printable PDF report.');
    return;
  }

  const dateStr = new Date(data.timestamp).toLocaleString();

  const reportHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Waqas Mehmood - AI SEO, AEO & GEO Resolution Report - ${data.hostname}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
    body { background: #070a13; color: #e2e8f0; padding: 30px; font-size: 13px; line-height: 1.5; }
    @media print {
      body { background: #ffffff !important; color: #0f172a !important; padding: 10mm; }
      .no-print { display: none !important; }
      .page-break { page-break-after: always; }
      .card, .summary-table, .cat-card, .cta-box { border-color: #cbd5e1 !important; background: #f8fafc !important; color: #0f172a !important; }
      .card-val { color: #0f172a !important; }
      pre, code { background: #f1f5f9 !important; color: #0f172a !important; border: 1px solid #cbd5e1 !important; }
    }
    .report-wrap { max-width: 900px; mx-auto: 0 auto; margin: 0 auto; }
    .print-bar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding: 12px 18px; background: #0f172a; border-radius: 12px; border: 1px solid #1e293b; }
    .btn-print { background: #f5c042; color: #020617; font-weight: 800; font-size: 12px; border: none; padding: 8px 16px; border-radius: 8px; cursor: pointer; display: flex; align-items: center; gap: 6px; }
    .btn-print:hover { background: #fcd34d; }
    
    /* Header */
    .header { border-bottom: 2px solid #1e293b; padding-bottom: 20px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: flex-start; }
    .title { font-family: Georgia, serif; font-size: 26px; font-weight: 700; color: #f5c042; font-style: italic; }
    .sub { font-size: 12px; color: #94a3b8; font-family: monospace; letter-spacing: 1px; margin-top: 4px; }
    .meta-box { text-align: right; font-size: 11px; color: #94a3b8; font-family: monospace; }
    .meta-url { font-size: 14px; font-weight: bold; color: #38bdf8; word-break: break-all; }
    
    /* Top Metrics */
    .metrics-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 24px; }
    .metric-box { background: #0c1220; border: 1px solid #1a253a; border-radius: 12px; padding: 14px; text-align: center; }
    .metric-lbl { font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; font-family: monospace; }
    .metric-val { font-size: 32px; font-weight: 900; font-family: monospace; margin: 4px 0; }
    .metric-desc { font-size: 10px; color: #64748b; }
    .val-seo { color: #38bdf8; }
    .val-geo { color: #34d399; }
    .val-aeo { color: #f5c042; }
    .val-aiview { color: #c084fc; }

    /* Executive Summary Table */
    .sec-heading { font-size: 16px; font-weight: 800; color: #fff; margin-bottom: 12px; display: flex; align-items: center; gap: 8px; border-left: 3px solid #f5c042; padding-left: 10px; }
    .table-wrap { overflow-x: auto; margin-bottom: 30px; }
    table { width: 100%; border-collapse: collapse; text-align: left; font-size: 11.5px; background: #0c1220; border-radius: 10px; overflow: hidden; border: 1px solid #1a253a; }
    th { background: #111a2e; color: #94a3b8; padding: 10px 12px; font-family: monospace; text-transform: uppercase; font-size: 10px; border-bottom: 1px solid #1e293b; }
    td { padding: 10px 12px; border-bottom: 1px solid #162033; }
    tr:last-child td { border-bottom: none; }
    .badge-score { font-weight: 800; font-family: monospace; padding: 2px 6px; border-radius: 4px; }
    .score-green { background: rgba(52, 211, 153, 0.15); color: #34d399; }
    .score-amber { background: rgba(251, 191, 36, 0.15); color: #fbbf24; }
    .score-red { background: rgba(248, 113, 113, 0.15); color: #f87171; }
    .priority-critical { color: #f87171; font-weight: 700; }
    .priority-high { color: #fbbf24; font-weight: 700; }
    .priority-med { color: #94a3b8; }

    /* Resolution Cards */
    .cat-cards { display: flex; flex-direction: column; gap: 16px; margin-bottom: 30px; }
    .cat-card { background: #0c1220; border: 1px solid #1a253a; border-radius: 12px; padding: 16px; }
    .cat-card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; padding-bottom: 8px; border-bottom: 1px solid #162033; }
    .cat-card-title { font-size: 14px; font-weight: 700; color: #fff; }
    .issue-text { color: #f87171; margin-bottom: 8px; font-size: 11.5px; }
    .fix-box { background: #070b16; border-left: 3px solid #38bdf8; padding: 10px 12px; margin-bottom: 10px; border-radius: 0 8px 8px 0; font-size: 11.5px; }
    .fix-title { font-weight: 700; color: #38bdf8; margin-bottom: 4px; font-family: monospace; font-size: 11px; }
    pre { background: #030712; padding: 10px; border-radius: 8px; font-family: Consolas, monospace; font-size: 10.5px; overflow-x: auto; color: #38bdf8; border: 1px solid #162033; margin-top: 6px; }
    .validation-text { font-size: 10.5px; color: #64748b; font-style: italic; margin-top: 6px; }

    /* Consultation CTA Box */
    .cta-box { background: linear-gradient(135deg, rgba(245, 192, 66, 0.1) 0%, rgba(56, 189, 248, 0.1) 100%); border: 1px solid rgba(245, 192, 66, 0.35); border-radius: 16px; padding: 24px; margin-top: 30px; text-align: center; }
    .cta-title { font-size: 18px; font-weight: 800; color: #fff; margin-bottom: 8px; }
    .cta-desc { font-size: 12px; color: #cbd5e1; max-width: 650px; margin: 0 auto 16px auto; line-height: 1.6; }
    .cta-actions { display: flex; justify-content: center; gap: 12px; flex-wrap: wrap; }
    .cta-btn { padding: 10px 20px; border-radius: 10px; font-weight: 700; font-size: 12px; text-decoration: none; display: inline-flex; align-items: center; gap: 6px; }
    .cta-btn-primary { background: #f5c042; color: #020617; }
    .cta-btn-sec { background: #1e293b; color: #38bdf8; border: 1px solid #334155; }
  </style>
</head>
<body>
  <div class="report-wrap">
    
    <div class="print-bar no-print">
      <div>
        <strong style="color: #f5c042;">Waqas Mehmood AI Optimization Report</strong>
        <span style="color: #94a3b8; margin-left: 8px;">Ready to save as PDF</span>
      </div>
      <button class="btn-print" onclick="window.print()">
        <span>🖨️ Save as PDF / Print</span>
      </button>
    </div>

    <div class="header">
      <div>
        <div class="title">WAQAS MEHMOOD</div>
        <div class="sub">AI SEO • AEO • GEO RESOLUTION PLAN</div>
      </div>
      <div class="meta-box">
        <div class="meta-url">${data.url}</div>
        <div>Audited: ${dateStr}</div>
        <div style="color: #34d399; font-weight: bold; margin-top: 2px;">Overall Score: ${data.scores.overall}/100</div>
      </div>
    </div>

    <!-- 4 Core Metrics -->
    <div class="metrics-row">
      <div class="metric-box">
        <div class="metric-lbl">SEO Visibility</div>
        <div class="metric-val val-seo">${data.scores.seo}</div>
        <div class="metric-desc">Search Engine Foundation</div>
      </div>
      <div class="metric-box">
        <div class="metric-lbl">GEO Readiness</div>
        <div class="metric-val val-geo">${data.scores.geo}</div>
        <div class="metric-desc">AI Citability & Entity</div>
      </div>
      <div class="metric-box">
        <div class="metric-lbl">AEO Targeting</div>
        <div class="metric-val val-aeo">${data.scores.aeo}</div>
        <div class="metric-desc">Direct Answer & Snippets</div>
      </div>
      <div class="metric-box">
        <div class="metric-lbl">AI View</div>
        <div class="metric-val val-aiview">${data.scores.aiView}</div>
        <div class="metric-desc">Agent Discovery Score</div>
      </div>
    </div>

    <!-- Executive Summary Table -->
    <div class="sec-heading">1. Executive Summary & Category Audit</div>
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Area</th>
            <th>Score</th>
            <th>Status / Finding</th>
            <th>Priority</th>
          </tr>
        </thead>
        <tbody>
          ${data.categories.map(c => {
            const res = RESOLUTIONS_DB[c.name] || { priority: c.score < 70 ? 'High' : 'Medium' };
            const scoreClass = c.score >= 80 ? 'score-green' : c.score >= 60 ? 'score-amber' : 'score-red';
            const priorityClass = res.priority === 'Critical' ? 'priority-critical' : res.priority === 'High' ? 'priority-high' : 'priority-med';
            const mainIssue = c.issues.length > 0 ? c.issues[0] : 'All criteria verified & optimal';
            return `
              <tr>
                <td style="font-weight: 600; color: #fff;">${c.name}</td>
                <td><span class="badge-score ${scoreClass}">${c.score}/100</span></td>
                <td>${mainIssue}</td>
                <td class="${priorityClass}">${res.priority || 'Normal'}</td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    </div>

    <div class="page-break"></div>

    <!-- Detailed Resolution & Implementation Guide -->
    <div class="sec-heading">2. Detailed Issue Resolutions & Exact Implementation Fixes</div>
    <div class="cat-cards">
      ${data.categories.map(c => {
        const res = RESOLUTIONS_DB[c.name];
        const scoreClass = c.score >= 80 ? 'score-green' : c.score >= 60 ? 'score-amber' : 'score-red';
        return `
          <div class="cat-card">
            <div class="cat-card-header">
              <span class="cat-card-title">${c.name}</span>
              <span class="badge-score ${scoreClass}">Score: ${c.score}/100</span>
            </div>
            <div style="font-size: 11px; color: #94a3b8; margin-bottom: 6px;"><strong>Current Diagnostic:</strong> ${c.detail}</div>
            
            ${c.issues.length > 0 ? `
              <div class="issue-text">
                <strong>Identified Issues:</strong>
                <ul style="margin-left: 16px; margin-top: 3px;">
                  ${c.issues.map(iss => `<li>${iss}</li>`).join('')}
                </ul>
              </div>
            ` : `<div style="color: #34d399; font-size: 11px; margin-bottom: 6px;">✓ Fully compliant with modern AI/SEO standards.</div>`}

            ${res ? `
              <div class="fix-box">
                <div class="fix-title">ACTIONABLE RESOLUTION PLAN:</div>
                <p>${res.fix}</p>
                ${res.code ? `<pre><code>${res.code.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>` : ''}
                <div class="validation-text">Validation: ${res.validation}</div>
              </div>
            ` : ''}
          </div>
        `;
      }).join('')}
    </div>

    <!-- Consultation & Hire Box -->
    <div class="cta-box">
      <div class="cta-title">Need Expert Implementation & 1-on-1 Consultation?</div>
      <p class="cta-desc">
        Implementing technical SEO, JSON-LD Schema siloing, and AI Answer Engine Optimization (AEO/GEO) requires precise engineering. 
        <strong>Waqas Mehmood</strong> (Senior SEO Specialist & Full-Stack Growth Engineer) personally executes custom SEO audits, 
        Core Web Vitals remediation, and monthly growth retainers.
      </p>
      <div class="cta-actions">
        <a href="https://waqasmehmood.com/contact" target="_blank" class="cta-btn cta-btn-primary">
          <span>Leave a Message / Book Consultation</span>
          <span>&rarr;</span>
        </a>
        <a href="mailto:contact@waqasmehmood.com" class="cta-btn cta-btn-sec">
          <span>Email: contact@waqasmehmood.com</span>
        </a>
        <a href="https://waqasmehmood.com/services" target="_blank" class="cta-btn cta-btn-sec">
          <span>Explore All SEO Services</span>
        </a>
      </div>
      <div style="margin-top: 14px; font-size: 10px; color: #64748b;">
        Report generated by Waqas Mehmood AI Engine • waqasmehmood.com • © ${new Date().getFullYear()} All rights reserved.
      </div>
    </div>

  </div>

  <script>
    // Automatically trigger print dialog once styles are rendered
    window.addEventListener('load', () => {
      setTimeout(() => {
        window.print();
      }, 500);
    });
  </script>
</body>
</html>
  `;

  printWindow.document.open();
  printWindow.document.write(reportHtml);
  printWindow.document.close();
}


// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  requestAudit();

  document.getElementById('btn-rescan').addEventListener('click', () => {
    requestAudit();
  });

  document.getElementById('btn-export').addEventListener('click', () => {
    exportCsvReport();
  });

  const pdfBtn = document.getElementById('btn-export-pdf');
  if (pdfBtn) {
    pdfBtn.addEventListener('click', () => {
      exportPdfReport();
    });
  }
});
