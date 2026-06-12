/* ================================================================
   DISCO X — main.js
   Huanta, Ayacucho | JS Premium
   ================================================================ */
'use strict';

/* ── INIT ───────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initAgeGate();
  initCursor();
  initScrollBar();
  initNavbar();
  initMobileMenu();
  initReveal();
  initCounters();
  initParticles();
  initCountdown();
  initFAQ();
  initTilt();
  initParallax();
  initNewsletterForm();
  setActiveNav();
  initAmbient();
});

/* ================================================================
   AGE GATE
   ================================================================ */
function initAgeGate() {
  const gate = document.getElementById('age-gate');
  if (!gate) return;
  if (sessionStorage.getItem('dx-age-ok')) { gate.classList.add('hidden'); return; }

  document.getElementById('ag-yes')?.addEventListener('click', () => {
    sessionStorage.setItem('dx-age-ok', '1');
    gate.style.opacity = '0';
    gate.style.transition = 'opacity .5s';
    setTimeout(() => gate.classList.add('hidden'), 500);
  });
  document.getElementById('ag-no')?.addEventListener('click', () => {
    window.location.href = 'https://www.google.com';
  });
}

/* ================================================================
   CURSOR
   ================================================================ */
function initCursor() {
  if (window.innerWidth < 768) return;
  const dot  = document.getElementById('cx-dot');
  const ring = document.getElementById('cx-ring');
  if (!dot || !ring) return;

  let mx = -200, my = -200, rx = -200, ry = -200;

  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  (function loop() {
    dot.style.left  = mx + 'px';
    dot.style.top   = my + 'px';
    rx += (mx - rx) * 0.13;
    ry += (my - ry) * 0.13;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(loop);
  })();

  const hoverSel = 'a, button, .btn, .gal-item, .dj-card, .ev-card, .card, .testi-card, .combo-card, .promo-card, .faq-q';
  document.querySelectorAll(hoverSel).forEach(el => {
    el.addEventListener('mouseenter', () => { dot.classList.add('hov'); ring.classList.add('hov'); });
    el.addEventListener('mouseleave', () => { dot.classList.remove('hov'); ring.classList.remove('hov'); });
  });
}

/* ================================================================
   SCROLL PROGRESS
   ================================================================ */
function initScrollBar() {
  const bar = document.getElementById('sp-bar');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const st = document.documentElement.scrollTop;
    const dh = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    bar.style.width = dh ? (st / dh * 100) + '%' : '0%';
  }, { passive: true });
}

/* ================================================================
   NAVBAR
   ================================================================ */
function initNavbar() {
  const nav = document.querySelector('.nav');
  if (!nav) return;
  const upd = () => nav.classList.toggle('on', window.scrollY > 55);
  window.addEventListener('scroll', upd, { passive: true });
  upd();
}

function setActiveNav() {
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mob-menu a').forEach(a => {
    const hr = a.getAttribute('href') || '';
    if (hr === page || hr.endsWith(page)) a.classList.add('active');
  });
}

/* ================================================================
   MOBILE MENU
   ================================================================ */
function initMobileMenu() {
  const btn  = document.querySelector('.hamburger');
  const menu = document.querySelector('.mob-menu');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    btn.classList.toggle('open');
    menu.classList.toggle('open');
    document.body.style.overflow = menu.classList.contains('open') ? 'hidden' : '';
  });

  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    btn.classList.remove('open');
    menu.classList.remove('open');
    document.body.style.overflow = '';
  }));

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && menu.classList.contains('open')) {
      btn.classList.remove('open');
      menu.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
}

/* ================================================================
   REVEAL ON SCROLL
   ================================================================ */
function initReveal() {
  const els = document.querySelectorAll('.rv, .rv-l, .rv-r, .rv-sc');
  if (!els.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target); } });
  }, { threshold: 0.1, rootMargin: '0px 0px -36px 0px' });
  els.forEach(el => obs.observe(el));
}

/* ================================================================
   COUNTERS
   ================================================================ */
function initCounters() {
  const els = document.querySelectorAll('[data-count]');
  if (!els.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { countUp(e.target); obs.unobserve(e.target); } });
  }, { threshold: 0.5 });
  els.forEach(el => obs.observe(el));
}

function countUp(el) {
  const target = parseInt(el.dataset.count, 10);
  const dur = 1800;
  const start = performance.now();
  const update = now => {
    const p = Math.min((now - start) / dur, 1);
    const v = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.floor(v * target).toLocaleString();
    if (p < 1) requestAnimationFrame(update);
    else el.textContent = target.toLocaleString();
  };
  requestAnimationFrame(update);
}

/* ================================================================
   PARTICLES
   ================================================================ */
