// NeoGlow Developer Space 2.0 — script.js
(function(){
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = window.innerWidth <= 1024;

  // Year in footer
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // Typing animation
  const typingEl = document.querySelector('.typing-text');
  if (typingEl && !prefersReduced) {
    const words = (typingEl.getAttribute('data-words') || '').split(',').filter(Boolean);
    if (words.length) {
      let wordIndex = 0;
      let charIndex = 0;
      let isDeleting = false;
      let typingSpeed = 100;

      function type() {
        const currentWord = words[wordIndex];
        if (isDeleting) {
          typingEl.textContent = currentWord.substring(0, charIndex - 1);
          charIndex--;
          typingSpeed = 50;
        } else {
          typingEl.textContent = currentWord.substring(0, charIndex + 1);
          charIndex++;
          typingSpeed = 100;
        }

        if (!isDeleting && charIndex === currentWord.length) {
          typingSpeed = 2000; // pause at end
          isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
          isDeleting = false;
          wordIndex = (wordIndex + 1) % words.length;
          typingSpeed = 500; // pause before next word
        }

        setTimeout(type, typingSpeed);
      }
      type();
    }
  } else if (typingEl) {
    // Fallback: show first word
    const words = (typingEl.getAttribute('data-words') || '').split(',').filter(Boolean);
    if (words.length) typingEl.textContent = words[0];
  }

  // Reveal on scroll
  const revealEls = Array.from(document.querySelectorAll('.reveal-up'));
  if (!prefersReduced && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          // Animate skill bars when their container reveals
          if (entry.target.classList.contains('skill')) {
            const bar = entry.target.querySelector('.bar');
            if (bar) animateBar(bar);
            entry.target.classList.add('in');
          }
          // Animate skills grid children
          if (entry.target.classList.contains('skills-grid')) {
            const skills = entry.target.querySelectorAll('.skill');
            skills.forEach((skill, i) => {
              setTimeout(() => {
                skill.classList.add('in');
                const bar = skill.querySelector('.bar');
                if (bar) animateBar(bar);
              }, i * 100);
            });
          }
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -15% 0px', threshold: 0.15 });
    revealEls.forEach(el=>io.observe(el));
  } else {
    // Fallback: show immediately
    revealEls.forEach(el=>el.classList.add('in'));
    document.querySelectorAll('.skill').forEach(el=>el.classList.add('in'));
    document.querySelectorAll('.bar').forEach(animateBar);
  }

  function animateBar(bar){
    const span = bar.querySelector('span');
    const target = parseInt(bar.getAttribute('data-value') || '0', 10);
    bar.setAttribute('aria-valuenow', String(target));
    requestAnimationFrame(()=>{
      span.style.width = Math.max(0, Math.min(100, target)) + '%';
    });
  }

  // Parallax (subtle)
  const parallaxEls = Array.from(document.querySelectorAll('[data-parallax]'));
  if (!prefersReduced && parallaxEls.length){
    let ticking = false;
    const speedCache = parallaxEls.map(el => parseFloat(el.getAttribute('data-speed') || '1'));

    function onScroll(){
      if (!ticking){
        ticking = true;
        requestAnimationFrame(()=>{
          const top = window.scrollY || window.pageYOffset;
          parallaxEls.forEach((el, i)=>{
            const s = speedCache[i];
            el.style.transform = `translate3d(0, ${top * 0.025 * s}px, 0)`;
          });
          ticking = false;
        });
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // Smooth anchor scroll (enhanced)
  document.addEventListener('click', (e)=>{
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href');
    if (id.length > 1){
      const target = document.querySelector(id);
      if (target){
        e.preventDefault();
        target.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth', block: 'start' });
      }
    }
  });

  // ========== 3D GRADIENT BLOB MOUSE INTERACTION ==========
  if (!prefersReduced && !isMobile) {
    const blobs = document.querySelectorAll('.gradient-blob[data-3d]');
    document.addEventListener('mousemove', (e) => {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      blobs.forEach((blob, i) => {
        const speed = 0.08 + (i * 0.03);
        const xOffset = (x - 0.5) * 60 * speed;
        const yOffset = (y - 0.5) * 60 * speed;
        const zOffset = (x - 0.5) * 30 * speed;
        blob.style.transform = `translate3d(${xOffset}px, ${yOffset}px, ${zOffset}px) scale(${1 + (x - 0.5) * 0.1})`;
      });
    });
  }

  // ========== CURSOR TRAIL ==========
  if (!prefersReduced && !isMobile) {
    const cursorTrail = document.querySelector('.cursor-trail');
    if (cursorTrail) {
      let mouseX = 0, mouseY = 0;
      let trailX = 0, trailY = 0;

      document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
      });

      function animateCursor() {
        const dx = mouseX - trailX;
        const dy = mouseY - trailY;
        trailX += dx * 0.1;
        trailY += dy * 0.1;
        cursorTrail.style.transform = `translate(${trailX}px, ${trailY}px)`;
        requestAnimationFrame(animateCursor);
      }
      animateCursor();
    }
  } else {
    document.body.classList.add('has-cursor');
  }

  // ========== HOLOGRAPHIC PARTICLES ==========
  if (!prefersReduced && !isMobile) {
    const particlesContainer = document.querySelector('.particles-container');
    if (particlesContainer) {
      const particleCount = 40;
      const colors = ['#A855F7', '#06B6D4', '#FF10F0', '#3B82F6'];
      
      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        particle.style.animationDelay = Math.random() * 15 + 's';
        particle.style.animationDuration = (10 + Math.random() * 10) + 's';
        particlesContainer.appendChild(particle);
      }
    }
  }

  // ========== DATA STREAMS ==========
  if (!prefersReduced && !isMobile) {
    const dataStreams = document.querySelector('.data-streams');
    if (dataStreams) {
      const streamCount = 8;
      
      function createDataLine() {
        const line = document.createElement('div');
        line.className = 'data-line';
        line.style.top = Math.random() * 100 + '%';
        line.style.width = (200 + Math.random() * 400) + 'px';
        line.style.animationDuration = (6 + Math.random() * 4) + 's';
        line.style.animationDelay = Math.random() * 8 + 's';
        dataStreams.appendChild(line);
        
        setTimeout(() => {
          line.remove();
          createDataLine();
        }, (6 + Math.random() * 4) * 1000);
      }
      
      for (let i = 0; i < streamCount; i++) {
        setTimeout(() => createDataLine(), i * 1000);
      }
    }
  }

  // ========== SCROLL TO TOP BUTTON ==========
  const scrollToTopBtn = document.querySelector('.scroll-to-top');
  if (scrollToTopBtn) {
    function toggleScrollButton() {
      const scrollY = window.scrollY || window.pageYOffset;
      if (scrollY > 500) {
        scrollToTopBtn.classList.add('visible');
      } else {
        scrollToTopBtn.classList.remove('visible');
      }
    }

    window.addEventListener('scroll', toggleScrollButton, { passive: true });
    toggleScrollButton();

    scrollToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: prefersReduced ? 'auto' : 'smooth'
      });
    });
  }

  // ========== CIRCULAR SKILL GRAPHS ==========
  const skillCircles = document.querySelectorAll('.skill-circle');
  if (skillCircles.length && !prefersReduced && 'IntersectionObserver' in window) {
    const circleObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const circle = entry.target;
          const percent = parseInt(circle.getAttribute('data-percent') || '0', 10);
          const progressCircle = circle.querySelector('.skill-circle-progress');
          
          if (progressCircle) {
            const circumference = 2 * Math.PI * 52; // radius = 52
            const offset = circumference - (percent / 100) * circumference;
            
            setTimeout(() => {
              progressCircle.style.strokeDashoffset = offset;
            }, 100);
          }
          
          circleObserver.unobserve(circle);
        }
      });
    }, { rootMargin: '0px 0px -15% 0px', threshold: 0.15 });

    skillCircles.forEach(circle => circleObserver.observe(circle));
  }

  // ========== PROJECT FILTERS ==========
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');
      
      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      // Filter projects
      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        
        if (filter === 'all' || category === filter) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // ========== TILT EFFECT ON PROJECT CARDS ==========
  if (!prefersReduced && !isMobile) {
    const tiltCards = document.querySelectorAll('.tilt-card');
    
    tiltCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
      });
    });
  }

  // ========== NAVIGATION ACTIVE SECTION HIGHLIGHT ==========
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav a');

  function highlightNavigation() {
    const scrollY = window.scrollY || window.pageYOffset;
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  if (navLinks.length) {
    window.addEventListener('scroll', highlightNavigation, { passive: true });
    highlightNavigation();
  }

  // ========== RIPPLE EFFECT ENHANCEMENT ==========
  const rippleElements = document.querySelectorAll('.ripple-effect');
  
  rippleElements.forEach(element => {
    element.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';
      ripple.classList.add('ripple');
      
      this.appendChild(ripple);
      
      setTimeout(() => ripple.remove(), 600);
    });
  });

  // ========== PARALLAX LAYERS ==========
  if (!prefersReduced && !isMobile) {
    const parallaxLayers = [
      { selector: '.gradient-blob', speed: 0.5 },
      { selector: '.floating-code', speed: 0.3 }
    ];

    let ticking = false;
    
    function updateParallax() {
      const scrollY = window.scrollY || window.pageYOffset;
      
      parallaxLayers.forEach(layer => {
        const elements = document.querySelectorAll(layer.selector);
        elements.forEach(el => {
          const yPos = -(scrollY * layer.speed);
          el.style.transform = `translate3d(0, ${yPos}px, 0)`;
        });
      });
      
      ticking = false;
    }

    function requestParallax() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(updateParallax);
      }
    }

    window.addEventListener('scroll', requestParallax, { passive: true });
  }

  // ========== SMOOTH SCROLL ENHANCEMENT ==========
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#' || href === '#top') {
        e.preventDefault();
        window.scrollTo({
          top: 0,
          behavior: prefersReduced ? 'auto' : 'smooth'
        });
      }
    });
  });

  // ========== PERFORMANCE: Reduce animations on low-end devices ==========
  if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
    document.body.classList.add('reduced-animations');
  }

  // ========== GLASS CARD 3D TILT ==========
  if (!prefersReduced && !isMobile) {
    const glassCards = document.querySelectorAll('.glass-card');
    
    glassCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 15;
        const rotateY = (centerX - x) / 15;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
      });
    });
  }

  // ========== ENHANCED SCROLL PROGRESS ==========
  const scrollProgress = document.createElement('div');
  scrollProgress.className = 'scroll-progress';
  scrollProgress.innerHTML = '<div class="scroll-progress-bar"></div>';
  document.body.appendChild(scrollProgress);

  function updateScrollProgress() {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    const progressBar = document.querySelector('.scroll-progress-bar');
    if (progressBar) {
      progressBar.style.width = scrolled + '%';
    }
  }

  window.addEventListener('scroll', updateScrollProgress, { passive: true });
  updateScrollProgress();

  // ========== NEON SPARK PARTICLES ON CLICK ==========
  if (!prefersReduced && !isMobile) {
    document.addEventListener('click', (e) => {
      const spark = document.createElement('div');
      spark.className = 'click-spark';
      spark.style.left = e.clientX + 'px';
      spark.style.top = e.clientY + 'px';
      document.body.appendChild(spark);
      
      setTimeout(() => spark.remove(), 1000);
    });
  }

  // ========== CONSOLE EASTER EGG ==========
  console.log('%c🚀 NeoGlow Developer Space 2.0 - Ultra Edition', 'font-size: 20px; font-weight: bold; background: linear-gradient(135deg, #A855F7, #06B6D4, #FF10F0); -webkit-background-clip: text; color: transparent;');
  console.log('%cBuilt with 💜 by Ruyyan Ahmed Shamim', 'font-size: 14px; color: #06B6D4;');
  console.log('%cFeaturing: Cursor Trail • Particles • 3D Tilt • Liquid Waves • Neon Glows', 'font-size: 12px; color: #A855F7;');
  console.log('%cInterested in the code? Check out the repo!', 'font-size: 12px; color: #FF10F0;');

})();
