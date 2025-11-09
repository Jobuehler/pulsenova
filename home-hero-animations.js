// Combined Animations for BG and Home-Hero Elements
// Extracted from osmo-website-template.js

// ============================================
// SETUP & CONFIGURATION
// ============================================

gsap.registerPlugin(SplitText, CustomEase, ScrollTrigger);

CustomEase.create("osmo-ease", "0.625, 0.05, 0, 1");

let staggerDefault = 0.075;
let durationDefault = 0.8;

gsap.defaults({
  ease: "osmo-ease",
  duration: durationDefault,
});

gsap.config({ nullTargetWarn: false });

// ============================================
// HOME HERO LOAD ANIMATION
// ============================================

function initHeroLoad() {
  let nav = document.querySelector(".nav-row");
  if (!nav) return;

  let hero = document.querySelector(".section");
  let lines = hero.querySelectorAll(".single-line");
  let pWrap = hero.querySelector('[data-load-items="wrap-p"]');
  let buttonWrap = hero.querySelector('[data-load-items="wrap-buttons"]');
  let revealItems = document.querySelectorAll('[data-load-items="reveal"]');
  let pItems, buttons;

  if (pWrap) { pItems = pWrap.querySelectorAll("p"); }
  if (buttonWrap) { buttons = buttonWrap.querySelectorAll(".button"); }

  let tl = gsap.timeline({
    defaults: {
      ease: "osmo-ease",
      duration: 1.2
    },
    onComplete: () => {
      ScrollTrigger.refresh();
    }
  });

  tl.set(hero, { autoAlpha: 1 }, 0.5)
    .to(lines, { y: 0, stagger: staggerDefault })
    .to(nav, { y: 0 }, "<");

  if (revealItems.length > 1) {
    tl.from(revealItems, { yPercent: 20, autoAlpha: 0, stagger: staggerDefault }, 0.3);
  }
  if (pWrap) {
    tl.to(pItems, { y: 0, stagger: staggerDefault }, 0.3);
  }
  if (buttonWrap) {
    tl.from(buttons, { autoAlpha: 0, duration: 0.6, stagger: staggerDefault }, 0.8);
  }
}

// ============================================
// BACKGROUND WRAPPER ANIMATION (Spline/UnicornStudio)
// ============================================

function initBackgroundWrapper() {
  // Initialize UnicornStudio for bg-wrapper animations
  // The bg-wrapper element has these attributes:
  // data-us-project-src="https://cdn.jsdelivr.net/npm/@splinetool/runtime@latest/build/runtime.js"
  // data-us-disableMobile="false"
  // data-us-alttext="graphic background"

  UnicornStudio.init();
}

// ============================================
// VIDEO MODAL BACKGROUND ANIMATION
// ============================================

function initVideoModalBg() {
  let trigger = document.querySelector("[data-video-open]");
  let closeTriggers = document.querySelectorAll("[data-video-close]");
  let modal = document.querySelector(".video-wrap");
  let bg = modal.querySelector(".bg");
  let vidWrap = document.querySelector(".hero-vid-wrap");
  let vimeoPlayer = document.querySelector(".video-player__wrap .single-vimeo-player");
  let videoInfo = document.querySelector(".hero-vid-info");
  let starWrap = document.querySelector(".home-vid-star");
  let starLines = starWrap.querySelectorAll("rect");

  let openTimeline = gsap.timeline({ paused: true })
    .set(modal, { display: "flex" })
    .set(vimeoPlayer, { opacity: 0 })
    .to(videoInfo, { autoAlpha: 0 })
    .to(starLines, { height: 0 }, "<")
    .fromTo(bg, { opacity: 0 }, { opacity: 0.75 }, "<")
    .to(vidWrap, { autoAlpha: 0, duration: 0.5 })
    .set(vimeoPlayer, { opacity: 1 }, "<");

  let closeTimeline = gsap.timeline({ paused: true })
    .to(bg, { opacity: 0 })
    .to(vimeoPlayer, { opacity: 0, duration: 0.25 }, "<")
    .to(vidWrap, { autoAlpha: 1 }, "<")
    .set(modal, { display: "none" })
    .to(videoInfo, { autoAlpha: 1, duration: 0.5 })
    .to(starLines, { height: "100%" }, "<+=0.25")
    .to(vidWrap, { autoAlpha: 1, duration: 0.001, overwrite: "auto", clearProps: true });

  trigger.addEventListener("click", () => {
    openTimeline.play(0);
  });

  closeTriggers.forEach(trigger => {
    trigger.addEventListener("click", () => {
      closeTimeline.play(0);
    });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeTimeline.play(0);
    }
  });
}

