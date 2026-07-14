/* ==========================================
   STACKLY TOURS — main.js
   Core: Loader, Nav, Scroll Anims, GSAP,
   Toast, Accordion, Hero Carousel,
   Why STACKLY Sticky Scroll
   ========================================== */

/* ---------- Page Loader ---------- */
document.addEventListener('DOMContentLoaded', () => {
  const loader = document.getElementById('page-loader');
  if (loader) {
    setTimeout(() => {
      loader.classList.add('hidden');
      setTimeout(() => { loader.style.display = 'none'; }, 1000);
    }, 1800);
  }
});

/* ---------- Navbar ---------- */
document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    let lastScrollY = window.scrollY;
    window.addEventListener('scroll', () => {
      const currentScrollY = window.scrollY;
      navbar.classList.toggle('scrolled', currentScrollY > 50);
      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        navbar.classList.add('nav-hidden');
      } else {
        navbar.classList.remove('nav-hidden');
      }
      lastScrollY = currentScrollY;
    }, { passive: true });
  }

  const hamburger = document.querySelector('.nav-hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }
});

/* ---------- Scroll Animations ---------- */
document.addEventListener('DOMContentLoaded', () => {
  const animEls = document.querySelectorAll('[data-anim]');
  if (!animEls.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.dataset.delay) || 0;
        setTimeout(() => { entry.target.classList.add('visible'); }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  animEls.forEach(el => observer.observe(el));
});

/* ---------- Counter Animation ---------- */
function animateCounters() {
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = el.dataset.count;
    const hasDecimal = target.includes('.');
    const numericTarget = parseFloat(target.replace(/[^0-9.]/g, ''));
    const suffix = target.replace(/[0-9.]/g, '');
    const duration = 2000;
    const startTime = performance.now();
    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = numericTarget * easeOut;
      el.textContent = hasDecimal ? current.toFixed(1) + suffix : Math.floor(current).toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  });
}

/* ---------- Toast System ---------- */
window.showToast = function(message, type = 'info', duration = 4000) {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const icons = {
    success: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
    error: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`,
    info: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`,
    warning: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`
  };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${icons[type] || ''}</span> ${message}`;
  container.appendChild(toast);
  setTimeout(() => { toast.classList.add('hide'); setTimeout(() => toast.remove(), 400); }, duration);
};

/* ---------- Smooth Scroll ---------- */
document.addEventListener('click', (e) => {
  const anchor = e.target.closest('a[href^="#"]');
  if (anchor) {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  }
});

/* ---------- Ripple Effect ---------- */
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.btn');
  if (!btn) return;
  const ripple = document.createElement('span');
  const rect = btn.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  ripple.style.cssText = `position:absolute;width:${size}px;height:${size}px;border-radius:50%;background:rgba(255,255,255,0.2);transform:scale(0);animation:ripple 0.6s ease-out forwards;left:${e.clientX - rect.left - size/2}px;top:${e.clientY - rect.top - size/2}px;pointer-events:none;`;
  if (!document.querySelector('#ripple-style')) {
    const style = document.createElement('style');
    style.id = 'ripple-style';
    style.textContent = '@keyframes ripple { to { transform: scale(2); opacity: 0; } }';
    document.head.appendChild(style);
  }
  btn.style.position = 'relative';
  btn.style.overflow = 'hidden';
  btn.appendChild(ripple);
  setTimeout(() => ripple.remove(), 600);
});

/* ---------- Active Nav Link ---------- */
document.addEventListener('DOMContentLoaded', () => {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    if (link.getAttribute('href') === currentPage) link.classList.add('active');
  });
});

/* ---------- FAQ Accordion ---------- */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.faq-item').forEach(item => {
    item.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
      if (!isActive) item.classList.add('active');
    });
  });
});

