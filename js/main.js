/* ===================================================
   ISPOVA — main.js
   Navegación, carrusel, tabs, acordeón, utilidades
=================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initCarousel();
  initTabs();
  initAccordion();
  initCopyButtons();
  initReadMore();
  markActiveNav();
   initScrollReveal();
  initBackToTop();
  initMvvCarousel();
  initEdFilter();
  initModal();
});

/* ---------- Navegación (mobile + dropdown) ---------- */
function initNav() {
  const toggle = document.querySelector('.nav__toggle');
  const menu = document.querySelector('.nav__menu');

  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const isOpen = menu.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });
  }

  // Tapping/clicking the parent link opens the submenu instead of navigating
  document.querySelectorAll('.nav__item.has-dropdown > .nav__link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const item = link.closest('.nav__item');
      const willOpen = !item.classList.contains('is-open');

      document.querySelectorAll('.nav__item.has-dropdown.is-open').forEach(openItem => {
        if (openItem !== item) openItem.classList.remove('is-open');
      });

      item.classList.toggle('is-open', willOpen);
    });
  });

  // Close an open submenu when clicking anywhere outside of it
  document.addEventListener('click', (e) => {
    document.querySelectorAll('.nav__item.has-dropdown.is-open').forEach(item => {
      if (!item.contains(e.target)) item.classList.remove('is-open');
    });
  });

  // Close the dropdown (and, on mobile, the whole menu) when a leaf link is clicked
  document.querySelectorAll('.nav__link:not(.has-dropdown > .nav__link), .nav__dropdown-link').forEach(link => {
    link.addEventListener('click', () => {
      link.closest('.nav__item.has-dropdown')?.classList.remove('is-open');

      if (window.innerWidth < 1100 && menu) {
        menu.classList.remove('is-open');
        toggle?.setAttribute('aria-expanded', 'false');
      }
    });
  });
}

function markActiveNav() {
  function update() {
    const path = window.location.pathname.split('/').pop() || 'index.html';
    const hash = window.location.hash;

    document.querySelectorAll('.nav__link, .nav__dropdown-link').forEach(link => {
      link.classList.remove('is-active');
    });

    document.querySelectorAll('.nav__link, .nav__dropdown-link').forEach(link => {
      const href = link.getAttribute('href');
      if (!href) return;

      const [hrefPath, hrefHash] = href.split('#');
      if (hrefPath !== path) return;

      // Los links con #hash (ej. propuesta-educativa.html#tab-secundario) sólo se
      // marcan activos cuando ese es el hash actual; los links sin hash, cuando no hay hash.
      const matches = hrefHash ? '#' + hrefHash === hash : !hash;
      if (!matches) return;

      link.classList.add('is-active');
      const parentItem = link.closest('.nav__item.has-dropdown');
      if (parentItem) parentItem.querySelector('.nav__link').classList.add('is-active');
    });
  }

  update();
  window.addEventListener('hashchange', update);
}