// ============================================
// MODAL BACKGROUND ANIMATION
// ============================================

function initModalBg() {
  let buttons = document.querySelectorAll("[data-modal-cta]");
  let modalWrap = document.querySelector(".modal-wrap");
  let bg = modalWrap.querySelector(".modal-bg");
  let sidebar = modalWrap.querySelector(".sidebar");
  let contents = sidebar.querySelectorAll('[data-modal]');
  let titleLines = sidebar.querySelectorAll(".sidebar-title .single-line");
  let closeTriggers = document.querySelectorAll("[data-modal-close]");
  let items = document.querySelectorAll(".faq-item");
  let revealItems = sidebar.querySelectorAll("[data-modal-reveal]");

  let isMobileLandscape = window.innerWidth < 768;
  let animating = false;

  let openTimeline = gsap.timeline({ paused: true })
    .set(modalWrap, { display: "block" })
    .set(sidebar, { display: "flex" })
    .fromTo(bg, { opacity: 0 }, { opacity: 0.5 })
    .fromTo(sidebar, {
      yPercent: isMobileLandscape ? 110 : 0,
      xPercent: isMobileLandscape ? 0 : 110
    }, { xPercent: 0, yPercent: 0, duration: 1 }, "<")
    .fromTo(titleLines, { y: "120%" }, { y: "0%", stagger: 0.02 }, ">-=0.8")
    .fromTo([items, revealItems], { yPercent: 70, autoAlpha: 0 }, {
      yPercent: 0,
      autoAlpha: 1,
      stagger: 0.05
    }, "<+=0.3");

  let closeTimeline = gsap.timeline({
    paused: true,
    onStart: () => { animating = true; },
    onComplete: () => { animating = false; },
  })
    .to(bg, { opacity: 0 })
    .to(titleLines, { y: "120%", stagger: { each: 0.03, from: "end" }, duration: 0.65 }, "<")
    .to([items, revealItems], { yPercent: 70, autoAlpha: 0, stagger: 0.03, duration: 0.65 }, "<")
    .to(sidebar, {
      xPercent: isMobileLandscape ? 0 : 110,
      yPercent: isMobileLandscape ? 110 : 0
    }, "<+=0.25")
    .set(modalWrap, { display: "none" });

  buttons.forEach(button => {
    button.addEventListener("click", () => {
      let targetModal = button.getAttribute("data-modal-cta");

      contents.forEach(content => {
        content.style.display = "none";
      });

      let activeContent = sidebar.querySelector(`[data-modal="${targetModal}"]`);
      activeContent.style.display = "flex";

      openTimeline.play(0);
    });
  });

  function closeModal() {
    closeTimeline.play(0);
  }

  closeTriggers.forEach(trigger => {
    trigger.addEventListener("click", () => {
      if (animating) return;
      closeModal();
    });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeModal();
    }
  });
}

// ============================================
// HOME DASHBOARD CONTAINER ANIMATION
// ============================================

