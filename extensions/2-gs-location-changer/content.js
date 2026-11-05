// Waqas Mehmood - GS Location Changer & Local 3-Pack Inspector
// Real-time On-SERP Local Business Extraction

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

  cardElements.forEach((card, idx) => {
    if (packItems.length >= 5) return;

    // Title / Business Name
    const titleEl = card.querySelector('[role="heading"]') || card.querySelector('.OSrXXb') || card.querySelector('.dbg0pd') || card.querySelector('div[aria-level="3"]');
    const name = titleEl ? titleEl.textContent.trim() : '';

    if (!name || seenNames.has(name.toLowerCase())) return;
    seenNames.add(name.toLowerCase());

    // Rating & Reviews
    const ratingEl = card.querySelector('.YDINpm') || card.querySelector('span[aria-label*="stars"]') || card.querySelector('span[aria-label*="star"]');
    const rating = ratingEl ? (ratingEl.getAttribute('aria-label') || ratingEl.textContent).trim() : 'No Rating';

    const reviewsEl = card.querySelector('.RDApEe') || card.querySelector('span[aria-label*="review"]');
    const reviews = reviewsEl ? reviewsEl.textContent.trim().replace(/[()]/g, '') : '0';

    // Category & Details snippet
    const detailsContainer = card.querySelector('.rllt__details') || card;
    const detailsText = detailsContainer ? detailsContainer.textContent.replace(/\s+/g, ' ').trim() : '';
    
    // Primary Category guess (first segment before "·" or "·")
    let category = 'Local Business';
    const splitParts = detailsText.split(/·|•/);
    if (splitParts.length > 0) {
      const candidate = splitParts[0].replace(name, '').replace(/[0-9.]/g, '').trim();
      if (candidate.length > 2 && candidate.length < 40) {
        category = candidate;
      }
    }

    // Website Link
    const websiteLink = card.querySelector('a[href^="http"]:not([href*="google.com"])') || card.querySelector('a[aria-label*="Website"]');
    const hasWebsite = !!websiteLink;
    const websiteUrl = websiteLink ? websiteLink.getAttribute('href') : '';

    // Phone / Directions
    const hasPhone = /[\(\+]?[0-9]{3}[\)\s\-]?[0-9]{3}[\-\s]?[0-9]{4}/.test(detailsText);

    packItems.push({
      rank: packItems.length + 1,
      name,
      rating,
      reviews,
      category,
      hasWebsite,
      websiteUrl,
      hasPhone,
      rawSnippet: detailsText.slice(0, 150)
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
