import { prefersReducedMotion } from '@theme/utilities';

/**
 * Initializes scroll-reveal animations using IntersectionObserver.
 * Elements with data-scroll-reveal attribute will animate when scrolled into view.
 */
class ScrollReveal {
  constructor() {
    if (prefersReducedMotion()) {
      // Make all elements visible immediately if user prefers reduced motion
      this.showAllImmediately();
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            // Optionally unobserve after revealing (one-time animation)
            if (entry.target.dataset.scrollRevealOnce !== 'false') {
              this.observer.unobserve(entry.target);
            }
          } else if (entry.target.dataset.scrollRevealOnce === 'false') {
            // Re-hide if configured to repeat animation
            entry.target.classList.remove('is-visible');
          }
        });
      },
      {
        threshold: 0.2, // Trigger when 20% visible
        rootMargin: '0px 0px -70px 0px', // Element must be 70px into viewport
      }
    );

    this.init();
    this.observeMutations();
  }

  /**
   * Initialize observer on all existing scroll-reveal elements
   */
  init() {
    const elements = document.querySelectorAll('[data-scroll-reveal]');
    elements.forEach((el) => this.observer.observe(el));
  }

  /**
   * Watch for dynamically added elements
   */
  observeMutations() {
    const mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            // Check if the added node itself has the attribute
            if (node.hasAttribute?.('data-scroll-reveal')) {
              this.observer.observe(node);
            }
            // Check children of added node
            const children = node.querySelectorAll?.('[data-scroll-reveal]');
            children?.forEach((el) => this.observer.observe(el));
          }
        });
      });
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  /**
   * Fallback for reduced motion - show all elements immediately
   */
  showAllImmediately() {
    const elements = document.querySelectorAll('[data-scroll-reveal]');
    elements.forEach((el) => el.classList.add('is-visible'));
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new ScrollReveal());
} else {
  new ScrollReveal();
}
