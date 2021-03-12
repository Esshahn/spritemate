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
}
