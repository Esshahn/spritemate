/*

  WINDOW CONTROLS
  Provides basic functionality for windows, mostly canvas & zoom related
  Inherited e.g. from Editor, List, Preview

 */

export default class Window_Controls {
  width: any;
  height: any;
  zoom: any;
  zoom_min: any;
  zoom_max: any;
  pixels_x: any;
  pixels_y: any;
  config: any;
  canvas: any;

  get_width(): number {
    return this.width;
  }

  get_height(): number {
    return this.height;
  }

  is_min_zoom(): boolean {
    return this.zoom < this.zoom_min;
  }

  is_max_zoom(): boolean {
    return this.zoom > this.zoom_max;
  }

  get_zoom(): number {
    return this.zoom;
  }

  zoom_in(): void {
    if (this.zoom <= this.zoom_max) {
      this.zoom += 2;
      this.update_zoom();
    }
  }

  zoom_out(): void {
    if (this.zoom >= this.zoom_min) {
      this.zoom -= 2;
      this.update_zoom();
    }
  }

  update_zoom(): void {
    this.width = this.pixels_x * this.zoom;
    this.height = this.pixels_y * this.zoom;
  }

  /**
   * Shared method for rendering sprite pixels to canvas
   * Used by Editor, Preview, and List
   */
  render_pixels(
    sprite_data: any,
    all_data: any,
    fillStyleTransform?: (color: string) => string
  ): void {
    const x_grid_step = sprite_data.multicolor ? 2 : 1;

    for (let i = 0; i < this.pixels_x; i += x_grid_step) {
      for (let j = 0; j < this.pixels_y; j++) {
        let array_entry = sprite_data.pixels[j][i];

        // Skip transparent pixels
        if (array_entry === 0) continue;

        // Determine color based on pixel value
        let color: number;
        if (array_entry === 1 || !sprite_data.multicolor) {
          color = sprite_data.color;
        } else {
          color = all_data.colors[array_entry];
        }

        // Apply color transformation if provided (e.g., for alpha/overlay)
        const colorString = this.config.colors[color];
        this.canvas.fillStyle = fillStyleTransform
          ? fillStyleTransform(colorString)
          : colorString;

        // Draw pixel rectangle
        this.canvas.fillRect(
          i * this.zoom,
          j * this.zoom,
          x_grid_step * this.zoom,
          this.zoom
        );
      }
    }
  }
}
