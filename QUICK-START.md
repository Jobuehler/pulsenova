# ⚡ QUICK START - Fix Flow Academy Opacity Bug

## 🎯 The Problem
Your `[data-hero-section]` is stuck at `opacity: 0` because the loading animation script is missing.

## ✅ The Solution (2 Steps)

### STEP 1: Add Loading Container (OPTIONAL)
Add this as the **first element** in your Webflow `<body>`:

```html
<div data-loading-container style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: #fff; z-index: 9999; display: flex; align-items: center; justify-content: center;">
  <div data-loading-words data-loading-words="Welcome,Hello,Start">
    <div data-loading-words-target style="font-size: 3rem; font-weight: 600;"></div>
  </div>
</div>
```

**Skip this if you just want the hero to show without loading animation.**

---

### STEP 2: Replace Footer Code (REQUIRED)
Replace your **entire Webflow footer code** with the code from:

**📄 `flow-academy-implementation-guide.md` → STEP 3**

Or use this minimal version:

```html
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js"></script>
<script src="https://unpkg.com/split-type"></script>
<script src="https://cdn.jsdelivr.net/npm/hls.js@1.6.11"></script>
<script src="https://cdn.jsdelivr.net/npm/lenis@1.2.3/dist/lenis.min.js"></script>
<script defer src="https://cdn.unicorn.studio/v1.3.1/unicornStudio.umd.js"></script>
<script src="https://slater.app/17222/47680.js"></script>

<script>
// Minimal fix - reveals hero immediately
function init() {
  const hero = document.querySelector('[data-hero-section]');
  if (!hero) return;

  gsap.registerPlugin(ScrollTrigger);

  // Initialize text splitting if SplitType is available
  if (typeof SplitType !== 'undefined') {
    const splitElements = document.querySelectorAll('[data-split="lines"]');
    splitElements.forEach(el => {
      new SplitType(el, { types: 'lines', lineClass: 'single-line' });
      const lines = el.querySelectorAll('.single-line');
      lines.forEach(line => {
        const wrapper = document.createElement('div');
        wrapper.style.overflow = 'hidden';
        line.parentNode.insertBefore(wrapper, line);
        wrapper.appendChild(line);
        gsap.set(line, { y: '100%' });
      });
    });
  }

  const lines = hero.querySelectorAll('.single-line');
  const wrapP = hero.querySelector('[data-load-items="wrap-p"]');
  const wrapButtons = hero.querySelector('[data-load-items="wrap-buttons"]');

  const tl = gsap.timeline();
  tl.set(hero, { autoAlpha: 1 })
    .set([wrapP, wrapButtons], { opacity: 0, y: 20 });

  if (lines.length > 0) {
    tl.to(lines, { y: 0, duration: 1.2, stagger: 0.04, ease: "expo.out" }, 0.3);
  }

  if (wrapP) tl.to(wrapP, { opacity: 1, y: 0, duration: 0.8 }, "-=0.6");
  if (wrapButtons) tl.to(wrapButtons, { opacity: 1, y: 0, duration: 0.8 }, "-=0.6");

  console.log('✅ Hero revealed!');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
</script>

<script>
window.addEventListener('load', function() {
  if (typeof Lenis !== 'undefined' && typeof gsap !== 'undefined') {
    const lenis = new Lenis({ autoRaf: true, smoothWheel: true, wheelMultiplier: 1.0 });
    if (typeof ScrollTrigger !== 'undefined') {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(time => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    }
    window.lenis = lenis;
  }
});
</script>
```

---

## 📊 What Gets Fixed

✅ Hero section fades in properly
✅ Text lines animate in one by one
✅ Buttons and paragraphs fade in
✅ Smooth scrolling works
✅ Matches partner site animation

---

## 🐛 Still Not Working?

Open browser console (F12) and check for:
- Red errors → Script loading issue
- `✅ Hero revealed!` → It's working!
- Nothing → JavaScript not running

---

## 📚 Full Documentation

See **`flow-academy-implementation-guide.md`** for:
- Complete implementation details
- Customization options
- Troubleshooting guide
- Professional loading screen setup

---

**That's it! Publish, test, and enjoy your working animations! 🎉**
