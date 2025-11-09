# 🎯 Flow Academy Loading Animation - Complete Implementation Guide

## 📋 Overview
This guide will fix the `data-hero-section opacity: 0` bug and implement the exact same loading animation from the partner site.

---

## 🏗️ STEP 1: Add Loading Container HTML

### Option A: Simple Loading Screen (Recommended for Quick Fix)

Add this HTML **as the FIRST element in your <body>** tag in Webflow:

```html
<div data-loading-container style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: #fff; z-index: 9999; display: flex; align-items: center; justify-content: center;">
  <div data-loading-words data-loading-words="Welcome,Bienvenue,Willkommen,Bienvenido">
    <div data-loading-words-target style="font-size: 3rem; font-weight: 600; text-align: center;"></div>
  </div>
</div>
```

**Customize the words:** Change `"Welcome,Bienvenue,Willkommen,Bienvenido"` to your preferred loading words (comma-separated).

---

### Option B: Styled Loading Screen (More Professional)

If you want a more polished look, use Webflow's designer to create:

1. **Create a new Div Block** (name it "Loading Container")
   - Add custom attribute: `data-loading-container`
   - Set position: Fixed
   - Top: 0, Left: 0, Right: 0, Bottom: 0
   - Z-index: 9999
   - Background: Your brand color
   - Display: Flex, Align: Center, Justify: Center

2. **Inside that, create another Div Block** (name it "Loading Words")
   - Add custom attribute: `data-loading-words`
   - Add custom attribute value: `data-loading-words="Welcome,Hello,Start,Flow"`
   - Text align: Center

3. **Inside "Loading Words", add a Div Block** (name it "Loading Words Target")
   - Add custom attribute: `data-loading-words-target`
   - This will contain the animated text
   - Set font size, weight, color as desired

---

## 🔧 STEP 2: Update Your Hero Section

### Ensure your hero section has the correct initial CSS:

In Webflow, select your `[data-hero-section]` element and:

1. **Set initial opacity to 0** in the Style Panel
   - This is CORRECT - the JavaScript will animate it to visible
2. Make sure it has the attribute `data-hero-section=""` (you already have this ✅)

### For your H1 headline:

Make sure it has:
- `data-split="lines"` ✅ (you have this)
- `data-reveal="load"` ✅ (you have this)

### For scroll-triggered text (optional):

For any text you want to reveal on scroll (not on page load), use:
- `data-reveal="scroll"` instead of `data-reveal="load"`

---

## 📜 STEP 3: Update Your Footer Code (Webflow Custom Code)

**Replace your current footer code with this:**

