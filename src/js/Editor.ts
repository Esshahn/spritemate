import { dom } from "./helper";
import Window_Controls from "./Window_Controls";

export default class Editor extends Window_Controls {
  // Grid constants
  private static readonly GRID_COLOR_LIGHT = "#666666";
  private static readonly GRID_COLOR_DARK = "#888888";
  private static readonly SEPARATOR_COLOR = "#aaaaaa";
  private static readonly ACTIVE_BORDER_COLOR = "#4488ff";
  private static readonly SEPARATOR_LINE_WIDTH = 2;
  private static readonly ACTIVE_BORDER_DASH = [3, 3];

  grid: boolean;
  canvas_element: HTMLCanvasElement;
  canvas: any;
  overlay_canvas_element: HTMLCanvasElement;
  overlay_canvas: CanvasRenderingContext2D;
  animation_frame_id: number | null;
  animation_offset: number;
  grid_width: number;
  grid_height: number;
  active_grid_x: number;
  active_grid_y: number;
  grid_start_sprite: number;

  constructor(public window: number, public config) {
    super();
    this.config = config;
    this.grid = this.config.window_editor.grid;
    this.window = window;

    // Initialize grid layout settings from config (default: 1x1 = single sprite mode)
    this.grid_width = this.config.window_editor.grid_width ?? 1;
    this.grid_height = this.config.window_editor.grid_height ?? 1;

    // Track which grid cell is active (for visual indicator)
    this.active_grid_x = 0;
    this.active_grid_y = 0;

    // Track the starting sprite index for the grid (stays fixed when clicking sprites)
    this.grid_start_sprite = 0;

    // Auto-enable grid if loading with grid mode (>1x1)
    this.autoEnableGridIfNeeded();

    this.canvas_element = document.createElement("canvas");
    this.zoom = this.config.window_editor.zoom;
    this.zoom_min = this.config.zoom_limits.editor.min;
    this.zoom_max = this.config.zoom_limits.editor.max;
    this.pixels_x = this.config.sprite_x * this.grid_width;
    this.pixels_y = this.config.sprite_y * this.grid_height;
    this.width = this.pixels_x * this.zoom;
    this.height = this.pixels_y * this.zoom;

    this.canvas_element.id = "editor";
    this.canvas_element.width = this.width;
    this.canvas_element.height = this.height;
    this.canvas_element.style.display = "block"; // Remove any inline spacing

    // Initialize overlay canvas for selection animation
    this.overlay_canvas_element = document.createElement("canvas");
    this.overlay_canvas_element.id = "editor-overlay";
    // Match the main canvas logical size
    this.overlay_canvas_element.width = this.width;
    this.overlay_canvas_element.height = this.height;
    this.overlay_canvas_element.style.position = "absolute";
    this.overlay_canvas_element.style.pointerEvents = "none";
    this.overlay_canvas_element.style.left = "0";
    this.overlay_canvas_element.style.top = "0";
    // Will be sized to match main canvas after it's added to DOM
    this.overlay_canvas = this.overlay_canvas_element.getContext("2d", { alpha: true })!;
    this.animation_frame_id = null;
    this.animation_offset = 0;

    const template = `
      <div class="window_menu">
        <div class="window_menu_icon_area">
          <img src="ui/icon-zoom-in.png" class="icon-hover" id="icon-editor-zoom-in" title="zoom in">
          <img src="ui/icon-zoom-out.png" class="icon-hover" id="icon-editor-zoom-out" title="zoom out">
          <img src="ui/icon-grid.png" class="icon-hover" id="icon-editor-grid" title="toggle grid">
        </div>

        <div class="window_menu_icon_area">
          <img src="ui/icon-multicolor.png" title="toggle single- & multicolor (c)" class=" icon-hover" id="icon-multicolor">
          <img src="ui/icon-flip-horizontal.png" title="flip horizontal" class="icon-hover" id="icon-flip-horizontal">
          <img src="ui/icon-flip-vertical.png" title="flip vertical" class="icon-hover" id="icon-flip-vertical">
        </div>
        <div class="window_menu_icon_area">
          <input type="text" id="input-sprite-name" name="" value="" title="rename sprite">
        </div>

        <div class="window_menu_icon_area">
          <label title="grid layout">Layout</label>
          <input type="number" id="editor-grid-width" min="1" max="8" value="${this.grid_width}" title="grid width">
          ×
          <input type="number" id="editor-grid-height" min="1" max="8" value="${this.grid_height}" title="grid height">
        </div>
      </div>
      <div id="editor-canvas-container">
        <div id="editor-canvas"></div>
      </div>

    `;

    dom.append("#window-" + this.window, template);
    dom.append_element("#editor-canvas", this.canvas_element);
    dom.append_element("#editor-canvas", this.overlay_canvas_element);

    this.canvas = this.canvas_element.getContext("2d", { alpha: false });

    // Sync overlay canvas position and size with main canvas
    this.syncOverlayCanvas();

    // Start animation loop for marching ants
    this.startAnimationLoop();

    // Setup grid layout input handlers
    this.setupGridLayoutHandlers();
  }

