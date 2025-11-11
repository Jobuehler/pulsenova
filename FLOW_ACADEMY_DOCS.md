# Flow Academy - Data-Split & Load Animation System

## Overview

This enhanced system provides comprehensive text animation capabilities for the Flow Academy website, following the same pattern as the osmo-website-template. It includes:

- **Text Splitting**: Automatically splits text into lines and letters
- **Load Animations**: Animates elements when the page loads
- **Scroll Animations**: Triggers animations as elements come into view

## Setup

### 1. Include Required Libraries

Make sure you have these GSAP plugins loaded:

```html
<script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/gsap.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/SplitText.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/ScrollTrigger.min.js"></script>
```

### 2. Include the Flow Academy Script

```html
<script src="flow-academy.js"></script>
```

## HTML Attribute Reference

### Text Splitting

#### Split into Lines
```html
<h1 data-split="lines">
  Your heading text here
</h1>
```

#### Split into Lines (Alternative - for backward compatibility)
```html
<h1 data-split="heading">
  Your heading text here
</h1>
```

#### Split into Letters
```html
<p data-split="letters">
  Text that will be split into individual letters
</p>
```

### Load Animations

Load animations trigger automatically when the page loads.

#### Hero Section
The first `.section` or element with `[data-hero]` will be animated on load:

```html
<section class="section" style="opacity: 0;">
  <h1 data-split="lines">Welcome to Flow Academy</h1>
  <div data-load-items="wrap-p">
    <p>This paragraph will animate on load</p>
    <p>So will this one</p>
  </div>
  <div data-load-items="wrap-buttons">
    <a href="#" class="button">Get Started</a>
    <a href="#" class="button">Learn More</a>
  </div>
</section>
```

#### Reveal Items
Elements that should fade in on load:

```html
<div data-load-items="reveal">
  <img src="image.jpg" alt="Image">
</div>
```

### Scroll-Triggered Animations

Elements with `data-reveal="scroll"` will animate when they scroll into view:

```html
<div data-reveal="scroll">
  <h2 data-split="lines">This heading animates on scroll</h2>
</div>

<section data-reveal="scroll">
  <h3 data-split="lines">Another section</h3>
  <p data-split="lines">With multiple lines of text</p>
</section>
```

## Complete Example

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Flow Academy</title>
  <style>
    /* Required CSS for text split animations */
    .single-line-wrap {
      overflow: hidden;
    }

    .single-line {
      display: block;
      transform: translateY(120%);
    }

    .single-letter {
      display: inline-block;
    }

    /* Hide hero section initially */
    .section {
      opacity: 0;
    }

    /* Optional: Smooth transitions for letters */
    [data-letters-delay] .single-letter {
      transition: all 0.3s ease;
    }
  </style>
</head>
<body>
  <!-- Navigation -->
  <nav class="nav-row" style="transform: translateY(-100%);">
    <a href="/">Home</a>
    <a href="/about">About</a>
  </nav>

  <!-- Hero Section with Load Animation -->
  <section class="section" style="opacity: 0;">
    <h1 data-split="lines">
      Welcome to Flow Academy
    </h1>

    <div data-load-items="wrap-p">
      <p>Learn animation and motion design</p>
      <p>From beginner to professional</p>
    </div>

    <div data-load-items="wrap-buttons">
      <a href="#courses" class="button">Browse Courses</a>
      <a href="#about" class="button">Learn More</a>
    </div>

    <div data-load-items="reveal">
      <img src="hero-image.jpg" alt="Hero">
    </div>
  </section>

  <!-- Scroll-Triggered Section -->
  <section data-reveal="scroll">
    <h2 data-split="lines">
      Our Courses
    </h2>
    <p data-split="lines">
      Discover our comprehensive curriculum
    </p>
  </section>

  <!-- Another Scroll-Triggered Section -->
  <div data-reveal="scroll">
    <h3 data-split="lines">Advanced Techniques</h3>
    <p data-split="letters">
      Master the art of animation
    </p>
  </div>

  <!-- Scripts -->
  <script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/gsap.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/SplitText.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/ScrollTrigger.min.js"></script>
  <script src="flow-academy.js"></script>
</body>
</html>
```

## Advanced Options

### Legacy Support

The script maintains backward compatibility with the old `initMaskTextScrollReveal()` function. Elements with `data-split="heading"` and `data-split-reveal` attributes will still work:

```html
<h1 data-split="heading" data-split-reveal="lines">
  Legacy heading
</h1>

<h2 data-split="heading" data-split-reveal="words">
  Word-by-word animation
</h2>

<h3 data-split="heading" data-split-reveal="chars">
  Character-by-character animation
</h3>
```

### Custom Selectors

If your site uses different class names or selectors, you can modify these in the script:

- **Navigation**: `.nav-row, nav, [data-nav]`
- **Hero section**: `.section, [data-hero], [data-load-section]`
- **Buttons**: `.button, [data-button]`

### Animation Timing

You can adjust the default timing values at the top of the script:

```javascript
let staggerDefault = 0.075; // Time between each animated element
let durationDefault = 0.8;  // Duration of each animation

const splitConfig = {
  lines: { duration: 0.8, stagger: 0.08 },
  words: { duration: 0.6, stagger: 0.06 },
  chars: { duration: 0.4, stagger: 0.01 }
};
```

## Key Differences from Old System

### Old System (initMaskTextScrollReveal)
- Required `data-split="heading"` on every element
- Used `mask: 'lines'` approach
- Limited to scroll-triggered animations
- Required `data-split-reveal` to specify type

### New System
- Uses `data-split="lines"` or `data-split="letters"`
- Supports both load and scroll animations
- Automatic line wrapping with `.single-line-wrap`
- Better resize handling
- More consistent with other projects

## CSS Requirements

Add this CSS to your stylesheet:

```css
/* Text Split Styles */
.single-line-wrap {
  overflow: hidden;
  display: block;
}

.single-line {
  display: block;
  transform: translateY(120%);
  will-change: transform;
}

.single-letter {
  display: inline-block;
  will-change: transform, opacity;
}

/* Hide sections that will load animate */
.section {
  opacity: 0;
}

/* Navigation hidden initially */
.nav-row,
nav[data-nav] {
  transform: translateY(-100%);
}
```

## Troubleshooting

### Animations not triggering
1. Check that GSAP plugins are loaded before your script
2. Verify HTML attributes are correct (`data-split="lines"` not `data-split="line"`)
3. Ensure ScrollTrigger is registered

### Text appears immediately without animation
1. Make sure CSS is properly hiding elements initially
2. Check that `.single-line` has `transform: translateY(120%)`
3. Verify `.section` has `opacity: 0`

### Resize issues
The script automatically handles window resizes, but only when the width changes (not height-only changes like mobile keyboard appearing).

## Support

For issues or questions, refer to:
- GSAP Documentation: https://greensock.com/docs/
- SplitText Plugin: https://greensock.com/docs/v3/Plugins/SplitText
- ScrollTrigger: https://greensock.com/docs/v3/Plugins/ScrollTrigger
