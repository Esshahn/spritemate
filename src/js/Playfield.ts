import { dom } from "./helper";
import Window_Controls from "./Window_Controls";

// Interface for a sprite placed on the playfield
interface PlayfieldSprite {
  id: string; // unique ID for this instance
  spriteIndex: number; // which sprite from the sprite list
  x: number; // position on playfield
  y: number; // position on playfield
  doubleX: boolean; // x stretch
  doubleY: boolean; // y stretch
  zIndex: number; // layer order
  name: string; // display name
}

export default class Playfield extends Window_Controls {
  canvas_element: HTMLCanvasElement;
  canvas: CanvasRenderingContext2D;
  sprites: PlayfieldSprite[] = [];
  selectedSprite: PlayfieldSprite | null = null;
  dragging: boolean = false;
  dragOffsetX: number = 0;
  dragOffsetY: number = 0;
  nextId: number = 1;
  all_data: any = null; // Cache of sprite data
  selectedBackgroundColor: number = 0; // Default to color 0 (black)
  grid: boolean = false; // Grid is off by default
  scanlines: boolean = false; // Scanlines are off by default
  private app: any; // Reference to App for calling saveState()

  constructor(public window: number, public config, app: any) {
    super();
    this.config = config;
    this.window = window;
    this.app = app;

    // Setup canvas - playfield is a larger canvas
    this.canvas_element = document.createElement("canvas");
    // Only allow zoom 1 (320x200) or 2 (640x400)
    const savedZoom = this.config.window_playfield?.zoom ?? 1;
    this.zoom = savedZoom === 2 ? 2 : 1;
    this.zoom_min = 1;
    this.zoom_max = 2;
    this.pixels_x = this.config.sprite_x;
    this.pixels_y = this.config.sprite_y;

    // Restore grid state from config
    this.grid = this.config.window_playfield?.grid ?? false;

    // Playfield canvas size - 320x200 (C64 screen resolution) at zoom 1
    this.width = 320 * this.zoom;
    this.height = 200 * this.zoom;

    this.canvas_element.id = "playfield";
    this.canvas_element.width = this.width;
    this.canvas_element.height = this.height;
    this.canvas = this.canvas_element.getContext("2d")!;

    const template = `
      <div class="window_menu">
        <div class="window_menu_icon_area">
          <img src="ui/icon-zoom-in.png" class="icon-hover" id="icon-playfield-zoom-in" title="zoom in">
          <img src="ui/icon-zoom-out.png" class="icon-hover" id="icon-playfield-zoom-out" title="zoom out">
          <img src="ui/icon-grid.png" class="icon-hover" id="icon-playfield-grid" title="toggle grid">
          <img src="ui/icon-scanlines.png" class="icon-hover" id="icon-playfield-scanlines" title="toggle scanlines">
        </div>
        <div id="playfield-color-palette" class="playfield-color-palette"></div>
        <img src="ui/icon-list-trash.png" class="icon-right icon-hover" id="playfield-clear-all" title="clear all sprites">
      </div>
      <div id="playfield-canvas-container"></div>
      <div id="playfield-sprite-controls" class="playfield-sprite-controls">
        <div class="playfield-control-row">
          <label>Sprite:</label>
          <span id="playfield-sprite-name" class="playfield-sprite-name">-</span>
        </div>
        <div class="playfield-control-row">
          <label>X:</label>
          <input type="number" id="playfield-sprite-x" disabled />
          <label>Y:</label>
          <input type="number" id="playfield-sprite-y" disabled />
        </div>
        <div class="playfield-control-row">
          <label>
            <input type="checkbox" id="playfield-sprite-double-x" disabled />
            Double Width
          </label>
          <label>
            <input type="checkbox" id="playfield-sprite-double-y" disabled />
            Double Height
          </label>
        </div>
        <div class="playfield-control-row">
          <label>Z-Index:</label>
          <input type="number" id="playfield-sprite-z-index" disabled />
        </div>
        <div class="playfield-control-row">
          <button id="playfield-sprite-remove" class="playfield-button" disabled>Remove from Playfield</button>
        </div>
      </div>
    `;

    dom.append("#window-" + this.window, template);

    // Create a wrapper for the canvas to position the selection overlay
    const canvasWrapper = document.createElement("div");
    canvasWrapper.id = "playfield-canvas-wrapper";
    canvasWrapper.className = "playfield-canvas-wrapper";
    canvasWrapper.appendChild(this.canvas_element);

    dom.append_element("#playfield-canvas-container", canvasWrapper);

    this.createColorPalette();
    this.setupEventListeners();
  }

