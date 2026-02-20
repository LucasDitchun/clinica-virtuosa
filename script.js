// Clínica Virtuosa São Bernardo - Landing Page Scripts

(function () {
  'use strict';

  // --- Header scroll effect ---
  const header = document.getElementById('header');

  function handleScroll() {
    if (window.scrollY > 20) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });

  // --- Mobile menu toggle ---
  const menuToggle = document.getElementById('menuToggle');
  const mobileNav = document.getElementById('mobileNav');
  const mobileLinks = mobileNav.querySelectorAll('.mobile-nav__link');

  menuToggle.addEventListener('click', function () {
    menuToggle.classList.toggle('active');
    mobileNav.classList.toggle('active');
    document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
  });

  mobileLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      menuToggle.classList.remove('active');
      mobileNav.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // --- Smooth scroll for anchor links ---
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        var headerHeight = header.offsetHeight;
        var targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight - 16;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      }
    });
  });

  // --- Before / After slider (mouse hover automático) ---
  var slider = document.getElementById('baSlider');
  var before = document.getElementById('baBefore');
  var handle = document.getElementById('baHandle');

  if (slider && before && handle) {
    var currentRatio = 0.5;
    var targetRatio = 0.5;
    var rafId = null;
    var isHovering = false;

    // Smooth animation via requestAnimationFrame
    function animate() {
      var diff = targetRatio - currentRatio;
      if (Math.abs(diff) > 0.0005) {
        currentRatio += diff * 0.12;
        applyRatio(currentRatio);
        rafId = requestAnimationFrame(animate);
      } else {
        currentRatio = targetRatio;
        applyRatio(currentRatio);
        rafId = null;
      }
    }

    function setTarget(ratio) {
      targetRatio = Math.max(0.02, Math.min(ratio, 0.98));
      if (!rafId) rafId = requestAnimationFrame(animate);
    }

    function applyRatio(ratio) {
      var pct = ratio * 100;
      before.style.width = pct + '%';
      handle.style.left = pct + '%';
      fixBeforeImg();
    }

    function fixBeforeImg() {
      var img = before.querySelector('img');
      if (img) {
        var w = slider.offsetWidth + 'px';
        img.style.width = w;
        img.style.minWidth = w;
      }
    }

    // Mouse hover → move slider
    slider.addEventListener('mousemove', function (e) {
      var rect = slider.getBoundingClientRect();
      setTarget((e.clientX - rect.left) / rect.width);
    });

    // Mouse leave → animate back to centre
    slider.addEventListener('mouseleave', function () {
      setTarget(0.5);
    });

    // Touch → drag support
    slider.addEventListener('touchmove', function (e) {
      e.preventDefault();
      var rect = slider.getBoundingClientRect();
      setTarget((e.touches[0].clientX - rect.left) / rect.width);
    }, { passive: false });

    slider.addEventListener('touchend', function () {
      setTarget(0.5);
    });

    // Resize
    window.addEventListener('resize', fixBeforeImg);

    // Init after images load
    var heroImgs = slider.querySelectorAll('img');
    var loaded = 0;
    heroImgs.forEach(function (img) {
      if (img.complete) { loaded++; }
      else { img.addEventListener('load', function () { loaded++; if (loaded === heroImgs.length) { fixBeforeImg(); applyRatio(0.5); } }); }
    });
    fixBeforeImg();
    applyRatio(0.5);
  }

  // --- Scroll reveal animation ---
  var revealElements = document.querySelectorAll(
    '.treatment-card, .testimonial-card, .differential-card, .result-card, .about__feature, .hero__float-card'
  );

  var style = document.createElement('style');
  style.textContent = [
    '.reveal-hidden { opacity: 0; transform: translateY(24px); transition: opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1); }',
    '.reveal-visible { opacity: 1; transform: translateY(0); }'
  ].join('\n');
  document.head.appendChild(style);

  revealElements.forEach(function (el) {
    el.classList.add('reveal-hidden');
  });

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  revealElements.forEach(function (el, index) {
    el.style.transitionDelay = (index % 3) * 100 + 'ms';
    observer.observe(el);
  });
})();
