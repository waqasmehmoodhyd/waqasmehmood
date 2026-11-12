// Waqas Mehmood - Detailed SEO & AI Citability Engine Landing Page Controller

document.addEventListener('DOMContentLoaded', () => {

  // 1. HERO INTERACTIVE MOCKUP TAB SWITCHER
  const mockTabButtons = document.querySelectorAll('.mock-tab-btn');
  const mockPanes = document.querySelectorAll('.mock-pane');

  mockTabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      mockTabButtons.forEach(b => b.classList.remove('active'));
      mockPanes.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetId = btn.getAttribute('data-mock-tab');
      const targetPane = document.getElementById(`mock-${targetId}`);
      if (targetPane) {
        targetPane.classList.add('active');
      }
    });
  });

  // 2. FAQ ACCORDION TOGGLE
  const accordionItems = document.querySelectorAll('.accordion-item');

  accordionItems.forEach(item => {
    const trigger = item.querySelector('.accordion-trigger');
    trigger.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all others
      accordionItems.forEach(i => i.classList.remove('active'));

      // If it wasn't active, open it
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  // 3. REVIEWS MODAL & INTERACTIVE SUBMISSION
  const reviewModal = document.getElementById('review-modal');
  const btnOpenModal = document.getElementById('btn-open-review-modal');
  const btnCloseModal = document.getElementById('btn-close-modal');
  const formSubmitReview = document.getElementById('form-submit-review');
  const starPicks = document.querySelectorAll('.star-pick');
  const inputStarVal = document.getElementById('input-star-val');
  const reviewsContainer = document.getElementById('reviews-container');

  if (btnOpenModal && reviewModal) {
    btnOpenModal.addEventListener('click', () => {
      reviewModal.classList.add('open');
    });
  }

  if (btnCloseModal && reviewModal) {
    btnCloseModal.addEventListener('click', () => {
      reviewModal.classList.remove('open');
    });
  }

  // Click outside modal dialog to close
  window.addEventListener('click', (e) => {
    if (e.target === reviewModal) {
      reviewModal.classList.remove('open');
    }
  });

  // Star Rating Selector
  starPicks.forEach(star => {
    star.addEventListener('click', () => {
      const selectedRating = parseInt(star.getAttribute('data-rating'), 10);
      inputStarVal.value = selectedRating;

      starPicks.forEach(s => {
        const r = parseInt(s.getAttribute('data-rating'), 10);
        if (r <= selectedRating) {
          s.classList.add('active');
        } else {
          s.classList.remove('active');
        }
      });
    });
  });

  // Form Submission
  if (formSubmitReview) {
    formSubmitReview.addEventListener('submit', (e) => {
      e.preventDefault();

      const rating = parseInt(inputStarVal.value, 10) || 5;
      const name = document.getElementById('input-reviewer-name').value.trim();
      const role = document.getElementById('input-reviewer-role').value.trim();
      const comment = document.getElementById('input-reviewer-comment').value.trim();

      if (!name || !role || !comment) return;

      const starString = '★'.repeat(rating) + '☆'.repeat(5 - rating);
      const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'WM';

      // Create new review card
      const newCard = document.createElement('div');
      newCard.className = 'review-card';
      newCard.style.animation = 'fadeIn 0.4s ease';
      newCard.innerHTML = `
        <div class="review-head">
          <div class="reviewer-avatar" style="background:#2563eb;">${escapeHtml(initials)}</div>
          <div>
            <div class="reviewer-name">${escapeHtml(name)}</div>
            <div class="reviewer-role">${escapeHtml(role)}</div>
          </div>
        </div>
        <div class="review-stars">${starString}</div>
        <p class="review-comment">"${escapeHtml(comment)}"</p>
        <span class="review-date">Verified User &bull; Just now</span>
      `;

      // Prepend to reviews list
      reviewsContainer.insertBefore(newCard, reviewsContainer.firstChild);

      // Save to localStorage
      try {
        const saved = JSON.parse(localStorage.getItem('wm_user_reviews') || '[]');
        saved.unshift({ name, role, comment, rating, date: new Date().toISOString() });
        localStorage.setItem('wm_user_reviews', JSON.stringify(saved));
      } catch (err) {}

      // Reset form and close modal
      formSubmitReview.reset();
      inputStarVal.value = '5';
      starPicks.forEach(s => s.classList.add('active'));
      reviewModal.classList.remove('open');

      alert('Thank you for your review! It has been posted successfully.');
    });
  }

  // Load any previously saved user reviews from localStorage
  try {
    const saved = JSON.parse(localStorage.getItem('wm_user_reviews') || '[]');
    saved.forEach(item => {
      const starString = '★'.repeat(item.rating || 5) + '☆'.repeat(5 - (item.rating || 5));
      const initials = (item.name || '').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'WM';
      const card = document.createElement('div');
      card.className = 'review-card';
      card.innerHTML = `
        <div class="review-head">
          <div class="reviewer-avatar" style="background:#2563eb;">${escapeHtml(initials)}</div>
          <div>
            <div class="reviewer-name">${escapeHtml(item.name)}</div>
            <div class="reviewer-role">${escapeHtml(item.role)}</div>
          </div>
        </div>
        <div class="review-stars">${starString}</div>
        <p class="review-comment">"${escapeHtml(item.comment)}"</p>
        <span class="review-date">Verified User &bull; Recently added</span>
      `;
      reviewsContainer.insertBefore(card, reviewsContainer.firstChild);
    });
  } catch (err) {}

  // 4. VIDEO PLAY BUTTON INTERACTION (Smart YouTube Embedder)
  const btnPlayVideo = document.getElementById('btn-play-video');
  const videoWrap = document.getElementById('video-wrap');

  function extractYouTubeId(urlOrId) {
    if (!urlOrId) return '';
    const clean = urlOrId.trim();
    if (/^[a-zA-Z0-9_-]{11}$/.test(clean)) return clean;
    const match = clean.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : '';
  }

  function playEmbedVideo(videoId) {
    if (!videoWrap || !videoId) return;
    videoWrap.innerHTML = `
      <iframe 
        width="100%" 
        height="100%" 
        src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1" 
        title="Detailed SEO & AI Engine Chrome Extension Demo" 
        frameborder="0" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
        referrerpolicy="strict-origin-when-cross-origin" 
        allowfullscreen
        style="width:100%; height:100%; border:0; display:block;">
      </iframe>
    `;
  }

  if (videoWrap) {
    // Check if a video ID is passed in data-youtube-id or URL hash/query
    const preconfiguredId = videoWrap.getAttribute('data-youtube-id') || videoWrap.getAttribute('data-youtube-url') || '';
    const parsedId = extractYouTubeId(preconfiguredId);

    if (btnPlayVideo) {
      btnPlayVideo.addEventListener('click', (e) => {
        e.stopPropagation();
        if (parsedId) {
          playEmbedVideo(parsedId);
        } else {
          // If no video ID configured yet, prompt or show interactive modal to paste it
          const userUrl = prompt('Enter your YouTube Video URL or Video ID (e.g. https://youtu.be/XYZ or XYZ):');
          if (userUrl) {
            const extracted = extractYouTubeId(userUrl);
            if (extracted) {
              videoWrap.setAttribute('data-youtube-id', extracted);
              playEmbedVideo(extracted);
            } else {
              alert('Please enter a valid YouTube video URL or 11-character video ID.');
            }
          }
        }
      });
    }

    videoWrap.addEventListener('click', () => {
      if (parsedId && !videoWrap.querySelector('iframe')) {
        playEmbedVideo(parsedId);
      }
    });
  }

  function escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
});
