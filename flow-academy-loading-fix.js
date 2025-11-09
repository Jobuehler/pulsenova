/**
 * FLOW ACADEMY - COMPLETE LOADING ANIMATION SOLUTION
 * Based on working partner site: slater.app/13515/33966.js
 *
 * This script fixes the opacity 0 bug and implements the full loading animation
 */

// ============================================
// CONFIGURATION
// ============================================
const config = {
  customEase: "0.625, 0.05, 0, 1", // osmo-ease curve
  staggerAmount: 0.04,
  loadDelay: 0.3
};

// ============================================
// 1. LOADING WORDS ANIMATION
// ============================================
function initWelcomingWordsLoader() {
  const loadingContainer = document.querySelector('[data-loading-container]');

  // If no loading container exists, skip this animation
  if (!loadingContainer) {
    console.log('⚠️ No [data-loading-container] found - skipping welcome loader');
    initHeroReveal(); // Go straight to hero reveal
    return;
  }

  const loadingWords = loadingContainer.querySelector('[data-loading-words]');
  const wordsTarget = loadingWords.querySelector('[data-loading-words-target]');
  const wordsAttr = loadingWords.getAttribute('data-loading-words');

  if (!wordsAttr) {
    console.error('❌ data-loading-words attribute is missing');
    return;
  }

  const words = wordsAttr.split(',').map(w => w.trim());

  const tl = gsap.timeline({
    onComplete: () => {
      console.log('✅ Loading animation complete');
      initHeroReveal(); // Trigger hero reveal after loading completes
    }
  });

  // Start with words offset and invisible
  tl.set(loadingWords, { yPercent: 50, opacity: 0 })
    // Fade in and slide up the words container
    .to(loadingWords, {
      opacity: 1,
      yPercent: 0,
      duration: 1,
      ease: "expo.inOut"
    });

  // Cycle through each word
  words.forEach(word => {
    tl.call(() => {
      wordsTarget.textContent = word;
    }, null, '+=0.3');
  });

  // Fade out words and slide up
  tl.to(loadingWords, {
      opacity: 0,
      yPercent: -75,
      duration: 0.8,
      ease: "expo.in"
    })
    // Hide the entire loading container
    .to(loadingContainer, {
      autoAlpha: 0,
      duration: 0.6,
      ease: "power1.inOut"
    }, "-=0.2");
}

// ============================================
// 2. TEXT SPLITTING (for line-by-line reveals)
// ============================================
function initSplit() {
  const splitElements = document.querySelectorAll('[data-split="lines"]');

  if (splitElements.length === 0) {
    console.log('⚠️ No [data-split="lines"] elements found');
    return;
  }

  splitElements.forEach(element => {
    // Split text into lines
    const splitText = new SplitType(element, {
      types: 'lines',
      lineClass: 'single-line'
    });

    // Wrap each line in a wrapper for overflow hidden effect
    const lines = element.querySelectorAll('.single-line');
    lines.forEach(line => {
      const wrapper = document.createElement('div');
      wrapper.className = 'line-wrapper';
      wrapper.style.overflow = 'hidden';
      line.parentNode.insertBefore(wrapper, line);
      wrapper.appendChild(line);

      // Set initial state - lines start below
      gsap.set(line, { y: '100%' });
    });
  });

  console.log('✅ Text splitting initialized');
}

// ============================================
// 3. HERO SECTION REVEAL
// ============================================
function initHeroReveal() {
  const heroSection = document.querySelector('[data-hero-section]');

  if (!heroSection) {
    console.error('❌ No [data-hero-section] element found');
    return;
  }

  // Find all elements that need to animate in
  const lines = heroSection.querySelectorAll('.single-line');
  const wrapP = heroSection.querySelector('[data-load-items="wrap-p"]');
  const wrapButtons = heroSection.querySelector('[data-load-items="wrap-buttons"]');
  const nav = document.querySelector('nav'); // Assuming you have a nav element

  const tl = gsap.timeline({
    defaults: {
      ease: `CustomEase.create("osmo", "${config.customEase}")`
    }
  });

  // First, make the hero section visible (fixes the opacity 0 bug!)
  tl.set(heroSection, { autoAlpha: 1 }, 0)
    // Also set initial states for load items
    .set([wrapP, wrapButtons], { opacity: 0, y: 20 }, 0);

  // Animate lines in with stagger
  if (lines.length > 0) {
    tl.to(lines, {
      y: 0,
      duration: 1.2,
      stagger: config.staggerAmount,
      ease: "expo.out"
    }, config.loadDelay);
  }

  // Animate wrap-p items
  if (wrapP) {
    tl.to(wrapP, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power2.out"
    }, `-=0.6`);
  }

  // Animate wrap-buttons
  if (wrapButtons) {
    tl.to(wrapButtons, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power2.out"
    }, `-=0.6`);
  }

  // Animate nav if it exists
  if (nav) {
    tl.to(nav, {
      y: 0,
      opacity: 1,
      duration: 0.6
    }, `-=0.8`);
  }

  console.log('✅ Hero reveal animation started');
}

// ============================================
// 4. SCROLL-TRIGGERED TEXT REVEALS
// ============================================
function initTextScroll() {
  const revealElements = document.querySelectorAll('[data-reveal="scroll"]');

  if (revealElements.length === 0) {
    console.log('⚠️ No [data-reveal="scroll"] elements found');
    return;
  }

  revealElements.forEach(element => {
    const lines = element.querySelectorAll('.single-line');

    if (lines.length === 0) return;

    gsap.set(lines, { y: '100%' });

    ScrollTrigger.create({
      trigger: element,
      start: 'top 80%',
      onEnter: () => {
        gsap.to(lines, {
          y: 0,
          duration: 1,
          stagger: config.staggerAmount,
          ease: "expo.out"
        });
      },
      once: true
    });
  });

  console.log('✅ Scroll-triggered text reveals initialized');
}

// ============================================
// 5. MAIN INITIALIZATION
// ============================================
function init() {
  console.log('🚀 Flow Academy Loading Animation - Starting...');

  // Check if GSAP is available
  if (typeof gsap === 'undefined') {
    console.error('❌ GSAP is not loaded! Make sure to include GSAP before this script.');
    return;
  }

  // Register GSAP plugins
  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    console.log('✅ ScrollTrigger registered');
  }

  // Check if SplitType is available (needed for text splitting)
  if (typeof SplitType === 'undefined') {
    console.warn('⚠️ SplitType library not found. Text splitting will be skipped.');
    console.warn('   Add this to your <head>: <script src="https://unpkg.com/split-type"></script>');
  } else {
    // Initialize text splitting first
    initSplit();
  }

  // Check if we have a loading container
  const hasLoadingContainer = document.querySelector('[data-loading-container]');

  if (hasLoadingContainer) {
    // Start with loading animation
    initWelcomingWordsLoader();
  } else {
    // No loading container - go straight to hero reveal
    console.log('⚠️ No loading container - revealing hero immediately');
    initHeroReveal();
  }

  // Initialize scroll-triggered reveals
  if (typeof ScrollTrigger !== 'undefined') {
    initTextScroll();
  }

  console.log('✅ Flow Academy Loading Animation - Initialized!');
}

// ============================================
// AUTO-INITIALIZE
// ============================================
// Wait for page to load, then initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  // DOMContentLoaded already fired
  init();
}