function initParticles() {
  const canvas = document.getElementById('px-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const N   = window.innerWidth < 768 ? 28 : 55;
  let w, h, pts;

  const resize = () => { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; };
  const mk = () => ({ x: Math.random() * w, y: Math.random() * h, r: Math.random() * 1.3 + .3, vx: (Math.random()-.5)*.22, vy: -(Math.random()*.35+.08), a: Math.random()*.45+.1, life: 0, max: Math.random()*280+160 });

  const draw = () => {
    ctx.clearRect(0, 0, w, h);
    pts.forEach((p, i) => {
      p.x += p.vx; p.y += p.vy; p.life++;
      const lr = p.life / p.max;
      const f  = lr < .12 ? lr/.12 : lr > .78 ? (1-lr)/.22 : 1;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      ctx.fillStyle = `rgba(212,175,55,${p.a * f})`; ctx.fill();
      if (p.life >= p.max || p.y < -8) pts[i] = mk();
    });
    requestAnimationFrame(draw);
  };

  resize();
  pts = Array.from({ length: N }, mk);
  window.addEventListener('resize', resize, { passive: true });
  draw();
}

/* ================================================================
   COUNTDOWN REAL
   ================================================================ */
function initCountdown() {
  const el = document.getElementById('countdown');
  if (!el) return;

  // Lee la fecha del atributo data-date="YYYY-MM-DDTHH:MM:SS"
  const target = new Date(el.dataset.date || '2025-06-28T22:00:00');

  const pads = n => String(n).padStart(2, '0');

  const tick = () => {
    const diff = target - new Date();
    if (diff <= 0) {
      el.innerHTML = '<div class="cd-box"><span class="cd-num">¡HOY!</span></div>';
      return;
    }
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000)  / 60000);
    const s = Math.floor((diff % 60000)    / 1000);
    el.innerHTML = `
      <div class="cd-box"><span class="cd-num">${pads(d)}</span><span class="cd-lbl">Días</span></div>
      <div class="cd-box"><span class="cd-num">${pads(h)}</span><span class="cd-lbl">Horas</span></div>
      <div class="cd-box"><span class="cd-num">${pads(m)}</span><span class="cd-lbl">Mins</span></div>
      <div class="cd-box"><span class="cd-num">${pads(s)}</span><span class="cd-lbl">Segs</span></div>`;
  };
  tick();
  setInterval(tick, 1000);
}

/* ================================================================
   FAQ ACCORDION
   ================================================================ */
function initFAQ() {
  document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(el => el.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });
}

/* ================================================================
   3D TILT
   ================================================================ */
function initTilt() {
  const cards = document.querySelectorAll('.ev-card, .dj-card, .combo-card, .testi-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const r  = card.getBoundingClientRect();
      const x  = e.clientX - r.left - r.width  / 2;
      const y  = e.clientY - r.top  - r.height / 2;
      card.style.transform    = `translateY(-8px) rotateX(${(y/r.height)*-7}deg) rotateY(${(x/r.width)*7}deg)`;
      card.style.transition   = 'none';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform  = '';
      card.style.transition = '';
    });
  });
}

/* ================================================================
   PARALLAX
   ================================================================ */
function initParallax() {
  const hero = document.querySelector('.hero-content');
  if (!hero) return;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    hero.style.transform = `translateY(${y * .16}px)`;
    hero.style.opacity   = Math.max(0, 1 - y / 560);
  }, { passive: true });
}

/* ================================================================
   NEWSLETTER
   ================================================================ */
function initNewsletterForm() {
  const form = document.getElementById('newsletter-form');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const email = form.querySelector('input[type="email"]')?.value;
    if (!email) return;
    DX.success('¡Suscrito!', `Te notificaremos en <strong>${email}</strong> sobre cada evento exclusivo. 🎉`);
    form.reset();
  });
}

/* ================================================================
   AMBIENT SOUND TOGGLE
   ================================================================ */
function initAmbient() {
  const btn   = document.getElementById('ambient-btn');
  const audio = document.getElementById('ambient-audio');
  if (!btn || !audio) return;
  let playing = false;
  btn.addEventListener('click', () => {
    playing = !playing;
    if (playing) {
      audio.volume = 0.08;
      audio.play().catch(() => { playing = false; });
      btn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
      btn.title = 'Silenciar ambiente';
    } else {
      audio.pause();
      btn.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
      btn.title = 'Activar sonido ambiente';
    }
  });
}

/* ================================================================
   SWEETALERT2 — UTILIDADES GLOBALES
   ================================================================ */
window.DX = {
  success(title, html) {
    if (typeof Swal === 'undefined') return;
    Swal.fire({ title, html, icon: 'success', confirmButtonText: 'Perfecto', background: '#0f0f0f', color: '#F2EFE8', iconColor: '#D4AF37', confirmButtonColor: '#D4AF37' });
  },
  error(title, html) {
    if (typeof Swal === 'undefined') return;
    Swal.fire({ title, html, icon: 'error', confirmButtonText: 'Entendido', background: '#0f0f0f', color: '#F2EFE8', confirmButtonColor: '#D4AF37' });
  },
  toast(msg, icon = 'success') {
    if (typeof Swal === 'undefined') return;
    Swal.fire({ toast: true, position: 'top-end', icon, title: msg, showConfirmButton: false, timer: 3200, timerProgressBar: true, background: '#161616', color: '#F2EFE8', iconColor: '#D4AF37' });
  },
  confirm(title, text, cb) {
    if (typeof Swal === 'undefined') { cb(); return; }
    Swal.fire({ title, text, icon: 'question', showCancelButton: true, confirmButtonText: 'Confirmar', cancelButtonText: 'Cancelar', background: '#0f0f0f', color: '#F2EFE8', iconColor: '#D4AF37', confirmButtonColor: '#D4AF37' })
      .then(r => { if (r.isConfirmed) cb(); });
  },
  validate(fields) {
    for (const [name, label] of Object.entries(fields)) {
      const el = document.querySelector(`[name="${name}"]`);
      if (!el) continue;
      if (!el.value.trim()) { this.error('Campo requerido', `El campo <strong>${label}</strong> es obligatorio.`); el.focus(); return false; }
      if (el.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value.trim())) { this.error('Correo inválido', 'Ingresa un correo válido.'); el.focus(); return false; }
    }
    return true;
  }
};

/* ── SMOOTH SCROLL ───────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});