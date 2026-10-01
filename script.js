/**
 * Madhur Gupta — Sleek Minimalist Luxury Portfolio
 * Interactive Systems & UX Controller
 */

(function () {
  'use strict';

  // -------------------------------------------------------------------------
  // 01. AUDIO SYNTHESIZER ENGINE (Web Audio API)
  // -------------------------------------------------------------------------
  class LuxurySoundEngine {
    constructor() {
      this.ctx = null;
      this.enabled = false;
    }

    init() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    toggle() {
      this.enabled = !this.enabled;
      if (this.enabled) {
        this.init();
        this.playChime(587.33, 0.15); // D5 pleasant warm tone
      }
      return this.enabled;
    }

    playClick() {
      if (!this.enabled || !this.ctx) return;
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.04);

        gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.04);
      } catch (e) {}
    }

    playChime(freq = 523.25, duration = 0.25) {
      if (!this.enabled || !this.ctx) return;
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.5, this.ctx.currentTime + duration);

        gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + duration);
      } catch (e) {}
    }
  }

  const soundEngine = new LuxurySoundEngine();

  // -------------------------------------------------------------------------
  // 02. AMBIENT MOUSE SPOTLIGHT
  // -------------------------------------------------------------------------
  const ambientSpotlight = document.getElementById('ambient-spotlight');

  if (ambientSpotlight && window.matchMedia('(pointer: fine)').matches) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let currentX = mouseX;
    let currentY = mouseY;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    const renderSpotlight = () => {
      currentX += (mouseX - currentX) * 0.12;
      currentY += (mouseY - currentY) * 0.12;
      ambientSpotlight.style.transform = `translate(${currentX}px, ${currentY}px)`;
      requestAnimationFrame(renderSpotlight);
    };
    renderSpotlight();
  }

  // -------------------------------------------------------------------------
  // 03. HERO CONSTELLATION CANVAS
  // -------------------------------------------------------------------------
  const initHeroCanvas = () => {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width, height;
    let particles = [];
    const count = 45;
    let mouse = { x: -1000, y: -1000 };

    const resize = () => {
      width = canvas.width = canvas.parentElement.offsetWidth;
      height = canvas.height = canvas.parentElement.offsetHeight;
    };

    window.addEventListener('resize', resize);
    resize();

    window.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.35;
        this.vy = (Math.random() - 0.5) * 0.35;
        this.radius = Math.random() * 1.5 + 0.6;
        this.alpha = Math.random() * 0.4 + 0.2;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212, 175, 55, ${this.alpha})`;
        ctx.fill();
      }
    }

    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Connect nearby particles
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        p1.update();
        p1.draw();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            const lineAlpha = (1 - dist / 120) * 0.12;
            ctx.strokeStyle = `rgba(212, 175, 55, ${lineAlpha})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }

        // Connect to mouse if close
        const mdx = p1.x - mouse.x;
        const mdy = p1.y - mouse.y;
        const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mDist < 140) {
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(mouse.x, mouse.y);
          const mAlpha = (1 - mDist / 140) * 0.22;
          ctx.strokeStyle = `rgba(243, 231, 196, ${mAlpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }

      requestAnimationFrame(animate);
    };

    animate();
  };

  // -------------------------------------------------------------------------
  // 04. 3D TILT EFFECT ON CARDS
  // -------------------------------------------------------------------------
  const initTiltCards = () => {
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const cards = document.querySelectorAll('.tilt-card');
    cards.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -4.5;
        const rotateY = ((x - centerX) / centerX) * 4.5;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
      });
    });
  };

  // -------------------------------------------------------------------------
  // 05. CLOCKS & LIVE TELEMETRY
  // -------------------------------------------------------------------------
  const initSystemClocks = () => {
    const mobileClock = document.getElementById('mobile-utc-clock');
    const currentYear = document.getElementById('current-year');

    if (currentYear) {
      currentYear.textContent = new Date().getFullYear();
    }

    const updateClocks = () => {
      const now = new Date();
      // Format in IST (India Standard Time)
      const options = { timeZone: 'Asia/Kolkata', hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' };
      const istString = now.toLocaleTimeString('en-GB', options) + ' IST';

      if (mobileClock) mobileClock.textContent = istString;
    };

    updateClocks();
    setInterval(updateClocks, 1000);
  };

  // -------------------------------------------------------------------------
  // 06. HEADER SCROLL & NAVIGATION
  // -------------------------------------------------------------------------
  const initNavigation = () => {
    const header = document.getElementById('main-header');
    const navLinks = document.querySelectorAll('.desktop-nav .nav-link');
    const mobileToggle = document.getElementById('mobile-menu-btn');
    const mobileDrawer = document.getElementById('mobile-menu-drawer');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');

    // Sticky header shadow
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });

    // Mobile drawer toggle
    if (mobileToggle && mobileDrawer) {
      mobileToggle.addEventListener('click', () => {
        const isOpen = mobileDrawer.classList.toggle('active');
        mobileToggle.setAttribute('aria-expanded', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
        soundEngine.playClick();
      });

      mobileLinks.forEach((link) => {
        link.addEventListener('click', () => {
          mobileDrawer.classList.remove('active');
          mobileToggle.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        });
      });
    }

    // Active link on scroll
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
      let current = '';
      sections.forEach((section) => {
        const sectionTop = section.offsetTop - 120;
        if (window.pageYOffset >= sectionTop) {
          current = section.getAttribute('id');
        }
      });

      navLinks.forEach((link) => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
          link.classList.add('active');
        }
      });
    });
  };

  // -------------------------------------------------------------------------
  // 07. ARCHITECTURE WORKBENCH DATA & CONTROLLER (MADHUR GUPTA STACK)
  // -------------------------------------------------------------------------
  const architectureData = {
    ingress: {
      badge: 'LAYER 01: CLOUD INGRESS & OAUTH 2.0',
      status: 'OPERATIONAL · OAUTH 2.0 ENFORCED',
      title: 'Google Cloud Load Balancing & OAuth Authentication',
      desc: 'Standardized security boundary with Google Cloud Platform integration. Enforces Google OAuth 2.0 token validation, role separation across attendees, organizers, and managers, and automated SSL termination.',
      lat: 'OAuth 2.0 + JWT',
      conn: 'GCP & AWS Clouds',
      iso: '3-Tier RBAC',
      sec: 'Docker Multi-Stage',
      safeguards: [
        'Automated token signature verification preventing session hijacking and replay attacks',
        'Role-based access matrix separating administrative routes from public-facing endpoints',
        'Cross-Site Request Forgery (CSRF) and CORS protection integrated into Flask/Django middleware'
      ]
    },
    multitenant: {
      badge: 'LAYER 02: MULTI-TENANT CMS & TEMPLATE PIPELINE',
      status: 'ISOLATED · DYNAMIC THEMING ACTIVE',
      title: 'Scalable Multi-Tenant Architecture & Plugin Hook Engine',
      desc: 'Engineered multi-tenant website builder architecture supporting isolated websites, custom domains, and dynamic themes from a unified Django/PostgreSQL backend. Custom event-driven hook/filter engine allows modular extensibility without touching core logic.',
      lat: '< 25ms Render',
      conn: 'Multi-Tenant Scale',
      iso: 'Database Schema Isolation',
      sec: 'Plugin Hook Sandboxing',
      safeguards: [
        'Dynamic tenant resolution via request host headers with custom domain CNAME support',
        'Event-driven hooks and filters isolating custom plugin executions from core kernel',
        'Centralized dashboard telemetry tracking per-site resource consumption and storage'
      ]
    },
    containers: {
      badge: 'LAYER 03: CONTAINER MESH & CI/CD PIPELINE',
      status: 'CONTAINERIZED · GITHUB ACTIONS AUTOMATED',
      title: 'Docker Multi-Stage Containers & Kubernetes Orchestration',
      desc: 'All 5+ production services containerized via lightweight Alpine-based Docker multi-stage builds. Orchestrated with Kubernetes, infrastructure automated with Terraform, and zero-touch delivery pipelines powered by GitHub Actions.',
      lat: 'Automated CI/CD',
      conn: 'Kubernetes Pods',
      iso: 'Container Namespaces',
      sec: 'Prometheus / Grafana',
      safeguards: [
        'Multi-stage Docker builds minimizing attack surface and container image footprint',
        'Automated test suites and linting gating every GitHub commit prior to production rollout',
        'Continuous Prometheus metrics gathering and Grafana dashboards for proactive incident alerts'
      ]
    },
    database: {
      badge: 'LAYER 04: RELATIONAL SCHEMAS & SECURE RBAC',
      status: 'TRANSACTIONAL · SCHEMA ENFORCED',
      title: 'PostgreSQL Relational Design & Cloud CherryTree RBAC',
      desc: 'Architected during tenure as Python SME at Octopyder Services. Features normalized relational schemas, multi-tenant tenancy tables, indexed query execution plans, and strict Role-Based Access Control (RBAC) ensuring enterprise cybersecurity standards.',
      lat: '< 15ms Queries',
      conn: 'PostgreSQL & MySQL',
      iso: 'Role-Based Row Security',
      sec: 'Encrypted Passwords & Secrets',
      safeguards: [
        'Fine-grained role tables with granular permissions (Admin, Security, Auditor, DevOps)',
        'Parameterized query execution eliminating SQL injection vulnerabilities at the ORM layer',
        'Automated transactional rollbacks preserving data consistency across complex multi-step updates'
      ]
    },
    ai_rag: {
      badge: 'LAYER 05: APPLIED AI & MULTI-AGENT PIPELINES',
      status: 'INTELLIGENT · CONTEXT AWARE',
      title: 'LangChain, Retrieval-Augmented Generation (RAG) & Multi-Agent Systems',
      desc: 'Certified across Oracle AI Foundations, Google GenAI, and Columbia ML. Practical implementations orchestrating LangChain chains, vector retrieval pipelines, and multi-agent systems for contextual analysis and automated task execution.',
      lat: 'Low Latency Stream',
      conn: 'Vector Embeddings',
      iso: 'Agent Context Guardrails',
      sec: 'GenAI Certified',
      safeguards: [
        'Semantic retrieval relevance filtering mitigating hallucination risks in RAG answers',
        'Prompt injection defense filters and output validation schemas on all model calls',
        'Modular multi-agent architectures allowing specialized agent handoffs for complex tasks'
      ]
    }
  };

  const initArchitectureWorkbench = () => {
    const nodeBtns = document.querySelectorAll('.arch-node-btn');
    const badge = document.getElementById('arch-badge');
    const statusText = document.getElementById('arch-status-text');
    const title = document.getElementById('arch-title');
    const desc = document.getElementById('arch-desc');
    const metricLat = document.getElementById('arch-metric-lat');
    const metricConn = document.getElementById('arch-metric-conn');
    const metricIso = document.getElementById('arch-metric-iso');
    const metricSec = document.getElementById('arch-metric-sec');
    const safeguards = document.getElementById('arch-safeguards');

    nodeBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const nodeId = btn.getAttribute('data-node');
        const data = architectureData[nodeId];
        if (!data) return;

        soundEngine.playClick();

        nodeBtns.forEach((b) => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        // Update inspector with smooth transition
        const inspector = document.querySelector('.arch-inspector-panel');
        inspector.style.opacity = '0.7';

        setTimeout(() => {
          badge.textContent = data.badge;
          statusText.textContent = data.status;
          title.textContent = data.title;
          desc.textContent = data.desc;
          metricLat.textContent = data.lat;
          metricConn.textContent = data.conn;
          metricIso.textContent = data.iso;
          metricSec.textContent = data.sec;

          safeguards.innerHTML = data.safeguards
            .map((item) => `<li>${item}</li>`)
            .join('');

          inspector.style.opacity = '1';
        }, 120);
      });
    });
  };

  // -------------------------------------------------------------------------
  // 08. PROJECT FILTERING & DETAIL MODAL (MADHUR GUPTA PROJECTS)
  // -------------------------------------------------------------------------
  const projectsData = {
    webpress: {
      tag: 'MULTI-TENANT CMS & WEBSITE BUILDER',
      title: 'WebPress — Multi-Tenant Website Builder & Modular CMS',
      subtitle: 'Scalable multi-tenant architecture with drag-and-drop builder, custom domains & plugin engine',
      image: 'assets/project-webpress.jpg',
      deepdive: 'Architected a comprehensive multi-tenant Content Management System and drag-and-drop website builder that allows users to manage multiple isolated client websites from a single centralized dashboard. Engineered custom domain routing, dynamic theme selection, and an event-driven plugin hook/filter engine enabling modular extensibility without touching the core codebase.',
      metrics: [
        { val: 'Multi-Tenant', lbl: 'Isolated Sites Architecture' },
        { val: 'Dockerized', lbl: 'Cloud-Native Container' },
        { val: 'Hooks/Filters', lbl: 'Event-Driven Plugin Core' },
        { val: 'Custom Domains', lbl: 'Dynamic Tenant Routing' }
      ],
      tech: ['Python-Django', 'PostgreSQL', 'JavaScript', 'HTML/CSS', 'Docker', 'OAuth 2.0', 'Plugin Engine']
    },
    codesnippets: {
      tag: 'DEVELOPER WORKSPACE & CLOUD VAULT',
      title: 'CodeSnippets — "Terminal Midnight" Developer Workspace',
      subtitle: 'High-performance glassmorphic code snippet manager with fluid animations & multi-language support',
      image: 'assets/project-codesnippets.jpg',
      deepdive: 'Developed a high-performance "Terminal Midnight" developer workspace to securely store, organize, and retrieve reusable code snippets. Designed with glassmorphic aesthetics, fluid 60fps micro-animations via Framer Motion, syntax highlighting across 50+ programming languages, instant full-text filtering, and real-time cross-device cloud synchronization powered by Firebase Firestore and Authentication.',
      metrics: [
        { val: '50+', lbl: 'Languages Highlighted' },
        { val: 'Realtime', lbl: 'Firebase Cloud Sync' },
        { val: '60 FPS', lbl: 'Framer Motion Fluid UX' },
        { val: 'Instant', lbl: 'Search & Tag Indexing' }
      ],
      tech: ['React.js', 'Node.js', 'Tailwind CSS', 'Firebase Firestore', 'Firebase Auth', 'Framer Motion', 'Lucide React']
    },
    eventark: {
      tag: 'EVENT DISCOVERY & TICKETING PLATFORM',
      title: 'Eventark — Event Discovery, Ticketing & RSVP Platform',
      subtitle: 'Full-stack event discovery with role-based access control & automated QR-code generation',
      image: 'assets/project-eventark.jpg',
      deepdive: 'Built an end-to-end event management platform on GCP featuring distinct 3-tier role-based access control for Attendees, Organizers, and Managers. Implements automated QR-code dynamic ticket generation for streamlined door entry verification, dynamic event discovery carousels, Google OAuth authentication, and secure relational RSVP database management.',
      metrics: [
        { val: '3 Roles', lbl: 'Attendees, Organizers, Managers' },
        { val: 'Auto QR', lbl: 'Dynamic Ticket Pass Engine' },
        { val: 'GCP OAuth', lbl: 'Google Cloud Integration' },
        { val: 'PostgreSQL', lbl: 'Relational RSVP Storage' }
      ],
      tech: ['Python-Flask', 'PostgreSQL', 'Google Cloud Platform (GCP)', 'Google OAuth 2.0', 'HTML/CSS', 'QR Engine']
    },
    cherrytree: {
      tag: 'ENTERPRISE CYBERSECURITY PLATFORM',
      title: 'Cloud CherryTree — Cybersecurity & Threat Telemetry Platform',
      subtitle: 'Architected during tenure as Python SME at Octopyder Services with complex RBAC & Docker deployment',
      image: 'assets/project-cherrytree.jpg',
      deepdive: 'Served as Python Subject Matter Expert (SME) at Octopyder Services, leading technical direction and architecting the Cloud CherryTree cybersecurity platform. Designed complex Role-Based Access Control (RBAC) permission matrices, modeled secure PostgreSQL database schemas, and containerized the entire application via Docker for cloud-native deployment.',
      metrics: [
        { val: 'Python SME', lbl: 'Led Architecture & Team' },
        { val: 'RBAC', lbl: 'Fine-Grained Security Matrix' },
        { val: 'Docker', lbl: 'Cloud-Native Containerization' },
        { val: 'PostgreSQL', lbl: 'Hardened Schema Design' }
      ],
      tech: ['Python', 'PostgreSQL', 'Docker', 'RBAC Security', 'REST APIs', 'Octopyder Services']
    }
  };

  const initProjectFiltersAndModal = () => {
    // Project Category Filtering
    const filterBtns = document.querySelectorAll('.project-filters .filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        soundEngine.playClick();
        const filter = btn.getAttribute('data-filter');

        filterBtns.forEach((b) => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        projectCards.forEach((card) => {
          const category = card.getAttribute('data-category');
          if (filter === 'all' || category === filter) {
            card.classList.remove('hidden-category');
          } else {
            card.classList.add('hidden-category');
          }
        });
      });
    });

    // Project Detail Modal
    const modal = document.getElementById('project-modal');
    const modalBackdrop = document.getElementById('modal-backdrop');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const modalTag = document.getElementById('modal-tag');
    const modalTitle = document.getElementById('modal-title');
    const modalSubtitle = document.getElementById('modal-subtitle');
    const modalImage = document.getElementById('modal-image');
    const modalDeepdiveText = document.getElementById('modal-deepdive-text');
    const modalMetricsContainer = document.getElementById('modal-metrics-container');
    const modalTechStack = document.getElementById('modal-tech-stack');
    const modalCtaBtn = document.getElementById('modal-cta-btn');

    const openProjectModal = (projectId) => {
      const data = projectsData[projectId];
      if (!data) return;

      soundEngine.playChime(659.25, 0.2); // E5 pleasant tone

      modalTag.textContent = data.tag;
      modalTitle.textContent = data.title;
      modalSubtitle.textContent = data.subtitle;
      modalImage.src = data.image;
      modalImage.alt = data.title;
      modalDeepdiveText.textContent = data.deepdive;

      // Metrics
      modalMetricsContainer.innerHTML = data.metrics
        .map(
          (m) => `
        <div class="modal-stat-box">
          <span class="modal-stat-val">${m.val}</span>
          <span class="modal-stat-lbl">${m.lbl}</span>
        </div>
      `
        )
        .join('');

      // Tech Stack
      modalTechStack.innerHTML = data.tech
        .map((t) => `<span class="tech-pill">${t}</span>`)
        .join('');

      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    };

    const closeProjectModal = () => {
      soundEngine.playClick();
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    };

    // Attach trigger buttons
    document.querySelectorAll('[data-project-id]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const projectId = btn.getAttribute('data-project-id');
        openProjectModal(projectId);
      });
    });

    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeProjectModal);
    if (modalBackdrop) modalBackdrop.addEventListener('click', closeProjectModal);
    if (modalCtaBtn) {
      modalCtaBtn.addEventListener('click', () => {
        closeProjectModal();
      });
    }

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeProjectModal();
      }
    });
  };

  // -------------------------------------------------------------------------
  // 09. TOAST NOTIFICATION SYSTEM
  // -------------------------------------------------------------------------
  const showToast = (message, duration = 4000) => {
    const toast = document.getElementById('toast-notification');
    const toastMsg = document.getElementById('toast-message');
    if (!toast || !toastMsg) return;

    toastMsg.textContent = message;
    toast.classList.add('active');

    soundEngine.playChime(783.99, 0.25); // G5 chime

    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
      toast.classList.remove('active');
    }, duration);
  };

  // -------------------------------------------------------------------------
  // 10. COPY EMAIL TO CLIPBOARD
  // -------------------------------------------------------------------------
  const initEmailCopy = () => {
    const quickBtn = document.getElementById('quick-copy-email-btn');
    const copyBtn2 = document.getElementById('copy-email-btn-2');
    const email = 'madhurguptaofficial@gmail.com';

    const copyHandler = (e) => {
      e.preventDefault();
      navigator.clipboard.writeText(email).then(() => {
        showToast('Email address copied to clipboard: ' + email);
        soundEngine.playClick();
      }).catch(() => {
        window.location.href = `mailto:${email}`;
      });
    };

    if (quickBtn) quickBtn.addEventListener('click', copyHandler);
    if (copyBtn2) copyBtn2.addEventListener('click', copyHandler);
  };

  // -------------------------------------------------------------------------
  // 11. AUDIO TOGGLE BUTTON
  // -------------------------------------------------------------------------
  const initAudioToggle = () => {
    const toggleBtn = document.getElementById('sound-toggle-btn');
    const soundIcon = document.getElementById('sound-icon');
    const soundLabel = document.getElementById('sound-label');

    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        const isEnabled = soundEngine.toggle();
        if (isEnabled) {
          soundIcon.textContent = '🔊';
          soundLabel.textContent = 'Audio On';
          showToast('Tactile audio feedback enabled.');
        } else {
          soundIcon.textContent = '🔇';
          soundLabel.textContent = 'Audio Off';
          showToast('Audio muted.');
        }
      });
    }
  };

  // -------------------------------------------------------------------------
  // 12. CONTACT FORM VALIDATION & INTERACTIVE TRANSMISSION
  // -------------------------------------------------------------------------
  const initContactForm = () => {
    const form = document.getElementById('contact-form');
    if (!form) return;

    const nameInput = document.getElementById('contact-name');
    const emailInput = document.getElementById('contact-email');
    const messageInput = document.getElementById('contact-message');
    const submitBtn = document.getElementById('submit-btn');
    const btnSpinner = document.getElementById('btn-spinner');
    const btnText = submitBtn.querySelector('.btn-text');

    const nameError = document.getElementById('name-error');
    const emailError = document.getElementById('email-error');
    const messageError = document.getElementById('message-error');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;

      // Clear errors
      nameError.textContent = '';
      emailError.textContent = '';
      messageError.textContent = '';

      if (!nameInput.value.trim()) {
        nameError.textContent = 'Please enter your name or organization';
        valid = false;
      }

      if (!emailInput.value.trim()) {
        emailError.textContent = 'Correspondence email is required';
        valid = false;
      } else if (!emailRegex.test(emailInput.value.trim())) {
        emailError.textContent = 'Please enter a valid email address';
        valid = false;
      }

      if (!messageInput.value.trim()) {
        messageError.textContent = 'Please outline your message or opportunity brief';
        valid = false;
      } else if (messageInput.value.trim().length < 8) {
        messageError.textContent = 'Message must contain at least 8 characters';
        valid = false;
      }

      if (!valid) {
        soundEngine.playClick();
        return;
      }

      // Simulated transmission dispatch
      soundEngine.playClick();
      submitBtn.disabled = true;
      btnSpinner.classList.remove('hidden');
      btnText.textContent = 'Transmitting Message...';

      setTimeout(() => {
        btnSpinner.classList.add('hidden');
        btnText.textContent = 'Dispatched to Madhur ✦';
        submitBtn.style.background = 'linear-gradient(135deg, #10B981 0%, #059669 100%)';
        submitBtn.style.color = '#fff';

        showToast('Your message has been sent to Madhur Gupta. Thank you for reaching out!');

        setTimeout(() => {
          form.reset();
          submitBtn.disabled = false;
          submitBtn.style.background = '';
          submitBtn.style.color = '';
          btnText.textContent = 'Transmit Transmission';
        }, 3500);
      }, 1200);
    });
  };

  // -------------------------------------------------------------------------
  // 13. DOM INITIALIZATION
  // -------------------------------------------------------------------------
  document.addEventListener('DOMContentLoaded', () => {
    initHeroCanvas();
    initTiltCards();
    initSystemClocks();
    initNavigation();
    initArchitectureWorkbench();
    initProjectFiltersAndModal();
    initEmailCopy();
    initAudioToggle();
    initContactForm();
  });
})();