  createColorPalette() {
    const paletteContainer = dom.sel("#playfield-color-palette");
    if (!paletteContainer) return;

    // Create 16 color squares
    for (let i = 0; i < 16; i++) {
      const colorSquare = document.createElement("div");
      colorSquare.className = "playfield-color-square";
      colorSquare.id = `playfield-color-${i}`;
      colorSquare.style.backgroundColor = this.config.colors[i];
      colorSquare.title = `Set background to ${this.config.color_names[i]}`;

      // Mark the first color as selected by default
      if (i === 0) {
        colorSquare.classList.add("playfield-color-selected");
      }

      colorSquare.onclick = () => {
        this.selectBackgroundColor(i);
      };

      paletteContainer.appendChild(colorSquare);
    }
  }

  selectBackgroundColor(colorIndex: number) {
    this.selectedBackgroundColor = colorIndex;

    // Update visual selection - remove previous, add new
    document.querySelectorAll(".playfield-color-selected").forEach(el =>
      el.classList.remove("playfield-color-selected")
    );
    dom.sel(`#playfield-color-${colorIndex}`)?.classList.add("playfield-color-selected");

    this.render();
    this.app.saveState(); // Trigger save
  }

  setupEventListeners() {
    // Canvas mouse events for dragging
    this.canvas_element.addEventListener("mousedown", this.onMouseDown.bind(this));
    this.canvas_element.addEventListener("mousemove", this.onMouseMove.bind(this));
    this.canvas_element.addEventListener("mouseup", this.onMouseUp.bind(this));
    this.canvas_element.addEventListener("mouseleave", this.onMouseUp.bind(this));

    // Clear all button
    const clearAllBtn = dom.sel("#playfield-clear-all") as HTMLButtonElement;
    if (clearAllBtn) {
      clearAllBtn.onclick = () => {
        this.sprites = [];
        this.selectedSprite = null;
        this.updateControls();
        this.render();
        this.app.saveState(); // Trigger save
      };
    }

    // Sprite controls
    const xInput = dom.sel("#playfield-sprite-x") as HTMLInputElement;
    if (xInput) {
      xInput.onchange = () => {
        if (this.selectedSprite) {
          this.selectedSprite.x = parseInt(xInput.value) || 0;
          this.render();
          this.app.saveState(); // Trigger save
        }
      };
    }

    const yInput = dom.sel("#playfield-sprite-y") as HTMLInputElement;
    if (yInput) {
      yInput.onchange = () => {
        if (this.selectedSprite) {
          this.selectedSprite.y = parseInt(yInput.value) || 0;
          this.render();
          this.app.saveState(); // Trigger save
        }
      };
    }

    const doubleXCheckbox = dom.sel("#playfield-sprite-double-x") as HTMLInputElement;
    if (doubleXCheckbox) {
      doubleXCheckbox.onchange = () => {
        if (this.selectedSprite) {
          this.selectedSprite.doubleX = doubleXCheckbox.checked;
          this.render();
          this.app.saveState(); // Trigger save
        }
      };
    }

    const doubleYCheckbox = dom.sel("#playfield-sprite-double-y") as HTMLInputElement;
    if (doubleYCheckbox) {
      doubleYCheckbox.onchange = () => {
        if (this.selectedSprite) {
          this.selectedSprite.doubleY = doubleYCheckbox.checked;
          this.render();
          this.app.saveState(); // Trigger save
        }
      };
    }

    const zIndexInput = dom.sel("#playfield-sprite-z-index") as HTMLInputElement;
    if (zIndexInput) {
      zIndexInput.onchange = () => {
        if (this.selectedSprite) {
          this.selectedSprite.zIndex = parseInt(zIndexInput.value) || 0;
          this.sortByZIndex();
          this.render();
          this.app.saveState(); // Trigger save
        }
      };
    }

    const removeBtn = dom.sel("#playfield-sprite-remove") as HTMLButtonElement;
    if (removeBtn) {
      removeBtn.onclick = () => {
        if (this.selectedSprite) {
          this.sprites = this.sprites.filter(s => s.id !== this.selectedSprite!.id);
          this.selectedSprite = null;
          this.updateControls();
          this.render();
          this.app.saveState(); // Trigger save
        }
      };
    }
  }

