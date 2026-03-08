/* ============================================================
   ÀṢÀ LUXURY EVENTS — Main JavaScript
   Features:
   - Sticky navbar on scroll
   - Hero slider with auto-play
   - Hamburger mobile menu
   - Gallery filter + lightbox
   - Testimonial carousel
   - Scroll reveal animations
   - Form validation
   - Scroll-to-top button
============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ============================================================
     1. STICKY NAVBAR
     Adds .scrolled class after scrolling past the hero
  ============================================================ */
  const navbar = document.getElementById('navbar');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });


  /* ============================================================
     2. HAMBURGER MOBILE MENU
  ============================================================ */
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('navMenu');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('open');
  });

  // Close menu when a nav link is clicked
  navMenu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navMenu.classList.remove('open');
    });
  });


  /* ============================================================
     3. HERO SLIDER
     Auto-advances every 5 seconds; dots navigate manually
  ============================================================ */
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.dot');
  let currentSlide = 0;
  let sliderTimer = null;

  function goToSlide(index) {
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');
    currentSlide = (index + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
  }

  function startSlider() {
    sliderTimer = setInterval(() => {
      goToSlide(currentSlide + 1);
    }, 5500);
  }

  // Dot click handlers
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      clearInterval(sliderTimer);
      goToSlide(Number(dot.dataset.index));
      startSlider();
    });
  });

  startSlider();


  /* ============================================================
     4. GALLERY — Filter Tabs
  ============================================================ */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active state
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      galleryItems.forEach(item => {
        if (filter === 'all' || item.dataset.category === filter) {
          item.classList.remove('hidden');
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });


  /* ============================================================
     5. GALLERY — Lightbox
  ============================================================ */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');

  // Build a list of visible items for prev/next navigation
  let visibleItems = [];
  let lightboxIndex = 0;

  function openLightbox(index) {
    visibleItems = [...galleryItems].filter(i => !i.classList.contains('hidden'));
    lightboxIndex = index;
    updateLightbox();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function updateLightbox() {
    const item = visibleItems[lightboxIndex];
    lightboxImg.src = item.dataset.src;
    lightboxCaption.textContent = item.querySelector('span').textContent;
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    // Delay clearing src to allow fade-out
    setTimeout(() => { lightboxImg.src = ''; }, 400);
  }

  // Attach click to each gallery item
  galleryItems.forEach((item, i) => {
    item.addEventListener('click', () => {
      visibleItems = [...galleryItems].filter(g => !g.classList.contains('hidden'));
      const indexInVisible = visibleItems.indexOf(item);
      openLightbox(indexInVisible);
    });
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxPrev.addEventListener('click', () => {
    lightboxIndex = (lightboxIndex - 1 + visibleItems.length) % visibleItems.length;
    updateLightbox();
  });
  lightboxNext.addEventListener('click', () => {
    lightboxIndex = (lightboxIndex + 1) % visibleItems.length;
    updateLightbox();
  });

  // Close on backdrop click
  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
  });

  // Keyboard navigation
  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') { lightboxIndex = (lightboxIndex - 1 + visibleItems.length) % visibleItems.length; updateLightbox(); }
    if (e.key === 'ArrowRight') { lightboxIndex = (lightboxIndex + 1) % visibleItems.length; updateLightbox(); }
  });


  /* ============================================================
     6. TESTIMONIAL CAROUSEL
  ============================================================ */
  const testimonialSlides = document.querySelectorAll('.testimonial-slide');
  const tDots = document.querySelectorAll('.t-dot');
  const tPrev = document.getElementById('tPrev');
  const tNext = document.getElementById('tNext');
  let currentTestimonial = 0;
  let tTimer = null;

  function goToTestimonial(index) {
    testimonialSlides[currentTestimonial].classList.remove('active');
    tDots[currentTestimonial].classList.remove('active');
    currentTestimonial = (index + testimonialSlides.length) % testimonialSlides.length;
    testimonialSlides[currentTestimonial].classList.add('active');
    tDots[currentTestimonial].classList.add('active');
  }

  function startTestimonialTimer() {
    tTimer = setInterval(() => goToTestimonial(currentTestimonial + 1), 6000);
  }

  tPrev.addEventListener('click', () => { clearInterval(tTimer); goToTestimonial(currentTestimonial - 1); startTestimonialTimer(); });
  tNext.addEventListener('click', () => { clearInterval(tTimer); goToTestimonial(currentTestimonial + 1); startTestimonialTimer(); });
  tDots.forEach((dot, i) => {
    dot.addEventListener('click', () => { clearInterval(tTimer); goToTestimonial(i); startTestimonialTimer(); });
  });

  startTestimonialTimer();


  /* ============================================================
     7. SCROLL REVEAL ANIMATIONS
     Uses IntersectionObserver to trigger animations on scroll
  ============================================================ */
  const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealEls.forEach(el => revealObserver.observe(el));


  /* ============================================================
     8. BOOKING FORM VALIDATION
  ============================================================ */
  const bookingForm = document.getElementById('bookingForm');
  const formSuccess = document.getElementById('formSuccess');

  if (bookingForm) {
    bookingForm.addEventListener('submit', e => {
      e.preventDefault();
      let valid = true;

      // Name
      const name = document.getElementById('bName');
      const nameErr = document.getElementById('bNameErr');
      if (!name.value.trim()) {
        nameErr.textContent = 'Please enter your full name.';
        nameErr.classList.add('visible');
        valid = false;
      } else {
        nameErr.classList.remove('visible');
      }

      // Email
      const email = document.getElementById('bEmail');
      const emailErr = document.getElementById('bEmailErr');
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.value.trim())) {
        emailErr.textContent = 'Please enter a valid email address.';
        emailErr.classList.add('visible');
        valid = false;
      } else {
        emailErr.classList.remove('visible');
      }

      if (valid) {
        // Simulate submission
        const submitBtn = bookingForm.querySelector('button[type="submit"]');
        submitBtn.textContent = 'Sending…';
        submitBtn.disabled = true;

        setTimeout(() => {
          formSuccess.classList.add('visible');
          bookingForm.reset();
          submitBtn.innerHTML = 'Send Consultation Request <i class="ri-send-plane-line"></i>';
          submitBtn.disabled = false;
        }, 1500);
      }
    });
  }


  /* ============================================================
     9. CONTACT FORM SUBMISSION
  ============================================================ */
  const contactForm = document.getElementById('contactForm');
  const contactSuccess = document.getElementById('contactSuccess');

  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      const btn = contactForm.querySelector('button[type="submit"]');
      btn.textContent = 'Sending…';
      btn.disabled = true;
      setTimeout(() => {
        contactSuccess.classList.add('visible');
        contactForm.reset();
        btn.innerHTML = 'Send Message <i class="ri-send-plane-line"></i>';
        btn.disabled = false;
      }, 1200);
    });
  }


  /* ============================================================
     10. SCROLL TO TOP BUTTON
  ============================================================ */
  const scrollTopBtn = document.getElementById('scrollTop');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  }, { passive: true });

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });


  /* ============================================================
     11. SMOOTH ACTIVE NAV HIGHLIGHT on scroll
  ============================================================ */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let scrollPos = window.scrollY + 120;
    sections.forEach(section => {
      if (scrollPos >= section.offsetTop && scrollPos < section.offsetTop + section.offsetHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active-link');
          if (link.getAttribute('href') === '#' + section.id) {
            link.classList.add('active-link');
          }
        });
      }
    });
  }, { passive: true });

});
