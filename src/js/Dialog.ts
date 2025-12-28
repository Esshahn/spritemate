/**
 * Dialog Manager - Native <dialog> wrapper to replace jQuery UI Dialog
 * Provides draggable, resizable windows with position persistence
 */

export interface DialogConfig {
  id: string;
  title: string;
  width?: number | string;
  height?: number | string;
  modal?: boolean;
  resizable?: boolean;
  closeOnEscape?: boolean;
  autoOpen?: boolean;
  left?: number;
  top?: number;
  buttons?: { [key: string]: () => void };
  onDragStop?: (position: { top: number; left: number }) => void;
  onResizeStop?: (size: { width: number; height: number; top: number; left: number }) => void;
}

export class Dialog {
  private dialog!: HTMLDialogElement;
  private wrapper!: HTMLElement;
  private titleBar!: HTMLElement;
  private content!: HTMLElement;
  private config: DialogConfig;
  private isDragging = false;
  private isResizing = false;
  private dragStartX = 0;
  private dragStartY = 0;
  private elementStartX = 0;
  private elementStartY = 0;
  private resizeStartX = 0;
  private resizeStartY = 0;
  private resizeStartWidth = 0;
  private resizeStartHeight = 0;

  constructor(config: DialogConfig) {
    this.config = {
      modal: false,
      resizable: false,
      closeOnEscape: true,
      autoOpen: true,
      width: "auto",
      height: "auto",
      ...config,
    };

    this.createDialog();
    this.setupEventListeners();

    if (this.config.autoOpen) {
      this.open();
    }
  }

  private createDialog(): void {
    // Create dialog element
    this.dialog = document.createElement("dialog");
    this.dialog.id = this.config.id;
    this.dialog.className = "spritemate-dialog";

    // Create wrapper for styling and positioning
    this.wrapper = document.createElement("div");
    this.wrapper.className = "dialog-wrapper";

    // Create title bar
    this.titleBar = document.createElement("div");
    this.titleBar.className = "dialog-titlebar";
    this.titleBar.innerHTML = `
      <span class="dialog-title">${this.config.title}</span>
    `;

    // Create content container
    this.content = document.createElement("div");
    this.content.className = "dialog-content";

    // Assemble dialog
    this.wrapper.appendChild(this.titleBar);
    this.wrapper.appendChild(this.content);
    this.dialog.appendChild(this.wrapper);

    // Add resize handle if resizable
    if (this.config.resizable) {
      const resizeHandle = document.createElement("div");
      resizeHandle.className = "dialog-resize-handle";
      this.wrapper.appendChild(resizeHandle);
    }

    // Add to document
    document.body.appendChild(this.dialog);

    // Apply initial size
    if (this.config.width && this.config.width !== "auto") {
      const widthValue = typeof this.config.width === "number"
        ? `${this.config.width}px`
        : String(this.config.width);
      this.wrapper.style.width = widthValue;
      // Remove min-width when explicit width is set
      this.wrapper.style.minWidth = "0";
    } else {
      // For auto sizing, use fit-content from CSS and let it shrink to content
      this.wrapper.style.removeProperty("width");
      this.wrapper.style.removeProperty("minWidth");
    }

    if (this.config.height && this.config.height !== "auto") {
      const heightValue = typeof this.config.height === "number"
        ? `${this.config.height}px`
        : String(this.config.height);
      this.wrapper.style.height = heightValue;
      // Remove min-height when explicit height is set
      this.wrapper.style.minHeight = "0";
    } else {
      // For auto sizing, use fit-content from CSS and let it shrink to content
      this.wrapper.style.removeProperty("height");
      this.wrapper.style.removeProperty("minHeight");
    }

    // Apply initial position if provided
    if (this.config.left !== undefined && this.config.top !== undefined) {
      this.wrapper.style.left = `${this.config.left}px`;
      this.wrapper.style.top = `${this.config.top}px`;
    }
  }