/* ---------- Carrusel del hero (Inicio) ---------- */
function initCarousel() {
  const carousel = document.querySelector('.hero-carousel');
  if (!carousel) return;

  const track = carousel.querySelector('.hero-carousel__track');
  const slides = Array.from(carousel.querySelectorAll('.hero-carousel__slide'));
  const dotsWrap = carousel.querySelector('.hero-carousel__dots');
  const prevBtn = carousel.querySelector('.hero-carousel__nav--prev');
  const nextBtn = carousel.querySelector('.hero-carousel__nav--next');
  let index = 0;
  let timer;

  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'hero-carousel__dot' + (i === 0 ? ' is-active' : '');
    dot.setAttribute('aria-label', `Ir a la imagen ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  });
  const dots = Array.from(dotsWrap.querySelectorAll('.hero-carousel__dot'));

  function goTo(i) {
    index = (i + slides.length) % slides.length;
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((d, di) => d.classList.toggle('is-active', di === index));
  }

  function next() { goTo(index + 1); }
  function prev() { goTo(index - 1); }

  nextBtn?.addEventListener('click', () => { next(); resetTimer(); });
  prevBtn?.addEventListener('click', () => { prev(); resetTimer(); });

  function resetTimer() {
    clearInterval(timer);
    timer = setInterval(next, 5000);
  }

  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    resetTimer();
  }
}

/* ---------- Tabs (Propuesta Educativa / Institución) ---------- */
function initTabs() {
  document.querySelectorAll('.tabs').forEach(tabGroup => {
    const buttons = Array.from(tabGroup.querySelectorAll('.tab-btn'));
    const panelWrapId = tabGroup.dataset.panels;
    const panels = panelWrapId
      ? Array.from(document.getElementById(panelWrapId).querySelectorAll('.tab-panel'))
      : [];

    function activate(btn) {
      buttons.forEach(b => b.classList.remove('is-active'));
      panels.forEach(p => p.classList.remove('is-active'));
      btn.classList.add('is-active');
      const target = document.getElementById(btn.dataset.tab);
      if (target) target.classList.add('is-active');
    }

    // Si la URL trae un link de submenú (ej. #tab-secundario), activa esa pestaña.
    function syncFromHash() {
      const hash = window.location.hash.slice(1);
      const match = buttons.find(b => b.dataset.tab === hash);
      if (!match) return;

      activate(match);
      // .tabs está oculta (display:none): hacer scrollIntoView sobre ella
      // dejaba la página en una posición fantasma. Scrolleamos al panel real.
      const target = document.getElementById(match.dataset.tab);
      if (!target) return;

      const scrollToTarget = () => target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      requestAnimationFrame(scrollToTarget);

      // Las imágenes del panel (el logo, sobre todo) recién están empezando a
      // cargar en este momento: al terminar cambian el alto de la página y
      // desacomodan el scroll que acabamos de hacer. Reintentamos cuando ya cargaron.
      const pendingImages = Array.from(target.querySelectorAll('img')).filter(img => !img.complete);
      let remaining = pendingImages.length;
      pendingImages.forEach(img => {
        img.addEventListener('load', () => {
          remaining--;
          if (remaining === 0) scrollToTarget();
        }, { once: true });
      });
    }

    buttons.forEach(btn => {
      btn.addEventListener('click', () => activate(btn));
    });

    syncFromHash();
    // Sin esto, clickear un link de submenú estando ya en la página sólo cambiaba
    // el hash de la URL sin reload — y la pestaña nunca se activaba.
    window.addEventListener('hashchange', syncFromHash);
  });
}

/* ---------- Botones "+ Leer más" ---------- */
function initReadMore() {
  document.querySelectorAll('[data-readmore-target]').forEach(btn => {
    const target = document.getElementById(btn.dataset.readmoreTarget);
    if (!target) return;

    btn.addEventListener('click', () => {
      const isHidden = target.style.display === 'none' || !target.style.display;
      target.style.display = isHidden ? 'block' : 'none';
      btn.textContent = isHidden ? '– Leer menos' : '+ Leer más';
    });
  });
}

/* ---------- Acordeón (Historia / Becas) ---------- */
function initAccordion() {
  document.querySelectorAll('.accordion-trigger').forEach(trigger => {
    const panel = trigger.nextElementSibling;

    trigger.addEventListener('click', () => {
      const isOpen = trigger.getAttribute('aria-expanded') === 'true';
      trigger.setAttribute('aria-expanded', String(!isOpen));
      panel.style.maxHeight = isOpen ? '0px' : panel.scrollHeight + 'px';
    });
  });
}

/* ---------- Botones "copiar" (contacto) ---------- */
function initCopyButtons() {
  document.querySelectorAll('[data-copy]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const text = btn.dataset.copy;
      try {
        await navigator.clipboard.writeText(text);
        const original = btn.innerHTML;
        btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M4 12l5 5L20 6"/></svg>';
        setTimeout(() => { btn.innerHTML = original; }, 1500);
      } catch (err) {
        console.warn('No se pudo copiar automáticamente:', err);
      }
    });
  });
}

/* ---------- Scroll reveal (aparecer al hacer scroll) ---------- */
function initScrollReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  if (!('IntersectionObserver' in window)) {
    items.forEach(el => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target); // ya apareció, no hace falta seguir observando
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  items.forEach(el => observer.observe(el));
}

/* ---------- Carrusel Misión / Valores / Visión (Nivel Secundario) ---------- */
function initMvvCarousel() {
  document.querySelectorAll('.ns-mvv-scroll').forEach(container => {
    const cards = Array.from(container.querySelectorAll('.ns-mvv-card'));
    if (!cards.length) return;

    const MAX_LIFT = 34;   // px que sube la card centrada
    const MIN_SCALE = 0.65; // tamaño de las cards de los costados (chiquitas)
    let ticking = false;

    function update() {
      const containerRect = container.getBoundingClientRect();
      const containerCenter = containerRect.left + containerRect.width / 2;

      cards.forEach(card => {
        const cardRect = card.getBoundingClientRect();
        const cardCenter = cardRect.left + cardRect.width / 2;
        const distance = Math.abs(containerCenter - cardCenter);
        // proximidad: 1 = centrada, 0 = a mitad de camino hacia afuera o más
        const proximity = Math.max(0, 1 - distance / (cardRect.width * 0.9));

        const lift = proximity * MAX_LIFT;
        const scale = MIN_SCALE + proximity * (1 - MIN_SCALE);

        card.style.transform = `translateY(${-lift}px) scale(${scale})`;
        card.classList.toggle('is-centered', proximity > 0.75);
      });
      ticking = false;
    }

    container.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });

    // Al cargar, centra la card del medio (ej. "Nuestros Valores"), no la primera.
    const middleCard = cards[Math.floor(cards.length / 2)];
    if (middleCard) {
      container.scrollLeft = middleCard.offsetLeft - (container.clientWidth - middleCard.offsetWidth) / 2;
    }

    window.addEventListener('resize', update);
    update();
  });
}

/* ---------- Filtro de nivel (Equipo Directivo) ---------- */
function initEdFilter() {
  const filter = document.querySelector('.ed-filter');
  if (!filter) return;

  const buttons = Array.from(filter.querySelectorAll('.ed-filter-btn'));
  const groups = Array.from(document.querySelectorAll('[data-level-group]'));

  function activate(level) {
    buttons.forEach(b => b.classList.toggle('is-active', b.dataset.level === level));
    groups.forEach(g => { g.hidden = g.dataset.levelGroup !== level; });
  }

  buttons.forEach(btn => {
    btn.addEventListener('click', () => activate(btn.dataset.level));
  });
}

/* ---------- Modal genérico (ej. "Leer más" con el texto completo) ---------- */
function initModal() {
  const openers = document.querySelectorAll('[data-modal-target]');
  if (!openers.length) return;

  function open(modal) {
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function close(modal) {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  openers.forEach(btn => {
    const modal = document.getElementById(btn.dataset.modalTarget);
    if (!modal) return;

    btn.addEventListener('click', () => open(modal));

    modal.querySelectorAll('[data-modal-close]').forEach(closer => {
      closer.addEventListener('click', () => close(modal));
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) close(modal);
    });
  });
}

/* ---------- Botón "volver arriba" ---------- */
function initBackToTop() {
  const btn = document.querySelector('.back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('is-visible', window.scrollY > 500);
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}