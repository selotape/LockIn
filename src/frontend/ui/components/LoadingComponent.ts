/**
 * Loading Component
 * Shows/hides loading spinner
 */

/**
 * Loading component for displaying loading state
 */
export class LoadingComponent {
  private element: HTMLElement;

  constructor(elementId: string = 'loading') {
    const el = document.getElementById(elementId);
    if (!el) {
      throw new Error(`Loading element with id "${elementId}" not found`);
    }
    this.element = el;
  }

  /**
   * Show loading spinner
   */
  show(): void {
    this.element.style.display = 'flex';
  }

  /**
   * Hide loading spinner
   */
  hide(): void {
    this.element.style.display = 'none';
  }

  /**
   * Toggle loading spinner visibility
   */
  toggle(show: boolean): void {
    if (show) {
      this.show();
    } else {
      this.hide();
    }
  }
}
