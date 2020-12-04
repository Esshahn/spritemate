/*

  WINDOW CONTROLS
  Provides basic functionality for windows, mostly canvas & zoom related

  Inherited e.g. from Editor, List, Preview


 */

export default class Window_Controls {
  get_width() {
    return this.width;
  }

  get_height() {
    return this.height;
  }

  is_min_zoom() {
    if (this.zoom < this.zoom_min) return true;
  }

  is_max_zoom() {
    if (this.zoom > this.zoom_max) return true;
  }

  get_zoom() {
    return this.zoom;
  }

  zoom_in() {
    if (this.zoom <= this.zoom_max) {
      this.zoom += 2;
      this.update_zoom();
    }
  }

  zoom_out() {
    if (this.zoom >= this.zoom_min) {
      this.zoom -= 2;
      this.update_zoom();
    }
  }

  update_zoom() {
    this.width = this.pixels_x * this.zoom;
    this.height = this.pixels_y * this.zoom;
  }
}
