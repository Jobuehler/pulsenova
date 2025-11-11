// Flow Academy - Enhanced Text Animation System
// This file implements data-split and load functionality

gsap.registerPlugin(SplitText, ScrollTrigger);

let staggerDefault = 0.075;
let durationDefault = 0.8;

gsap.defaults({
  ease: "expo.out",
  duration: durationDefault,
});

gsap.config({ nullTargetWarn: false });

const splitConfig = {
  lines: { duration: 0.8, stagger: 0.08 },
  words: { duration: 0.6, stagger: 0.06 },
  chars: { duration: 0.4, stagger: 0.01 }
};

/**
 * Initialize text splitting for lines and letters
 * @param {HTMLElement} next - Container element to search within (default: document)
 */
function initSplit(next) {
  next = next || document;
  let lineTargets = next.querySelectorAll('[data-split="lines"], [data-split="heading"]');
  let letterTargets = next.querySelectorAll('[data-split="letters"]');
  let splitTextLines = null;
  let splitTextLetters = [];

  function splitText(next) {
    // Revert existing splits
    if (splitTextLines) {
      splitTextLines.revert();
    }
    splitTextLetters.forEach((instance) => {
      if (instance) instance.revert();
    });
    splitTextLetters = [];

    // Split Lines
    if (lineTargets.length > 0) {
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

    // Split Letters
    splitTextLetters = Array.from(letterTargets).map((target) => {
      if (target.hasAttribute("split-ran")) return;
      return new SplitText(target, {
        type: "words, chars",
        charsClass: "single-letter"
      });
    });

    splitTextLetters.forEach((instance) => {
      if (instance) {
        instance.elements[0].setAttribute("split-ran", "true");
        if (instance.elements[0].hasAttribute("data-letters-delay")) {
          instance.chars.forEach((letter, index) => {
            let delay = index / 150 + "s";
            letter.style.setProperty("transition-delay", delay);
          });
        }
      }
    });
  }

  // Perform the initial split
  splitText(next);

  // Add a debounced resize event listener
  let resizeTimeout;
  let lastWidth = window.innerWidth;

  window.addEventListener("resize", () => {
    if (window.innerWidth === lastWidth) return; // Ignore height-only resizes

    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      lastWidth = window.innerWidth;
      splitText(next);
      initTextScroll(next);
      initLoad(next);
    }, 300);
  });
}

/**
 * Initialize load animations for hero/first section
 * @param {HTMLElement} next - Container element (default: document)
 */
function initLoad(next) {
  next = next || document;

  let nav = document.querySelector(".nav-row, nav, [data-nav]");
  let hero = next.querySelector(".section, [data-hero], [data-load-section]");

  if (!hero) return;

  let lines = hero.querySelectorAll(".single-line");
  let pWrap = hero.querySelector('[data-load-items="wrap-p"]');
  let buttonWrap = hero.querySelector('[data-load-items="wrap-buttons"]');
  let revealItems = next.querySelectorAll('[data-load-items="reveal"]');
  let pItems, buttons;

  if (pWrap) { pItems = pWrap.querySelectorAll("p"); }
  if (buttonWrap) { buttons = buttonWrap.querySelectorAll(".button, [data-button]"); }

  let tl = gsap.timeline({
    defaults: {
      ease: "expo.out",
      duration: 1.2
    },
    onComplete: () => {
      ScrollTrigger.refresh();
    }
  });

  tl.set(hero, { autoAlpha: 1 }, 0.5)
    .to(lines, { y: 0, stagger: staggerDefault });

  if (nav) {
    tl.to(nav, { y: 0 }, "<");
  }

  if (revealItems.length > 0) {
    tl.from(revealItems, { yPercent: 20, autoAlpha: 0, stagger: staggerDefault }, 0.3);
  }

  if (pWrap) {
    tl.to(pItems, { y: 0, stagger: staggerDefault }, 0.3);
  }

  if (buttonWrap) {
    tl.from(buttons, { autoAlpha: 0, duration: 0.6, stagger: staggerDefault }, 0.8);
  }
}

/**
 * Initialize scroll-triggered text animations
 * @param {HTMLElement} next - Container element (default: document)
 */
function initTextScroll(next) {
  next = next || document;
  let targets = next.querySelectorAll('[data-reveal="scroll"]');

  targets.forEach((target) => {
    let lines = target.querySelectorAll(".single-line");

    if (lines.length > 0) {
      gsap.to(lines, {
        y: 0,
        duration: durationDefault + 0.2,
        stagger: staggerDefault,
        scrollTrigger: {
          trigger: target,
          start: "top 90%",
          once: true
        }
      });
    }
  });
}

/**
 * Initialize mask text scroll reveal (legacy support)
 * This function provides backward compatibility with the old implementation
 */
function initMaskTextScrollReveal() {
  document.querySelectorAll('[data-split="heading"]').forEach(heading => {
    // Find the split type, the default is 'lines'
    const type = heading.dataset.splitReveal || 'lines';
    const typesToSplit =
      type === 'lines' ? ['lines'] :
      type === 'words' ? ['lines', 'words'] : ['lines', 'words', 'chars'];

    // Split the text
    SplitText.create(heading, {
      type: typesToSplit.join(', '), // split into required elements
      mask: 'lines', // wrap each line in an overflow:hidden div
      autoSplit: true,
      linesClass: 'line',
      wordsClass: 'word',
      charsClass: 'letter',
      onSplit: function (instance) {
        const targets = instance[type]; // Register animation targets
        const config = splitConfig[type]; // Find matching duration and stagger from our splitConfig

        return gsap.from(targets, {
          yPercent: 110,
          duration: config.duration,
          stagger: config.stagger,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: heading,
            start: 'clamp(top 80%)',
            once: true
          }
        });
      }
    });
  });
}

/**
 * Initialize all text animation systems
 */
function initTextAnimations(container) {
  container = container || document;

  // Use new split system for data-split="lines" and data-split="letters"
  initSplit(container);

  // Initialize load animations
  initLoad(container);

  // Initialize scroll-triggered animations
  initTextScroll(container);

  // Initialize legacy mask text reveal for backward compatibility
  // Note: You can remove this if you've updated all elements to use the new system
  initMaskTextScrollReveal();
}

// Initialize on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  initTextAnimations();
});

// Export functions for use in other scripts if needed
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initSplit,
    initLoad,
    initTextScroll,
    initMaskTextScrollReveal,
    initTextAnimations
  };
}