  onMouseDown(e: MouseEvent) {
    const rect = this.canvas_element.getBoundingClientRect();
    const x = (e.clientX - rect.left) / this.zoom;
    const y = (e.clientY - rect.top) / this.zoom;

    // Check if clicking on a sprite (reverse order for z-index)
    for (let i = this.sprites.length - 1; i >= 0; i--) {
      const sprite = this.sprites[i];
      const { width, height } = this.getSpriteDimensions(sprite);

      if (
        x >= sprite.x &&
        x <= sprite.x + width &&
        y >= sprite.y &&
        y <= sprite.y + height
      ) {
        this.selectedSprite = sprite;
        this.dragging = true;
        this.dragOffsetX = x - sprite.x;
        this.dragOffsetY = y - sprite.y;
        this.updateControls();
        this.render();
        return;
      }
    }

    // Clicked on empty space
    this.selectedSprite = null;
    this.updateControls();
    this.render();
  }

  onMouseMove(e: MouseEvent) {
    if (!this.dragging || !this.selectedSprite) return;

    const rect = this.canvas_element.getBoundingClientRect();
    const x = (e.clientX - rect.left) / this.zoom;
    const y = (e.clientY - rect.top) / this.zoom;

    // Round to integers to ensure sprite positions are always whole numbers
    this.selectedSprite.x = Math.max(0, Math.round(x - this.dragOffsetX));
    this.selectedSprite.y = Math.max(0, Math.round(y - this.dragOffsetY));

    this.updateControls();
    this.render();
  }

  onMouseUp() {
    if (this.dragging) {
      this.dragging = false;
      this.app.saveState(); // Trigger save after drag
    }
  }

  addSprite(spriteIndex: number, spriteName: string, spriteData: any) {
    const newSprite: PlayfieldSprite = {
      id: `sprite_${this.nextId++}`,
      spriteIndex: spriteIndex,
      x: 50,
      y: 50,
      doubleX: spriteData.double_x || false,
      doubleY: spriteData.double_y || false,
      zIndex: this.sprites.length,
      name: spriteName || `Sprite ${spriteIndex + 1}`,
    };

    this.sprites.push(newSprite);
    this.selectedSprite = newSprite;
    this.updateControls();
    this.render();
    this.app.saveState(); // Trigger save
  }

  sortByZIndex() {
    this.sprites.sort((a, b) => a.zIndex - b.zIndex);
  }

  getSpriteDimensions(sprite: PlayfieldSprite) {
    return {
      width: this.pixels_x * (sprite.doubleX ? 2 : 1),
      height: this.pixels_y * (sprite.doubleY ? 2 : 1)
    };
  }

  toggle_grid() {
    this.grid = !this.grid;
    this.render();
  }

  get_grid(): boolean {
    return this.grid;
  }

  toggle_scanlines() {
    this.scanlines = !this.scanlines;
    this.updateScanlines();
  }

  updateScanlines() {
    const existingScanlines = document.getElementById("playfield-scanlines-overlay");
    if (existingScanlines) {
      existingScanlines.remove();
    }

    if (this.scanlines) {
      const scanlinesOverlay = document.createElement("div");
      scanlinesOverlay.id = "playfield-scanlines-overlay";
      scanlinesOverlay.className = "playfield-scanlines";
      const wrapper = document.getElementById("playfield-canvas-wrapper");
      if (wrapper) {
        wrapper.appendChild(scanlinesOverlay);
      }
    }
  }

