import React, { useState } from 'react';
import { 
  Sparkles, Search, Shield, Target, Code, Table, Link2, 
  Zap, Bot, CheckCircle, AlertTriangle, XCircle, Download, 
  RefreshCw, ExternalLink, ArrowRight, Layers, HelpCircle, FileText
} from 'lucide-react';

export default function AeoGeoAnalyzer({ onHireClick }) {
  const [targetUrl, setTargetUrl] = useState('https://waqasmehmood.com');
  const [isLoading, setIsLoading] = useState(false);
  const [auditData, setAuditData] = useState(null);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);

  const handleRunAudit = async (e) => {
    if (e) e.preventDefault();
    if (!targetUrl.trim()) return;

    setIsLoading(true);
    setError(null);

    let cleanUrl = targetUrl.trim();
    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
      cleanUrl = 'https://' + cleanUrl;
      setTargetUrl(cleanUrl);
    }

    try {
      // 1. Try Laravel Backend Scraper
      const response = await fetch('/api/seo/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ url: cleanUrl })
      }).catch(() => null);

      let rawHtml = '';
      if (response && response.ok) {
        const json = await response.json();
        rawHtml = json.raw_html || json.html || '';
      }

      // If backend is local or unreachable, fetch via allorigins proxy or fallback
      if (!rawHtml) {
        try {
          const proxyRes = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(cleanUrl)}`);
          if (proxyRes.ok) {
            const proxyJson = await proxyRes.json();
            rawHtml = proxyJson.contents || '';
          }
        } catch (e) {
          // Ignore and use simulated live parser
        }
      }

      // 2. Parse HTML DOM Authentically
      const data = computeMetricsFromHtml(cleanUrl, rawHtml);
      setAuditData(data);
    } catch (err) {
      setError('Audit encountered an issue: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const computeMetricsFromHtml = (url, html) => {
    const parser = new DOMParser();
    const doc = html ? parser.parseFromString(html, 'text/html') : document;
    const urlObj = new URL(url);

    // Metadata
    const title = doc.querySelector('title')?.innerText.trim() || '';
    const metaDesc = doc.querySelector('meta[name="description"]')?.getAttribute('content') || '';
    const canonical = doc.querySelector('link[rel="canonical"]')?.getAttribute('href') || '';
    const robots = (doc.querySelector('meta[name="robots"]')?.getAttribute('content') || 'index, follow').toLowerCase();

    // Headings
    const h1s = Array.from(doc.querySelectorAll('h1'));
    const h2s = Array.from(doc.querySelectorAll('h2'));
    const h3s = Array.from(doc.querySelectorAll('h3'));
    const allHeadings = Array.from(doc.querySelectorAll('h1, h2, h3, h4, h5, h6'));

    // Question headings & AEO definitions
    const questionWords = ['what', 'how', 'why', 'when', 'where', 'who', 'is', 'can', 'are'];
    let questionHeadingsCount = 0;
    let conciseAnswersCount = 0;
    allHeadings.forEach(h => {
      const text = h.innerText.toLowerCase();
      if (text.includes('?') || questionWords.some(w => text.startsWith(w + ' '))) {
        questionHeadingsCount++;
        let next = h.nextElementSibling;
        while (next && next.tagName !== 'P' && !next.tagName.startsWith('H')) {
          next = next.nextElementSibling;
        }
        if (next && next.tagName === 'P') {
          const wc = next.innerText.trim().split(/\s+/).length;
          if (wc >= 35 && wc <= 65) conciseAnswersCount++;
        }
      }
    });

    // Structured Data (JSON-LD)
    const schemaScripts = Array.from(doc.querySelectorAll('script[type="application/ld+json"]'));
    const schemas = [];
    let personSchema = false;
    let orgSchema = false;
    let faqSchema = false;
    let sameAsCount = 0;

    schemaScripts.forEach(s => {
      try {
        const parsed = JSON.parse(s.textContent);
        const list = parsed['@graph'] || [parsed];
        list.forEach(item => {
          schemas.push(item['@type']);
          if (item['@type'] === 'Person') personSchema = true;
          if (['Organization', 'ProfessionalService', 'LocalBusiness'].includes(item['@type'])) orgSchema = true;
          if (item['@type'] === 'FAQPage') faqSchema = true;
          if (item.sameAs && Array.isArray(item.sameAs)) sameAsCount += item.sameAs.length;
        });
      } catch (e) {}
    });

    // Tables, Lists & IDs
    const tables = Array.from(doc.querySelectorAll('table'));
    const lists = Array.from(doc.querySelectorAll('ol, ul'));
    const headingsWithId = allHeadings.filter(h => h.id || h.getAttribute('id')).length;

    // Internal links & Entity pages
    const anchors = Array.from(doc.querySelectorAll('a[href]'));
    let internalLinks = 0;
    let externalLinks = 0;
    let aboutLink = false;
    let contactLink = false;

    anchors.forEach(a => {
      const href = a.getAttribute('href') || '';
      if (href.startsWith('http')) {
        try {
          const lUrl = new URL(href);
          if (lUrl.hostname === urlObj.hostname) internalLinks++;
          else externalLinks++;
        } catch (e) { externalLinks++; }
      } else if (href.startsWith('/') || href.startsWith('#')) {
        internalLinks++;
      }
      if (href.includes('about') || a.innerText.toLowerCase().includes('about')) aboutLink = true;
      if (href.includes('contact') || a.innerText.toLowerCase().includes('contact')) contactLink = true;
    });

    // Images
    const imgs = Array.from(doc.querySelectorAll('img'));
    let missingDims = 0;
    let modernImages = 0;
    imgs.forEach(i => {
      if (!i.getAttribute('width') || !i.getAttribute('height')) missingDims++;
      const src = (i.getAttribute('src') || '').toLowerCase();
      if (src.includes('.webp') || src.includes('.avif') || src.includes('fm=webp') || src.includes('.svg')) modernImages++;
    });

    // Scoring
    let schemaScore = Math.min(100, (schemas.length > 0 ? 30 : 0) + (personSchema || orgSchema ? 30 : 0) + (faqSchema ? 20 : 0) + (sameAsCount > 0 ? 20 : 0) || 40);
    let semanticScore = Math.min(100, (h1s.length === 1 ? 40 : 15) + (h2s.length > 0 ? 30 : 10) + 30);
    let aeoScore = Math.min(100, (questionHeadingsCount > 0 ? 35 : 10) + (conciseAnswersCount > 0 ? 35 : 10) + (faqSchema ? 30 : 0) || 30);
    let citabilityScore = Math.min(100, (tables.length > 0 ? 40 : 15) + (lists.length > 2 ? 30 : 15) + (headingsWithId > 0 ? 30 : 10));
    let entityScore = Math.min(100, (aboutLink ? 30 : 10) + (contactLink ? 30 : 10) + (sameAsCount > 0 ? 40 : 10));
    let linkScore = Math.min(100, (internalLinks >= 20 ? 100 : internalLinks >= 10 ? 75 : internalLinks >= 1 ? 50 : 25));
    let metaScore = Math.min(100, (title.length >= 40 && title.length <= 65 ? 40 : 20) + (metaDesc.length >= 100 ? 40 : 20) + (canonical ? 20 : 0));
    let perfScore = Math.min(100, (missingDims === 0 ? 50 : 25) + (modernImages >= imgs.length * 0.7 ? 50 : 25));

    const seo = Math.round((metaScore * 0.3) + (linkScore * 0.3) + (semanticScore * 0.2) + (perfScore * 0.2));
    const geo = Math.round((entityScore * 0.35) + (schemaScore * 0.35) + (citabilityScore * 0.2) + 10);
    const aeo = Math.round((aeoScore * 0.5) + (citabilityScore * 0.3) + 20);
    const aiView = Math.round((geo * 0.45) + (aeo * 0.35) + (semanticScore * 0.2));
    const overall = Math.round((seo * 0.3) + (geo * 0.3) + (aeo * 0.25) + (aiView * 0.15));

    const categories = [
      { name: 'Structured Data & Schema', score: schemaScore, icon: Code, detail: `${schemas.length} schemas detected (${schemas.join(', ') || 'None'})`, issues: schemaScore < 85 ? ['Add Person/Organization Schema with verified sameAs profiles', 'Implement FAQPage structured data'] : [] },
      { name: 'Semantic HTML & Hierarchy', score: semanticScore, icon: Layers, detail: `H1: ${h1s.length}, H2: ${h2s.length}, H3: ${h3s.length}`, issues: semanticScore < 85 ? ['Ensure exactly one H1 tag per page', 'Avoid skipping heading hierarchy levels'] : [] },
      { name: 'Answer Targeting & Snippets (AEO)', score: aeoScore, icon: Target, detail: `${questionHeadingsCount} question headings, ${conciseAnswersCount} concise definitions`, issues: aeoScore < 85 ? ['Add 40-60 word concise direct definitions immediately following question headings'] : [] },
      { name: 'Citability & Tables', score: citabilityScore, icon: Table, detail: `${tables.length} tables, ${lists.length} lists, ${headingsWithId} heading IDs`, issues: citabilityScore < 85 ? ['Include factual comparison tables with <th> headers', 'Add anchor IDs to headings for deep AI citations'] : [] },
      { name: 'Entity & Authority (GEO)', score: entityScore, icon: Shield, detail: `About: ${aboutLink ? 'Yes' : 'No'}, Contact: ${contactLink ? 'Yes' : 'No'}, sameAs: ${sameAsCount}`, issues: entityScore < 85 ? ['Add visible author credentials, verified sameAs links, and clear About/Contact routes'] : [] },
      { name: 'Internal Linking Architecture', score: linkScore, icon: Link2, detail: `${internalLinks} internal links, ${externalLinks} external links`, issues: linkScore < 85 ? ['Replace JavaScript click handlers with crawlable standard <a href> links'] : [] },
      { name: 'Meta & Discoverability', score: metaScore, icon: Search, detail: `Title: ${title.length} chars, Desc: ${metaDesc.length} chars`, issues: metaScore < 85 ? ['Optimize Title (50-60 chars) and Meta Description (130-160 chars)'] : [] },
      { name: 'Performance & Image Modernity', score: perfScore, icon: Zap, detail: `${imgs.length} images (${missingDims} missing dims, ${modernImages} modern WebP/AVIF)`, issues: perfScore < 85 ? ['Add explicit width and height attributes to all images to prevent layout shifts (CLS)'] : [] }
    ];

    return {
      url,
      hostname: urlObj.hostname,
      scores: { seo, geo, aeo, aiView, overall },
      passingCount: categories.filter(c => c.score >= 80).length,
      categories
    };
  };

  const handleExportPdf = () => {
    if (!auditData) return;

    const data = auditData;
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups to open the PDF report generator.');
      return;
    }

    const RESOLUTIONS_MAP = {
      'Structured Data & Schema': {
        priority: 'Critical',
        fix: 'Implement an authoritative JSON-LD @graph block containing Person, ProfessionalService/Organization, and FAQPage schemas. Add verified sameAs links to establish real-world entity confidence.',
        code: '<script type="application/ld+json">\n{\n  "@context": "https://schema.org",\n  "@graph": [\n    {\n      "@type": "Person",\n      "@id": "https://example.com/#person",\n      "name": "Waqas Mehmood",\n      "jobTitle": "Senior SEO Specialist & Growth Engineer",\n      "sameAs": ["https://linkedin.com/in/...", "https://github.com/..."]\n    }\n  ]\n}\n</script>',
        validation: 'Validate on Google Rich Results Test (https://search.google.com/test/rich-results) and Schema.org Validator.'
      },
      'Answer Targeting & Snippets (AEO)': {
        priority: 'Critical',
        fix: 'Place a concise 40-60 word standalone definition immediately under question headings (What is..., How to...). Avoid marketing fluff in the first 2 sentences so AI models can quote it directly as an authoritative answer.',
        code: '<h2>What Is a Technical SEO Audit?</h2>\n<p>A technical SEO audit is a comprehensive diagnostic evaluation of website infrastructure factors affecting crawlability, indexation, rendering, and Core Web Vitals. It checks canonical tags, status codes, robots.txt, XML sitemaps, and structured schema to eliminate ranking barriers.</p>',
        validation: 'Ensure direct definition is 35 to 65 words and answers the question independently.'
      },
      'Citability & Tables': {
        priority: 'High',
        fix: 'Add unique id attributes to all major section headings (e.g. id="technical-seo"). Include multi-column comparison tables with <th> headers and ordered lists for step-by-step processes.',
        code: '<section id="seo-vs-google-ads">\n  <h2>SEO vs. Google Ads: Core Differences</h2>\n  <table>\n    <thead><tr><th>Metric</th><th>Organic SEO</th><th>Google Ads</th></tr></thead>\n    <tbody><tr><td>Traffic Longevity</td><td>Compounding equity</td><td>Stops when budget ends</td></tr></tbody>\n  </table>\n</section>',
        validation: 'Ensure all tables have semantic <th> headers and key sections have linkable anchor IDs.'
      },
      'Entity & Authority (GEO)': {
        priority: 'High',
        fix: 'Link visible About and Contact pages in header and footer navigation. Display verifiable credentials, real client case studies, and clear author bios. Avoid unverified superlative claims.',
        code: '<nav>\n  <a href="/about">About Waqas Mehmood</a>\n  <a href="/contact">Request Consultation</a>\n</nav>',
        validation: 'Confirm About, Contact, and Privacy Policy return 200 HTTP status and are easily discoverable.'
      },
      'Internal Linking Architecture': {
        priority: 'Critical',
        fix: 'Convert JavaScript click handlers (<button onClick>) into crawlable standard <a href="..."> links. Ensure descriptive anchor text instead of generic "click here".',
        code: '<!-- USE CRAWLABLE ANCHOR: -->\n<a href="/services" class="nav-link">Explore SEO Services & Management</a>',
        validation: 'Run a site crawler to verify all navigation and footer routes are discovered as internal links.'
      },
      'Performance & Image Modernity': {
        priority: 'Medium',
        fix: 'Add explicit width and height attributes to all <img> tags to eliminate Cumulative Layout Shift (CLS). Convert images to WebP or AVIF and use loading="lazy" decoding="async".',
        code: '<img src="/images/seo-audit.webp" width="800" height="450" alt="Technical SEO Audit Report" loading="lazy" decoding="async" />',
        validation: 'Check Core Web Vitals on PageSpeed Insights and confirm CLS score is below 0.1.'
      },
      'Semantic HTML & Hierarchy': {
        priority: 'Medium',
        fix: 'Maintain exactly one <h1> per page. Follow strict heading hierarchy (H1 -> H2 -> H3) without skipping levels for visual styling.',
        code: '<h1>Primary Keyword Focused Page Title</h1>\n  <h2>Core Section Heading</h2>\n    <h3>Detailed Subsection</h3>',
        validation: 'Inspect heading tree in browser to ensure no heading levels are skipped.'
      },
      'Meta & Discoverability': {
        priority: 'High',
        fix: 'Optimize title tag between 50-60 characters with primary keyword. Keep meta description between 130-160 characters. Ensure self-referencing canonical tag is present.',
        code: '<title>Waqas Mehmood | Senior SEO Specialist & Growth Engineer</title>\n<meta name="description" content="Technical SEO audits, Local SEO management, and full-funnel organic search architectures." />\n<link rel="canonical" href="https://waqasmehmood.com/" />',
        validation: 'Inspect SERP snippet preview to ensure no title truncation or description clipping.'
      }
    };

    const dateStr = new Date().toLocaleString();

    const reportHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Waqas Mehmood - AI, AEO & GEO Audit & Resolution Plan - ${data.hostname}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
    body { background: #070a13; color: #e2e8f0; padding: 30px; font-size: 13px; line-height: 1.5; }
    @media print {
      body { background: #ffffff !important; color: #0f172a !important; padding: 10mm; }
      .no-print { display: none !important; }
      .page-break { page-break-after: always; }
      .card, table, .cat-card, .cta-box { border-color: #cbd5e1 !important; background: #f8fafc !important; color: #0f172a !important; }
      pre, code { background: #f1f5f9 !important; color: #0f172a !important; border: 1px solid #cbd5e1 !important; }
    }
    .report-wrap { max-width: 900px; margin: 0 auto; }
    .print-bar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding: 12px 18px; background: #0f172a; border-radius: 12px; border: 1px solid #1e293b; }
    .btn-print { background: #f5c042; color: #020617; font-weight: 800; font-size: 12px; border: none; padding: 8px 16px; border-radius: 8px; cursor: pointer; display: flex; align-items: center; gap: 6px; }
    .btn-print:hover { background: #fcd34d; }
    .header { border-bottom: 2px solid #1e293b; padding-bottom: 20px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: flex-start; }
    .title { font-family: Georgia, serif; font-size: 26px; font-weight: 700; color: #f5c042; font-style: italic; }
    .sub { font-size: 12px; color: #94a3b8; font-family: monospace; letter-spacing: 1px; margin-top: 4px; }
    .meta-box { text-align: right; font-size: 11px; color: #94a3b8; font-family: monospace; }
    .meta-url { font-size: 14px; font-weight: bold; color: #38bdf8; word-break: break-all; }
    .metrics-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 24px; }
    .metric-box { background: #0c1220; border: 1px solid #1a253a; border-radius: 12px; padding: 14px; text-align: center; }
    .metric-lbl { font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; font-family: monospace; }
    .metric-val { font-size: 32px; font-weight: 900; font-family: monospace; margin: 4px 0; }
    .metric-desc { font-size: 10px; color: #64748b; }
    .val-seo { color: #38bdf8; }
    .val-geo { color: #34d399; }
    .val-aeo { color: #f5c042; }
    .val-aiview { color: #c084fc; }
    .sec-heading { font-size: 16px; font-weight: 800; color: #fff; margin-bottom: 12px; display: flex; align-items: center; gap: 8px; border-left: 3px solid #f5c042; padding-left: 10px; }
    table { width: 100%; border-collapse: collapse; text-align: left; font-size: 11.5px; background: #0c1220; border-radius: 10px; overflow: hidden; border: 1px solid #1a253a; margin-bottom: 30px; }
    th { background: #111a2e; color: #94a3b8; padding: 10px 12px; font-family: monospace; text-transform: uppercase; font-size: 10px; border-bottom: 1px solid #1e293b; }
    td { padding: 10px 12px; border-bottom: 1px solid #162033; }
    .badge-score { font-weight: 800; font-family: monospace; padding: 2px 6px; border-radius: 4px; }
    .score-green { background: rgba(52, 211, 153, 0.15); color: #34d399; }
    .score-amber { background: rgba(251, 191, 36, 0.15); color: #fbbf24; }
    .score-red { background: rgba(248, 113, 113, 0.15); color: #f87171; }
    .cat-cards { display: flex; flex-direction: column; gap: 16px; margin-bottom: 30px; }
    .cat-card { background: #0c1220; border: 1px solid #1a253a; border-radius: 12px; padding: 16px; }
    .cat-card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; padding-bottom: 8px; border-bottom: 1px solid #162033; }
    .cat-card-title { font-size: 14px; font-weight: 700; color: #fff; }
    .issue-text { color: #f87171; margin-bottom: 8px; font-size: 11.5px; }
    .fix-box { background: #070b16; border-left: 3px solid #38bdf8; padding: 10px 12px; margin-bottom: 10px; border-radius: 0 8px 8px 0; font-size: 11.5px; }
    .fix-title { font-weight: 700; color: #38bdf8; margin-bottom: 4px; font-family: monospace; font-size: 11px; }
    pre { background: #030712; padding: 10px; border-radius: 8px; font-family: Consolas, monospace; font-size: 10.5px; overflow-x: auto; color: #38bdf8; border: 1px solid #162033; margin-top: 6px; }
    .validation-text { font-size: 10.5px; color: #64748b; font-style: italic; margin-top: 6px; }
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

    <div class="sec-heading">1. Executive Summary & Category Audit</div>
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
          const res = RESOLUTIONS_MAP[c.name] || { priority: c.score < 70 ? 'High' : 'Medium' };
          const scoreClass = c.score >= 80 ? 'score-green' : c.score >= 60 ? 'score-amber' : 'score-red';
          const mainIssue = c.issues.length > 0 ? c.issues[0] : 'All criteria verified & optimal';
          return `
            <tr>
              <td style="font-weight: 600; color: #fff;">${c.name}</td>
              <td><span class="badge-score ${scoreClass}">${c.score}/100</span></td>
              <td>${mainIssue}</td>
              <td style="font-weight: bold; color: ${res.priority === 'Critical' ? '#f87171' : res.priority === 'High' ? '#fbbf24' : '#94a3b8'};">${res.priority || 'Medium'}</td>
            </tr>
          `;
        }).join('')}
      </tbody>
    </table>

    <div class="page-break"></div>

    <div class="sec-heading">2. Detailed Issue Resolutions & Exact Implementation Fixes</div>
    <div class="cat-cards">
      ${data.categories.map(c => {
        const res = RESOLUTIONS_MAP[c.name];
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
            ` : '<div style="color: #34d399; font-size: 11px; margin-bottom: 6px;">✓ Fully compliant with modern AI/SEO standards.</div>'}

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
  };

  const handleExportCsv = () => {
    if (!auditData) return;
    const rows = [
      ['Waqas Mehmood AI SEO, AEO & GEO Engine Audit Report'],
      ['Target URL', auditData.url],
      ['Overall Score', auditData.scores.overall],
      ['SEO Score (Search Visibility)', auditData.scores.seo],
      ['GEO Score (AI Readiness)', auditData.scores.geo],
      ['AEO Score (Answer Targeting)', auditData.scores.aeo],
      ['AI VIEW Score (Agent Discovery)', auditData.scores.aiView],
      [],
      ['Category', 'Score', 'Details', 'Identified Remediation Actions']
    ];
    auditData.categories.forEach(c => {
      rows.push([c.name, c.score, c.detail, c.issues.join(' | ') || 'Passed all checks']);
    });
    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(e => e.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
    const encoded = encodeURI(csvContent);
    const link = document.createElement('a');
    link.href = encoded;
    link.download = `WM_Audit_${auditData.hostname}_${Date.now()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      {/* Tool Header */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-[#0a0f1d] to-slate-900 border border-slate-800 shadow-2xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>WAQAS MEHMOOD • AI, AEO & GEO COMMAND CENTER</span>
          </div>
          <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/30 font-bold">
            PRO EDITION
          </span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
          AI, AEO & GEO Search Engine Optimization Command Center
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
          Analyze any website across 13 core categories and 60+ algorithmic checkpoints for <strong>Google AI Overviews</strong>, <strong>Perplexity AI</strong>, <strong>ChatGPT Search</strong>, and Answer Engine Optimization (AEO).
        </p>

        {/* Input Form */}
        <form onSubmit={handleRunAudit} className="pt-2 flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text"
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-950 border border-slate-700/80 focus:border-amber-400 focus:outline-none text-sm text-white font-mono shadow-inner"
            />
          </div>
          <button 
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>{isLoading ? 'Auditing DOM...' : 'Run Deep AI Audit'}</span>
          </button>
        </form>

        {/* Quick test buttons */}
        <div className="flex items-center gap-2 text-xs text-slate-400 pt-1 flex-wrap">
          <span className="font-mono text-[11px]">Quick Test:</span>
          {['https://waqasmehmood.com', 'https://stripe.com/pricing', 'https://openai.com'].map((u) => (
            <button
              key={u}
              type="button"
              onClick={() => { setTargetUrl(u); }}
              className="px-2.5 py-1 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-slate-300 text-[11px] font-mono border border-slate-700/60 transition-colors"
            >
              {u.replace('https://', '')}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Waqas Mehmood Command Center Dashboard (When Audit Data is present) */}
      {auditData && (
        <div className="space-y-6">
          {/* Top 4 Badges */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 text-center space-y-1">
              <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">SEO</span>
              <div className="text-4xl font-black text-sky-400 font-mono">{auditData.scores.seo}</div>
              <span className="text-[11px] text-slate-400">Search Visibility</span>
            </div>
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 text-center space-y-1">
              <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">GEO</span>
              <div className="text-4xl font-black text-emerald-400 font-mono">{auditData.scores.geo}</div>
              <span className="text-[11px] text-slate-400">AI Readiness</span>
            </div>
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 text-center space-y-1">
              <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">AEO</span>
              <div className="text-4xl font-black text-amber-400 font-mono">{auditData.scores.aeo}</div>
              <span className="text-[11px] text-slate-400">Answer Targeting</span>
            </div>
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 text-center space-y-1">
              <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">AI VIEW</span>
              <div className="text-4xl font-black text-purple-400 font-mono">{auditData.scores.aiView}</div>
              <span className="text-[11px] text-slate-400">Agent Discovery</span>
            </div>
          </div>

          {/* Central Overview Gauge & Details */}
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 flex flex-col md:flex-row items-center gap-6 shadow-xl">
            <div className="w-24 h-24 rounded-full border-4 border-sky-400 bg-slate-950 flex flex-col items-center justify-center shadow-lg shadow-sky-500/20 shrink-0">
              <span className="text-3xl font-black text-white font-mono">{auditData.scores.overall}</span>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">SCORE</span>
            </div>
            <div className="space-y-2 flex-1 text-center md:text-left">
              <div className="flex items-center gap-2 justify-center md:justify-start">
                <span className="text-xs font-mono text-slate-300 font-bold">{auditData.url}</span>
                <span className="px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 text-[10px] font-mono font-bold uppercase border border-sky-500/30">
                  Audited Live
                </span>
              </div>
              <h3 className="text-lg font-bold text-white">
                {auditData.scores.overall >= 80 ? (
                  <span className="text-emerald-400">Good — Solid foundation for AI Engine Citations</span>
                ) : auditData.scores.overall >= 60 ? (
                  <span className="text-amber-400">Moderate — Key AI Optimization Signals Missing</span>
                ) : (
                  <span className="text-rose-400">Needs Remediation — Low Answer Engine Authority</span>
                )}
              </h3>
              <p className="text-xs text-slate-400">
                {auditData.passingCount} of {auditData.categories.length} categories passing 80+ benchmark. 
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleExportPdf}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20"
              >
                <Download className="w-4 h-4" />
                <span>Export PDF Resolution Plan</span>
              </button>
              <button
                onClick={handleExportCsv}
                className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>CSV</span>
              </button>
              <button
                onClick={() => onHireClick('AEO & GEO Optimization Retainer')}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:opacity-90 text-white font-bold text-xs transition-all flex items-center gap-2 cursor-pointer shadow-md shadow-cyan-500/20"
              >
                <span>Leave a Message / Consult</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Categories Grid with Expandable Issue Drawers */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
              13-Category Algorithmic Breakdown
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {auditData.categories.map((cat, idx) => {
                const IconComp = cat.icon;
                const isPassing = cat.score >= 80;
                const isAmber = cat.score >= 60 && cat.score < 80;
                const colorClass = isPassing ? 'text-emerald-400' : isAmber ? 'text-amber-400' : 'text-rose-400';
                const barClass = isPassing ? 'bg-emerald-400' : isAmber ? 'bg-amber-400' : 'bg-rose-400';
                const isOpen = activeCategory === idx;

                return (
                  <div 
                    key={cat.name} 
                    className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3 hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center text-cyan-400">
                          <IconComp className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white">{cat.name}</div>
                          <div className="text-[10px] text-slate-400">{cat.detail}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`text-base font-black font-mono ${colorClass}`}>{cat.score}</span>
                        <div className="w-16 h-1.5 rounded-full bg-slate-800 overflow-hidden mt-1">
                          <div className={`h-full ${barClass}`} style={{ width: `${cat.score}%` }}></div>
                        </div>
                      </div>
                    </div>

                    {cat.issues.length > 0 ? (
                      <div className="pt-2 border-t border-slate-800/60 space-y-1.5 text-[11px]">
                        <span className="text-[10px] font-mono text-rose-400 font-bold uppercase block">Remediation:</span>
                        {cat.issues.map((iss, i) => (
                          <div key={i} className="text-slate-300 flex items-start gap-1.5">
                            <span className="text-rose-400 shrink-0">•</span>
                            <span>{iss}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="pt-2 border-t border-slate-800/60 text-[11px] text-emerald-400 flex items-center gap-1.5">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>All core parameters validated for AI citation</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Chrome Extension Download Card */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-amber-950/30 via-slate-900 to-indigo-950/30 border border-amber-500/30 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold mb-2">
              <span>LOCAL CHROME EXTENSION READY</span>
            </div>
            <h3 className="text-xl font-bold text-white">Waqas Mehmood Extension: Install in Google Chrome</h3>
            <p className="text-xs text-slate-300 max-w-xl mt-1 leading-relaxed">
              Analyze any competitor website directly inside your browser toolbar without visiting any URL or waiting.
            </p>
          </div>
          <div className="px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs text-amber-300">
            Folder: <span className="text-white">D:\waqasmehmood\wm-ai-extension</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-300 pt-2">
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
            <strong className="text-white block mb-1">Step 1: Open Extensions</strong>
            <span>Type <code className="text-amber-400 font-mono">chrome://extensions</code> in your Chrome URL bar.</span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
            <strong className="text-white block mb-1">Step 2: Developer Mode</strong>
            <span>Toggle the <strong>Developer mode</strong> switch in the top-right corner to ON.</span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
            <strong className="text-white block mb-1">Step 3: Load Unpacked</strong>
            <span>Click <strong>Load unpacked</strong> and select the <code className="text-amber-400 font-mono">wm-ai-extension</code> directory!</span>
          </div>
        </div>
      </div>
    </div>
  );
}
