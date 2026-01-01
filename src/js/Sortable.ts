/**
 * Sortable - Native drag-drop sorting to replace jQuery UI Sortable
 * Provides drag-and-drop reordering for DOM elements
 */

export interface SortableConfig {
  onSort?: (oldIndex: number, newIndex: number) => void;
  onSortStart?: () => void;
}

export class Sortable {
  private container: HTMLElement;
  private config: SortableConfig;
  private draggedElement: HTMLElement | null = null;
  private placeholder: HTMLElement | null = null;
  private draggedIndex: number = -1;

  constructor(container: HTMLElement | string, config: SortableConfig = {}) {
    this.container = typeof container === "string"
      ? document.querySelector(container) as HTMLElement
      : container;

    if (!this.container) {
      throw new Error("Sortable container not found");
    }

    this.config = config;
    this.init();
  }

  private init(): void {
    this.container.addEventListener("dragstart", this.handleDragStart.bind(this));
    this.container.addEventListener("dragend", this.handleDragEnd.bind(this));
    this.container.addEventListener("dragover", this.handleDragOver.bind(this));
    this.container.addEventListener("drop", this.handleDrop.bind(this));

    // Make all children draggable
    this.updateDraggableItems();
  }

  private updateDraggableItems(): void {
    const items = this.container.children;
    for (let i = 0; i < items.length; i++) {
      const item = items[i] as HTMLElement;
      item.draggable = true;
    }
  }

  private handleDragStart(e: DragEvent): void {
    const target = e.target as HTMLElement;

    // Check if the target is a direct child of container
    if (target.parentElement !== this.container) return;

    // Call onSortStart callback if provided
    if (this.config.onSortStart) {
      this.config.onSortStart();
    }

    this.draggedElement = target;
    this.draggedIndex = Array.from(this.container.children).indexOf(target);

    // Set drag data
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/html", target.innerHTML);
    }

    // Add dragging class
    setTimeout(() => {
      if (this.draggedElement) {
        this.draggedElement.classList.add("sortable-dragging");
      }
    }, 0);

    // Create placeholder
    this.placeholder = document.createElement("div");
    this.placeholder.className = "sortable-placeholder";
    this.placeholder.style.width = `${target.offsetWidth}px`;
    this.placeholder.style.height = `${target.offsetHeight}px`;
  }

  private handleDragEnd(e: DragEvent): void {
    if (this.draggedElement) {
      this.draggedElement.classList.remove("sortable-dragging");
      this.draggedElement = null;
    }

    if (this.placeholder) {
      // Remove placeholder if it's still in DOM (might already be removed in handleDrop)
      if (this.placeholder.parentElement) {
        this.placeholder.remove();
      }
      this.placeholder = null;
    }
  }

  private handleDragOver(e: DragEvent): void {
    e.preventDefault();
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = "move";
    }

    if (!this.draggedElement || !this.placeholder) return;

    // Find which element is under the cursor
    const items = Array.from(this.container.children) as HTMLElement[];
    let closestItem: HTMLElement | null = null;
    let insertBefore = false;

    for (const item of items) {
      if (item === this.draggedElement || item === this.placeholder) continue;

      const rect = item.getBoundingClientRect();
      const horizontalMidpoint = rect.left + rect.width / 2;

      // Check if cursor is over this item
      if (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      ) {
        closestItem = item;
        insertBefore = e.clientX < horizontalMidpoint;
        break;
      }
    }

    // Insert placeholder at the cursor position
    if (closestItem) {
      if (insertBefore) {
        this.container.insertBefore(this.placeholder, closestItem);
      } else {
        this.container.insertBefore(this.placeholder, closestItem.nextSibling);
      }
    }
  }

  private handleDrop(e: DragEvent): void {
    e.preventDefault();
    e.stopPropagation();

    if (!this.draggedElement || !this.placeholder) return;

    // Check if placeholder is actually in the container
    const placeholderInContainer = this.placeholder.parentElement === this.container;

    if (placeholderInContainer) {
      const newIndex = Array.from(this.container.children).indexOf(this.placeholder);

      // Insert dragged element at new position
      this.container.insertBefore(this.draggedElement, this.placeholder);

      // Remove placeholder immediately before callback
      this.placeholder.remove();

      // Call callback if provided (after placeholder is removed)
      if (this.config.onSort && newIndex !== -1 && this.draggedIndex !== newIndex) {
        const adjustedNewIndex = newIndex > this.draggedIndex ? newIndex - 1 : newIndex;
        this.config.onSort(this.draggedIndex, adjustedNewIndex);
      }
    }

    // Reset state
    this.draggedIndex = -1;
  }

  public refresh(): void {
    this.updateDraggableItems();
  }

  public destroy(): void {
    const items = this.container.children;
    for (let i = 0; i < items.length; i++) {
      const item = items[i] as HTMLElement;
      item.draggable = false;
    }
  }
}