  display_grid() {
    // Draw grid with 24px horizontal and 21px vertical spacing
    this.canvas.setLineDash([1, 1]);
    this.canvas.strokeStyle = "#666666";

    // Vertical lines (every 24 pixels)
    for (let i = 0; i <= 320; i += 24) {
      this.canvas.beginPath();
      this.canvas.moveTo(i * this.zoom, 0);
      this.canvas.lineTo(i * this.zoom, this.canvas_element.height);
      this.canvas.stroke();
    }

    // Horizontal lines (every 21 pixels)
    for (let j = 0; j <= 200; j += 21) {
      this.canvas.beginPath();
      this.canvas.moveTo(0, j * this.zoom);
      this.canvas.lineTo(this.canvas_element.width, j * this.zoom);
      this.canvas.stroke();
    }

    // Reset line dash
    this.canvas.setLineDash([]);
  }

  // Override zoom methods to only allow 1x or 2x
  zoom_in(): void {
    if (this.zoom < this.zoom_max) {
      this.zoom = 2;
      this.update_zoom();
    }
  }

  zoom_out(): void {
    if (this.zoom > this.zoom_min) {
      this.zoom = 1;
      this.update_zoom();
    }
  }

  // Override update_zoom to resize canvas based on zoom level
  update_zoom(): void {
    this.width = 320 * this.zoom;
    this.height = 200 * this.zoom;
    this.canvas_element.width = this.width;
    this.canvas_element.height = this.height;
    this.render();
  }

  updateControls() {
    const nameSpan = dom.sel("#playfield-sprite-name") as HTMLSpanElement;
    const xInput = dom.sel("#playfield-sprite-x") as HTMLInputElement;
    const yInput = dom.sel("#playfield-sprite-y") as HTMLInputElement;
    const doubleXCheckbox = dom.sel("#playfield-sprite-double-x") as HTMLInputElement;
    const doubleYCheckbox = dom.sel("#playfield-sprite-double-y") as HTMLInputElement;
    const zIndexInput = dom.sel("#playfield-sprite-z-index") as HTMLInputElement;
    const removeBtn = dom.sel("#playfield-sprite-remove") as HTMLButtonElement;

    if (!this.selectedSprite) {
      // Disable all controls when nothing is selected
      if (nameSpan) nameSpan.textContent = "-";
      if (xInput) { xInput.value = ""; xInput.disabled = true; }
      if (yInput) { yInput.value = ""; yInput.disabled = true; }
      if (doubleXCheckbox) { doubleXCheckbox.checked = false; doubleXCheckbox.disabled = true; }
      if (doubleYCheckbox) { doubleYCheckbox.checked = false; doubleYCheckbox.disabled = true; }
      if (zIndexInput) { zIndexInput.value = ""; zIndexInput.disabled = true; }
      if (removeBtn) removeBtn.disabled = true;
      return;
    }

    // Enable controls and populate with selected sprite data
    if (nameSpan) nameSpan.textContent = this.selectedSprite.name;
    if (xInput) { xInput.value = this.selectedSprite.x.toString(); xInput.disabled = false; }
    if (yInput) { yInput.value = this.selectedSprite.y.toString(); yInput.disabled = false; }
    if (doubleXCheckbox) { doubleXCheckbox.checked = this.selectedSprite.doubleX; doubleXCheckbox.disabled = false; }
    if (doubleYCheckbox) { doubleYCheckbox.checked = this.selectedSprite.doubleY; doubleYCheckbox.disabled = false; }
    if (zIndexInput) { zIndexInput.value = this.selectedSprite.zIndex.toString(); zIndexInput.disabled = false; }
    if (removeBtn) removeBtn.disabled = false;
  }

