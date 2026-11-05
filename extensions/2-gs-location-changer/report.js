// Waqas Mehmood - Local 3-Pack PDF Report Controller

document.addEventListener('DOMContentLoaded', () => {
  const lblQuery = document.getElementById('lbl-query');
  const lblGeo = document.getElementById('lbl-geo');
  const lblTimestamp = document.getElementById('lbl-timestamp');
  const lblCount = document.getElementById('lbl-competitors-count');
  const tbody = document.getElementById('table-rows-container');
  const btnPrint = document.getElementById('btn-print-trigger');

  if (btnPrint) {
    btnPrint.addEventListener('click', () => {
      window.print();
    });
  }

  // Load report data from chrome storage
  chrome.storage.local.get(['wm_latest_report'], (result) => {
    const data = result.wm_latest_report;

    if (!data || !data.competitors || data.competitors.length === 0) {
      lblQuery.textContent = 'No active search detected';
      lblGeo.textContent = 'Not specified';
      lblTimestamp.textContent = new Date().toLocaleString();
      tbody.innerHTML = `
        <tr>
          <td colspan="5" style="text-align:center; padding:40px; color:#ef4444; font-weight:600;">
            No competitor data was found. Please open Google search, run a local search query (e.g. "plumber in london"), and click "PDF Report" from the extension popup.
          </td>
        </tr>
      `;
      return;
    }

    lblQuery.textContent = `"${data.currentQuery || 'Local Search'}"`;
    lblGeo.textContent = data.googleDetectedLocation || 'Detected Location';
    lblCount.textContent = `${data.competitors.length} Ranking Businesses`;
    lblTimestamp.textContent = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    tbody.innerHTML = '';

    data.competitors.forEach((c) => {
      const tr = document.createElement('tr');
      const cleanRating = (c.rating || '').replace(/[^0-9.]/g, '') || '5.0';
      const cleanReviews = (c.reviews || '').replace(/[^0-9]/g, '') || '0';
      const phone = c.phone || 'Not Listed';
      const web = c.websiteUrl || 'Not Listed';

      const phoneCell = phone !== 'Not Listed'
        ? `<a href="tel:${escapeHtml(phone)}" class="phone-text" style="text-decoration:none;">📞 ${escapeHtml(phone)}</a>`
        : `<span class="not-listed">Not Listed</span>`;

      const webCell = web !== 'Not Listed'
        ? `<a href="${escapeHtml(web)}" target="_blank" class="web-link">${escapeHtml(web.replace(/^https?:\/\/(www\.)?/, '').slice(0, 36))}</a>`
        : `<span class="not-listed">No Website Attached</span>`;

      tr.innerHTML = `
        <td style="text-align:center;"><span class="rank-pill">#${c.rank}</span></td>
        <td>
          <div class="biz-name">${escapeHtml(c.name)}</div>
          <div class="biz-cat">${escapeHtml(c.category || 'Local Business')}</div>
        </td>
        <td>
          <div class="star-score">★ ${cleanRating}</div>
          <div class="reviews-count">(${cleanReviews} reviews)</div>
        </td>
        <td>${phoneCell}</td>
        <td>${webCell}</td>
      `;
      tbody.appendChild(tr);
    });

    // Auto-trigger print dialog after small rendering buffer
    setTimeout(() => {
      window.print();
    }, 400);
  });

  function escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
});
