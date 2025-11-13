# Swiper + GSAP Integration Fix

## The Problem

The original code had a critical timing conflict:

1. **GSAP reveal animations** set elements to `autoAlpha: 0` (which means `opacity: 0` and `visibility: hidden`)
2. **Swiper initialization** needs visible elements to calculate slide dimensions properly
3. When Swiper initializes on hidden elements, it calculates incorrect dimensions (often 0px width)
4. This causes slides to not display or behave incorrectly

## The Solution

### Key Fixes Implemented:

#### 1. **Swiper Initialization (`swiper-init.js`)**
- ✅ Added library existence checks
- ✅ Added visibility detection before initialization
- ✅ Implemented MutationObserver to wait for elements to become visible
- ✅ Added fallback delayed initialization
- ✅ Enabled Swiper's observer mode for DOM updates
- ✅ Added proper error handling and logging
- ✅ Conditional navigation/pagination setup
- ✅ Force update after initialization

#### 2. **GSAP Reveal Animations (`gsap-reveal.js`)**
- ✅ Added library existence checks
- ✅ Special handling for Swiper elements (don't hide with `autoAlpha`)
- ✅ Swiper elements only animate `transform`, keeping them visible
- ✅ Automatic Swiper update trigger after reveal animations complete
- ✅ Better error handling and logging
- ✅ Accessibility support (prefers-reduced-motion)

#### 3. **Timing Coordination**
- ✅ GSAP initializes first, sets initial states
- ✅ Swiper initializes after a small delay (50ms)
- ✅ MutationObserver ensures Swiper waits for visibility
- ✅ Callbacks trigger Swiper updates after animations

## Implementation Guide

### Step 1: Include Required Libraries (IN THIS ORDER!)

```html
<!-- 1. GSAP Core -->
<script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/gsap.min.js"></script>

<!-- 2. GSAP ScrollTrigger Plugin -->
<script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/ScrollTrigger.min.js"></script>

<!-- 3. Swiper Core -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css">
<script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>

<!-- 4. Your GSAP Reveal Script -->
<script src="gsap-reveal.js"></script>

<!-- 5. Your Swiper Init Script -->
<script src="swiper-init.js"></script>
```

### Step 2: HTML Structure

#### Basic Swiper (no reveal animation):
```html
<div data-swiper-group>
  <div data-swiper-wrap class="swiper">
    <div class="swiper-wrapper">
      <div class="swiper-slide">Slide 1</div>
      <div class="swiper-slide">Slide 2</div>
      <div class="swiper-slide">Slide 3</div>
    </div>
    <div class="swiper-pagination"></div>
  </div>
  <button data-swiper-prev>Previous</button>
  <button data-swiper-next>Next</button>
</div>
```

#### Swiper WITH Reveal Animation:
```html
<div data-reveal-group data-stagger="150" data-distance="3em">
  <h2>This heading will animate in</h2>

  <!-- Swiper will stay visible but animate in -->
  <div data-swiper-group>
    <div data-swiper-wrap class="swiper">
      <div class="swiper-wrapper">
        <div class="swiper-slide">Slide 1</div>
        <div class="swiper-slide">Slide 2</div>
        <div class="swiper-slide">Slide 3</div>
      </div>
      <div class="swiper-pagination"></div>
    </div>
    <button data-swiper-prev>Previous</button>
    <button data-swiper-next>Next</button>
  </div>

  <p>This paragraph will also animate in</p>
</div>
```

### Step 3: Configuration Options

#### GSAP Reveal Attributes:
- `data-reveal-group` - Marks a container for reveal animation
- `data-stagger="100"` - Delay between child animations (milliseconds)
- `data-distance="2em"` - Distance elements travel during reveal
- `data-start="top 80%"` - ScrollTrigger start position

#### Swiper Attributes:
- `data-swiper-group` - Marks a container for Swiper initialization
- `data-swiper-wrap` - The actual Swiper container
- `data-swiper-prev` - Previous button
- `data-swiper-next` - Next button
- `.swiper-pagination` - Pagination element (optional)

## Debugging

### Check Browser Console

The improved scripts include helpful logging:

```
✓ "Reveal group 0 initialized successfully"
✓ "Swiper 0 initialized successfully"
✓ "Swiper updated after reveal animation"
```

### Common Error Messages:

```
❌ "Swiper library is not loaded"
   → Include Swiper before swiper-init.js

❌ "GSAP library is not loaded"
   → Include GSAP before gsap-reveal.js

❌ "ScrollTrigger plugin is not loaded"
   → Include ScrollTrigger plugin

❌ "Swiper group X is hidden. Delaying initialization..."
   → Normal behavior, Swiper will initialize when visible
```

### Testing Checklist:

- [ ] Swiper slides are visible and correct width
- [ ] Navigation buttons work (if present)
- [ ] Pagination shows and is clickable (if present)
- [ ] Reveal animations trigger on scroll
- [ ] No console errors
- [ ] Works on mobile/tablet breakpoints (480px, 992px)
- [ ] Keyboard navigation works (arrow keys)
- [ ] Reduced motion preference is respected

## Advanced: Custom Configuration

### Modify Swiper Settings

Edit `swiper-init.js`, find `swiperConfig`:

```javascript
const swiperConfig = {
  slidesPerView: 1.25,  // Change default slides
  speed: 600,            // Animation speed
  spaceBetween: 20,      // Add space between slides
  loop: true,            // Enable loop mode
  autoplay: {            // Enable autoplay
    delay: 3000,
  },
  // ... rest of config
};
```

### Modify Reveal Animation

Edit `gsap-reveal.js`, find animation settings:

```javascript
const animDuration = 0.8;     // Animation duration (seconds)
const animEase = "power4.inOut";  // Easing function
```

## Browser Support

- ✅ Modern browsers (Chrome, Firefox, Safari, Edge)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)
- ✅ IE 11 (with polyfills for Swiper 8.x)

## Performance Tips

1. **Lazy load images** in Swiper slides
2. **Limit reveal groups** on a single page
3. **Use `will-change: transform`** on animated elements
4. **Debounce** ScrollTrigger refresh on resize

## Troubleshooting

### Swiper slides have wrong width

**Cause:** Swiper initialized while parent was hidden
**Solution:** The script now handles this automatically with MutationObserver

### Animations don't trigger

**Cause:** ScrollTrigger start position might be wrong
**Solution:** Adjust `data-start` attribute (try "top 90%" or "top center")

### Multiple Swipers interfere

**Cause:** Shared pagination selectors
**Solution:** Use unique pagination classes or query within each group

### Slides flash visible before animation

**Cause:** GSAP hasn't set initial hidden state yet
**Solution:** Add CSS: `[data-reveal-group] { opacity: 0; }` then GSAP will handle it

## Questions?

For issues or questions:
1. Check browser console for error messages
2. Verify script load order
3. Inspect element visibility with DevTools
4. Test without reveal animations first