  update(all_data: any) {
    this.all_data = all_data;
    this.render();
  }

  getPlayfieldState() {
    return {
      backgroundColor: this.selectedBackgroundColor,
      sprites: this.sprites.map(s => ({
        spriteIndex: s.spriteIndex,
        x: s.x,
        y: s.y,
        doubleX: s.doubleX,
        doubleY: s.doubleY,
        zIndex: s.zIndex,
        name: s.name
      }))
    };
  }

  setPlayfieldState(state: any) {
    if (!state) return;

    // Restore background color
    if (state.backgroundColor !== undefined) {
      this.selectBackgroundColor(state.backgroundColor);
    }

    // Restore sprites
    if (state.sprites && Array.isArray(state.sprites)) {
      this.sprites = state.sprites.map(s => ({
        id: `sprite_${this.nextId++}`,
        spriteIndex: s.spriteIndex,
        x: s.x || 0,
        y: s.y || 0,
        doubleX: s.doubleX || false,
        doubleY: s.doubleY || false,
        zIndex: s.zIndex || 0,
        name: s.name || `Sprite ${s.spriteIndex + 1}`
      }));
      this.sortByZIndex();
      this.selectedSprite = null;
      this.updateControls();
      this.render();
    }
  }

  render() {
    if (!this.all_data) return;

    // Clear canvas with selected background color
    this.canvas.fillStyle = this.config.colors[this.selectedBackgroundColor];
    this.canvas.fillRect(0, 0, this.canvas_element.width, this.canvas_element.height);

    // Draw grid if enabled (lowest z-index, below sprites)
    if (this.grid) {
      this.display_grid();
    }

    // Draw all sprites sorted by z-index
    for (const playfieldSprite of this.sprites) {
      this.renderSprite(playfieldSprite);
    }

    // Remove existing selection overlay
    const existingOverlay = dom.sel("#playfield-selection-overlay");
    if (existingOverlay) {
      existingOverlay.remove();
    }

    // Highlight selected sprite with blue dotted border
    if (this.selectedSprite) {
      const { width, height } = this.getSpriteDimensions(this.selectedSprite);

      const overlay = document.createElement("div");
      overlay.id = "playfield-selection-overlay";
      overlay.className = "playfield-selection-overlay";
      overlay.style.left = `${this.selectedSprite.x * this.zoom + 1}px`;
      overlay.style.top = `${this.selectedSprite.y * this.zoom + 1}px`;
      overlay.style.width = `${width * this.zoom}px`;
      overlay.style.height = `${height * this.zoom}px`;

      const wrapper = dom.sel("#playfield-canvas-wrapper");
      if (wrapper) {
        wrapper.appendChild(overlay);
      }
    }
  }

  renderSprite(playfieldSprite: PlayfieldSprite) {
    const sprite_data = this.all_data.sprites[playfieldSprite.spriteIndex];
    if (!sprite_data) return;

    const x_grid_step = sprite_data.multicolor ? 2 : 1;
    const scaleX = playfieldSprite.doubleX ? 2 : 1;
    const scaleY = playfieldSprite.doubleY ? 2 : 1;

    // Render each pixel (zoom affects the entire canvas, not individual pixels)
    for (let i = 0; i < this.pixels_x; i += x_grid_step) {
      for (let j = 0; j < this.pixels_y; j++) {
        const array_entry = sprite_data.pixels[j][i];

        // Skip transparent pixels
        if (array_entry === 0) continue;

        // Determine color
        let color: number;
        if (array_entry === 1 || !sprite_data.multicolor) {
          color = sprite_data.color;
        } else {
          color = this.all_data.colors[array_entry];
        }

        this.canvas.fillStyle = this.config.colors[color];

        // Draw pixel - positions and sizes are scaled by zoom
        this.canvas.fillRect(
          (playfieldSprite.x + i * scaleX) * this.zoom,
          (playfieldSprite.y + j * scaleY) * this.zoom,
          x_grid_step * scaleX * this.zoom,
          scaleY * this.zoom
        );
      }
    }
  }
}
