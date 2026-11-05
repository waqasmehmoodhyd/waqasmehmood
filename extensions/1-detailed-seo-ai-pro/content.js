// Waqas Mehmood - Complete On-Page, Technical, Social & AI/AEO DOM Analyzer
// 100% Native, Authentic, and Real-Time In-Browser Inspection

function runWmComprehensiveAnalysis() {
  const url = window.location.href;
  const urlObj = new URL(url);
  const hostname = urlObj.hostname;
  const pathname = urlObj.pathname;

  // =========================================================================
  // 1. METADATA & GENERAL SIGNALS
  // =========================================================================
  const titleEl = document.querySelector('title');
  const titleText = (titleEl?.textContent || titleEl?.innerText || '').trim();
  const titleLength = titleText.length;
  // Estimated pixel width calculation (approx 9px per char on average desktop Arial 18px)
  const estimatedPixelWidth = Math.round(titleLength * 8.8);

  const metaDescEl = document.querySelector('meta[name="description"]');
  const metaDescText = (metaDescEl ? (metaDescEl.getAttribute('content') || '') : '').trim();
  const metaDescLength = metaDescText.length;

  const canonicalEl = document.querySelector('link[rel="canonical"]');
  const canonicalUrl = canonicalEl ? (canonicalEl.getAttribute('href') || '').trim() : '';
  
  // Canonical match check
  let canonicalStatus = 'missing';
  let isCanonicalMatch = false;
  if (canonicalUrl) {
    try {
      const fullCanonical = new URL(canonicalUrl, window.location.origin).href;
      isCanonicalMatch = (fullCanonical === url || fullCanonical === window.location.origin + pathname);
      canonicalStatus = isCanonicalMatch ? 'match' : 'mismatch';
    } catch (e) {
      canonicalStatus = 'invalid';
    }
  }

  const robotsEl = document.querySelector('meta[name="robots"]');
  const robotsContent = (robotsEl ? (robotsEl.getAttribute('content') || '') : 'index, follow').toLowerCase();
  const isNoIndex = robotsContent.includes('noindex');
  const isNoFollow = robotsContent.includes('nofollow');

  const lang = document.documentElement.getAttribute('lang') || 'Not specified';
  const charset = document.characterSet || 'UTF-8';
  const viewportEl = document.querySelector('meta[name="viewport"]');
  const viewport = viewportEl ? viewportEl.getAttribute('content') : 'Missing';
  const authorEl = document.querySelector('meta[name="author"]') || document.querySelector('meta[name="publisher"]');
  const author = authorEl ? authorEl.getAttribute('content') : '';

  // Content & Word stats
  const visibleText = (document.body ? (document.body.innerText || document.body.textContent || '') : '').trim();
  const wordsArray = visibleText.split(/\s+/).filter(Boolean);
  const wordCount = wordsArray.length;
  const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));

  const rawHtml = document.documentElement.outerHTML || '';
  const htmlLength = rawHtml.length || 1;
  const textToHtmlRatio = Math.round((visibleText.length / htmlLength) * 100);

  // =========================================================================
  // 2. HEADINGS ARCHITECTURE (H1-H6)
  // =========================================================================
  const allHeadings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
  const headingsCount = { h1: 0, h2: 0, h3: 0, h4: 0, h5: 0, h6: 0, total: allHeadings.length };
  const headingsList = [];
  let headingHierarchySkips = 0;

  allHeadings.forEach((h, idx) => {
    const tag = h.tagName.toLowerCase();
    headingsCount[tag] = (headingsCount[tag] || 0) + 1;
    const text = (h.textContent || h.innerText || '').trim();
    headingsList.push({
      index: idx + 1,
      tag: tag.toUpperCase(),
      level: parseInt(tag.replace('h', ''), 10),
      text: text,
      length: text.length,
      hasId: !!(h.id || h.getAttribute('id'))
    });

    if (idx < allHeadings.length - 1) {
      const currLevel = parseInt(h.tagName.replace('H', ''), 10);
      const nextLevel = parseInt(allHeadings[idx + 1].tagName.replace('H', ''), 10);
      if (nextLevel > currLevel + 1) {
        headingHierarchySkips++;
      }
    }
  });

  const h1Status = headingsCount.h1 === 1 ? 'optimal' : headingsCount.h1 === 0 ? 'missing' : 'multiple';

  // =========================================================================
  // 3. STRUCTURED DATA & SCHEMA (JSON-LD)
  // =========================================================================
  const schemaScripts = Array.from(document.querySelectorAll('script[type="application/ld+json"]'));
  const schemaDetails = [];
  const schemaTypesDetected = [];
  let sameAsProfiles = [];
  let personSchemaFound = false;
  let orgSchemaFound = false;
  let faqSchemaFound = false;

  schemaScripts.forEach((script, idx) => {
    try {
      const rawText = script.textContent.trim();
      const parsed = JSON.parse(rawText);
      const items = Array.isArray(parsed['@graph']) ? parsed['@graph'] : Array.isArray(parsed) ? parsed : [parsed];

      items.forEach(item => {
        if (item && item['@type']) {
          const type = item['@type'];
          schemaTypesDetected.push(type);
          if (type === 'Person') personSchemaFound = true;
          if (['Organization', 'ProfessionalService', 'LocalBusiness'].includes(type)) orgSchemaFound = true;
          if (type === 'FAQPage') faqSchemaFound = true;
          if (item.sameAs) {
            const list = Array.isArray(item.sameAs) ? item.sameAs : [item.sameAs];
            sameAsProfiles = sameAsProfiles.concat(list);
          }
        }
      });

      schemaDetails.push({
        index: idx + 1,
        types: items.map(i => i['@type']).filter(Boolean),
        rawFormatted: JSON.stringify(parsed, null, 2)
      });
    } catch (e) {
      schemaDetails.push({
        index: idx + 1,
        types: ['Invalid JSON-LD Syntax'],
        rawFormatted: script.textContent.slice(0, 300) + '... (Syntax Error: ' + e.message + ')'
      });
    }
  });

  // =========================================================================
  // 4. LINKS BREAKDOWN (INTERNAL & EXTERNAL)
  // =========================================================================
  const allAnchors = Array.from(document.querySelectorAll('a[href]'));
  let internalLinksCount = 0;
  let externalLinksCount = 0;
  let nofollowCount = 0;
  let sponsoredCount = 0;
  let ugcCount = 0;
  const externalDomainsMap = {};
  const sampleExternalLinks = [];
  let aboutLinkFound = false;
  let contactLinkFound = false;
  let privacyLinkFound = false;

  allAnchors.forEach(a => {
    const rawHref = (a.getAttribute('href') || '').trim();
    const rel = (a.getAttribute('rel') || '').toLowerCase();
    if (rel.includes('nofollow')) nofollowCount++;
    if (rel.includes('sponsored')) sponsoredCount++;
    if (rel.includes('ugc')) ugcCount++;

    let isInternal = false;
    let targetDomain = '';

    if (rawHref.startsWith('http://') || rawHref.startsWith('https://')) {
      try {
        const linkUrl = new URL(rawHref);
        targetDomain = linkUrl.hostname;
        if (targetDomain === hostname || targetDomain.endsWith('.' + hostname)) {
          isInternal = true;
        }
      } catch (e) {
        isInternal = false;
      }
    } else if (rawHref.startsWith('/') || rawHref.startsWith('#') || rawHref.startsWith('./') || rawHref.startsWith('mailto:') || rawHref.startsWith('tel:')) {
      isInternal = true;
    }

    if (isInternal) {
      internalLinksCount++;
    } else {
      externalLinksCount++;
      if (targetDomain) {
        externalDomainsMap[targetDomain] = (externalDomainsMap[targetDomain] || 0) + 1;
        if (sampleExternalLinks.length < 15) {
          sampleExternalLinks.push({
            domain: targetDomain,
            href: rawHref,
            text: (a.textContent || a.innerText || '').trim().slice(0, 50) || '(No Anchor Text)',
            nofollow: rel.includes('nofollow')
          });
        }
      }
    }

    const lowerHref = rawHref.toLowerCase();
    const lowerText = (a.textContent || a.innerText || '').toLowerCase();
    if (lowerHref.includes('about') || lowerText.includes('about')) aboutLinkFound = true;
    if (lowerHref.includes('contact') || lowerText.includes('contact')) contactLinkFound = true;
    if (lowerHref.includes('privacy') || lowerHref.includes('terms')) privacyLinkFound = true;
  });

  const uniqueExternalDomainsCount = Object.keys(externalDomainsMap).length;

  // =========================================================================
  // 5. IMAGES & VISUAL ASSETS
  // =========================================================================
  const allImages = Array.from(document.querySelectorAll('img'));
  let imagesMissingAltCount = 0;
  let imagesMissingDimensionsCount = 0;
  let modernFormatsCount = 0;
  const missingAltSample = [];

  allImages.forEach((img, idx) => {
    const alt = img.getAttribute('alt');
    const hasAlt = (alt !== null && alt.trim() !== '');
    if (!hasAlt) {
      imagesMissingAltCount++;
      if (missingAltSample.length < 12) {
        missingAltSample.push({
          index: idx + 1,
          src: img.getAttribute('src') || '(data URI)',
          width: img.naturalWidth || img.width || 0,
          height: img.naturalHeight || img.height || 0
        });
      }
    }

    const hasWidth = img.getAttribute('width') || (img.style && img.style.width);
    const hasHeight = img.getAttribute('height') || (img.style && img.style.height);
    if (!hasWidth || !hasHeight) {
      imagesMissingDimensionsCount++;
    }

    const src = (img.getAttribute('src') || '').toLowerCase();
    if (src.includes('.webp') || src.includes('.avif') || src.includes('fm=webp') || src.includes('.svg')) {
      modernFormatsCount++;
    }
  });

  const modernFormatsPercent = allImages.length > 0 ? Math.round((modernFormatsCount / allImages.length) * 100) : 100;

  // =========================================================================
  // 6. SOCIAL & OPEN GRAPH CARDS
  // =========================================================================
  const getMeta = (prop, name) => {
    const el = document.querySelector(`meta[property="${prop}"]`) || document.querySelector(`meta[name="${name || prop}"]`);
    return el ? (el.getAttribute('content') || '').trim() : '';
  };

  const ogData = {
    title: getMeta('og:title'),
    description: getMeta('og:description'),
    image: getMeta('og:image'),
    url: getMeta('og:url'),
    siteName: getMeta('og:site_name'),
    type: getMeta('og:type')
  };

  const twitterData = {
    card: getMeta('twitter:card'),
    title: getMeta('twitter:title'),
    description: getMeta('twitter:description'),
    image: getMeta('twitter:image'),
    site: getMeta('twitter:site'),
    creator: getMeta('twitter:creator')
  };

  // =========================================================================
  // 7. AI, AEO & GEO EXCLUSIVE 2026 AUDIT ENGINE
  // =========================================================================
  const questionWords = ['what', 'how', 'why', 'when', 'where', 'who', 'which', 'is', 'can', 'are', 'should', 'kia', 'kaise'];
  let questionHeadingsCount = 0;
  let conciseAnswersCount = 0;
  const directAnswersList = [];

  allHeadings.forEach(h => {
    const text = (h.textContent || h.innerText || '').trim().toLowerCase();
    const isQ = text.includes('?') || questionWords.some(w => text.startsWith(w + ' '));
    if (isQ) {
      questionHeadingsCount++;
      let next = h.nextElementSibling;
      while (next && next.tagName !== 'P' && !next.tagName.startsWith('H')) {
        next = next.nextElementSibling;
      }
      if (next && next.tagName === 'P') {
        const words = (next.textContent || next.innerText || '').trim().split(/\s+/).filter(Boolean).length;
        if (words >= 35 && words <= 65) {
          conciseAnswersCount++;
          if (directAnswersList.length < 5) {
            directAnswersList.push({
              question: (h.textContent || h.innerText || '').trim(),
              answer: (next.textContent || next.innerText || '').trim().slice(0, 160) + '...',
              wordCount: words
            });
          }
        }
      }
    }
  });

  const tables = Array.from(document.querySelectorAll('table'));
  const tablesWithHeaders = tables.filter(t => t.querySelector('th')).length;
  const lists = Array.from(document.querySelectorAll('ol, ul'));
  const headingsWithId = allHeadings.filter(h => h.id || h.getAttribute('id')).length;

  // Numbers & statistics density (AI citability signal)
  const numbersFound = visibleText.match(/\b\d+(\.\d+)?%?|\$\d+/g) || [];
  const statisticsDensity = Math.min(100, Math.round((numbersFound.length / Math.max(1, wordCount)) * 500));

  // =========================================================================
  // 8. 2026 SCORING ALGORITHM (AUTHENTIC WEIGHTED DOM SIGNALS)
  // =========================================================================
  // SEO Score (0-100)
  let seoCalc = 0;
  if (titleLength >= 40 && titleLength <= 65) seoCalc += 25; else if (titleLength > 0) seoCalc += 12;
  if (metaDescLength >= 100 && metaDescLength <= 170) seoCalc += 25; else if (metaDescLength > 0) seoCalc += 12;
  if (canonicalStatus === 'match') seoCalc += 15; else if (canonicalStatus === 'missing') seoCalc += 5;
  if (!isNoIndex) seoCalc += 15;
  if (headingsCount.h1 === 1) seoCalc += 10;
  if (allImages.length === 0 || imagesMissingAltCount === 0) seoCalc += 10; else seoCalc += Math.max(0, 10 - imagesMissingAltCount * 2);
  const seoScore = Math.min(100, Math.max(15, seoCalc));

  // GEO (Generative Engine Optimization) Score (0-100)
  let geoCalc = 0;
  if (schemaTypesDetected.length > 0) geoCalc += 25;
  if (personSchemaFound || orgSchemaFound) geoCalc += 20;
  if (sameAsProfiles.length > 0) geoCalc += 20;
  if (aboutLinkFound && contactLinkFound) geoCalc += 20;
  if (headingsWithId > 0) geoCalc += 15;
  const geoScore = Math.min(100, Math.max(10, geoCalc));

  // AEO (Answer Engine Optimization) Score (0-100)
  let aeoCalc = 0;
  if (questionHeadingsCount > 0) aeoCalc += 30;
  if (conciseAnswersCount > 0) aeoCalc += 35;
  if (faqSchemaFound) aeoCalc += 20;
  if (tablesWithHeaders > 0 || lists.length >= 2) aeoCalc += 15;
  const aeoScore = Math.min(100, Math.max(10, aeoCalc));

  // AI Citation Readiness View
  const aiViewScore = Math.round((geoScore * 0.45) + (aeoScore * 0.35) + (seoScore * 0.2));
  const overallScore = Math.round((seoScore * 0.35) + (geoScore * 0.3) + (aeoScore * 0.25) + (aiViewScore * 0.1));

  return {
    url,
    hostname,
    pathname,
    analyzedAt: new Date().toLocaleTimeString(),
    meta: {
      title: titleText,
      titleLength,
      estimatedPixelWidth,
      description: metaDescText,
      descriptionLength: metaDescLength,
      canonical: canonicalUrl,
      canonicalStatus,
      isCanonicalMatch,
      robots: robotsContent,
      isNoIndex,
      isNoFollow,
      lang,
      charset,
      viewport,
      author
    },
    contentStats: {
      wordCount,
      readingTimeMinutes,
      textToHtmlRatio,
      totalChars: visibleText.length
    },
    headings: {
      counts: headingsCount,
      list: headingsList,
      h1Status,
      hierarchySkips: headingHierarchySkips
    },
    schemas: {
      totalScripts: schemaScripts.length,
      types: Array.from(new Set(schemaTypesDetected)),
      sameAsCount: sameAsProfiles.length,
      sameAsList: sameAsProfiles,
      details: schemaDetails
    },
    links: {
      total: allAnchors.length,
      internal: internalLinksCount,
      external: externalLinksCount,
      nofollow: nofollowCount,
      sponsored: sponsoredCount,
      ugc: ugcCount,
      uniqueDomainsCount: uniqueExternalDomainsCount,
      sampleExternal: sampleExternalLinks,
      hasAbout: aboutLinkFound,
      hasContact: contactLinkFound,
      hasPrivacy: privacyLinkFound
    },
    images: {
      total: allImages.length,
      missingAlt: imagesMissingAltCount,
      missingDimensions: imagesMissingDimensionsCount,
      modernFormatsCount,
      modernFormatsPercent,
      missingAltSample
    },
    social: {
      og: ogData,
      twitter: twitterData
    },
    aiEngine: {
      questionHeadings: questionHeadingsCount,
      conciseAnswersCount,
      directAnswers: directAnswersList,
      tablesTotal: tables.length,
      tablesWithHeaders,
      listsCount: lists.length,
      headingsWithId,
      statisticsDensity,
      faqSchemaFound
    },
    scores: {
      seo: seoScore,
      geo: geoScore,
      aeo: aeoScore,
      aiView: aiViewScore,
      overall: overallScore
    }
  };
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'ANALYZE_PAGE') {
    try {
      const data = runWmComprehensiveAnalysis();
      sendResponse({ success: true, data });
    } catch (err) {
      sendResponse({ success: false, error: err.message });
    }
  }
  return true;
});