  /**
   * Helper method to check if we're in grid mode (more than one sprite displayed)
   */
  isGridMode(): boolean {
    return this.grid_width > 1 || this.grid_height > 1;
  }

  /**
   * Auto-enable grid display when in grid mode (>1x1)
   */
  autoEnableGridIfNeeded(): void {
    if (this.isGridMode() && !this.grid) {
      this.grid = true;
      this.config.window_editor.grid = true;
    }
  }

  /**
   * Calculate grid cell coordinates from sprite offset
   */
  getGridCellFromOffset(offset: number): { grid_x: number; grid_y: number } {
    return {
      grid_x: offset % this.grid_width,
      grid_y: Math.floor(offset / this.grid_width)
    };
  }

  setupGridLayoutHandlers(): void {
    const widthInput = dom.sel("#editor-grid-width") as HTMLInputElement;
    const heightInput = dom.sel("#editor-grid-height") as HTMLInputElement;

    if (widthInput) {
      widthInput.onchange = () => {
        const newWidth = parseInt(widthInput.value) || 1;
        this.grid_width = Math.max(1, Math.min(8, newWidth));
        widthInput.value = this.grid_width.toString();
        this.updateGridLayout();
      };
    }

    if (heightInput) {
      heightInput.onchange = () => {
        const newHeight = parseInt(heightInput.value) || 1;
        this.grid_height = Math.max(1, Math.min(8, newHeight));
        heightInput.value = this.grid_height.toString();
        this.updateGridLayout();
      };
    }
  }

  updateGridLayout(): void {
    // Update canvas dimensions based on grid layout
    this.pixels_x = this.config.sprite_x * this.grid_width;
    this.pixels_y = this.config.sprite_y * this.grid_height;
    this.width = this.pixels_x * this.zoom;
    this.height = this.pixels_y * this.zoom;

    // Resize canvases
    this.canvas_element.width = this.width;
    this.canvas_element.height = this.height;
    this.overlay_canvas_element.width = this.width;
    this.overlay_canvas_element.height = this.height;
    this.syncOverlayCanvas();

    // Auto-enable grid when switching to grid mode
    this.autoEnableGridIfNeeded();

    // Save to config
    this.config.window_editor.grid_width = this.grid_width;
    this.config.window_editor.grid_height = this.grid_height;
    const app = (window as any).app;
    if (app && app.storage) {
      app.storage.write(this.config);
    }

    // Trigger update
    if (app && app.update) {
      app.update();
    }
  }

  update(all_data) {
    this.canvas_element.width = this.width;
    this.canvas_element.height = this.height;

    const sprite_data = all_data.sprites[all_data.current_sprite];

    // set the name of the sprite as the title
    dom.val("#input-sprite-name", sprite_data.name);

    // first fill the whole canvas with the background color
    this.canvas.fillStyle = this.config.colors[all_data.colors[0]];
    this.canvas.fillRect(0, 0, this.width, this.height);

    // Render sprites
    if (this.isGridMode()) {
      // Grid mode: render multiple sprites
      this.renderGridMode(all_data);
    } else {
      // Single sprite mode: render current sprite with overlays
      this.renderSingleSpriteMode(all_data, sprite_data);
    }

    // Draw grid lines if enabled
    if (this.grid) this.display_grid(sprite_data, all_data);
  }

