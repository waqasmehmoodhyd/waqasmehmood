// Waqas Mehmood - GS Location Changer & Local 3-Pack Inspector
// Real-time On-SERP Local Business Extraction with Exact Phone & Website

function extractGoogleLocalPack() {
  const queryParam = new URLSearchParams(window.location.search).get('q') || '';
  const searchInput = document.querySelector('textarea[name="q"]') || document.querySelector('input[name="q"]');
  const currentQuery = queryParam || (searchInput ? searchInput.value : '');

  // Extract footer location indicated by Google
  const footerLocEl = document.querySelector('.Q8LRLc') || document.querySelector('#footcnt .fbar');
  const googleDetectedLocation = footerLocEl ? footerLocEl.textContent.trim().replace(/\s+/g, ' ') : 'Default Location';

  // Extract Local 3-Pack Competitors
  const packItems = [];
  // Selectors covering modern Google Desktop & Tablet SERP 3-Pack cards
  const cardElements = Array.from(document.querySelectorAll('.VkpGBb, [data-cid], .rllt__details, [jscontroller*="b00Xvc"]'));

  const seenNames = new Set();

  cardElements.forEach((card) => {
    if (packItems.length >= 7) return;

    // 1. Title / Business Name (Strip Ad disclosures like 'My Ad Centre', 'Sponsored', etc.)
    const titleEl = card.querySelector('[role="heading"]') || card.querySelector('.OSrXXb') || card.querySelector('.dbg0pd') || card.querySelector('div[aria-level="3"]');
    let name = titleEl ? titleEl.textContent.trim() : '';
    if (!name) return;

    name = name.replace(/\b(?:My Ad Centre|Sponsored|Ad\s*·?)\b/gi, '').trim();
    name = name.replace(/^[\s·•\-]+|[\s·•\-]+$/g, '').trim();
    if (!name || seenNames.has(name.toLowerCase())) return;
    seenNames.add(name.toLowerCase());

    // 2. Snippet & Details container
    const detailsContainer = card.querySelector('.rllt__details') || card;
    const detailsText = detailsContainer ? detailsContainer.textContent.replace(/\s+/g, ' ').trim() : '';

    // 3. Exact Numeric Rating (e.g. 4.9, 5.0)
    let rating = '';
    const ratingEl = card.querySelector('.yi40Hd, .YDINpm, .YrbPuc, [aria-label*="star" i], [aria-label*="rated" i]');
    if (ratingEl) {
      const aria = ratingEl.getAttribute('aria-label') || '';
      const m = aria.match(/([1-5]\.[0-9])/);
      if (m) {
        rating = m[1];
      } else if (/^[1-5]\.[0-9]$/.test(ratingEl.textContent.trim())) {
        rating = ratingEl.textContent.trim();
      }
    }
    if (!rating) {
      const textMatch = detailsText.match(/\b([1-5]\.[0-9])\s*(?:★|\(|\b)/);
      if (textMatch) {
        rating = textMatch[1];
      }
    }
    if (!rating) rating = '5.0';

    // 4. Exact Total Review Count
    const reviewsEl = card.querySelector('.RDApEe') || card.querySelector('span[aria-label*="review" i]');
    let reviews = reviewsEl ? reviewsEl.textContent.trim().replace(/[()]/g, '') : '';
    if (!reviews) {
      const revMatch = detailsText.match(/\(([\d,]+)\)/);
      reviews = revMatch ? revMatch[1] : '0';
    }

    // 5. Exact Phone Number Extraction (US, UK, International, Local)
    let phone = 'Not Listed';
    const telLink = card.querySelector('a[href^="tel:"]');
    if (telLink) {
      phone = telLink.getAttribute('href').replace(/^tel:/i, '').trim();
    } else {
      // Regex matching phone formats like (xxx) xxx-xxxx, +1-xxx-xxx-xxxx, 020 xxxx xxxx, etc.
      const phoneRegex = /(?:\+?\d{1,3}[\s.-]?)?\(?\d{2,4}\)?[\s.-]?\d{3,4}[\s.-]?\d{3,5}/g;
      const matches = detailsText.match(phoneRegex);
      if (matches) {
        for (const m of matches) {
          const digitsOnly = m.replace(/\D/g, '');
          if (digitsOnly.length >= 7 && digitsOnly.length <= 15) {
            phone = m.trim();
            break;
          }
        }
      }
    }

    // 6. Exact Website URL Extraction
    let websiteUrl = 'Not Listed';
    const websiteLink = card.querySelector('a[data-website-url]') ||
                        card.querySelector('a[aria-label*="Website" i]') ||
                        card.querySelector('a.yYJqh') ||
                        card.querySelector('a[href^="http"]:not([href*="google."])');
    if (websiteLink) {
      let href = websiteLink.getAttribute('data-website-url') || websiteLink.getAttribute('href') || '';
      if (href.includes('/url?q=')) {
        try {
          const parsed = new URL(href, window.location.origin);
          href = parsed.searchParams.get('q') || href;
        } catch (e) {}
      }
      if (href.startsWith('http')) {
        websiteUrl = href;
      }
    }

    // 7. Clean Category Extraction
    let category = 'Local Business';
    const segments = detailsText.split(/[·•\n\r|]/).map(s => s.trim()).filter(Boolean);
    for (const seg of segments) {
      if (/\b[1-5]\.[0-9]\b/.test(seg)) continue;
      if (/\b(?:reviews?|stars?)\b/i.test(seg)) continue;
      if (/\b(?:open|closed|24 hours|opens|closes)\b/i.test(seg)) continue;
      if (/\d{3,}/.test(seg)) continue;
      if (/my ad centre|sponsored/i.test(seg)) continue;
      if (seg.toLowerCase() === name.toLowerCase()) continue;
      if (seg.length >= 3 && seg.length <= 40) {
        category = seg;
        break;
      }
    }

    packItems.push({
      rank: packItems.length + 1,
      name,
      rating: `${rating} ★`,
      ratingRaw: rating,
      reviews,
      category,
      phone,
      hasPhone: phone !== 'Not Listed',
      websiteUrl,
      hasWebsite: websiteUrl !== 'Not Listed',
      rawSnippet: detailsText.slice(0, 160)
    });
  });

  return {
    isGoogleSearch: true,
    currentQuery,
    googleDetectedLocation,
    currentUrl: window.location.href,
    packFound: packItems.length > 0,
    packCount: packItems.length,
    competitors: packItems
  };
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'GET_SERP_PACK') {
    try {
      const data = extractGoogleLocalPack();
      sendResponse({ success: true, data });
    } catch (e) {
      sendResponse({ success: false, error: e.message });
    }
  }
  return true;
});
