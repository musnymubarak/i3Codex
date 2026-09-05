/**
 * i3Codex Main Interactive JavaScript
 * Powers Practice Tabs, Live Telemetry Simulator, Architecture Review Modal,
 * Interactive Scope & Cost Estimator, Form Validation, Mobile Drawer, and Toasts.
 */

(function () {
  'use strict';

  // --------------------------------------------------------------------------
  // 1. Mobile Drawer Navigation
  // --------------------------------------------------------------------------
  function initMobileNav() {
    const mobileBtn = document.getElementById('mobile-nav-toggle');
    const drawer = document.getElementById('mobile-nav-drawer');
    const closeBtn = document.getElementById('mobile-drawer-close');

    if (!mobileBtn || !drawer) return;

    function openDrawer() {
      drawer.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    function closeDrawer() {
      drawer.classList.remove('open');
      document.body.style.overflow = '';
    }

    mobileBtn.addEventListener('click', openDrawer);
    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);

    // Close on click outside drawer content
    drawer.addEventListener('click', function (e) {
      if (e.target === drawer) closeDrawer();
    });

    // Close when clicking any nav link in drawer
    const drawerLinks = drawer.querySelectorAll('.mobile-drawer-link, .btn');
    drawerLinks.forEach(link => {
      link.addEventListener('click', closeDrawer);
    });
  }

  // --------------------------------------------------------------------------
  // 2. Practice Tabs Switcher (Home Page)
  // --------------------------------------------------------------------------
  function initPracticeTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn[data-practice]');
    const tabPanels = document.querySelectorAll('.tab-panel[data-practice-panel]');

    if (!tabButtons.length || !tabPanels.length) return;

    tabButtons.forEach(btn => {
      btn.addEventListener('click', function () {
        const targetPractice = this.getAttribute('data-practice');

        // Update active tab button
        tabButtons.forEach(b => b.classList.remove('active'));
        this.classList.add('active');

        // Show matching panel
        tabPanels.forEach(panel => {
          if (panel.getAttribute('data-practice-panel') === targetPractice) {
            panel.classList.add('active');
          } else {
            panel.classList.remove('active');
          }
        });
      });
    });
  }

  // --------------------------------------------------------------------------
  // 3. Live Product & Security Telemetry Panel Simulator
  // --------------------------------------------------------------------------
  function initTelemetry() {
    const primaryMetric = document.getElementById('telemetry-latency-val');
    const toggleProduction = document.getElementById('btn-latency-edge');
    const toggleSecurity = document.getElementById('btn-latency-origin');
    const metricLabel = document.getElementById('telemetry-metric-label');

    let currentMode = 'production'; // 'production' or 'security'

    if (toggleProduction && toggleSecurity) {
      toggleProduction.addEventListener('click', () => setMode('production'));
      toggleSecurity.addEventListener('click', () => setMode('security'));
    }

    function setMode(mode) {
      currentMode = mode;
      if (mode === 'production') {
        if (toggleProduction) toggleProduction.style.opacity = '1';
        if (toggleSecurity) toggleSecurity.style.opacity = '0.6';
        if (metricLabel) metricLabel.textContent = 'Active Users (Live Session Concurrency)';
        if (primaryMetric) primaryMetric.textContent = '24,812 online';
      } else {
        if (toggleProduction) toggleProduction.style.opacity = '0.6';
        if (toggleSecurity) toggleSecurity.style.opacity = '1';
        if (metricLabel) metricLabel.textContent = 'Automated Security & Audit Score';
        if (primaryMetric) primaryMetric.textContent = '100% Passed';
      }
    }

    function jitterMetrics() {
      if (!primaryMetric || currentMode !== 'production') return;
      const base = 24800;
      const jitter = Math.floor((Math.random() - 0.5) * 45);
      primaryMetric.textContent = (base + jitter).toLocaleString() + ' online';
    }

    if (primaryMetric) {
      setInterval(jitterMetrics, 4500);
    }
  }

  // --------------------------------------------------------------------------
  // 4. Interactive Project Scope & Cost Estimator (Services Page)
  // --------------------------------------------------------------------------
  function initEstimator() {
    const estimatorBox = document.getElementById('project-estimator');
    if (!estimatorBox) return;

    const serviceChips = estimatorBox.querySelectorAll('[data-est-service]');
    const scaleChips = estimatorBox.querySelectorAll('[data-est-scale]');
    const outTimeline = document.getElementById('est-timeline');
    const outTeam = document.getElementById('est-team');
    const outBudget = document.getElementById('est-budget');

    const rates = {
      mobile: {
        mvp: { timeline: '5-7 weeks', team: '2 Mobile Eng + 1 UI/UX', budget: '$28k - $38k' },
        standard: { timeline: '10-14 weeks', team: '3 Full-Stack/Mobile + 1 Lead + 1 QA', budget: '$52k - $74k' },
        enterprise: { timeline: '16-22 weeks', team: '5 Senior Eng + DevOps + Architect', budget: '$95k - $140k' }
      },
      web: {
        mvp: { timeline: '4-6 weeks', team: '2 Full-Stack Eng + 1 Designer', budget: '$24k - $34k' },
        standard: { timeline: '8-12 weeks', team: '3 Next.js/React + 1 Cloud Eng', budget: '$46k - $68k' },
        enterprise: { timeline: '14-20 weeks', team: '4 Senior Eng + Cloud Architect + QA', budget: '$85k - $125k' }
      },
      devops: {
        mvp: { timeline: '3-5 weeks', team: '1 Lead SRE + 1 DevOps Eng', budget: '$20k - $28k' },
        standard: { timeline: '6-9 weeks', team: '2 Senior Cloud/K8s Architects', budget: '$38k - $55k' },
        enterprise: { timeline: '10-16 weeks', team: '3 Multi-Cloud / SRE Specialists', budget: '$68k - $105k' }
      },
      ai: {
        mvp: { timeline: '4-6 weeks', team: '2 ML / RAG Specialists', budget: '$30k - $42k' },
        standard: { timeline: '8-12 weeks', team: '2 AI Eng + 1 Backend + 1 Eval Lead', budget: '$58k - $82k' },
        enterprise: { timeline: '14-18 weeks', team: '4 Senior AI Researchers & Architects', budget: '$98k - $150k' }
      },
      blockchain: {
        mvp: { timeline: '4-6 weeks', team: '2 Smart Contract Eng', budget: '$32k - $45k' },
        standard: { timeline: '8-12 weeks', team: '3 Web3 / Protocol Eng + 1 Auditor', budget: '$60k - $90k' },
        enterprise: { timeline: '14-20 weeks', team: '4 Protocol Eng + Security Lead + QA', budget: '$110k - $165k' }
      },
      security: {
        mvp: { timeline: '2-3 weeks', team: '2 Certified Penetration Testers', budget: '$15k - $22k' },
        standard: { timeline: '4-6 weeks', team: '2 Security Auditors + 1 DevSecOps Lead', budget: '$32k - $46k' },
        enterprise: { timeline: '8-12 weeks', team: '3 Principal Security Architects (SOC2/Zero-Trust)', budget: '$62k - $95k' }
      }
    };

    let selectedService = 'mobile';
    let selectedScale = 'standard';

    function recalculate() {
      const data = rates[selectedService]?.[selectedScale] || rates.mobile.standard;
      if (outTimeline) outTimeline.textContent = data.timeline;
      if (outTeam) outTeam.textContent = data.team;
      if (outBudget) outBudget.textContent = data.budget;
    }

    serviceChips.forEach(chip => {
      chip.addEventListener('click', function () {
        serviceChips.forEach(c => c.classList.remove('active'));
        this.classList.add('active');
        selectedService = this.getAttribute('data-est-service');
        recalculate();
      });
    });

    scaleChips.forEach(chip => {
      chip.addEventListener('click', function () {
        scaleChips.forEach(c => c.classList.remove('active'));
        this.classList.add('active');
        selectedScale = this.getAttribute('data-est-scale');
        recalculate();
      });
    });

    recalculate();
  }

  // --------------------------------------------------------------------------
  // 5. "Start a Project / Architecture Scoping" Modal
  // --------------------------------------------------------------------------
  function initReviewModal() {
    const modal = document.getElementById('review-modal');
    if (!modal) return;

    const openBtns = document.querySelectorAll('[data-open-modal="review"]');
    const closeBtns = modal.querySelectorAll('[data-close-modal]');
    const form = document.getElementById('review-booking-form');
    const chipBtns = modal.querySelectorAll('.chip[data-chip]');

    chipBtns.forEach(chip => {
      chip.addEventListener('click', function () {
        const group = this.parentElement;
        group.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
        this.classList.add('active');
      });
    });

    function openModal() {
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    function closeModal() {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    }

    openBtns.forEach(btn => {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        openModal();
      });
    });

    closeBtns.forEach(btn => {
      btn.addEventListener('click', closeModal);
    });

    modal.addEventListener('click', function (e) {
      if (e.target === modal) closeModal();
    });

    window.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('open')) {
        closeModal();
      }
    });

    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Scheduling consultation...';

        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
          closeModal();
          showToast('Technical consultation requested. A senior partner will contact you within 24 hours.');
          form.reset();
        }, 900);
      });
    }
  }

  // --------------------------------------------------------------------------
  // 6. Contact Page Form Validation & Handling
  // --------------------------------------------------------------------------
  function initContactForm() {
    const contactForm = document.getElementById('site-contact-form');
    if (!contactForm) return;

    const chips = contactForm.querySelectorAll('.chip[data-stage]');
    const hiddenStageInput = document.getElementById('contact-stage-input');

    chips.forEach(chip => {
      chip.addEventListener('click', function () {
        chips.forEach(c => c.classList.remove('active'));
        this.classList.add('active');
        if (hiddenStageInput) {
          hiddenStageInput.value = this.getAttribute('data-stage');
        }
      });
    });

    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const emailInput = document.getElementById('contact-email');
      const msgInput = document.getElementById('contact-message');
      let isValid = true;

      if (!emailInput || !emailInput.value || !emailInput.value.includes('@') || !emailInput.value.includes('.')) {
        if (emailInput) emailInput.classList.add('error');
        isValid = false;
      } else {
        if (emailInput) emailInput.classList.remove('error');
      }

      if (!msgInput || !msgInput.value.trim()) {
        if (msgInput) msgInput.classList.add('error');
        isValid = false;
      } else {
        if (msgInput) msgInput.classList.remove('error');
      }

      if (!isValid) {
        showToast('Please provide a valid work email and details about your project.');
        return;
      }

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const origText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Transmitting requirements...';

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = origText;
        contactForm.reset();
        chips.forEach((c, idx) => c.classList.toggle('active', idx === 0));
        showToast('Project brief received. Our senior architects will review and reply within one business day.');
      }, 800);
    });
  }

  // --------------------------------------------------------------------------
  // 7. Toast Notification Helper
  // --------------------------------------------------------------------------
  function showToast(message) {
    let toast = document.getElementById('site-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'site-toast';
      toast.className = 'toast';
      document.body.appendChild(toast);
    }

    toast.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="#08C4DE" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M4 10.5 8 14.5 16 6"/>
      </svg>
      <span>${message}</span>
    `;

    toast.classList.add('show');
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 4500);
  }

  window.i3Toast = showToast;

  // --------------------------------------------------------------------------
  // 8. Dynamic Navbar Scroll Height Reduction (Hysteresis & Zero Blink)
  // --------------------------------------------------------------------------
  function initNavbarScroll() {
    const header = document.querySelector('.site-header');
    if (!header) return;

    let isScrolled = false;
    let ticking = false;

    function updateHeader() {
      const scrollY = window.pageYOffset || document.documentElement.scrollTop || 0;

      // Hysteresis deadband: activate at > 50px, deactivate only when back near top < 15px
      if (!isScrolled && scrollY > 50) {
        isScrolled = true;
        header.classList.add('scrolled');
      } else if (isScrolled && scrollY < 15) {
        isScrolled = false;
        header.classList.remove('scrolled');
      }
      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(updateHeader);
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    updateHeader();
  }

  // --------------------------------------------------------------------------
  // Initialize All Modules on DOM Ready
  // --------------------------------------------------------------------------
  document.addEventListener('DOMContentLoaded', function () {
    initNavbarScroll();
    initMobileNav();
    initPracticeTabs();
    initTelemetry();
    initEstimator();
    initReviewModal();
    initContactForm();
  });
})();
