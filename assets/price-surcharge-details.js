import { ThemeEvents } from '@theme/events';

/**
 * A custom element that displays price surcharge breakdown.
 * This component listens for variant update events and updates the display accordingly.
 */
class PriceSurchargeDetails extends HTMLElement {
  connectedCallback() {
    const closestSection = this.closest('.shopify-section, dialog');
    if (!closestSection) return;
    closestSection.addEventListener(ThemeEvents.variantUpdate, this.updateSurcharge);
  }

  disconnectedCallback() {
    const closestSection = this.closest('.shopify-section, dialog');
    if (!closestSection) return;
    closestSection.removeEventListener(ThemeEvents.variantUpdate, this.updateSurcharge);
  }

  /**
   * Updates the surcharge breakdown display.
   * @param {CustomEvent} event - The variant update event.
   */
  updateSurcharge = (event) => {
    if (event.detail.data.newProduct) {
      this.dataset.productId = event.detail.data.newProduct.id;
    } else if (event.target instanceof HTMLElement && event.target.dataset.productId !== this.dataset.productId) {
      return;
    }

    // Find the new price-surcharge-details element in the updated HTML
    const newSurchargeDetails = event.detail.data.html.querySelector(
      `price-surcharge-details[data-block-id="${this.dataset.blockId}"]`
    );
    if (!newSurchargeDetails) return;

    // Update visibility based on whether the new variant has a surcharge
    this.hidden = newSurchargeDetails.hidden;

    // Update surcharge container
    const newContainer = newSurchargeDetails.querySelector('[ref="surchargeContainer"]');
    const currentContainer = this.querySelector('[ref="surchargeContainer"]');
    if (newContainer && currentContainer) {
      currentContainer.replaceWith(newContainer);
    }
  };
}

if (!customElements.get('price-surcharge-details')) {
  customElements.define('price-surcharge-details', PriceSurchargeDetails);
}
