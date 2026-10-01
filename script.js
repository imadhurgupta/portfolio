/* ============================
   MADHUR GUPTA — PORTFOLIO JS
   Minimal, formal interactions
   ============================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Footer year ── */
  const yearEl = document.getElementById('footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ── Navbar scroll effect ── */
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ── Mobile nav toggle ── */
  const toggle = document.getElementById('nav-toggle');
  const mobileNav = document.getElementById('nav-mobile');

  toggle?.addEventListener('click', () => {
    mobileNav.classList.toggle('open');
  });

  // Close mobile nav on link click
  mobileNav?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileNav.classList.remove('open');
    });
  });

  /* ── Active nav link on scroll ── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a, .nav-mobile a');

  const highlightNav = () => {
    let current = '';
    sections.forEach(s => {
      const top = s.offsetTop - 90;
      if (window.scrollY >= top) current = s.getAttribute('id');
    });
    navLinks.forEach(link => {
      link.style.color = '';
      if (link.getAttribute('href') === `#${current}`) {
        link.style.color = 'var(--white)';
      }
    });
  };
  window.addEventListener('scroll', highlightNav, { passive: true });

  /* ── Contact form ── */
  const form = document.getElementById('contact-form');
  const submitBtn = document.getElementById('f-submit');
  const submitText = document.getElementById('f-submit-text');

  const showErr = (id, msg) => {
    const el = document.getElementById(id);
    if (el) el.textContent = msg;
  };

  const clearErr = id => {
    const el = document.getElementById(id);
    if (el) el.textContent = '';
  };

  const validate = () => {
    let valid = true;

    const name = document.getElementById('f-name').value.trim();
    const email = document.getElementById('f-email').value.trim();
    const msg = document.getElementById('f-message').value.trim();

    clearErr('err-name');
    clearErr('err-email');
    clearErr('err-message');

    if (!name) { showErr('err-name', 'Name is required.'); valid = false; }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showErr('err-email', 'Enter a valid email address.'); valid = false;
    }
    if (!msg || msg.length < 15) {
      showErr('err-message', 'Message must be at least 15 characters.'); valid = false;
    }

    return valid;
  };

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validate()) return;

    submitBtn.disabled = true;
    submitText.textContent = 'Sending…';

    // Simulate async send (replace with real form endpoint)
    await new Promise(r => setTimeout(r, 1200));

    submitText.textContent = 'Message Sent ✓';
    submitBtn.style.background = '#1a1a1a';
    submitBtn.style.color = 'var(--silver)';
    submitBtn.style.borderColor = 'var(--border)';

    setTimeout(() => {
      form.reset();
      submitText.textContent = 'Send Message';
      submitBtn.disabled = false;
      submitBtn.style.cssText = '';
    }, 4000);
  });

  /* ── Subtle fade-in on scroll (IntersectionObserver) ── */
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'none';
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  const animTargets = document.querySelectorAll(
    '.project-card, .cert-card, .stat-box, .pillar, .skill-group, .timeline-item'
  );

  animTargets.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(14px)';
    el.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    obs.observe(el);
  });

});
