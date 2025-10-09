// Mobile nav toggle + accessible attributes
document.addEventListener('DOMContentLoaded', function () {
  const navToggle = document.getElementById('navToggle');
  const primaryNav = document.getElementById('primary-nav');

  navToggle.addEventListener('click', function () {
    const expanded = this.getAttribute('aria-expanded') === 'true';
    this.setAttribute('aria-expanded', String(!expanded));
    if (!expanded) {
      primaryNav.style.display = 'flex';
      primaryNav.setAttribute('data-open', 'true');
    } else {
      primaryNav.style.display = '';
      primaryNav.removeAttribute('data-open');
    }
  });

  // Close mobile nav when a link is clicked (helpful on small screens)
  primaryNav.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 900) {
        navToggle.setAttribute('aria-expanded', 'false');
        primaryNav.style.display = '';
      }
    });
  });

  // Keyboard support for gallery images: open on Enter key
  document.querySelectorAll('.gallery-card img').forEach(img => {
    img.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(img);
      }
    });
  });

  // Lightbox close button
  const lightboxClose = document.getElementById('lightboxClose');
  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  // Close lightbox with ESC key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeLightbox();
    }
  });
});

  // -------------------------
  // Scroll reveal and counters
  // -------------------------
  function onScrollReveal() {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const reveals = document.querySelectorAll('.reveal');
    const windowH = window.innerHeight;

    reveals.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top <= windowH - 100) {
        el.classList.add('visible');
      }
    });
  }

  function animateCounters() {
    const counters = document.querySelectorAll('[data-counter]');
    counters.forEach(el => {
      if (el.dataset.animated) return;
      const rect = el.getBoundingClientRect();
      if (rect.top <= window.innerHeight - 80) {
        const target = parseInt(el.getAttribute('data-counter'), 10) || 0;
        const duration = 1600;
        const start = performance.now();
        el.dataset.animated = 'true';

        function step(ts) {
          const progress = Math.min((ts - start) / duration, 1);
          el.textContent = Math.floor(progress * target);
          if (progress < 1) requestAnimationFrame(step);
          else el.textContent = target;
        }
        requestAnimationFrame(step);
      }
    });
  }

  window.addEventListener('scroll', function () {
    onScrollReveal();
    animateCounters();
  });

  // Run once on load
  document.addEventListener('DOMContentLoaded', function () {
    onScrollReveal();
    animateCounters();
  });

// Open Lightbox
function openLightbox(img) {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  if (!lightbox || !lightboxImg) return;
  lightboxImg.src = img.src;
  lightbox.classList.add('active');
  lightbox.setAttribute('aria-hidden', 'false');

  // prevent body scroll while open
  document.body.style.overflow = 'hidden';

  // stop click on image from closing
  lightboxImg.addEventListener('click', function (e) {
    e.stopPropagation();
  }, { once: true });

  // close if clicking outside the image (on overlay)
  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) {
      closeLightbox();
    }
  }, { once: true });
}

// Close Lightbox
function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return;
  lightbox.classList.remove('active');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  const lightboxImg = document.getElementById('lightbox-img');
  if (lightboxImg) lightboxImg.src = '';
}

// Contact Form Submission (opens user's mail client with prefilled email)
document.getElementById('contactForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();

  const subject = encodeURIComponent("New inquiry from " + (name || 'Website visitor'));
  const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);

  // Use the business email for receiving messages
  window.location.href = `mailto:saishanker220@gmail.com?subject=${subject}&body=${body}`;
});