```html
<!-- ============================================ -->
<!-- FLOW ACADEMY - UPDATED FOOTER CODE -->
<!-- ============================================ -->

<!-- 1. Core Libraries (Load First) -->
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js"></script>
<script src="https://unpkg.com/split-type"></script>

<!-- 2. Video & Smooth Scroll Libraries -->
<script src="https://cdn.jsdelivr.net/npm/hls.js@1.6.11"></script>
<script src="https://cdn.jsdelivr.net/npm/lenis@1.2.3/dist/lenis.min.js"></script>

<!-- 3. UnicornStudio -->
<script defer src="https://cdn.unicorn.studio/v1.3.1/unicornStudio.umd.js"></script>

<!-- 4. Your Slater Scripts -->
<script src="https://slater.app/17222/47680.js"></script>

<!-- 5. LOADING ANIMATION FIX - ADD THIS! -->
<script>
/**
 * FLOW ACADEMY - COMPLETE LOADING ANIMATION SOLUTION
 * Fixes the data-hero-section opacity 0 bug
 */

// Configuration
const config = {
  customEase: "0.625, 0.05, 0, 1",
  staggerAmount: 0.04,
  loadDelay: 0.3
};

// 1. Loading Words Animation
function initWelcomingWordsLoader() {
  const loadingContainer = document.querySelector('[data-loading-container]');

  if (!loadingContainer) {
    console.log('⚠️ No loading container - skipping to hero reveal');
    initHeroReveal();
    return;
  }

  const loadingWords = loadingContainer.querySelector('[data-loading-words]');
  const wordsTarget = loadingWords.querySelector('[data-loading-words-target]');
  const wordsAttr = loadingWords.getAttribute('data-loading-words');

  if (!wordsAttr) {
    console.error('❌ data-loading-words attribute missing');
    initHeroReveal();
    return;
  }

  const words = wordsAttr.split(',').map(w => w.trim());

  const tl = gsap.timeline({
    onComplete: () => {
      console.log('✅ Loading complete');
      initHeroReveal();
    }
  });

  tl.set(loadingWords, { yPercent: 50, opacity: 0 })
    .to(loadingWords, { opacity: 1, yPercent: 0, duration: 1, ease: "expo.inOut" });

  words.forEach(word => {
    tl.call(() => { wordsTarget.textContent = word; }, null, '+=0.3');
  });

  tl.to(loadingWords, { opacity: 0, yPercent: -75, duration: 0.8, ease: "expo.in" })
    .to(loadingContainer, { autoAlpha: 0, duration: 0.6, ease: "power1.inOut" }, "-=0.2");
}

// 2. Text Splitting
function initSplit() {
  const splitElements = document.querySelectorAll('[data-split="lines"]');

  if (splitElements.length === 0 || typeof SplitType === 'undefined') {
    console.log('⚠️ Text splitting skipped');
    return;
  }

  splitElements.forEach(element => {
    new SplitType(element, { types: 'lines', lineClass: 'single-line' });

    const lines = element.querySelectorAll('.single-line');
    lines.forEach(line => {
      const wrapper = document.createElement('div');
      wrapper.className = 'line-wrapper';
      wrapper.style.overflow = 'hidden';
      line.parentNode.insertBefore(wrapper, line);
      wrapper.appendChild(line);
      gsap.set(line, { y: '100%' });
    });
  });

  console.log('✅ Text splitting done');
}

// 3. Hero Reveal Animation (FIXES THE OPACITY 0 BUG!)
function initHeroReveal() {
  const heroSection = document.querySelector('[data-hero-section]');

  if (!heroSection) {
    console.error('❌ No [data-hero-section] found');
    return;
  }

  const lines = heroSection.querySelectorAll('.single-line');
  const wrapP = heroSection.querySelector('[data-load-items="wrap-p"]');
  const wrapButtons = heroSection.querySelector('[data-load-items="wrap-buttons"]');
  const nav = document.querySelector('nav, .navbar, [data-nav]');

  const tl = gsap.timeline();

  // THIS LINE FIXES YOUR BUG! 🎉
  tl.set(heroSection, { autoAlpha: 1 }, 0)
    .set([wrapP, wrapButtons], { opacity: 0, y: 20 }, 0);

  if (lines.length > 0) {
    tl.to(lines, {
      y: 0,
      duration: 1.2,
      stagger: config.staggerAmount,
      ease: "expo.out"
    }, config.loadDelay);
  }

  if (wrapP) {
    tl.to(wrapP, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }, "-=0.6");
  }

  if (wrapButtons) {
    tl.to(wrapButtons, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }, "-=0.6");
  }

  if (nav) {
    tl.to(nav, { y: 0, opacity: 1, duration: 0.6 }, "-=0.8");
  }

  console.log('✅ Hero revealed!');
}

// 4. Scroll-Triggered Reveals
function initTextScroll() {
  const revealElements = document.querySelectorAll('[data-reveal="scroll"]');

  if (revealElements.length === 0 || typeof ScrollTrigger === 'undefined') return;

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
}

// 5. Initialize Everything
function init() {
  console.log('🚀 Flow Academy Loading Animation Starting...');

  if (typeof gsap === 'undefined') {
    console.error('❌ GSAP not loaded!');
    return;
  }

  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  // Initialize in correct order
  initSplit();

  // Check if loading container exists
  if (document.querySelector('[data-loading-container]')) {
    initWelcomingWordsLoader();
  } else {
    initHeroReveal();
  }

  if (typeof ScrollTrigger !== 'undefined') {
    initTextScroll();
  }

  console.log('✅ All animations initialized!');
}

// Auto-run when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
</script>

<!-- 6. Initialize Lenis + GSAP Integration -->
<script>
window.addEventListener('load', function() {
  // Initialize Lenis smooth scrolling
  if (typeof Lenis !== 'undefined' && typeof gsap !== 'undefined') {
    const lenis = new Lenis({
      autoRaf: true,
      smoothWheel: true,
      wheelMultiplier: 1.0
    });

    if (typeof ScrollTrigger !== 'undefined') {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(time => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    }

    window.lenis = lenis;
    console.log('✅ Lenis smooth scroll initialized');
  }

  // Check UnicornStudio
  setTimeout(function() {
    if (typeof UnicornStudio !== 'undefined') {
      console.log('✅ UnicornStudio loaded');
    } else {
      console.warn('⚠️ UnicornStudio failed to load');
    }
  }, 2000);
});
</script>
```