/* ---------- Hero Carousel ---------- */
document.addEventListener('DOMContentLoaded', () => {
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-dot');
  if (!slides.length) return;

  let current = 0;
  let interval;

  function goToSlide(index) {
    slides.forEach(s => s.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));
    current = index;
    slides[current].classList.add('active');
    if (dots[current]) dots[current].classList.add('active');
  }

  function nextSlide() {
    goToSlide((current + 1) % slides.length);
  }

  function startAutoplay() {
    interval = setInterval(nextSlide, 4000);
  }

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      clearInterval(interval);
      goToSlide(i);
      startAutoplay();
    });
  });

  const hero = document.querySelector('.hero');
  if (hero) {
    hero.addEventListener('mouseenter', () => clearInterval(interval));
    hero.addEventListener('mouseleave', startAutoplay);
  }

  goToSlide(0);
  startAutoplay();
});

/* ---------- GSAP Text Reveal ---------- */
document.addEventListener('DOMContentLoaded', () => {
  const revealElements = document.querySelectorAll('h1, h2, .section-title, .hero-title, .gsap-reveal');

  revealElements.forEach(el => {
    function wrapWords(node) {
      if (node.nodeType === 3) {
        const words = node.nodeValue.split(/(\s+)/);
        const fragment = document.createDocumentFragment();
        words.forEach(word => {
          if (word.trim() !== '') {
            const wrapper = document.createElement('span');
            wrapper.className = 'word-wrapper';
            const anim = document.createElement('span');
            anim.className = 'word-anim';
            let p = node.parentNode;
            while (p && p !== el) {
              if (p.classList && (p.classList.contains('teal-text') || p.classList.contains('was-teal'))) {
                p.classList.remove('teal-text'); p.classList.add('was-teal');
                anim.style.color = 'var(--primary)';
                anim.style.webkitTextFillColor = 'var(--primary)';
              }
              if (p.classList && (p.classList.contains('accent-text') || p.classList.contains('was-accent'))) {
                p.classList.remove('accent-text'); p.classList.add('was-accent');
                anim.style.color = 'var(--accent)';
                anim.style.webkitTextFillColor = 'var(--accent)';
              }
              p = p.parentNode;
            }
            anim.textContent = word;
            wrapper.appendChild(anim);
            fragment.appendChild(wrapper);
          } else {
            fragment.appendChild(document.createTextNode(word));
          }
        });
        node.replaceWith(fragment);
      } else if (node.nodeType === 1) {
        if (node.tagName !== 'BR' && node.tagName !== 'SVG' && !node.classList.contains('word-wrapper') && !node.classList.contains('icon-inline') && !node.classList.contains('arrow-inline')) {
          Array.from(node.childNodes).forEach(wrapWords);
        }
      }
    }
    Array.from(el.childNodes).forEach(wrapWords);
  });

  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    revealElements.forEach(el => {
      const words = el.querySelectorAll('.word-anim');
      gsap.set(words, { opacity: 1, y: 0, transform: 'none' });
      gsap.from(words, {
        y: 40, opacity: 0, duration: 0.8, stagger: 0.04, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' }
      });
    });
  } else {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('.word-anim').forEach((word, idx) => {
            setTimeout(() => { word.classList.add('visible'); }, idx * 40);
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    revealElements.forEach(el => observer.observe(el));
  }
});

/* ---------- Text Generate (Paragraphs) ---------- */
document.addEventListener('DOMContentLoaded', () => {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  const textGenElements = document.querySelectorAll('.hero-desc, .section-desc');
  textGenElements.forEach(el => {
    const text = el.innerText;
    el.innerHTML = '';
    const words = text.split(' ');
    words.forEach((word, wordIndex) => {
      const wordSpan = document.createElement('span');
      wordSpan.style.display = 'inline-block';
      wordSpan.style.whiteSpace = 'nowrap';
      word.split('').forEach(char => {
        const charSpan = document.createElement('span');
        charSpan.textContent = char;
        charSpan.style.opacity = '0';
        charSpan.style.display = 'inline-block';
        charSpan.className = 'text-gen-char';
        wordSpan.appendChild(charSpan);
      });
      el.appendChild(wordSpan);
      if (wordIndex < words.length - 1) {
        const spaceSpan = document.createElement('span');
        spaceSpan.innerHTML = '&nbsp;';
        el.appendChild(spaceSpan);
      }
    });
    gsap.to(el.querySelectorAll('.text-gen-char'), {
      opacity: 1, duration: 0.1, stagger: 0.015, ease: 'none',
      scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none none' }
    });
  });
});

/* ---------- Why STACKLY — Sticky Scroll Cards ---------- */
document.addEventListener('DOMContentLoaded', () => {
  const whySection = document.querySelector('.why-section');
  const whySticky = document.querySelector('.why-sticky');
  const whyCards = document.querySelectorAll('.why-card');
  const progressDots = document.querySelectorAll('.why-progress-dot');
  const progressContainer = document.querySelector('.why-progress');

  if (!whySection || !whySticky || whyCards.length === 0) return;
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  const numCards = whyCards.length;

  let mm = gsap.matchMedia();

  mm.add("(min-width: 768px)", () => {
    // Set section height to give scroll space
    whySection.style.height = (numCards * 100) + 'vh';

    // Pin the sticky container
    ScrollTrigger.create({
      trigger: whySection,
      start: 'top top',
      end: 'bottom bottom',
      pin: whySticky,
      pinSpacing: false,
      onUpdate: (self) => {
        const progress = self.progress;
        const activeIndex = Math.min(Math.floor(progress * numCards), numCards - 1);

        whyCards.forEach((card, i) => {
          if (i === activeIndex) {
            gsap.to(card, { opacity: 1, scale: 1, duration: 0.5, ease: 'power2.out' });
          } else if (i < activeIndex) {
            gsap.to(card, { opacity: 0, scale: 0.95, y: -30, duration: 0.5, ease: 'power2.out' });
          } else {
            gsap.to(card, { opacity: 0, scale: 0.92, y: 30, duration: 0.5, ease: 'power2.out' });
          }
        });

        progressDots.forEach((dot, i) => {
          dot.classList.toggle('active', i === activeIndex);
        });
      },
      onEnter: () => { if (progressContainer) progressContainer.classList.add('visible'); },
      onLeave: () => { if (progressContainer) progressContainer.classList.remove('visible'); },
      onEnterBack: () => { if (progressContainer) progressContainer.classList.add('visible'); },
      onLeaveBack: () => { if (progressContainer) progressContainer.classList.remove('visible'); }
    });

    // Show first card
    gsap.set(whyCards[0], { opacity: 1, scale: 1 });

    return () => {
      whySection.style.height = 'auto';
      gsap.set(whyCards, { clearProps: "all" });
    };
  });
});

/* ---------- Always Start at Top ---------- */
if ('scrollRestoration' in history) { history.scrollRestoration = 'manual'; }
window.addEventListener('load', () => {
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
  setTimeout(() => { if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh(); }, 300);
});

/* ---------- Destination Filter ---------- */
document.addEventListener('DOMContentLoaded', () => {
  const filters = document.querySelectorAll('.dest-filter');
  const cards = document.querySelectorAll('.dest-card');

  if (!filters.length || !cards.length) return;

  filters.forEach(filter => {
    filter.addEventListener('click', () => {
      // Remove active class from all
      filters.forEach(f => f.classList.remove('active'));
      // Add active class to clicked
      filter.classList.add('active');

      const filterText = filter.textContent.trim().toLowerCase();

      cards.forEach(card => {
        if (filterText === 'all experiences') {
          card.style.display = 'block';
          // Optional: re-trigger animations if handled via classes
          setTimeout(() => card.classList.add('visible'), 50);
        } else {
          const metaText = card.querySelector('.dest-card-meta').textContent.toLowerCase();
          if (metaText.includes(filterText)) {
            card.style.display = 'block';
            setTimeout(() => card.classList.add('visible'), 50);
          } else {
            card.style.display = 'none';
            card.classList.remove('visible');
          }
        }
      });
      
      // Refresh ScrollTrigger if it exists since layout changed
      if (typeof ScrollTrigger !== 'undefined') {
        setTimeout(() => ScrollTrigger.refresh(), 100);
      }
    });
  });
});