  /**
   * Render single sprite mode with overlays
   */
  renderSingleSpriteMode(all_data, sprite_data): void {
    // Update grid_start_sprite to follow current sprite in single mode
    this.grid_start_sprite = all_data.current_sprite;

    // overlay from previous sprite
    if (all_data.current_sprite > 0) {
      const previous_sprite = all_data.sprites[all_data.current_sprite - 1];
      if (previous_sprite.overlay) this.display_overlay(all_data, "previous");
    }

    // current sprite
    this.fill_canvas(all_data, sprite_data, 1);

    // overlay from next sprite
    if (sprite_data.overlay && all_data.current_sprite < all_data.sprites.length - 1) {
      this.display_overlay(all_data);
    }
  }

  renderGridMode(all_data): void {
    // Use the fixed grid start sprite (not current_sprite which changes when clicking)
    const start_sprite = this.grid_start_sprite;

    // Render sprites in grid layout
    for (let grid_y = 0; grid_y < this.grid_height; grid_y++) {
      for (let grid_x = 0; grid_x < this.grid_width; grid_x++) {
        const sprite_index = start_sprite + (grid_y * this.grid_width) + grid_x;

        // Only render if sprite exists
        if (sprite_index < all_data.sprites.length) {
          const sprite_data = all_data.sprites[sprite_index];
          this.renderSpriteAtPosition(all_data, sprite_data, grid_x, grid_y);
        }
      }
    }
  }

  renderSpriteAtPosition(all_data, sprite_data, grid_x: number, grid_y: number): void {
    const x_offset = grid_x * this.config.sprite_x;
    const y_offset = grid_y * this.config.sprite_y;
    const x_grid_step = sprite_data.multicolor ? 2 : 1;

    // Render each pixel of the sprite at the grid position
    for (let i = 0; i < this.config.sprite_x; i += x_grid_step) {
      for (let j = 0; j < this.config.sprite_y; j++) {
        const array_entry = sprite_data.pixels[j][i];

        // Skip transparent pixels
        if (array_entry === 0) continue;

        // Determine color based on pixel value
        let color: number;
        if (array_entry === 1 || !sprite_data.multicolor) {
          color = sprite_data.color;
        } else {
          color = all_data.colors[array_entry];
        }

        this.canvas.fillStyle = this.config.colors[color];
        this.canvas.fillRect(
          (x_offset + i) * this.zoom,
          (y_offset + j) * this.zoom,
          x_grid_step * this.zoom,
          this.zoom
        );
      }
    }
  }

  display_overlay(all_data, mode = "", alpha = 0.4) {
    let overlay_sprite_number = 1;
    if (mode === "previous") overlay_sprite_number = -1;
    const sprite_data =
      all_data.sprites[all_data.current_sprite + overlay_sprite_number];

    this.fill_canvas(all_data, sprite_data, alpha);
  }

  fill_canvas(all_data, sprite_data, alpha = 1) {
    // Use shared render_pixels method with alpha transformation
    this.render_pixels(sprite_data, all_data, (color) => this.overlay_color(color, alpha));
  }

