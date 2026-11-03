/* Tamba Tech · interactions
   GSAP + ScrollTrigger + Lenis. Everything degrades to a static, readable page. */

(() => {
  'use strict';

  // Where contact form messages go. Replace with the real inbox.
  const CONTACT_EMAIL = 'info@tambatech.ai';

  // Language: English in the HTML, Spanish and Portuguese from assets/js/i18n.js. Must run before any animation
  // touches the text (the statement is split into words, the hero title into lines).
  const i18n = window.TambaI18n;
  const t = (s) => (i18n ? i18n.t(s) : s);
  if (i18n) i18n.init();

  const root = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const preloader = $('#preloader');
  const hasGsap = !!(window.gsap && window.ScrollTrigger);

  /* ---------- No GSAP: show everything and keep the page usable ---------- */
  if (!hasGsap) {
    root.classList.remove('js');
    if (preloader) preloader.remove();
    initNav(null);
    initMenu(null);
    initTabs(null);
    initForm();
    staticHero();
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  gsap.defaults({ ease: 'power3.out' });

  // If animation frames never run (very old device, frozen tab), fall back to the static page.
  // A background tab gets no frames either, so wait until it is visible before deciding.
  const fallback = () => {
    if (gsap.ticker.frame > 3) return;
    if (document.hidden) { setTimeout(fallback, 1500); return; }
    gsap.globalTimeline.clear();
    root.classList.remove('js');
    $$('[style]').forEach((el) => {
      if (el.closest('svg')) return;
      if (el.matches('.tl-bar, .bar, .margin-bars i')) return;
      el.removeAttribute('style');
    });
    $$('.hero-arc-path, .orbit-fill').forEach((p) => { p.style.strokeDashoffset = 0; });
    staticHero();
    const pl = $('#preloader'); if (pl) pl.remove();
    if (lenis) lenis.start();
  };
  setTimeout(fallback, 4500);

  /* ---------- Smooth scroll ---------- */
  let lenis = null;
  if (!reduce && window.Lenis) {
    lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 1 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  initNav(lenis);
  initMenu(lenis);
  initForm();

  /* ---------- Preloader, then hero entrance ---------- */
  const heroArc = $('.hero-arc-path');
  const heroDot = $('.hero-arc-dot');
  prepStroke(heroArc);

  function heroIntro() {
    const tl = gsap.timeline();
    tl.from('.hero-title .line > span', { yPercent: 110, duration: 1.2, stagger: 0.09, ease: 'power4.out' })
      .from('.hero-over', { opacity: 0, y: 12, duration: 0.8 }, 0.1)
      .from('.hero-lead', { opacity: 0, y: 20, duration: 0.9 }, 0.45)
      .from('.hero-cta .btn', { opacity: 0, y: 16, duration: 0.8, stagger: 0.08 }, 0.6)
      .from('.nav', { opacity: 0, y: -12, duration: 0.8 }, 0.2)
      .from('.scroll-cue', { opacity: 0, duration: 0.8 }, 1);
    if (heroArc) {
      tl.to(heroArc, { strokeDashoffset: 0, duration: 2.2, ease: 'power2.inOut' }, 0)
        .from(heroDot, { scale: 0, transformOrigin: '50% 50%', duration: 0.6, ease: 'back.out(2)' }, 2.0);
    }
    const mock = $('.hero-visual');
    if (mock) {
      tl.to(mock, { opacity: 1, duration: 0.9 }, 0.7)
        .from(mock, { y: 28, duration: 1.1, ease: 'power3.out' }, 0.7)
        .add(heroMockIntro(), 1.0);
    }
    return tl;
  }

  if (reduce || !preloader || sessionStorage.getItem('tamba-seen')) {
    if (preloader) preloader.remove();
    if (heroArc) heroArc.style.strokeDashoffset = 0;
    if (!reduce) heroIntro();
  } else {
    const arc = $('.pl-arc', preloader);
    prepStroke(arc);
    gsap.set('.pl-t', { opacity: 0, scale: 0.8, transformOrigin: '50% 50%' });
    gsap.set('.pl-dot', { scale: 0, transformOrigin: '50% 50%' });
    if (lenis) lenis.stop();

    gsap.timeline({
      onComplete: () => {
        preloader.remove();
        try { sessionStorage.setItem('tamba-seen', '1'); } catch (e) {}
        if (lenis) lenis.start();
        ScrollTrigger.refresh();
      }
    })
      .to(arc, { strokeDashoffset: 0, duration: 0.9, ease: 'power2.inOut' })
      .to('.pl-t', { opacity: 1, scale: 1, duration: 0.5 }, '-=0.35')
      .to('.pl-dot', { scale: 1, duration: 0.45, ease: 'back.out(2.4)' }, '-=0.2')
      .to(preloader, { opacity: 0, duration: 0.6, ease: 'power2.inOut' }, '+=0.25')
      .add(heroIntro, '-=0.35');

    // Safety net in case anything stalls
    setTimeout(() => { if (document.body.contains(preloader)) { preloader.remove(); if (lenis) lenis.start(); } }, 5000);
  }

  if (reduce) {
    initTabs(null);
    initStages();
    staticHero();
    $$('.solutions .card, .solutions .lever').forEach((c) => c.classList.add('is-in'));
    const od = $('.orbit-dot');
    if (od) { od.setAttribute('cx', '51.1'); od.setAttribute('cy', '51.1'); }
    const on = $('#orbit-num'); if (on) on.textContent = '04';
    return;
  }

  /* ---------- Hero: content lifts and fades as you leave ---------- */
  gsap.to('.hero-content', {
    yPercent: -12, opacity: 0, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
  });
  gsap.to('.hero-arc', {
    yPercent: 14, scale: 1.08, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
  });
  gsap.to('.hero-visual', {
    yPercent: -6, opacity: 0, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
  });
  initHeroMockLoop();

  /* ---------- Statement: words light up with scroll ---------- */
  $$('[data-words]').forEach((el) => {
    const words = el.textContent.trim().split(/\s+/);
    el.innerHTML = words.map((w) => `<span class="w">${w}</span>`).join(' ');
    gsap.to($$('.w', el), {
      opacity: 1, ease: 'none', stagger: 0.1,
      scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 45%', scrub: true }
    });
  });

  /* ---------- Generic reveals ---------- */
  ScrollTrigger.batch('.reveal', {
    start: 'top 88%',
    once: true,
    onEnter: (batch) => gsap.to(batch, { opacity: 1, y: 0, duration: 1, stagger: 0.08, ease: 'power3.out', overwrite: true })
  });

  /* ---------- Bento visuals ---------- */
  $$('.solutions .card, .solutions .lever').forEach((card) => {
    ScrollTrigger.create({ trigger: card, start: 'top 75%', once: true, onEnter: () => card.classList.add('is-in') });
  });
  initStages();

  /* ---------- In practice: tabs with auto-play ---------- */
  initTabs(gsap);

  /* ---------- Process: the orbit fills as you scroll ---------- */
  initProcess();

  /* ---------- Incubation symbol draws itself ---------- */
  const bsArc = $('.bs-arc');
  if (bsArc) {
    prepStroke(bsArc);
    gsap.set('.bs-t', { opacity: 0 });
    gsap.set('.bs-dot', { scale: 0, transformOrigin: '50% 50%' });
    gsap.timeline({ scrollTrigger: { trigger: '.big-symbol', start: 'top 75%', once: true } })
      .to(bsArc, { strokeDashoffset: 0, duration: 1.4, ease: 'power2.inOut' })
      .to('.bs-t', { opacity: 1, duration: 0.6, stagger: 0.1 }, '-=0.6')
      .to('.bs-dot', { scale: 1, duration: 0.5, ease: 'back.out(2.4)' }, '-=0.2');
  }

  /* ---------- Origin: the three words slide into place ---------- */
  const offsets = [-18, 22, -26];
  $$('.ow').forEach((w, i) => {
    gsap.fromTo(w, { xPercent: offsets[i] }, {
      xPercent: 0, ease: 'none',
      scrollTrigger: { trigger: '.origin-words', start: 'top bottom', end: 'center 45%', scrub: true }
    });
  });

  /* ---------- Contact arc ---------- */
  gsap.from('.contact-arc', {
    yPercent: 20, ease: 'none',
    scrollTrigger: { trigger: '.contact', start: 'top bottom', end: 'bottom bottom', scrub: true }
  });

  window.addEventListener('load', () => ScrollTrigger.refresh());

  /* =========================================================
     Helpers and components
     ========================================================= */

  function prepStroke(path) {
    if (!path) return;
    const len = path.getTotalLength();
    path.style.strokeDasharray = `${len} ${len}`;
    path.style.strokeDashoffset = len;
  }

  /* ---------- Hero mock: the pricing engine working through sales ---------- */
  function staticHero() {
    const el = $('.hero-visual');
    if (!el) return;
    $$('.chip', el).forEach((c) => c.classList.add('on'));
    $$('.margin-bars i', el).forEach((b) => { b.style.transform = 'none'; });
  }

  function heroMockIntro() {
    const el = $('.hero-visual');
    const tl = gsap.timeline();
    if (!el) return tl;
    const chips = $$('.chip', el);
    const bars = $$('.margin-bars i', el);
    const count = $('.hm-count', el);
    gsap.set(bars, { scaleY: 0 });
    count.textContent = '0.0';
    chips.forEach((c) => tl.add(() => c.classList.add('on'), '+=0.4'));
    tl.to(bars, { scaleY: 1, duration: 0.9, stagger: 0.07, ease: 'power3.out' }, '+=0.3');
    const o = { v: 0 };
    tl.to(o, { v: 0.9, duration: 1.3, ease: 'power2.out', onUpdate: () => { count.textContent = o.v.toFixed(1); } }, '<+=0.2');
    return tl;
  }

  function initHeroMockLoop() {
    const el = $('.hero-visual');
    if (!el) return;
    const chips = $$('.chip', el);
    const sale = $('.hm-sale', el), offer = $('.hm-offer', el);
    const amt = $('.hm-amt', el), n = $('.hm-n', el), rate = $('.hm-rate', el), why = $('.hm-why', el);
    const scenes = [
      { n: '6',  amt: '$860',   rate: t('3.4% a month'), why: t('Safer offer for a new customer') },
      { n: '12', amt: '$2,150', rate: t('2.6% a month'), why: t('Loyal customer, lower risk') },
      { n: '10', amt: '$1,240', rate: t('2.9% a month'), why: t('Lowest rate that keeps the margin') }
    ];
    const tl = gsap.timeline({ repeat: -1, delay: 6.5, paused: true });
    scenes.forEach((s) => {
      tl.add(() => chips.forEach((c) => c.classList.remove('on')))
        .to(sale, { opacity: 0, y: -6, duration: 0.25 }, '<')
        .add(() => { amt.textContent = s.amt; n.textContent = s.n; })
        .to(sale, { opacity: 1, y: 0, duration: 0.4 });
      chips.forEach((c) => tl.add(() => c.classList.add('on'), '+=0.45'));
      tl.to(offer, { opacity: 0, y: 6, duration: 0.25 }, '+=0.35')
        .add(() => { rate.textContent = s.rate; why.textContent = s.why; })
        .to(offer, { opacity: 1, y: 0, duration: 0.45 })
        .to({}, { duration: 3.2 });
    });
    ScrollTrigger.create({
      trigger: '.hero', start: 'top bottom', end: 'bottom top',
      onToggle: (self) => { self.isActive ? tl.play() : tl.pause(); }
    });
    tl.play();
  }

  function initStages() {
    const items = $$('.viz-stages li');
    if (!items.length) return;
    if (reduce) { items.forEach((li) => li.classList.add('on')); return; }
    let i = 0, timer = null;
    const step = () => {
      items.forEach((li, k) => li.classList.toggle('on', k <= i));
      i = (i + 1) % (items.length + 1);
    };
    ScrollTrigger.create({
      trigger: '.viz-stages', start: 'top 90%', end: 'bottom 10%',
      onToggle: (self) => {
        clearInterval(timer);
        if (self.isActive) { step(); timer = setInterval(step, 900); }
      }
    });
  }

  function initProcess() {
    const fill = $('.orbit-fill');
    const dot = $('.orbit-dot');
    const num = $('#orbit-num');
    const steps = $$('.p-step');
    if (!fill || !steps.length) return;

    const len = fill.getTotalLength();
    fill.style.strokeDasharray = `${len} ${len}`;
    let current = -1;

    const render = (p) => {
      const d = Math.max(0.0001, p) * len;
      fill.style.strokeDashoffset = len - d;
      const pt = fill.getPointAtLength(d);
      dot.setAttribute('cx', pt.x);
      dot.setAttribute('cy', pt.y);
      const idx = Math.min(steps.length - 1, Math.floor(p * steps.length * 0.999));
      if (idx !== current) {
        current = idx;
        steps.forEach((s, k) => s.classList.toggle('is-active', k === idx));
        num.textContent = String(idx + 1).padStart(2, '0');
      }
    };
    render(0);

    const mm = gsap.matchMedia();
    mm.add('(min-width: 1021px)', () => {
      ScrollTrigger.create({
        trigger: '.process-pin', start: 'top top', end: '+=220%', pin: true, scrub: 0.6,
        onUpdate: (self) => render(self.progress)
      });
    });
    mm.add('(max-width: 1020px)', () => {
      ScrollTrigger.create({
        trigger: '.process-steps', start: 'top 75%', end: 'bottom 45%', scrub: 0.6,
        onUpdate: (self) => render(self.progress)
      });
    });
  }

  function initTabs(g) {
    const tabs = $$('.tab');
    const demos = $$('.demo');
    if (!tabs.length) return;

    const DURATION = 8; // seconds per demo
    let active = 0;
    let demoTl = null;
    let progTl = null;
    let inView = false;

    const builders = [buildPricing, buildService, buildDocs, buildForecast];

    function show(i, autoplay = true) {
      active = i;
      tabs.forEach((t, k) => {
        t.classList.toggle('is-active', k === i);
        t.setAttribute('aria-selected', k === i ? 'true' : 'false');
        t.tabIndex = k === i ? 0 : -1;
      });
      demos.forEach((d, k) => { d.hidden = k !== i; });

      if (!g) { staticState(demos[i]); return; }

      if (demoTl) demoTl.kill();
      if (progTl) progTl.kill();
      $$('.tab-progress i').forEach((b) => g.set(b, { scaleX: 0 }));

      demoTl = builders[i](demos[i]);
      g.fromTo(demos[i].querySelector('.device'), { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6 });
      g.fromTo(demos[i].querySelector('.demo-copy'), { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.6 });

      const bar = tabs[i].querySelector('.tab-progress i');
      progTl = g.to(bar, {
        scaleX: 1, duration: DURATION, ease: 'none',
        onComplete: () => show((active + 1) % tabs.length)
      });
      if (!autoplay || !inView) { progTl.pause(); demoTl.pause(); }
    }

    tabs.forEach((t, i) => {
      t.addEventListener('click', () => show(i, true));
      t.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
          e.preventDefault();
          const n = (active + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
          show(n);
          tabs[n].focus();
        }
      });
    });

    show(0, false);

    if (g && window.ScrollTrigger) {
      ScrollTrigger.create({
        trigger: '.stage', start: 'top 80%', end: 'bottom 20%',
        onToggle: (self) => {
          inView = self.isActive;
          if (inView) {
            if (demoTl && demoTl.progress() === 0) show(active);
            else { demoTl && demoTl.play(); progTl && progTl.play(); }
          } else {
            demoTl && demoTl.pause();
            progTl && progTl.pause();
          }
        }
      });
    }

    /* --- demo builders --- */
    function buildPricing(el) {
      const steps = $$('[data-step]', el);
      const chips = $$('[data-chip]', el);
      const bars = $$('.margin-bars i', el);
      const counts = $$('.count', el);
      chips.forEach((c) => c.classList.remove('on'));
      g.set(steps, { opacity: 0, y: 12 });
      g.set(bars, { scaleY: 0 });
      counts.forEach((c) => { c.textContent = fmtCount(c, 0); });
      const tl = g.timeline({ delay: 0.3 });
      tl.to(steps[0], { opacity: 1, y: 0, duration: 0.5 })
        .to(steps[1], { opacity: 1, y: 0, duration: 0.4 }, '+=0.4');
      chips.forEach((c) => tl.add(() => c.classList.add('on'), '+=0.5'));
      tl.to(steps[2], { opacity: 1, y: 0, duration: 0.5 }, '+=0.4')
        .to(steps[3], { opacity: 1, y: 0, duration: 0.5 }, '+=0.5')
        .to(bars, { scaleY: 1, duration: 0.8, stagger: 0.07, ease: 'power3.out' }, '<');
      counts.forEach((c) => tl.add(countUp(c), '<+=0.2'));
      return tl;
    }

    function buildService(el) {
      const steps = $$('[data-step]', el);
      const chips = $$('[data-chip]', el);
      chips.forEach((c) => c.classList.remove('on'));
      g.set(steps, { opacity: 0, y: 14 });
      const tl = g.timeline({ delay: 0.3 });
      tl.to(steps[0], { opacity: 1, y: 0, duration: 0.5 })
        .to(steps[1], { opacity: 1, y: 0, duration: 0.4 }, '+=0.5');
      chips.forEach((c) => tl.add(() => c.classList.add('on'), '+=0.55'));
      tl.to(steps[2], { opacity: 1, y: 0, duration: 0.5 }, '+=0.5')
        .to(steps[3], { opacity: 1, y: 0, duration: 0.5 }, '+=0.9')
        .to(steps[4], { opacity: 1, y: 0, duration: 0.5 }, '+=0.4');
      return tl;
    }

    function buildDocs(el) {
      const rows = $$('[data-row]', el);
      const foot = $('[data-step]', el);
      const counts = $$('.count', el);
      g.set(rows, { opacity: 0, y: 10 });
      g.set(foot, { opacity: 0 });
      counts.forEach((c) => { c.textContent = fmtCount(c, 0); });
      const tl = g.timeline({ delay: 0.2 });
      rows.forEach((row, r) => {
        const states = $$('.doc-status b', row);
        g.set(states, { opacity: 0, y: 0 });
        g.set(states[0], { opacity: 1 });
        const t0 = r * 0.55;
        tl.to(row, { opacity: 1, y: 0, duration: 0.45 }, t0);
        states.forEach((s, k) => {
          if (k === 0) return;
          const at = t0 + 0.5 + k * 0.5;
          tl.to(states[k - 1], { opacity: 0, y: -6, duration: 0.25 }, at)
            .fromTo(s, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.3 }, at + 0.1);
        });
      });
      tl.to(foot, { opacity: 1, duration: 0.5 }, '+=0.2');
      counts.forEach((c) => tl.add(countUp(c), '<'));
      return tl;
    }

    function buildForecast(el) {
      const bars = $$('.bar i', el);
      const note = $('[data-step]', el);
      const counts = $$('.count', el);
      g.set(bars, { scaleY: 0 });
      g.set(note, { opacity: 0, y: 8 });
      counts.forEach((c) => { c.textContent = fmtCount(c, 0); });
      const tl = g.timeline({ delay: 0.3 });
      counts.forEach((c) => tl.add(countUp(c), 0));
      tl.to(bars, { scaleY: 1, duration: 1, stagger: 0.08, ease: 'power3.out' }, 0.2)
        .to(note, { opacity: 1, y: 0, duration: 0.5 }, '+=0.3');
      return tl;
    }

    // data-dec: decimals to show. data-money: thousands separators (en-US).
    function fmtCount(elm, v) {
      const dec = +(elm.dataset.dec || 0);
      if ('money' in elm.dataset) return v.toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec });
      return v.toFixed(dec);
    }

    function countUp(elm) {
      const to = +elm.dataset.to;
      const o = { v: 0 };
      return g.to(o, { v: to, duration: 1.4, ease: 'power2.out', onUpdate: () => { elm.textContent = fmtCount(elm, o.v); } });
    }

    function staticState(el) {
      $$('.count', el).forEach((c) => { c.textContent = fmtCount(c, +c.dataset.to); });
      $$('[data-chip]', el).forEach((c) => c.classList.add('on'));
      $$('.doc-status', el).forEach((s) => {
        const b = $$('b', s);
        b.forEach((x, k) => { x.style.opacity = k === b.length - 1 ? 1 : 0; });
      });
      $$('.bar i, .margin-bars i', el).forEach((b) => { b.style.transform = 'none'; });
    }
  }

  function initNav(lenisRef) {
    const nav = $('#nav');
    if (!nav) return;
    const sections = $$('[data-theme]');
    const links = $$('.nav-links a');
    const linkTargets = links.map((a) => $(a.getAttribute('href')));
    let lastY = window.scrollY;

    const update = () => {
      const y = window.scrollY;
      nav.classList.toggle('is-scrolled', y > 8);

      const goingDown = y > lastY + 4;
      const goingUp = y < lastY - 4;
      if (goingDown && y > window.innerHeight * 0.9 && !document.body.classList.contains('menu-open')) nav.classList.add('is-hidden');
      else if (goingUp || y < 40) nav.classList.remove('is-hidden');
      lastY = y;

      const probe = 32;
      let theme = 'dark';
      for (const s of sections) {
        const r = s.getBoundingClientRect();
        if (r.top <= probe && r.bottom > probe) { theme = s.dataset.theme; break; }
      }
      const footer = $('.footer');
      if (footer && footer.getBoundingClientRect().top <= probe) theme = 'dark';
      nav.dataset.on = theme;

      const mid = window.innerHeight * 0.4;
      links.forEach((a, i) => {
        const t = linkTargets[i];
        if (!t) return;
        const r = t.getBoundingClientRect();
        a.classList.toggle('is-current', r.top <= mid && r.bottom > mid);
      });
    };

    if (lenisRef) lenisRef.on('scroll', update);
    else window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();

    // Anchor links
    $$('a[href^="#"]').forEach((a) => {
      a.addEventListener('click', (e) => {
        const id = a.getAttribute('href');
        const target = id === '#top' ? document.body : $(id);
        if (!target) return;
        e.preventDefault();
        if (a.dataset.interest) selectInterest(a.dataset.interest);
        document.body.classList.remove('menu-open');
        $('#burger') && $('#burger').setAttribute('aria-expanded', 'false');
        if (lenisRef) { lenisRef.start(); lenisRef.scrollTo(target, { offset: 0, duration: 1.4 }); }
        else target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
      });
    });
  }

  function initMenu(lenisRef) {
    const burger = $('#burger');
    const menu = $('#menu');
    if (!burger || !menu) return;
    burger.addEventListener('click', () => {
      const open = !document.body.classList.contains('menu-open');
      document.body.classList.toggle('menu-open', open);
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? t('Close menu') : t('Open menu'));
      menu.setAttribute('aria-hidden', String(!open));
      if (lenisRef) open ? lenisRef.stop() : lenisRef.start();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && document.body.classList.contains('menu-open')) burger.click();
    });
  }

  function selectInterest(value) {
    const input = $(`.pills input[value="${value}"]`);
    if (input) input.checked = true;
  }

  function initForm() {
    const form = $('#contact-form');
    const note = $('#form-note');
    if (!form) return;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const name = (data.get('name') || '').toString().trim();
      const email = (data.get('email') || '').toString().trim();
      let ok = true;
      [['f-name', !!name], ['f-email', /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)]].forEach(([id, valid]) => {
        $('#' + id).parentElement.classList.toggle('has-error', !valid);
        if (!valid) ok = false;
      });
      if (!ok) { note.textContent = t('Please add your name and a valid email.'); return; }

      const company = (data.get('company') || '').toString().trim();
      const interest = data.get('interest');
      const message = (data.get('message') || '').toString().trim();
      const subject = `${interest} · ${company || name}`;
      const body = `Name: ${name}\nEmail: ${email}\nCompany: ${company}\nInterest: ${interest}\n\n${message}`;
      window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      note.textContent = t('Thanks. Your email app should open with the message ready to send.');
    });
  }
})();
