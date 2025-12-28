/**
 * Sortable - Native drag-drop sorting to replace jQuery UI Sortable
 * Provides drag-and-drop reordering for DOM elements
 */

export interface SortableConfig {
  cursor?: string;
  tolerance?: string;
  revert?: string | number;
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

    this.config = {
      cursor: "move",
      tolerance: "pointer",
      revert: "100",
      ...config,
    };

    this.init();
  }

  private init(): void {
    this.container.addEventListener("dragstart", this.handleDragStart.bind(this));
    this.container.addEventListener("dragend", this.handleDragEnd.bind(this));
    this.container.addEventListener("dragover", this.handleDragOver.bind(this));
    this.container.addEventListener("drop", this.handleDrop.bind(this));
    this.container.addEventListener("dragenter", this.handleDragEnter.bind(this));

    // Make all children draggable
    this.updateDraggableItems();
  }

  private updateDraggableItems(): void {
    const items = this.container.children;
    for (let i = 0; i < items.length; i++) {
      const item = items[i] as HTMLElement;
      item.draggable = true;
      item.style.cursor = this.config.cursor || "move";
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
    }

    if (this.placeholder && this.placeholder.parentElement) {
      this.placeholder.remove();
    }

    this.draggedElement = null;
    this.placeholder = null;
  }

  private handleDragOver(e: DragEvent): void {
    e.preventDefault();
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = "move";
    }
  }

  private handleDragEnter(e: DragEvent): void {
    const target = e.target as HTMLElement;

    // Check if target is a sortable item
    if (target.parentElement !== this.container || target === this.draggedElement) {
      return;
    }

    // Insert placeholder before or after target based on mouse position
    const rect = target.getBoundingClientRect();
    const midpoint = rect.top + rect.height / 2;

    if (this.placeholder) {
      if (e.clientY < midpoint) {
        this.container.insertBefore(this.placeholder, target);
      } else {
        this.container.insertBefore(this.placeholder, target.nextSibling);
      }
    }
  }

  private handleDrop(e: DragEvent): void {
    e.preventDefault();
    e.stopPropagation();

    if (!this.draggedElement || !this.placeholder) return;

    // Get new index
    const newIndex = Array.from(this.container.children).indexOf(this.placeholder);

    // Insert dragged element at new position
    this.container.insertBefore(this.draggedElement, this.placeholder);

    // Remove placeholder
    this.placeholder.remove();

    // Call callback if provided
    if (this.config.onSort && newIndex !== -1 && this.draggedIndex !== newIndex) {
      // Adjust index if placeholder was counted
      const adjustedNewIndex = newIndex > this.draggedIndex ? newIndex - 1 : newIndex;
      this.config.onSort(this.draggedIndex, adjustedNewIndex);
    }

    // Cleanup
    this.draggedElement.classList.remove("sortable-dragging");
    this.draggedElement = null;
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
      item.style.cursor = "";
    }
  }
}
