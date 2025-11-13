/**
 * GSAP Content Reveal on Scroll
 * Fixed version with proper error handling and Swiper compatibility
 */

function initContentRevealScroll() {
  // Check if GSAP and ScrollTrigger are available
  if (typeof gsap === 'undefined') {
    console.error('GSAP library is not loaded. Please include GSAP before this script.');
    return;
  }

  if (typeof ScrollTrigger === 'undefined') {
    console.error('ScrollTrigger plugin is not loaded. Please include ScrollTrigger before this script.');
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealGroups = document.querySelectorAll('[data-reveal-group]');

  if (!revealGroups.length) {
    console.warn('No reveal groups found with [data-reveal-group] attribute.');
    return;
  }

  const ctx = gsap.context(() => {
    revealGroups.forEach((groupEl, groupIndex) => {
      // Config from attributes or defaults (group-level)
      const groupStaggerSec = (parseFloat(groupEl.getAttribute('data-stagger')) || 100) / 1000; // ms → sec
      const groupDistance = groupEl.getAttribute('data-distance') || '2em';
      const triggerStart = groupEl.getAttribute('data-start') || 'top 80%';

      const animDuration = 0.8;
      const animEase = "power4.inOut";

      // Reduced motion: show immediately without animation
      if (prefersReduced) {
        gsap.set(groupEl, { clearProps: 'all', y: 0, autoAlpha: 1 });
        // Ensure all children are visible too
        gsap.set(groupEl.querySelectorAll('*'), { clearProps: 'all', y: 0, autoAlpha: 1 });
        return;
      }

      // Check if this group contains a Swiper
      const containsSwiper = groupEl.querySelector('[data-swiper-wrap]') !== null;

      // If no direct children, animate the group element itself
      const directChildren = Array.from(groupEl.children).filter(el => el.nodeType === 1);

      if (!directChildren.length) {
        gsap.set(groupEl, { y: groupDistance, autoAlpha: 0 });
        ScrollTrigger.create({
          trigger: groupEl,
          start: triggerStart,
          once: true,
          onEnter: () => {
            gsap.to(groupEl, {
              y: 0,
              autoAlpha: 1,
              duration: animDuration,
              ease: animEase,
              onComplete: () => {
                gsap.set(groupEl, { clearProps: 'all' });
                // If contains Swiper, trigger update
                if (containsSwiper) {
                  triggerSwiperUpdate(groupEl);
                }
              }
            });
          }
        });
        return;
      }

      // Build animation slots: item or nested (deep layers allowed)
      const slots = [];
      directChildren.forEach(child => {
        const nestedGroup = child.matches('[data-reveal-group-nested]')
          ? child
          : child.querySelector(':scope [data-reveal-group-nested]');

        if (nestedGroup) {
          const includeParent = child.getAttribute('data-ignore') === 'false' ||
                               nestedGroup.getAttribute('data-ignore') === 'false';
          slots.push({
            type: 'nested',
            parentEl: child,
            nestedEl: nestedGroup,
            includeParent
          });
        } else {
          slots.push({ type: 'item', el: child });
        }
      });

      // Initial hidden state
      slots.forEach(slot => {
        if (slot.type === 'item') {
          // Skip hiding Swiper wrappers to prevent dimension issues
          const isSwiperElement = slot.el.matches('[data-swiper-wrap]') ||
                                 slot.el.querySelector('[data-swiper-wrap]');

          if (!isSwiperElement) {
            const isNestedSelf = slot.el.matches('[data-reveal-group-nested]');
            const d = isNestedSelf ? groupDistance : (slot.el.getAttribute('data-distance') || groupDistance);
            gsap.set(slot.el, { y: d, autoAlpha: 0 });
          } else {
            // For Swiper elements, only animate transform without hiding
            gsap.set(slot.el, { y: groupDistance, opacity: 1, visibility: 'visible' });
          }
        } else {
          // Parent follows the group's distance when included
          if (slot.includeParent) {
            gsap.set(slot.parentEl, { y: groupDistance, autoAlpha: 0 });
          }
          // Children use nested group's own distance
          const nestedD = slot.nestedEl.getAttribute('data-distance') || groupDistance;
          Array.from(slot.nestedEl.children).forEach(target => {
            const isSwiperElement = target.matches('[data-swiper-wrap]') ||
                                   target.querySelector('[data-swiper-wrap]');
            if (!isSwiperElement) {
              gsap.set(target, { y: nestedD, autoAlpha: 0 });
            } else {
              gsap.set(target, { y: nestedD, opacity: 1, visibility: 'visible' });
            }
          });
        }
      });

      // Extra safety: if a nested parent is included, re-assert its distance to the group's value
      slots.forEach(slot => {
        if (slot.type === 'nested' && slot.includeParent) {
          gsap.set(slot.parentEl, { y: groupDistance });
        }
      });

      // Reveal sequence
      ScrollTrigger.create({
        trigger: groupEl,
        start: triggerStart,
        once: true,
        onEnter: () => {
          const tl = gsap.timeline({
            onComplete: () => {
              // Trigger Swiper update after all animations complete
              if (containsSwiper) {
                triggerSwiperUpdate(groupEl);
              }
            }
          });

          slots.forEach((slot, slotIndex) => {
            const slotTime = slotIndex * groupStaggerSec;

            if (slot.type === 'item') {
              const isSwiperElement = slot.el.matches('[data-swiper-wrap]') ||
                                     slot.el.querySelector('[data-swiper-wrap]');

              if (!isSwiperElement) {
                tl.to(slot.el, {
                  y: 0,
                  autoAlpha: 1,
                  duration: animDuration,
                  ease: animEase,
                  onComplete: () => gsap.set(slot.el, { clearProps: 'all' })
                }, slotTime);
              } else {
                // For Swiper elements, animate only transform
                tl.to(slot.el, {
                  y: 0,
                  duration: animDuration,
                  ease: animEase,
                  onComplete: () => gsap.set(slot.el, { clearProps: 'transform' })
                }, slotTime);
              }
            } else {
              // Optionally include the parent at the same slot time
              if (slot.includeParent) {
                tl.to(slot.parentEl, {
                  y: 0,
                  autoAlpha: 1,
                  duration: animDuration,
                  ease: animEase,
                  onComplete: () => gsap.set(slot.parentEl, { clearProps: 'all' })
                }, slotTime);
              }

              // Nested children use nested stagger
              const nestedMs = parseFloat(slot.nestedEl.getAttribute('data-stagger'));
              const nestedStaggerSec = isNaN(nestedMs) ? groupStaggerSec : nestedMs / 1000;

              Array.from(slot.nestedEl.children).forEach((nestedChild, nestedIndex) => {
                const isSwiperElement = nestedChild.matches('[data-swiper-wrap]') ||
                                       nestedChild.querySelector('[data-swiper-wrap]');

                if (!isSwiperElement) {
                  tl.to(nestedChild, {
                    y: 0,
                    autoAlpha: 1,
                    duration: animDuration,
                    ease: animEase,
                    onComplete: () => gsap.set(nestedChild, { clearProps: 'all' })
                  }, slotTime + nestedIndex * nestedStaggerSec);
                } else {
                  tl.to(nestedChild, {
                    y: 0,
                    duration: animDuration,
                    ease: animEase,
                    onComplete: () => gsap.set(nestedChild, { clearProps: 'transform' })
                  }, slotTime + nestedIndex * nestedStaggerSec);
                }
              });
            }
          });
        }
      });

      console.log(`Reveal group ${groupIndex} initialized successfully`);
    });
  });

  return () => ctx.revert();
}

// Helper function to trigger Swiper updates
function triggerSwiperUpdate(container) {
  setTimeout(() => {
    const swiperWraps = container.querySelectorAll('[data-swiper-wrap]');
    swiperWraps.forEach(wrap => {
      // Try to find the Swiper instance
      if (wrap.swiper) {
        wrap.swiper.update();
        console.log('Swiper updated after reveal animation');
      } else {
        // If Swiper not initialized yet, trigger initialization
        if (typeof window.initSwiperSlider === 'function') {
          window.initSwiperSlider();
        }
      }
    });
  }, 50);
}

// Export for use in other scripts
if (typeof window !== 'undefined') {
  window.initContentRevealScroll = initContentRevealScroll;
}

// Initialize Content Reveal on Scroll
document.addEventListener("DOMContentLoaded", () => {
  initContentRevealScroll();
});
