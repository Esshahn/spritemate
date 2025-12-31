/**
 * Custom Tooltip System
 *
 * Provides instant, cursor-following tooltips with smooth fade in/out
 */

export default class Tooltip {
  private tooltipElement: HTMLElement;
  private currentTarget: HTMLElement | null = null;
  private offsetX: number = 15;
  private offsetY: number = 15;

  constructor() {
    this.tooltipElement = document.getElementById('custom-tooltip')!;

    if (!this.tooltipElement) {
      console.warn('Tooltip element not found');
      return;
    }

    this.init();
  }

  private init(): void {
    // Use event delegation for better performance
    document.addEventListener('mouseover', this.handleMouseOver.bind(this));
    document.addEventListener('mouseout', this.handleMouseOut.bind(this));
    document.addEventListener('mousemove', this.handleMouseMove.bind(this));
  }

  private handleMouseOver(e: MouseEvent): void {
    const target = e.target as HTMLElement;

    // Check if element has a title attribute (tooltip text)
    if (target.hasAttribute('title') && target.getAttribute('title')?.trim()) {
      this.currentTarget = target;
      const text = target.getAttribute('title')!;

      // Store the title and remove it to prevent browser tooltip
      target.setAttribute('data-tooltip', text);
      target.removeAttribute('title');

      // Show custom tooltip
      this.show(text, e.clientX, e.clientY);
    }
  }

  private handleMouseOut(e: MouseEvent): void {
    const target = e.target as HTMLElement;

    if (target === this.currentTarget) {
      // Restore the title attribute
      const text = target.getAttribute('data-tooltip');
      if (text) {
        target.setAttribute('title', text);
        target.removeAttribute('data-tooltip');
      }

      this.hide();
      this.currentTarget = null;
    }
  }

  private handleMouseMove(e: MouseEvent): void {
    if (this.currentTarget) {
      this.updatePosition(e.clientX, e.clientY);
    }
  }

  private show(text: string, x: number, y: number): void {
    this.tooltipElement.textContent = text;
    this.updatePosition(x, y);

    // Small delay for smoother appearance
    requestAnimationFrame(() => {
      this.tooltipElement.classList.add('visible');
    });
  }

  private hide(): void {
    this.tooltipElement.classList.remove('visible');
  }

  private updatePosition(x: number, y: number): void {
    let left = x + this.offsetX;
    let top = y + this.offsetY;

    // Get tooltip dimensions
    const rect = this.tooltipElement.getBoundingClientRect();

    // Keep tooltip within viewport
    if (left + rect.width > window.innerWidth) {
      left = x - rect.width - this.offsetX;
    }

    if (top + rect.height > window.innerHeight) {
      top = y - rect.height - this.offsetY;
    }

    this.tooltipElement.style.left = `${left}px`;
    this.tooltipElement.style.top = `${top}px`;
  }
}
