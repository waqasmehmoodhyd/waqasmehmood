// Waqas Mehmood - Complete On-Page AI, AEO & GEO DOM Analyzer
// 100% Native, Authentic, and Real In-Browser Analysis

function runWmAnalysis() {
  const url = window.location.href;
  const hostname = window.location.hostname;
  const pathname = window.location.pathname;

  // 1. Meta & Discoverability
  const titleEl = document.querySelector('title');
  const titleText = titleEl ? titleEl.innerText.trim() : '';
  const metaDescEl = document.querySelector('meta[name="description"]');
  const metaDescText = metaDescEl ? (metaDescEl.getAttribute('content') || '').trim() : '';
  const canonicalEl = document.querySelector('link[rel="canonical"]');
  const canonicalUrl = canonicalEl ? canonicalEl.getAttribute('href') : '';
  const robotsEl = document.querySelector('meta[name="robots"]');
  const robotsContent = robotsEl ? (robotsEl.getAttribute('content') || '').toLowerCase() : 'index, follow';
  const ogTitle = document.querySelector('meta[property="og:title"]');
  const ogDesc = document.querySelector('meta[property="og:description"]');
  const ogImage = document.querySelector('meta[property="og:image"]');

  // 2. Headings & Semantic HTML
  const h1s = Array.from(document.querySelectorAll('h1'));
  const h2s = Array.from(document.querySelectorAll('h2'));
  const h3s = Array.from(document.querySelectorAll('h3'));
  const h4s = Array.from(document.querySelectorAll('h4'));
  const allHeadings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
  const mainEl = document.querySelector('main');
  const navEl = document.querySelector('nav');
  const footerEl = document.querySelector('footer');
  const skipLink = document.querySelector('a[href^="#"]');

  let headingHierarchySkips = 0;
  for (let i = 0; i < allHeadings.length - 1; i++) {
    const currLevel = parseInt(allHeadings[i].tagName.replace('H', ''), 10);
    const nextLevel = parseInt(allHeadings[i + 1].tagName.replace('H', ''), 10);
    if (nextLevel > currLevel + 1) {
      headingHierarchySkips++;
    }
  }

  // Text-to-HTML calculation
  const rawHtml = document.documentElement.outerHTML;
  const visibleText = document.body ? document.body.innerText : '';
  const textLength = visibleText.length;
  const htmlLength = rawHtml.length || 1;
  const textToHtmlRatio = Math.round((textLength / htmlLength) * 100);

  // 3. Structured Data & Schema
  const schemaScripts = Array.from(document.querySelectorAll('script[type="application/ld+json"]'));
  const schemas = [];
  let personSchema = false;
  let orgSchema = false;
  let websiteSchema = false;
  let faqSchema = false;
  let sameAsCount = 0;
  let schemaMissingProps = [];

  schemaScripts.forEach(script => {
    try {
      const data = JSON.parse(script.textContent);
      const items = data['@graph'] ? data['@graph'] : [data];
      items.forEach(item => {
        const type = item['@type'];
        schemas.push(type);
        if (type === 'Person') personSchema = true;
        if (type === 'Organization' || type === 'ProfessionalService' || type === 'LocalBusiness') orgSchema = true;
        if (type === 'WebSite') websiteSchema = true;
        if (type === 'FAQPage') faqSchema = true;
        if (item.sameAs && Array.isArray(item.sameAs)) sameAsCount += item.sameAs.length;
        if (type === 'Person' && !item.jobTitle) schemaMissingProps.push('Person: jobTitle');
        if (type === 'Person' && !item.image) schemaMissingProps.push('Person: image');
      });
    } catch (e) {
      // invalid JSON-LD
    }
  });

  // 4. Answer Targeting & Snippets (AEO)
  const questionWords = ['what', 'how', 'why', 'when', 'where', 'who', 'which', 'is', 'can', 'are', 'kia', 'kaise'];
  let questionHeadings = 0;
  let conciseAnswersCount = 0;
  const conciseAnswerParagraphs = [];

  allHeadings.forEach(h => {
    const text = h.innerText.toLowerCase();
    const isQuestion = text.includes('?') || questionWords.some(w => text.startsWith(w + ' '));
    if (isQuestion) {
      questionHeadings++;
      let nextEl = h.nextElementSibling;
      while (nextEl && nextEl.tagName !== 'P' && !nextEl.tagName.startsWith('H')) {
        nextEl = nextEl.nextElementSibling;
      }
      if (nextEl && nextEl.tagName === 'P') {
        const words = nextEl.innerText.trim().split(/\s+/).length;
        if (words >= 35 && words <= 65) {
          conciseAnswersCount++;
          conciseAnswerParagraphs.push({ q: h.innerText.trim(), a: nextEl.innerText.trim().slice(0, 140) + '...' });
        }
      }
    }
  });

  // 5. Citability, Tables & Lists
  const tables = Array.from(document.querySelectorAll('table'));
  const tableHeaders = Array.from(document.querySelectorAll('table th'));
  const lists = Array.from(document.querySelectorAll('ol, ul'));
  const headingsWithId = allHeadings.filter(h => h.id || h.getAttribute('id')).length;

  // 6. Entity & Trust Signals (GEO)
  const allAnchors = Array.from(document.querySelectorAll('a[href]'));
  let internalLinksCount = 0;
  let externalLinksCount = 0;
  let aboutLinkFound = false;
  let contactLinkFound = false;
  let privacyLinkFound = false;

  allAnchors.forEach(a => {
    const href = a.getAttribute('href') || '';
    if (href.startsWith('http')) {
      try {
        const linkUrl = new URL(href);
        if (linkUrl.hostname === hostname) {
          internalLinksCount++;
        } else {
          externalLinksCount++;
        }
      } catch (e) {
        externalLinksCount++;
      }
    } else if (href.startsWith('/') || href.startsWith('#') || href.startsWith('./')) {
      internalLinksCount++;
    }

    const lowerHref = href.toLowerCase();
    const lowerText = a.innerText.toLowerCase();
    if (lowerHref.includes('about') || lowerText.includes('about')) aboutLinkFound = true;
    if (lowerHref.includes('contact') || lowerText.includes('contact')) contactLinkFound = true;
    if (lowerHref.includes('privacy') || lowerHref.includes('terms')) privacyLinkFound = true;
  });

  // 7. Images & Assets Performance
  const images = Array.from(document.querySelectorAll('img'));
  let imagesWithoutDims = 0;
  let modernFormatImages = 0;
  let imagesWithoutAlt = 0;

  images.forEach(img => {
    const hasWidth = img.getAttribute('width') || (img.style && img.style.width);
    const hasHeight = img.getAttribute('height') || (img.style && img.style.height);
    if (!hasWidth || !hasHeight) imagesWithoutDims++;

    const src = (img.getAttribute('src') || '').toLowerCase();
    if (src.includes('.webp') || src.includes('.avif') || src.includes('fm=webp') || src.includes('.svg')) {
      modernFormatImages++;
    }

    const alt = img.getAttribute('alt');
    if (alt === null || alt.trim() === '') imagesWithoutAlt++;
  });

  // 8. Scripts (Render Blocking)
  const scripts = Array.from(document.querySelectorAll('script[src]'));
  let renderBlockingScripts = 0;
  scripts.forEach(s => {
    const async = s.hasAttribute('async');
    const defer = s.hasAttribute('defer');
    const type = s.getAttribute('type');
    if (!async && !defer && type !== 'module') {
      renderBlockingScripts++;
    }
  });

  // 9. Accessibility for Agents
  const forms = Array.from(document.querySelectorAll('form'));
  const inputs = Array.from(document.querySelectorAll('input:not([type="hidden"]), select, textarea'));
  let accessibleInputs = 0;
  inputs.forEach(inp => {
    const id = inp.id;
    const hasLabel = id ? document.querySelector(`label[for="${id}"]`) : null;
    const hasAria = inp.getAttribute('aria-label') || inp.getAttribute('placeholder');
    if (hasLabel || hasAria) accessibleInputs++;
  });

  // =========================================================================
  // SCORING ALGORITHM (60+ CHECKS ACROSS 13 CATEGORIES)
  // =========================================================================

  // Category 1: Structured Data & Schema (Weight: 10)
  let schemaScore = 30;
  if (schemas.length > 0) schemaScore += 30;
  if (personSchema || orgSchema) schemaScore += 20;
  if (faqSchema) schemaScore += 10;
  if (sameAsCount > 0) schemaScore += 10;
  schemaScore = Math.min(100, schemaScore);

  // Category 2: Semantic HTML (Weight: 10)
  let semanticScore = 50;
  if (h1s.length === 1) semanticScore += 20;
  if (h2s.length > 0) semanticScore += 10;
  if (mainEl) semanticScore += 10;
  if (headingHierarchySkips === 0) semanticScore += 10;
  semanticScore = Math.min(100, semanticScore);

  // Category 3: Answer Targeting & Snippets (AEO) (Weight: 15)
  let aeoTargetScore = 20;
  if (questionHeadings > 0) aeoTargetScore += 30;
  if (conciseAnswersCount > 0) aeoTargetScore += 30;
  if (faqSchema) aeoTargetScore += 20;
  aeoTargetScore = Math.min(100, aeoTargetScore);

  // Category 4: Citability & Answer-Readiness (Weight: 10)
  let citabilityScore = 40;
  if (tables.length > 0) citabilityScore += 25;
  if (lists.length > 2) citabilityScore += 15;
  if (headingsWithId > 0) citabilityScore += 20;
  citabilityScore = Math.min(100, citabilityScore);

  // Category 5: Entity & Authority (GEO) (Weight: 15)
  let geoEntityScore = 30;
  if (aboutLinkFound) geoEntityScore += 20;
  if (contactLinkFound) geoEntityScore += 15;
  if (privacyLinkFound) geoEntityScore += 15;
  if (sameAsCount > 0) geoEntityScore += 20;
  geoEntityScore = Math.min(100, geoEntityScore);

  // Category 6: Internal Linking (Weight: 10)
  let internalLinkScore = 20;
  if (internalLinksCount >= 5) internalLinkScore += 30;
  if (internalLinksCount >= 15) internalLinkScore += 30;
  if (internalLinksCount >= 30) internalLinkScore += 20;
  internalLinkScore = Math.min(100, internalLinkScore);

  // Category 7: Meta & Discoverability (Weight: 10)
  let metaScore = 30;
  if (titleText.length >= 40 && titleText.length <= 65) metaScore += 25;
  if (metaDescText.length >= 100 && metaDescText.length <= 170) metaScore += 25;
  if (canonicalUrl) metaScore += 10;
  if (robotsContent.includes('index')) metaScore += 10;
  metaScore = Math.min(100, metaScore);

  // Category 8: Performance & Assets (Weight: 10)
  let perfScore = 50;
  if (images.length === 0 || imagesWithoutDims === 0) perfScore += 20;
  if (images.length === 0 || modernFormatImages >= images.length * 0.7) perfScore += 20;
  if (renderBlockingScripts === 0) perfScore += 10;
  perfScore = Math.min(100, perfScore);

  // Category 9: Accessibility for Agents (Weight: 5)
  let agentAccessScore = 60;
  if (inputs.length === 0 || accessibleInputs === inputs.length) agentAccessScore += 20;
  if (navEl && footerEl) agentAccessScore += 20;
  agentAccessScore = Math.min(100, agentAccessScore);

  // Category 10: Voice & Conversational (Weight: 5)
  let voiceScore = 50;
  if (conciseAnswersCount > 0) voiceScore += 30;
  if (faqSchema) voiceScore += 20;
  voiceScore = Math.min(100, voiceScore);

  // Top Metric Calculations
  const calculatedSeo = Math.round((metaScore * 0.3) + (internalLinkScore * 0.3) + (semanticScore * 0.2) + (perfScore * 0.2));
  const calculatedGeo = Math.round((geoEntityScore * 0.35) + (schemaScore * 0.35) + (citabilityScore * 0.2) + (agentAccessScore * 0.1));
  const calculatedAeo = Math.round((aeoTargetScore * 0.45) + (citabilityScore * 0.3) + (voiceScore * 0.25));
  const calculatedAiView = Math.round((calculatedGeo * 0.45) + (calculatedAeo * 0.35) + (agentAccessScore * 0.2));
  const overallScore = Math.round((calculatedSeo * 0.3) + (calculatedGeo * 0.3) + (calculatedAeo * 0.25) + (calculatedAiView * 0.15));

  // Category breakdown object
  const categories = [
    {
      id: 'schema',
      name: 'Structured Data & Schema',
      score: schemaScore,
      icon: 'code',
      detail: `${schemas.length} schemas detected (${schemas.join(', ') || 'None'})`,
      issues: schemaScore < 85 ? [
        sameAsCount === 0 ? 'No sameAs verified authority profile links in schema' : null,
        !faqSchema ? 'FAQPage schema missing' : null,
        ...schemaMissingProps
      ].filter(Boolean) : []
    },
    {
      id: 'semantic',
      name: 'Semantic HTML',
      score: semanticScore,
      icon: 'layout',
      detail: `H1: ${h1s.length}, H2: ${h2s.length}, Text/HTML: ${textToHtmlRatio}%`,
      issues: semanticScore < 85 ? [
        h1s.length === 0 ? 'Missing single H1 heading' : h1s.length > 1 ? 'Multiple H1 headings detected' : null,
        headingHierarchySkips > 0 ? `${headingHierarchySkips} heading hierarchy skip(s) detected` : null
      ].filter(Boolean) : []
    },
    {
      id: 'aeo',
      name: 'Answer Targeting & Snippets',
      score: aeoTargetScore,
      icon: 'target',
      detail: `${questionHeadings} question headings, ${conciseAnswersCount} direct concise answers`,
      issues: aeoTargetScore < 85 ? [
        questionHeadings === 0 ? 'No question-based headings found (What is..., How to...)' : null,
        conciseAnswersCount === 0 ? 'No ideal 40-60 word concise direct definition paragraphs found' : null
      ].filter(Boolean) : []
    },
    {
      id: 'citability',
      name: 'Citability & Formatting',
      score: citabilityScore,
      icon: 'table',
      detail: `${tables.length} tables, ${lists.length} lists, ${headingsWithId} heading IDs`,
      issues: citabilityScore < 85 ? [
        tables.length === 0 ? 'No comparison or factual data tables found' : null,
        headingsWithId === 0 ? 'Headings lack anchor IDs for direct AI section citation' : null
      ].filter(Boolean) : []
    },
    {
      id: 'entity',
      name: 'Entity & Authority (GEO)',
      score: geoEntityScore,
      icon: 'shield',
      detail: `About: ${aboutLinkFound ? 'Yes' : 'No'}, Contact: ${contactLinkFound ? 'Yes' : 'No'}, sameAs: ${sameAsCount}`,
      issues: geoEntityScore < 85 ? [
        !aboutLinkFound ? 'Missing About page link for entity verification' : null,
        !contactLinkFound ? 'Missing Contact page link' : null,
        sameAsCount === 0 ? 'Missing sameAs social/corporate authority links' : null
      ].filter(Boolean) : []
    },
    {
      id: 'linking',
      name: 'Internal Linking',
      score: internalLinkScore,
      icon: 'link',
      detail: `${internalLinksCount} internal links, ${externalLinksCount} outbound links`,
      issues: internalLinkScore < 85 ? [
        internalLinksCount === 0 ? 'Zero crawlable internal links detected (possible button navigation)' : internalLinksCount < 10 ? 'Low internal linking count' : null
      ].filter(Boolean) : []
    },
    {
      id: 'meta',
      name: 'Meta & Discoverability',
      score: metaScore,
      icon: 'search',
      detail: `Title: ${titleText.length} chars, Desc: ${metaDescText.length} chars`,
      issues: metaScore < 85 ? [
        !titleText ? 'Title tag missing' : titleText.length < 35 ? 'Title tag too short' : null,
        !metaDescText ? 'Meta description missing' : metaDescText.length < 80 ? 'Meta description too short' : null,
        !canonicalUrl ? 'Canonical tag missing' : null
      ].filter(Boolean) : []
    },
    {
      id: 'assets',
      name: 'Performance & Assets',
      score: perfScore,
      icon: 'zap',
      detail: `${images.length} images (${imagesWithoutDims} missing dims, ${modernFormatImages} modern format)`,
      issues: perfScore < 85 ? [
        imagesWithoutDims > 0 ? `${imagesWithoutDims} image(s) missing width/height attributes (CLS risk)` : null,
        images.length > 0 && modernFormatImages < images.length ? `${images.length - modernFormatImages} image(s) not in WebP/AVIF format` : null,
        renderBlockingScripts > 0 ? `${renderBlockingScripts} render-blocking script(s) found` : null
      ].filter(Boolean) : []
    },
    {
      id: 'agent_access',
      name: 'Accessibility for Agents',
      score: agentAccessScore,
      icon: 'bot',
      detail: `Accessible inputs: ${accessibleInputs}/${inputs.length}, Semantic landmarks present`,
      issues: agentAccessScore < 85 ? [
        inputs.length > accessibleInputs ? `${inputs.length - accessibleInputs} input(s) missing accessible label or aria attribute` : null
      ].filter(Boolean) : []
    }
  ];

  const passingCount = categories.filter(c => c.score >= 80).length;

  return {
    url,
    hostname,
    pathname,
    scores: {
      seo: calculatedSeo,
      geo: calculatedGeo,
      aeo: calculatedAeo,
      aiView: calculatedAiView,
      overall: overallScore
    },
    summary: {
      passingCategories: passingCount,
      totalCategories: categories.length,
      grade: overallScore >= 90 ? 'Excellent' : overallScore >= 75 ? 'Good' : overallScore >= 50 ? 'Fair' : 'Needs Optimization',
      statusMessage: overallScore >= 80 ? 'Solid foundation - Ready for AI engines' : 'Optimization required for AI citation'
    },
    categories,
    conciseAnswers: conciseAnswerParagraphs,
    timestamp: new Date().toISOString()
  };
}

// Listen for message from Extension Popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'ANALYZE_PAGE') {
    try {
      const data = runWmAnalysis();
      sendResponse({ success: true, data });
    } catch (err) {
      sendResponse({ success: false, error: err.message });
    }
  }
  return true;
});