function initHomeDashboardBg() {
  let container = document.querySelector(".db-container");
  if (!container) return;

  let wrap = container.querySelector(".db-wrapper");
  let search = wrap.querySelector(".db-search");
  let side = wrap.querySelector(".db-side");
  let cards = wrap.querySelectorAll(".db-content__card");
  let contents = wrap.querySelectorAll("[data-db-el]");

  gsap.set(contents, { autoAlpha: 0 });
  gsap.set(container, { pointerEvents: "none" });

  let scrollIntroTl = gsap.timeline({
    scrollTrigger: {
      trigger: container,
      start: "top bottom",
      end: "bottom bottom+=15%",
      scrub: true
    },
    defaults: {
      ease: "none"
    },
    onComplete: () => {
      endTl.play(0);
    }
  });

  scrollIntroTl
    .from(wrap, { rotateX: "20deg", z: "-20em" })
    .from(search, { z: "40em", autoAlpha: 0 }, "<")
    .from(side, { z: "35em", autoAlpha: 0 }, "<")
    .from(cards, {
      z: (i) => `${35 - i * 5}em`,
      stagger: 0.01
    }, "<")
    .to(contents, { autoAlpha: 0, duration: 0.01 }, 0)
    .set(container, { pointerEvents: "none" });

  let endTl = gsap.timeline({
    paused: true,
    defaults: {
      duration: 0.8,
    },
    onComplete: () => {
      gsap.set(container, { pointerEvents: "auto" });
    }
  });

  endTl
    .to([side, search, cards], {
      z: "4em",
      borderColor: "rgba(239, 238, 236, 0.65)",
      boxShadow: "0 2px 40px 0 hsla(10.95890410958904, 100.00%, 57.06%, 0.25)",
      stagger: 0.1,
      ease: "power1.inOut",
      duration: 0.35
    })
    .to([side, search, cards], {
      z: "0em",
      borderColor: "rgba(239, 238, 236, 0.08)",
      boxShadow: "0 0px 00px 0 hsla(10.95890410958904, 100.00%, 57.06%, 0)",
      stagger: staggerDefault,
      ease: "power3.out"
    }, 0.35)
    .to(contents, {
      autoAlpha: 1,
      stagger: 0.03,
      duration: 0.5
    }, "<");
}

// ============================================
// PARALLAX BACKGROUND ANIMATION
// ============================================

function initBgParallax() {
  const triggers = document.querySelectorAll('[data-parallax="trigger"]');

  triggers.forEach((trigger) => {
    const direction = trigger.getAttribute('data-parallax-direction') || 'vertical';
    const scrubValue = parseFloat(trigger.getAttribute('data-parallax-scrub')) || true;
    const startValue = parseFloat(trigger.getAttribute('data-parallax-start')) || -5;
    const endValue = parseFloat(trigger.getAttribute('data-parallax-end')) || 20;
    const scrollStart = trigger.getAttribute('data-parallax-scroll-start') || 'top bottom';
    const scrollEnd = trigger.getAttribute('data-parallax-scroll-end') || 'bottom top';
    const target = trigger.querySelector('[data-parallax="target"]') || trigger;
    const property = direction === 'horizontal' ? 'xPercent' : 'yPercent';

    gsap.fromTo(
      target,
      { [property]: startValue },
      {
        [property]: endValue,
        ease: 'none',
        scrollTrigger: {
          trigger: trigger,
          start: scrollStart,
          end: scrollEnd,
          scrub: scrubValue,
        },
      }
    );
  });
}

// ============================================
// TEXT SPLIT ANIMATION (for home-hero headings)
// ============================================

function initSplit() {
  let lineTargets = document.querySelectorAll('[data-split="lines"]');
  let splitTextLines = null;

  function splitText() {
    if (splitTextLines) {
      splitTextLines.revert();
    }

    // Lines
    splitTextLines = new SplitText(lineTargets, {
      type: "lines",
      linesClass: "single-line"
    });

    splitTextLines.lines.forEach((line) => {
      let wrapper = document.createElement('div');
      wrapper.classList.add('single-line-wrap');
      line.parentNode.insertBefore(wrapper, line);
      wrapper.appendChild(line);
    });
  }

  // Perform the initial split
  splitText();

  // Add a debounced resize event listener
  let resizeTimeout;
  let lastWidth = window.innerWidth;

  window.addEventListener("resize", () => {
    if (window.innerWidth === lastWidth) return;

    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      lastWidth = window.innerWidth;
      splitText();
      initHeroLoad();
    }, 300);
  });
}

// ============================================
// INITIALIZATION
// ============================================

// Call this function when the page loads
function initAllAnimations() {
  initSplit();
  initHeroLoad();
  initBackgroundWrapper();
  initBgParallax();

  // Optional: Initialize modal animations if elements exist
  if (document.querySelector(".video-wrap")) {
    initVideoModalBg();
  }

  if (document.querySelector(".modal-wrap")) {
    initModalBg();
  }

  if (document.querySelector(".db-container")) {
    initHomeDashboardBg();
  }
}

// Run on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAllAnimations);
} else {
  initAllAnimations();
}