---

## ✅ STEP 4: Test & Verify

### After implementing the above:

1. **Publish your Webflow site**
2. **Open in a new incognito window** (to avoid cache)
3. **Open browser console** (F12 → Console tab)

### You should see:

```
🚀 Flow Academy Loading Animation Starting...
✅ Text splitting done
⚠️ No loading container - skipping to hero reveal (if you didn't add loading HTML)
OR
✅ Loading complete (if you added loading HTML)
✅ Hero revealed!
✅ All animations initialized!
✅ Lenis smooth scroll initialized
```

### The hero section should:

- ✅ Start at opacity 0
- ✅ Fade in smoothly
- ✅ Text lines slide up one by one
- ✅ Buttons and paragraphs fade in
- ✅ No more stuck at opacity 0!

---

## 🐛 Troubleshooting

### Hero still stuck at opacity 0?

**Check console for errors:**
- If you see `❌ GSAP not loaded!` → GSAP script didn't load, check script URLs
- If you see `❌ No [data-hero-section] found` → Make sure your section has the attribute
- If you see `⚠️ Text splitting skipped` → SplitType library didn't load

**Quick Emergency Fix:**

Add this simple fallback to your footer code:

```javascript
// Emergency fallback - runs after 3 seconds
setTimeout(function() {
  const hero = document.querySelector('[data-hero-section]');
  if (hero && window.getComputedStyle(hero).opacity === '0') {
    hero.style.opacity = '1';
    hero.style.visibility = 'visible';
    console.log('⚠️ Emergency fallback activated');
  }
}, 3000);
```

---

## 🎨 Customization Options

### Change loading words:

```html
data-loading-words="Your,Custom,Words,Here"
```

### Adjust animation speed:

In the config object:
```javascript
const config = {
  staggerAmount: 0.04,  // Lower = faster stagger (try 0.02)
  loadDelay: 0.3        // Lower = starts sooner (try 0.1)
};
```

### Change animation easing:

```javascript
ease: "expo.out"     // Current
ease: "power2.out"   // Smoother
ease: "back.out(1.7)" // Bouncy
```

---

## 📊 What This Fixed

| Issue | Status |
|-------|--------|
| `data-hero-section` stuck at opacity 0 | ✅ FIXED |
| Missing loading animation | ✅ ADDED |
| Text not revealing line-by-line | ✅ FIXED |
| Buttons/paragraphs not fading in | ✅ FIXED |
| No word cycling animation | ✅ ADDED |
| Matches partner site animation | ✅ YES |

---

## 🚀 Next Steps

1. Implement STEP 1 (loading container HTML) - **Optional but recommended**
2. Implement STEP 3 (footer code) - **REQUIRED**
3. Publish and test
4. If issues persist, check the troubleshooting section
5. Customize to match your brand

---

## 💡 Pro Tips

- The loading animation adds professional polish - don't skip it!
- Use `data-reveal="scroll"` for elements below the fold to create scroll-triggered reveals
- Keep your loading words short (3-6 words max) for best effect
- Test on mobile - the animations are responsive

---

**Need help? Check the console logs - they'll tell you exactly what's happening! 🎯**
