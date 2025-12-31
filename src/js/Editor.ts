import { dom } from "./helper";
import Window_Controls from "./Window_Controls";

export default class Editor extends Window_Controls {
  grid: boolean;
  canvas_element: HTMLCanvasElement;
  canvas: any;
  overlay_canvas_element: HTMLCanvasElement;
  overlay_canvas: CanvasRenderingContext2D;
  animation_frame_id: number | null;
  animation_offset: number;

  constructor(public window: number, public config) {
    super();
    this.config = config;
    this.grid = this.config.window_editor.grid;
    this.window = window;
    this.canvas_element = document.createElement("canvas");
    this.zoom = this.config.window_editor.zoom;
    this.zoom_min = this.config.zoom_limits.editor.min;
    this.zoom_max = this.config.zoom_limits.editor.max;
    this.pixels_x = this.config.sprite_x;
    this.pixels_y = this.config.sprite_y;
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
        <div class="icons-zoom-area">
          <img src="ui/icon-zoom-in.png" class="icon-hover" id="icon-editor-zoom-in" title="zoom in">
          <img src="ui/icon-zoom-out.png" class="icon-hover" id="icon-editor-zoom-out" title="zoom out">
          <img src="ui/icon-grid.png" class="icon-hover" id="icon-editor-grid" title="toggle grid">
        </div>

        <img src="ui/icon-multicolor.png" title="toggle single- & multicolor (c)" class=" icon-hover" id="icon-multicolor">
        <img src="ui/icon-flip-horizontal.png" title="flip horizontal" class="icon-hover" id="icon-flip-horizontal">
        <img src="ui/icon-flip-vertical.png" title="flip vertical" class="icon-hover" id="icon-flip-vertical">
        <input type="text" class="editor_sprite_name" class="icon-hover" id="input-sprite-name" name="" value="" title="rename sprite">
      </div>
      <div id="editor-canvas" style="position: relative; display: inline-block;"></div>

    `;

    dom.append("#window-" + this.window, template);
    dom.append_element("#editor-canvas", this.canvas_element);
    dom.append_element("#editor-canvas", this.overlay_canvas_element);

    this.canvas = this.canvas_element.getContext("2d", { alpha: false });

    // Sync overlay canvas position and size with main canvas
    this.syncOverlayCanvas();

    // Start animation loop for marching ants
    this.startAnimationLoop();
  }

  update(all_data) {
    this.canvas_element.width = this.width;
    this.canvas_element.height = this.height;

    const sprite_data = all_data.sprites[all_data.current_sprite];
    let x_grid_step = 1;
    if (sprite_data.multicolor) x_grid_step = 2;

    // set the name of the sprite as the title
    dom.val("#input-sprite-name", sprite_data.name);

    // first fill the whole sprite with the background color
    this.canvas.fillStyle = this.config.colors[all_data.colors[0]];
    this.canvas.fillRect(0, 0, this.width, this.height);

    // overlay from previous sprite
    if (all_data.current_sprite > 0) {
      const previous_sprite = all_data.sprites[all_data.current_sprite - 1];
      if (previous_sprite.overlay) this.display_overlay(all_data, "previous");
    }

    // current sprite
    this.fill_canvas(all_data, sprite_data, x_grid_step, 1);

    // overlay from next sprite
    if (
      sprite_data.overlay &&
      all_data.current_sprite < all_data.sprites.length - 1
    )
      this.display_overlay(all_data);

    // grid
    if (this.grid) this.display_grid(sprite_data);
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

  display_grid(sprite_data) {
    // show a grid

    this.canvas.setLineDash([1, 1]);
    let x_grid_step = 1;

    if (sprite_data.multicolor) x_grid_step = 2;

    for (let i = 0; i <= this.pixels_x; i = i + x_grid_step) {
      // adds a vertical line in the middle
      this.canvas.strokeStyle = "#666666";
      if (i === this.pixels_x / 2) this.canvas.strokeStyle = "#888888";

      this.canvas.beginPath();
      this.canvas.moveTo(i * this.zoom, 0);
      this.canvas.lineTo(i * this.zoom, this.height);
      this.canvas.stroke();
    }

    for (let i = 0; i <= this.pixels_y; i++) {
      // adds 3 horizontal lines
      this.canvas.strokeStyle = "#666666";
      if (i % (this.pixels_y / 3) === 0) this.canvas.strokeStyle = "#888888";

      this.canvas.beginPath();
      this.canvas.moveTo(0, i * this.zoom);
      this.canvas.lineTo(this.width, i * this.zoom);
      this.canvas.stroke();
    }
  }

  // input: x,y position of the mouse/touch inside the editor window in pixels // output: x,y position in the sprite grid
  get_pixel(e) {
    const obj = this.canvas_element.getBoundingClientRect();

    // Handle both mouse and touch events
    let clientX: number, clientY: number;
    if (e.touches && e.touches.length > 0) {
      // Touch event
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if (e.changedTouches && e.changedTouches.length > 0) {
      // Touch end event
      clientX = e.changedTouches[0].clientX;
      clientY = e.changedTouches[0].clientY;
    } else {
      // Mouse event
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = clientX - obj.left;
    const y = clientY - obj.top;
    // Use actual rendered size from getBoundingClientRect, not logical canvas size
    const x_grid = Math.floor((x / obj.width) * this.config.sprite_x);
    const y_grid = Math.floor((y / obj.height) * this.config.sprite_y);
    return { x: x_grid, y: y_grid };
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
  zoom_in(): void {
    super.zoom_in();
    // Update main canvas logical size
    this.canvas_element.width = this.width;
    this.canvas_element.height = this.height;
    // Update overlay canvas logical size
    this.overlay_canvas_element.width = this.width;
    this.overlay_canvas_element.height = this.height;
    // Sync overlay CSS size to match main canvas rendered size
    this.syncOverlayCanvas();
  }

  zoom_out(): void {
    super.zoom_out();
    // Update main canvas logical size
    this.canvas_element.width = this.width;
    this.canvas_element.height = this.height;
    // Update overlay canvas logical size
    this.overlay_canvas_element.width = this.width;
    this.overlay_canvas_element.height = this.height;
    // Sync overlay CSS size to match main canvas rendered size
    this.syncOverlayCanvas();
  }
}
