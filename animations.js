/**
 * Adetutu Portfolio — Wild Animations Engine
 * Desktop: Full madness — custom cursor, magnetic elements, 
 *          parallax, text scramble, particle trails, page transitions
 * Mobile:  Cinematic — smooth reveals, swipe feedback, ink splashes
 */

(function() {
  'use strict';

  const isMobile = () => window.innerWidth < 768 || ('ontouchstart' in window);
  const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* =========================================================
   * PAGE TRANSITION OVERLAY
   * ========================================================= */
  function initPageTransitions() {
    // Create overlay
    const overlay = document.createElement('div');
    overlay.id = 'page-transition-overlay';
    overlay.innerHTML = `
      <div class="pt-inner">
        <div class="pt-line pt-line-1"></div>
        <div class="pt-line pt-line-2"></div>
        <div class="pt-line pt-line-3"></div>
      </div>
    `;
    document.body.appendChild(overlay);

    const style = document.createElement('style');
    style.textContent = `
      #page-transition-overlay {
        position: fixed; inset: 0; z-index: 9999;
        pointer-events: none; overflow: hidden;
      }
      .pt-inner {
        position: absolute; inset: 0;
        display: flex; flex-direction: column;
      }
      .pt-line {
        flex: 1;
        background: #1a1c1c;
        transform: scaleX(0);
        transform-origin: left;
        will-change: transform;
      }
      .pt-line-1 { transition: transform 0.45s cubic-bezier(0.77,0,0.175,1) 0s; }
      .pt-line-2 { transition: transform 0.45s cubic-bezier(0.77,0,0.175,1) 0.06s; }
      .pt-line-3 { transition: transform 0.45s cubic-bezier(0.77,0,0.175,1) 0.12s; }

      .pt-closing .pt-line {
        transform: scaleX(1) !important;
        transform-origin: left;
      }
      .pt-opening .pt-line {
        transform: scaleX(0) !important;
        transform-origin: right;
        transition-delay: 0s !important;
      }
    `;
    document.head.appendChild(style);

    // Intercept internal links
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href]');
      if (!link) return;
      const href = link.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto') || href.startsWith('tel')) return;
      if (link.target === '_blank') return;
      e.preventDefault();
      overlay.classList.add('pt-closing');
      overlay.querySelector('.pt-inner').style.flexDirection = 'column';
      setTimeout(() => {
        window.location.href = href;
      }, 600);
    });

    // Entry animation
    overlay.classList.add('pt-opening');
    // Already on new page — lines come in from right, retract to right
    const lines = overlay.querySelectorAll('.pt-line');
    lines.forEach(l => {
      l.style.transform = 'scaleX(1)';
      l.style.transformOrigin = 'right';
    });
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        lines.forEach((l, i) => {
          l.style.transition = `transform 0.5s cubic-bezier(0.77,0,0.175,1) ${i * 0.07}s`;
          l.style.transform = 'scaleX(0)';
        });
      });
    });
  }

  /* =========================================================
   * CUSTOM CURSOR (Desktop only)
   * ========================================================= */
  function initCursor() {
    if (isMobile()) return;

    const style = document.createElement('style');
    style.textContent = `
      * { cursor: none !important; }
      #cursor-dot {
        position: fixed; width: 8px; height: 8px;
        background: #1a1c1c; border-radius: 50%;
        pointer-events: none; z-index: 10000;
        transform: translate(-50%, -50%);
        transition: transform 0.1s, background 0.3s, width 0.3s, height 0.3s;
        will-change: left, top;
        mix-blend-mode: multiply;
      }
      #cursor-ring {
        position: fixed; width: 40px; height: 40px;
        border: 1px solid rgba(26,28,28,0.4); border-radius: 50%;
        pointer-events: none; z-index: 9999;
        transform: translate(-50%, -50%);
        transition: width 0.4s cubic-bezier(0.25,0.46,0.45,0.94),
                    height 0.4s cubic-bezier(0.25,0.46,0.45,0.94),
                    border-color 0.3s, opacity 0.3s;
        will-change: left, top;
      }
      body:has(a:hover) #cursor-ring,
      body:has(button:hover) #cursor-ring {
        width: 64px; height: 64px;
        border-color: rgba(26,28,28,0.8);
      }
      #cursor-ring.cursor-img {
        width: 80px; height: 80px;
        border-width: 2px;
        background: rgba(26,28,28,0.05);
      }
      #cursor-ring.cursor-text {
        width: 90px; height: 90px;
        background: rgba(26,28,28,0.06);
        border-color: rgba(26,28,28,0.6);
      }
      #cursor-label {
        position: fixed; z-index: 10001;
        pointer-events: none; opacity: 0;
        font-family: 'DM Sans', sans-serif;
        font-size: 10px; letter-spacing: 0.15em;
        text-transform: uppercase; color: #1a1c1c;
        transform: translate(-50%, -50%);
        transition: opacity 0.3s;
        white-space: nowrap;
      }
      #cursor-label.visible { opacity: 1; }
    `;
    document.head.appendChild(style);

    const dot = document.createElement('div'); dot.id = 'cursor-dot';
    const ring = document.createElement('div'); ring.id = 'cursor-ring';
    const label = document.createElement('div'); label.id = 'cursor-label';
    document.body.append(dot, ring, label);

    let mx = -100, my = -100, rx = -100, ry = -100;
    let raf;

    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

    function animateCursor() {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      dot.style.left = mx + 'px'; dot.style.top = my + 'px';
      ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
      label.style.left = rx + 'px'; label.style.top = ry + 'px';
      raf = requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Image hover
    document.querySelectorAll('.img-hover-zoom, .masonry-item img').forEach(el => {
      el.addEventListener('mouseenter', () => { ring.classList.add('cursor-img'); label.classList.add('visible'); label.textContent = 'View'; });
      el.addEventListener('mouseleave', () => { ring.classList.remove('cursor-img'); label.classList.remove('visible'); });
    });

    // Link hover
    document.querySelectorAll('a').forEach(el => {
      el.addEventListener('mouseenter', () => ring.classList.add('cursor-text'));
      el.addEventListener('mouseleave', () => ring.classList.remove('cursor-text'));
    });

    document.addEventListener('mouseleave', () => { dot.style.opacity = '0'; ring.style.opacity = '0'; });
    document.addEventListener('mouseenter', () => { dot.style.opacity = '1'; ring.style.opacity = '1'; });
  }

  /* =========================================================
   * MAGNETIC BUTTONS (Desktop)
   * ========================================================= */
  function initMagneticButtons() {
    if (isMobile()) return;
    document.querySelectorAll('.btn-primary, .btn-magnetic').forEach(btn => {
      btn.style.transition = 'transform 0.3s cubic-bezier(0.23,1,0.32,1), background 0.5s';
      btn.style.display = 'inline-block';

      btn.addEventListener('mousemove', e => {
        const rect = btn.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) * 0.35;
        const dy = (e.clientY - cy) * 0.35;
        btn.style.transform = `translate(${dx}px, ${dy}px)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0,0)';
      });
    });
  }

  /* =========================================================
   * TEXT SCRAMBLE EFFECT
   * ========================================================= */
  class TextScramble {
    constructor(el) {
      this.el = el;
      this.chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%&?';
      this.original = el.textContent;
      this.frame = 0;
    }
    scramble() {
      const len = this.original.length;
      let output = '';
      for (let i = 0; i < len; i++) {
        if (this.original[i] === ' ') { output += ' '; continue; }
        if (Math.random() > 0.4) {
          output += this.chars[Math.floor(Math.random() * this.chars.length)];
        } else {
          output += this.original[i];
        }
      }
      this.el.textContent = output;
    }
    restore(step) {
      const len = this.original.length;
      let output = '';
      for (let i = 0; i < len; i++) {
        if (this.original[i] === ' ') { output += ' '; continue; }
        if (i < step) {
          output += this.original[i];
        } else {
          output += this.chars[Math.floor(Math.random() * this.chars.length)];
        }
      }
      this.el.textContent = output;
    }
    run() {
      const len = this.original.length;
      let step = 0;
      const go = () => {
        if (step >= len) { this.el.textContent = this.original; return; }
        this.restore(step);
        step += 2;
        setTimeout(go, 30);
      };
      go();
    }
  }

  function initTextScramble() {
    const targets = document.querySelectorAll('.scramble-hover');
    targets.forEach(el => {
      const ts = new TextScramble(el);
      el.addEventListener('mouseenter', () => ts.run());
    });
    // Auto-run on visible headings after a delay
    const autoScramble = document.querySelectorAll('.scramble-auto');
    autoScramble.forEach((el, i) => {
      setTimeout(() => { new TextScramble(el).run(); }, 800 + i * 300);
    });
  }

  /* =========================================================
   * PARALLAX (Desktop only)
   * ========================================================= */
  function initParallax() {
    if (isMobile()) return;
    const layers = document.querySelectorAll('[data-parallax]');
    if (!layers.length) return;

    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      layers.forEach(el => {
        const speed = parseFloat(el.dataset.parallax) || 0.2;
        const rect = el.getBoundingClientRect();
        const centerY = rect.top + rect.height / 2;
        const offset = (centerY - window.innerHeight / 2) * speed;
        el.style.transform = `translateY(${offset}px)`;
      });
    }, { passive: true });
  }

  /* =========================================================
   * MOUSE PARALLAX — subtle tilt on hero images (Desktop)
   * ========================================================= */
  function initMouseParallax() {
    if (isMobile()) return;
    const hero = document.querySelector('.hero-parallax-container');
    if (!hero) return;
    const img = hero.querySelector('img');
    if (!img) return;

    document.addEventListener('mousemove', e => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const dx = (e.clientX - cx) / cx;
      const dy = (e.clientY - cy) / cy;
      img.style.transform = `scale(1.08) translate(${dx * -12}px, ${dy * -8}px)`;
    });
  }

  /* =========================================================
   * PARTICLE TRAIL (Desktop only)
   * ========================================================= */
  function initParticleTrail() {
    if (isMobile()) return;
    const canvas = document.createElement('canvas');
    canvas.id = 'particle-canvas';
    canvas.style.cssText = `
      position: fixed; inset: 0; pointer-events: none;
      z-index: 9998; opacity: 0.5; mix-blend-mode: multiply;
    `;
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    let W, H, particles = [];
    let mx = -999, my = -999;

    function resize() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);
    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

    function spawn() {
      if (mx < 0) return;
      for (let i = 0; i < 2; i++) {
        particles.push({
          x: mx + (Math.random() - 0.5) * 6,
          y: my + (Math.random() - 0.5) * 6,
          vx: (Math.random() - 0.5) * 0.8,
          vy: -Math.random() * 1.5 - 0.3,
          life: 1,
          size: Math.random() * 3 + 1,
          hue: Math.random() * 30,
        });
      }
    }

    function loop() {
      ctx.clearRect(0, 0, W, H);
      spawn();
      particles = particles.filter(p => p.life > 0);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        p.vy += 0.04; p.life -= 0.018;
        ctx.globalAlpha = p.life * 0.6;
        ctx.fillStyle = `hsl(${p.hue}, 5%, 15%)`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
      requestAnimationFrame(loop);
    }
    loop();
  }

  /* =========================================================
   * SCROLL REVEAL — enhanced stagger
   * ========================================================= */
  function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal, .reveal-up, .reveal-left, .reveal-right, .reveal-scale');
    if (!reveals.length) return;

    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    reveals.forEach(el => obs.observe(el));
  }

  /* =========================================================
   * STAGGER CHILDREN — auto-stagger children of containers
   * ========================================================= */
  function initStaggerChildren() {
    document.querySelectorAll('[data-stagger]').forEach(container => {
      const delay = parseFloat(container.dataset.stagger) || 0.1;
      const children = container.children;
      Array.from(children).forEach((child, i) => {
        child.style.transitionDelay = `${i * delay}s`;
        child.classList.add('reveal');
      });
    });
    // Re-run reveal for newly added classes
    initScrollReveal();
  }

  /* =========================================================
   * COUNTER ANIMATION
   * ========================================================= */
  function initCounters() {
    document.querySelectorAll('[data-count]').forEach(el => {
      const target = parseInt(el.dataset.count);
      const obs = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
          let start = 0;
          const duration = 1500;
          const step = timestamp => {
            if (!start) start = timestamp;
            const progress = Math.min((timestamp - start) / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(ease * target) + (el.dataset.suffix || '');
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
          obs.disconnect();
        }
      }, { threshold: 0.5 });
      obs.observe(el);
    });
  }

  /* =========================================================
   * HORIZONTAL MARQUEE
   * ========================================================= */
  function initMarquee() {
    document.querySelectorAll('.marquee-track').forEach(track => {
      // Duplicate content for seamless loop
      const inner = track.querySelector('.marquee-inner');
      if (!inner) return;
      inner.innerHTML += inner.innerHTML;
      const speed = parseFloat(track.dataset.speed) || 40;
      let pos = 0;
      const half = inner.scrollWidth / 2;
      function tick() {
        pos -= speed / 60;
        if (Math.abs(pos) >= half) pos = 0;
        inner.style.transform = `translateX(${pos}px)`;
        requestAnimationFrame(tick);
      }
      tick();
    });
  }

  /* =========================================================
   * MOBILE: TOUCH RIPPLE
   * ========================================================= */
  function initTouchRipple() {
    if (!isMobile()) return;
    const style = document.createElement('style');
    style.textContent = `
      .ripple-container { position: relative; overflow: hidden; }
      .ripple {
        position: absolute; border-radius: 50%;
        background: rgba(26,28,28,0.12);
        transform: scale(0); animation: rippleAnim 0.6s linear;
        pointer-events: none;
      }
      @keyframes rippleAnim {
        to { transform: scale(4); opacity: 0; }
      }
    `;
    document.head.appendChild(style);

    document.querySelectorAll('a, button').forEach(el => {
      el.classList.add('ripple-container');
      el.addEventListener('touchstart', e => {
        const rect = el.getBoundingClientRect();
        const touch = e.touches[0];
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;
        const size = Math.max(rect.width, rect.height);
        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        ripple.style.cssText = `width:${size}px;height:${size}px;left:${x - size/2}px;top:${y - size/2}px`;
        el.appendChild(ripple);
        setTimeout(() => ripple.remove(), 700);
      }, { passive: true });
    });
  }

  /* =========================================================
   * MOBILE: INK SPLASH on section entry
   * ========================================================= */
  function initInkSplash() {
    if (!isMobile()) return;
    const style = document.createElement('style');
    style.textContent = `
      @keyframes inkExpand {
        from { transform: scale(0); opacity: 0.3; }
        to { transform: scale(3); opacity: 0; }
      }
      .ink-splash {
        position: absolute; width: 200px; height: 200px;
        border-radius: 50%; background: rgba(26,28,28,0.06);
        pointer-events: none; animation: inkExpand 1.2s ease-out forwards;
        transform-origin: center; left: 50%; top: 50%;
        margin-left: -100px; margin-top: -100px;
        z-index: 0;
      }
    `;
    document.head.appendChild(style);

    const sections = document.querySelectorAll('section');
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          el.style.position = 'relative';
          const splash = document.createElement('div');
          splash.className = 'ink-splash';
          el.appendChild(splash);
          setTimeout(() => splash.remove(), 1300);
          obs.unobserve(el);
        }
      });
    }, { threshold: 0.2 });
    sections.forEach(s => obs.observe(s));
  }

  /* =========================================================
   * HERO TICKER / RUNNING TEXT
   * ========================================================= */
  function initHeroTicker() {
    const ticker = document.querySelector('.hero-ticker');
    if (!ticker) return;
    // already handled by marquee
  }

  /* =========================================================
   * GLITCH TEXT hover (Desktop)
   * ========================================================= */
  function initGlitch() {
    if (isMobile()) return;
    const style = document.createElement('style');
    style.textContent = `
      .glitch { position: relative; }
      .glitch::before, .glitch::after {
        content: attr(data-text);
        position: absolute; top: 0; left: 0; width: 100%; height: 100%;
        opacity: 0; pointer-events: none;
      }
      .glitch:hover::before {
        animation: glitch1 0.3s cubic-bezier(0.25,0.46,0.45,0.94) both infinite;
        color: rgba(255,0,0,0.5); clip-path: polygon(0 30%, 100% 30%, 100% 50%, 0 50%);
        transform: translate(-2px, 0);
      }
      .glitch:hover::after {
        animation: glitch2 0.3s cubic-bezier(0.25,0.46,0.45,0.94) both infinite;
        color: rgba(0,0,255,0.5); clip-path: polygon(0 60%, 100% 60%, 100% 80%, 0 80%);
        transform: translate(2px, 0);
      }
      @keyframes glitch1 {
        0%,100% { opacity: 0; } 20%,80% { opacity: 0.7; } 50% { transform: translate(-3px, 1px); }
      }
      @keyframes glitch2 {
        0%,100% { opacity: 0; } 20%,80% { opacity: 0.7; } 50% { transform: translate(3px, -1px); }
      }
    `;
    document.head.appendChild(style);
    document.querySelectorAll('.glitch').forEach(el => {
      el.dataset.text = el.textContent;
    });
  }

  /* =========================================================
   * SKEW ON SCROLL (Desktop)
   * ========================================================= */
  function initSkewOnScroll() {
    if (isMobile()) return;
    let lastScroll = window.scrollY;
    let currentSkew = 0;

    window.addEventListener('scroll', () => {
      const delta = window.scrollY - lastScroll;
      lastScroll = window.scrollY;
      currentSkew = Math.max(-3, Math.min(3, delta * 0.08));
    }, { passive: true });

    const skewEls = document.querySelectorAll('.skew-on-scroll');
    function tick() {
      currentSkew *= 0.85;
      skewEls.forEach(el => {
        el.style.transform = `skewY(${currentSkew}deg)`;
      });
      requestAnimationFrame(tick);
    }
    tick();
  }

  /* =========================================================
   * GRAIN OVERLAY
   * ========================================================= */
  function initGrain() {
    const style = document.createElement('style');
    style.textContent = `
      #grain-overlay {
        position: fixed; inset: 0; pointer-events: none; z-index: 9995;
        opacity: 0.025; mix-blend-mode: overlay;
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
        background-size: 200px 200px;
        animation: grainAnim 0.5s steps(1) infinite;
      }
      @keyframes grainAnim {
        0% { background-position: 0 0; }
        25% { background-position: -50px 25px; }
        50% { background-position: 25px -50px; }
        75% { background-position: -25px 50px; }
        100% { background-position: 50px -25px; }
      }
    `;
    document.head.appendChild(style);
    const grain = document.createElement('div');
    grain.id = 'grain-overlay';
    document.body.appendChild(grain);
  }

  /* =========================================================
   * INIT ALL
   * ========================================================= */
  function init() {
    if (prefersReducedMotion()) return;

    initGrain();
    initPageTransitions();
    initScrollReveal();
    initStaggerChildren();
    initCounters();
    initMarquee();
    initTextScramble();
    initGlitch();

    if (!isMobile()) {
      initCursor();
      initMagneticButtons();
      initParallax();
      initMouseParallax();
      initParticleTrail();
      initSkewOnScroll();
    } else {
      initTouchRipple();
      initInkSplash();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
