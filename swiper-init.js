/**
 * Swiper Slider Initialization
 * Fixed version with proper error handling and GSAP compatibility
 */

function initSwiperSlider() {
  // Check if Swiper is available
  if (typeof Swiper === 'undefined') {
    console.error('Swiper library is not loaded. Please include Swiper before this script.');
    return;
  }

  const swiperSliderGroups = document.querySelectorAll("[data-swiper-group]");

  if (!swiperSliderGroups.length) {
    console.warn('No Swiper groups found with [data-swiper-group] attribute.');
    return;
  }

  swiperSliderGroups.forEach((swiperGroup, index) => {
    const swiperSliderWrap = swiperGroup.querySelector("[data-swiper-wrap]");

    if (!swiperSliderWrap) {
      console.warn(`Swiper group ${index} is missing [data-swiper-wrap] element.`);
      return;
    }

    const prevButton = swiperGroup.querySelector("[data-swiper-prev]");
    const nextButton = swiperGroup.querySelector("[data-swiper-next]");
    const pagination = swiperGroup.querySelector('.swiper-pagination');

    // Ensure the swiper wrapper is visible before initialization
    // This prevents dimension calculation issues
    const computedStyle = window.getComputedStyle(swiperSliderWrap);
    if (computedStyle.display === 'none' || computedStyle.visibility === 'hidden') {
      console.warn(`Swiper group ${index} is hidden. Delaying initialization...`);

      // Use MutationObserver or wait for visibility
      const observer = new MutationObserver((mutations, obs) => {
        const newStyle = window.getComputedStyle(swiperSliderWrap);
        if (newStyle.display !== 'none' && newStyle.visibility !== 'hidden') {
          obs.disconnect();
          initializeSingleSwiper(swiperSliderWrap, prevButton, nextButton, pagination, index);
        }
      });

      observer.observe(swiperSliderWrap, {
        attributes: true,
        attributeFilter: ['style', 'class']
      });

      // Also try after a short delay as fallback
      setTimeout(() => {
        const newStyle = window.getComputedStyle(swiperSliderWrap);
        if (newStyle.display !== 'none' && newStyle.visibility !== 'hidden') {
          observer.disconnect();
          initializeSingleSwiper(swiperSliderWrap, prevButton, nextButton, pagination, index);
        }
      }, 100);

      return;
    }

    // Initialize immediately if visible
    initializeSingleSwiper(swiperSliderWrap, prevButton, nextButton, pagination, index);
  });
}

function initializeSingleSwiper(swiperSliderWrap, prevButton, nextButton, pagination, index) {
  try {
    const swiperConfig = {
      slidesPerView: 1.25,
      speed: 600,
      mousewheel: {
        forceToAxis: true,
      },
      grabCursor: true,
      breakpoints: {
        480: {
          slidesPerView: 1.8,
        },
        992: {
          slidesPerView: 3.5,
        }
      },
      keyboard: {
        enabled: true,
        onlyInViewport: false,
      },
      // Only add navigation if buttons exist
      ...(prevButton && nextButton && {
        navigation: {
          nextEl: nextButton,
          prevEl: prevButton,
        }
      }),
      // Only add pagination if element exists
      ...(pagination && {
        pagination: {
          el: pagination,
          type: 'bullets',
          clickable: true
        }
      }),
      // Add observer to update on DOM changes
      observer: true,
      observeParents: true,
      observeSlideChildren: true,
    };

    const swiper = new Swiper(swiperSliderWrap, swiperConfig);

    // Force update after initialization to ensure proper sizing
    requestAnimationFrame(() => {
      swiper.update();
    });

    console.log(`Swiper ${index} initialized successfully`);

    return swiper;
  } catch (error) {
    console.error(`Error initializing Swiper ${index}:`, error);
  }
}

// Export for use in other scripts
if (typeof window !== 'undefined') {
  window.initSwiperSlider = initSwiperSlider;
}

// Initialize on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  // Small delay to ensure GSAP animations have set initial states
  setTimeout(() => {
    initSwiperSlider();
  }, 50);
});
