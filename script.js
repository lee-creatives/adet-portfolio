// Navigation & Mobile Menu
const menuButton = document.querySelector('.menu-toggle');
const menu = document.querySelector('#main-nav');
const navLinks = document.querySelectorAll('.nav-link');

menuButton?.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!open));
  menu?.classList.toggle('is-open', !open);
});

menu?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    menu?.classList.remove('is-open');
    menuButton?.setAttribute('aria-expanded', 'false');
  });
});

// Active Navigation State via IntersectionObserver
const observedSections = document.querySelectorAll('section[id], header[id]');
if ('IntersectionObserver' in window) {
  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const currentId = entry.target.getAttribute('id');
          navLinks.forEach((link) => {
            const href = link.getAttribute('href');
            if (href === `#${currentId}`) {
              link.classList.add('is-active');
            } else {
              link.classList.remove('is-active');
            }
          });
        }
      });
    },
    { threshold: 0.25, rootMargin: '-10% 0px -40% 0px' }
  );

  observedSections.forEach((sec) => navObserver.observe(sec));
}

// Scroll Reveals
const revealItems = document.querySelectorAll('.reveal, .reveal-group');
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -6% 0px' }
  );
  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}

// Interactive Project Lightbox Gallery
const projectGalleries = {
  campusvoice: [
    {
      src: 'assets/campusvoice-preview.png',
      title: 'CampusVoice — Survey & Feedback Administration Dashboard',
      category: 'Education Technology / Web Application',
      desc: 'Centralized administrator overview showing live student response aggregation, feedback categorization, and survey completion analytics.'
    }
  ],
  patag: [
    {
      src: 'assets/patag-mobile-locate.png',
      title: 'PATAG — Citizen GPS Hazard Reporting Interface',
      category: 'Civic Technology / Flutter Mobile App',
      desc: 'Citizen-facing mobile screen featuring automatic GPS coordinate capture, road damage photo submission, and severity tagging.'
    },
    {
      src: 'assets/patag-mobile-inspect.png',
      title: 'PATAG — Road Incident Inspection & Verification',
      category: 'Civic Technology / Flutter Mobile App',
      desc: 'Field verification view enabling road inspectors to review report photos, examine road classifications, and log repair progress.'
    },
    {
      src: 'assets/patag-preview.png',
      title: 'PATAG — Municipal Engineering Dispatch Portal',
      category: 'Civic Technology / Web Administration',
      desc: 'Web dashboard for LGU engineering personnel to review verified road damage reports, assign maintenance crews, and monitor repair status.'
    }
  ],
  pananim: [
    {
      src: 'assets/pananim-preview.png',
      title: 'Pananim — Agricultural Supply Chain & Trading Dashboard',
      category: 'Agricultural Technology / Web Platform',
      desc: 'Real-time overview of wholesale crop trading, current farm-gate market prices, and regional cargo freight coordination.'
    }
  ]
};

const lightboxModal = document.getElementById('lightbox-modal');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxTitle = document.getElementById('lightbox-title');
const lightboxCategory = document.getElementById('lightbox-category');
const lightboxDesc = document.getElementById('lightbox-desc');
const lightboxCounter = document.getElementById('lightbox-counter');
const lightboxPrev = document.getElementById('lightbox-prev');
const lightboxNext = document.getElementById('lightbox-next');
const lightboxNav = document.getElementById('lightbox-nav');

let activeProjectKey = null;
let activeScreenIndex = 0;
let lastFocusedElement = null;

function renderLightboxScreen() {
  if (!activeProjectKey || !projectGalleries[activeProjectKey]) return;
  const screens = projectGalleries[activeProjectKey];
  const item = screens[activeScreenIndex];

  if (!item || !lightboxImg || !lightboxTitle || !lightboxCategory || !lightboxDesc) return;

  lightboxImg.src = item.src;
  lightboxImg.alt = item.title;
  lightboxTitle.textContent = item.title;
  lightboxCategory.textContent = item.category;
  lightboxDesc.textContent = item.desc;

  if (lightboxCounter) {
    lightboxCounter.textContent = `${activeScreenIndex + 1} / ${screens.length}`;
  }

  if (lightboxNav) {
    lightboxNav.style.display = screens.length > 1 ? 'flex' : 'none';
  }
}

function openLightbox(projectKey) {
  if (!projectGalleries[projectKey]) return;
  lastFocusedElement = document.activeElement;
  activeProjectKey = projectKey;
  activeScreenIndex = 0;
  renderLightboxScreen();

  lightboxModal?.classList.add('is-open');
  lightboxModal?.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';

  const closeBtn = lightboxModal?.querySelector('.lightbox-close-btn');
  closeBtn?.focus();
}

function closeLightbox() {
  lightboxModal?.classList.remove('is-open');
  lightboxModal?.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
    lastFocusedElement.focus();
  }
}

// Lightbox Trigger Event Listeners
document.querySelectorAll('[data-lightbox]').forEach((trigger) => {
  const handler = (e) => {
    // If it's an anchor or button inside that was clicked directly (other than inspect), let default happen
    if (e.target.closest('a') && !e.target.closest('.btn-inspect')) return;
    const key = trigger.getAttribute('data-lightbox');
    if (key) {
      e.preventDefault();
      openLightbox(key);
    }
  };

  trigger.addEventListener('click', handler);
  trigger.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const key = trigger.getAttribute('data-lightbox');
      if (key) openLightbox(key);
    }
  });
});

// Close triggers
document.querySelectorAll('[data-close-lightbox]').forEach((btn) => {
  btn.addEventListener('click', closeLightbox);
});

// Lightbox Navigation
lightboxPrev?.addEventListener('click', () => {
  if (!activeProjectKey) return;
  const count = projectGalleries[activeProjectKey].length;
  activeScreenIndex = (activeScreenIndex - 1 + count) % count;
  renderLightboxScreen();
});

lightboxNext?.addEventListener('click', () => {
  if (!activeProjectKey) return;
  const count = projectGalleries[activeProjectKey].length;
  activeScreenIndex = (activeScreenIndex + 1) % count;
  renderLightboxScreen();
});

// Keyboard controls (Escape, ArrowLeft, ArrowRight)
document.addEventListener('keydown', (e) => {
  if (!lightboxModal?.classList.contains('is-open')) return;

  if (e.key === 'Escape') {
    closeLightbox();
  } else if (e.key === 'ArrowLeft') {
    lightboxPrev?.click();
  } else if (e.key === 'ArrowRight') {
    lightboxNext?.click();
  }
});