  private setupEventListeners(): void {
    // Dragging
    this.titleBar.addEventListener("mousedown", this.startDrag.bind(this));
    document.addEventListener("mousemove", this.drag.bind(this));
    document.addEventListener("mouseup", this.stopDrag.bind(this));

    // Resizing
    if (this.config.resizable) {
      const resizeHandle = this.wrapper.querySelector(".dialog-resize-handle") as HTMLElement;
      if (resizeHandle) {
        resizeHandle.addEventListener("mousedown", this.startResize.bind(this));
        document.addEventListener("mousemove", this.resize.bind(this));
        document.addEventListener("mouseup", this.stopResize.bind(this));
      }
    }

    // ESC key to close
    if (this.config.closeOnEscape) {
      this.dialog.addEventListener("cancel", (e) => {
        e.preventDefault();
        this.close();
      });
    }

    // Prevent backdrop click close for non-modal dialogs
    this.dialog.addEventListener("click", (e) => {
      if (e.target === this.dialog && !this.config.modal) {
        e.stopPropagation();
      }
    });
  }

  private startDrag(e: MouseEvent): void {
    if ((e.target as HTMLElement).classList.contains("dialog-title") ||
        (e.target as HTMLElement).classList.contains("dialog-titlebar")) {
      this.isDragging = true;
      this.dragStartX = e.clientX;
      this.dragStartY = e.clientY;

      // Get current position from style, not from getBoundingClientRect
      this.elementStartX = parseInt(this.wrapper.style.left) || 0;
      this.elementStartY = parseInt(this.wrapper.style.top) || 0;

      this.wrapper.style.cursor = "move";
      e.preventDefault();
    }
  }

  private drag(e: MouseEvent): void {
    if (!this.isDragging) return;

    const deltaX = e.clientX - this.dragStartX;
    const deltaY = e.clientY - this.dragStartY;

    const newX = this.elementStartX + deltaX;
    const newY = this.elementStartY + deltaY;

    this.wrapper.style.left = `${newX}px`;
    this.wrapper.style.top = `${newY}px`;
  }

  private stopDrag(e: MouseEvent): void {
    if (!this.isDragging) return;

    this.isDragging = false;
    this.wrapper.style.cursor = "";

    if (this.config.onDragStop) {
      this.config.onDragStop({
        left: parseInt(this.wrapper.style.left) || 0,
        top: parseInt(this.wrapper.style.top) || 0,
      });
    }
  }

  private startResize(e: MouseEvent): void {
    this.isResizing = true;
    this.resizeStartX = e.clientX;
    this.resizeStartY = e.clientY;

    const rect = this.wrapper.getBoundingClientRect();
    this.resizeStartWidth = rect.width;
    this.resizeStartHeight = rect.height;

    e.preventDefault();
    e.stopPropagation();
  }

  private resize(e: MouseEvent): void {
    if (!this.isResizing) return;

    const deltaX = e.clientX - this.resizeStartX;
    const deltaY = e.clientY - this.resizeStartY;

    const newWidth = Math.max(200, this.resizeStartWidth + deltaX);
    const newHeight = Math.max(100, this.resizeStartHeight + deltaY);

    this.wrapper.style.width = `${newWidth}px`;
    this.wrapper.style.height = `${newHeight}px`;
  }

  private stopResize(e: MouseEvent): void {
    if (!this.isResizing) return;

    this.isResizing = false;

    if (this.config.onResizeStop) {
      this.config.onResizeStop({
        width: parseInt(this.wrapper.style.width) || 0,
        height: parseInt(this.wrapper.style.height) || 0,
        left: parseInt(this.wrapper.style.left) || 0,
        top: parseInt(this.wrapper.style.top) || 0,
      });
    }
  }

  public open(): void {
    if (this.config.modal) {
      this.dialog.showModal();
    } else {
      this.dialog.show();
    }
  }

  public close(): void {
    this.dialog.close();
  }

  public isOpen(): boolean {
    return this.dialog.open;
  }

  public setTitle(title: string): void {
    const titleElement = this.titleBar.querySelector(".dialog-title");
    if (titleElement) {
      titleElement.textContent = title;
    }
  }

  public getContent(): HTMLElement {
    return this.content;
  }

  public getId(): string {
    return `#${this.config.id}`;
  }

  public destroy(): void {
    this.dialog.remove();
  }

  public setOption(key: string, value: any): void {
    if (key === "title") {
      this.setTitle(value);
    }
  }
}