  overlay_color(hex, alpha) {
    // expects a hex value like "#ff8800" and returns a rbga + alpha value like "rgba (50,20,100,0.5)"
    const bigint = parseInt(hex.slice(-6), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    const combined = r + "," + g + "," + b;
    const result = "rgba(" + combined + "," + alpha + ")";
    return result;
  }

  display_grid(sprite_data, all_data) {
    this.canvas.setLineDash([1, 1]);

    if (this.isGridMode()) {
      this.drawGridModeGrid(all_data);
    } else {
      this.drawSingleSpriteGrid(sprite_data);
    }
  }

  /**
   * Draw grid lines for grid mode (multiple sprites)
   */
  drawGridModeGrid(all_data): void {
    // Safety check - if all_data not available yet, skip grid mode drawing
    if (!all_data?.sprites) return;

    // First draw pixel grids for each sprite
    this.drawPixelGridsForAllSprites(all_data);

    // Then draw bold sprite separator lines
    this.drawSpriteSeparatorLines();

    // Draw blue dotted border around active sprite
    this.drawActiveSpriteIndicator();
  }

  /**
   * Draw pixel grids for all sprites in the grid
   */
  drawPixelGridsForAllSprites(all_data): void {
    for (let grid_y = 0; grid_y < this.grid_height; grid_y++) {
      for (let grid_x = 0; grid_x < this.grid_width; grid_x++) {
        const sprite_index = this.grid_start_sprite + (grid_y * this.grid_width) + grid_x;

        // Only draw grid if sprite exists
        if (sprite_index < all_data.sprites.length) {
          const sprite = all_data.sprites[sprite_index];
          this.drawSpritePixelGrid(sprite, grid_x, grid_y);
        }
      }
    }
  }

  /**
   * Draw pixel grid for a single sprite at a specific grid position
   */
  drawSpritePixelGrid(sprite, grid_x: number, grid_y: number): void {
    const x_offset = grid_x * this.config.sprite_x;
    const y_offset = grid_y * this.config.sprite_y;
    const x_grid_step = sprite.multicolor ? 2 : 1;

    // Vertical lines within sprite
    for (let i = 0; i <= this.config.sprite_x; i += x_grid_step) {
      this.canvas.strokeStyle = i === this.config.sprite_x / 2 ? Editor.GRID_COLOR_DARK : Editor.GRID_COLOR_LIGHT;
      this.canvas.beginPath();
      this.canvas.moveTo((x_offset + i) * this.zoom, y_offset * this.zoom);
      this.canvas.lineTo((x_offset + i) * this.zoom, (y_offset + this.config.sprite_y) * this.zoom);
      this.canvas.stroke();
    }

    // Horizontal lines within sprite
    for (let j = 0; j <= this.config.sprite_y; j++) {
      this.canvas.strokeStyle = j % (this.config.sprite_y / 3) === 0 ? Editor.GRID_COLOR_DARK : Editor.GRID_COLOR_LIGHT;
      this.canvas.beginPath();
      this.canvas.moveTo(x_offset * this.zoom, (y_offset + j) * this.zoom);
      this.canvas.lineTo((x_offset + this.config.sprite_x) * this.zoom, (y_offset + j) * this.zoom);
      this.canvas.stroke();
    }
  }

  /**
   * Draw bold separator lines between sprites
   */
  drawSpriteSeparatorLines(): void {
    this.canvas.strokeStyle = Editor.SEPARATOR_COLOR;
    this.canvas.lineWidth = Editor.SEPARATOR_LINE_WIDTH;

    // Vertical separator lines
    for (let grid_x = 0; grid_x <= this.grid_width; grid_x++) {
      const x = grid_x * this.config.sprite_x * this.zoom;
      this.canvas.beginPath();
      this.canvas.moveTo(x, 0);
      this.canvas.lineTo(x, this.height);
      this.canvas.stroke();
    }

    // Horizontal separator lines
    for (let grid_y = 0; grid_y <= this.grid_height; grid_y++) {
      const y = grid_y * this.config.sprite_y * this.zoom;
      this.canvas.beginPath();
      this.canvas.moveTo(0, y);
      this.canvas.lineTo(this.width, y);
      this.canvas.stroke();
    }
  }

  /**
   * Draw blue dotted border around the active sprite in grid mode
   */
  drawActiveSpriteIndicator(): void {
    this.canvas.strokeStyle = Editor.ACTIVE_BORDER_COLOR;
    this.canvas.lineWidth = Editor.SEPARATOR_LINE_WIDTH;
    this.canvas.setLineDash(Editor.ACTIVE_BORDER_DASH);

    const active_x = this.active_grid_x * this.config.sprite_x * this.zoom;
    const active_y = this.active_grid_y * this.config.sprite_y * this.zoom;
    const active_width = this.config.sprite_x * this.zoom;
    const active_height = this.config.sprite_y * this.zoom;

    this.canvas.strokeRect(active_x, active_y, active_width, active_height);

    // Reset line style and width
    this.canvas.setLineDash([1, 1]);
    this.canvas.lineWidth = 1;
  }

  /**
   * Draw grid lines for single sprite mode
   */
  drawSingleSpriteGrid(sprite_data): void {
    const x_grid_step = sprite_data.multicolor ? 2 : 1;

    // Vertical lines
    for (let i = 0; i <= this.pixels_x; i += x_grid_step) {
      this.canvas.strokeStyle = i === this.pixels_x / 2 ? Editor.GRID_COLOR_DARK : Editor.GRID_COLOR_LIGHT;
      this.canvas.beginPath();
      this.canvas.moveTo(i * this.zoom, 0);
      this.canvas.lineTo(i * this.zoom, this.height);
      this.canvas.stroke();
    }

    // Horizontal lines
    for (let i = 0; i <= this.pixels_y; i++) {
      this.canvas.strokeStyle = i % (this.pixels_y / 3) === 0 ? Editor.GRID_COLOR_DARK : Editor.GRID_COLOR_LIGHT;
      this.canvas.beginPath();
      this.canvas.moveTo(0, i * this.zoom);
      this.canvas.lineTo(this.width, i * this.zoom);
      this.canvas.stroke();
    }
  }

  /**
   * Extract client coordinates from mouse or touch event
   */
  private getClientCoordinates(e): { clientX: number; clientY: number } {
    if (e.touches && e.touches.length > 0) {
      // Touch event
      return { clientX: e.touches[0].clientX, clientY: e.touches[0].clientY };
    } else if (e.changedTouches && e.changedTouches.length > 0) {
      // Touch end event
      return { clientX: e.changedTouches[0].clientX, clientY: e.changedTouches[0].clientY };
    } else {
      // Mouse event
      return { clientX: e.clientX, clientY: e.clientY };
    }
  }

  // input: x,y position of the mouse/touch inside the editor window in pixels // output: x,y position in the sprite grid
  get_pixel(e) {
    const obj = this.canvas_element.getBoundingClientRect();
    const { clientX, clientY } = this.getClientCoordinates(e);

    const x = clientX - obj.left;
    const y = clientY - obj.top;

    if (this.isGridMode()) {
      return this.getPixelInGridMode(x, y, obj);
    } else {
      return this.getPixelInSingleSpriteMode(x, y, obj);
    }
  }

  /**
   * Calculate pixel position in grid mode
   */
  getPixelInGridMode(x: number, y: number, obj: DOMRect) {
    // Use actual rendered size from getBoundingClientRect, not logical canvas size
    const x_in_canvas = Math.floor((x / obj.width) * this.pixels_x);
    const y_in_canvas = Math.floor((y / obj.height) * this.pixels_y);

    // Calculate which grid cell was clicked
    const grid_x = Math.floor(x_in_canvas / this.config.sprite_x);
    const grid_y = Math.floor(y_in_canvas / this.config.sprite_y);

    // Calculate pixel within the sprite
    const x_grid = x_in_canvas % this.config.sprite_x;
    const y_grid = y_in_canvas % this.config.sprite_y;

    // Calculate the sprite offset
    const sprite_offset = (grid_y * this.grid_width) + grid_x;

    return { x: x_grid, y: y_grid, sprite_offset };
  }

  /**
   * Calculate pixel position in single sprite mode
   */
  getPixelInSingleSpriteMode(x: number, y: number, obj: DOMRect) {
    // Use actual rendered size from getBoundingClientRect, not logical canvas size
    const x_grid = Math.floor((x / obj.width) * this.config.sprite_x);
    const y_grid = Math.floor((y / obj.height) * this.config.sprite_y);
    return { x: x_grid, y: y_grid, sprite_offset: 0 };
  }

  toggle_grid() {
    this.grid = !this.grid;
  }

  get_grid() {
    return this.grid;
  }

  syncOverlayCanvas(): void {
    // Both canvases are in the same parent (#editor-canvas)
    // The overlay should have the same CSS size as the main canvas
    const mainStyle = window.getComputedStyle(this.canvas_element);
    this.overlay_canvas_element.style.width = mainStyle.width;
    this.overlay_canvas_element.style.height = mainStyle.height;

    // Position at 0,0 within parent (same as main canvas)
    this.overlay_canvas_element.style.left = '0';
    this.overlay_canvas_element.style.top = '0';
  }

  startAnimationLoop(): void {
    const animate = () => {
      this.animation_offset = (this.animation_offset + 0.5) % 8;
      this.drawSelectionOverlay();
      this.animation_frame_id = requestAnimationFrame(animate);
    };
    animate();
  }

  stopAnimationLoop(): void {
    if (this.animation_frame_id !== null) {
      cancelAnimationFrame(this.animation_frame_id);
      this.animation_frame_id = null;
    }
  }

  drawSelectionOverlay(): void {
    // Clear overlay using logical canvas dimensions
    this.overlay_canvas.clearRect(0, 0, this.width, this.height);

    // Get app instance and check for active selection
    const app = (window as any).app;
    if (!app || !app.selection?.active || !app.selection.bounds) return;

    const { x1, y1, x2, y2 } = app.selection.bounds;
    const step = app.sprite.is_multicolor() ? 2 : 1;

    // If we're dragging a selection, draw the preview of the content
    if (app.move_start && app.move_selection_backup) {
      const currentSprite = app.sprite.get_current_sprite();
      const all_data = app.sprite.get_all();

      // Draw the selected content at the new position (only visible parts)
      let backupY = 0;
      for (let y = y1; y <= y2; y++) {
        let backupX = 0;
        for (let x = x1; x <= x2; x += step) {
          // Only draw if within canvas bounds
          if (y >= 0 && y < this.config.sprite_y && x >= 0 && x < this.config.sprite_x) {
            if (backupY < app.move_selection_backup.length && backupX < app.move_selection_backup[backupY].length) {
              const pixel = app.move_selection_backup[backupY][backupX];

              if (pixel === 0) {
                // Transparent pixel - draw background color to hide what's underneath
                this.overlay_canvas.fillStyle = this.config.colors[all_data.colors[0]];
                this.overlay_canvas.fillRect(
                  x * this.zoom,
                  y * this.zoom,
                  step * this.zoom,
                  this.zoom
                );
              } else {
                // Non-transparent pixel - get color for this pixel
                let color = currentSprite.color;
                if (pixel !== 1 && currentSprite.multicolor) {
                  color = all_data.colors[pixel];
                }

                this.overlay_canvas.fillStyle = this.config.colors[color];
                this.overlay_canvas.fillRect(
                  x * this.zoom,
                  y * this.zoom,
                  step * this.zoom,
                  this.zoom
                );
              }
            }
          }
          backupX++; // Increment by 1, not by step
        }
        backupY++;
      }
    }

    // Use the same coordinate calculation as display_grid()
    // Grid lines are drawn at: i * this.zoom
    // We want to draw the selection box ON the grid lines, not between them
    // strokeRect draws centered on the path, so offset by 0.5 to snap to pixel grid
    const rectX = x1 * this.zoom + 0.5;
    const rectY = y1 * this.zoom + 0.5;
    // Width/height should span from x1 to x2+step (inclusive of end pixel)
    // Subtract 1 because stroke is centered (0.5 on each side = 1 total)
    const rectWidth = (x2 - x1 + step) * this.zoom - 1;
    const rectHeight = (y2 - y1 + 1) * this.zoom - 1;

    // Draw marching ants border
    this.overlay_canvas.save();

    // Black dashes
    this.overlay_canvas.strokeStyle = "#000000";
    this.overlay_canvas.lineWidth = 1;
    this.overlay_canvas.setLineDash([4, 4]);
    this.overlay_canvas.lineDashOffset = -this.animation_offset;
    this.overlay_canvas.strokeRect(rectX, rectY, rectWidth, rectHeight);

    // White dashes (offset by 4 to create alternating pattern)
    this.overlay_canvas.strokeStyle = "#FFFFFF";
    this.overlay_canvas.lineDashOffset = -this.animation_offset - 4;
    this.overlay_canvas.strokeRect(rectX, rectY, rectWidth, rectHeight);
    this.overlay_canvas.restore();
  }

  // Update overlay canvas size when zoom changes
  /**
   * Update canvas sizes after zoom change
   */
  private updateCanvasSizes(): void {
    // Update main canvas logical size
    this.canvas_element.width = this.width;
    this.canvas_element.height = this.height;
    // Update overlay canvas logical size
    this.overlay_canvas_element.width = this.width;
    this.overlay_canvas_element.height = this.height;
    // Sync overlay CSS size to match main canvas rendered size
    this.syncOverlayCanvas();
  }

  zoom_in(): void {
    super.zoom_in();
    this.updateCanvasSizes();
  }

  zoom_out(): void {
    super.zoom_out();
    this.updateCanvasSizes();
  }
}
