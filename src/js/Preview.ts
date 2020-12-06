import $ from "jquery";
import Window_Controls from "./Window_Controls";

export default class Preview extends Window_Controls {
  canvas_element: any = {};
  canvas: any = {};

  constructor(public window, public config) {
    super();
    this.config = config;
    this.window = window;
    this.canvas_element = document.createElement("canvas");
    this.zoom = this.config.window_preview.zoom; // this.config.zoom;
    this.zoom_min = 4;
    this.zoom_max = 16;
    this.pixels_x = this.config.sprite_x;
    this.pixels_y = this.config.sprite_y;
    this.width = this.pixels_x * this.zoom;
    this.height = this.pixels_y * this.zoom;

    this.canvas_element.id = "preview";
    this.canvas_element.width = this.width;
    this.canvas_element.height = this.height;
    this.canvas = this.canvas_element.getContext("2d");

    let template = `
      <div class="window_menu">
        <div class="icons-zoom-area">
          <img src="img/ui/icon-zoom-plus.png" id="icon-preview-zoom-in" title="zoom in"><img src="img/ui/icon-zoom-minus.png" id="icon-preview-zoom-out" title="zoom out">
        </div>
        <div class="icon-preview-x2" id="icon-preview-x" title="double width"></div>
        <div class="icon-preview-y2" id="icon-preview-y" title="double height"></div>
        <img src="img/ui/icon-preview-overlay.png" id="icon-preview-overlay" title="overlay next sprite">
      </div>
      <div id="preview-canvas"></div>
    `;

    $("#window-" + this.window).append(template);
    $("#preview-canvas").append(this.canvas_element);
  }

  update(all_data) {
    this.canvas_element.width = this.width;
    this.canvas_element.height = this.height;
    let sprite_data = all_data.sprites[all_data.current_sprite];
    let x_grid_step = 1;
    if (sprite_data.multicolor) x_grid_step = 2;

    // first fill the whole sprite with the background color
    this.canvas.fillStyle = this.config.colors[all_data.colors[0]];
    this.canvas.fillRect(0, 0, this.width, this.height);

    for (let i = 0; i < this.pixels_x; i = i + x_grid_step) {
      for (let j = 0; j < this.pixels_y; j++) {
        let array_entry = sprite_data.pixels[j][i];

        if (array_entry != 0) {
          // transparent
          let color = sprite_data.color;
          if (array_entry != 1 && sprite_data.multicolor)
            color = all_data.colors[array_entry];
          this.canvas.fillStyle = this.config.colors[color];
          this.canvas.fillRect(
            i * this.zoom,
            j * this.zoom,
            x_grid_step * this.zoom,
            this.zoom
          );
        }
      }
    }

    if (
      sprite_data.overlay &&
      all_data.current_sprite < all_data.sprites.length - 1
    )
      this.display_overlay(all_data);

    // set the preview window x and y stretch
    if (sprite_data.double_x) {
      var double_x = 2;
      $("#icon-preview-x").addClass("icon-preview-x2-hi");
    } else {
      var double_x = 1;
      $("#icon-preview-x").removeClass("icon-preview-x2-hi");
    }

    if (sprite_data.double_y) {
      var double_y = 2;
      $("#icon-preview-y").addClass("icon-preview-y2-hi");
    } else {
      var double_y = 1;
      $("#icon-preview-y").removeClass("icon-preview-y2-hi");
    }

    $("#preview").css("width", this.width * double_x);
    $("#preview").css("height", this.height * double_y);
  }

  display_overlay(all_data) {
    let sprite_data = all_data.sprites[all_data.current_sprite + 1];
    let x_grid_step = 1;
    if (sprite_data.multicolor) x_grid_step = 2;

    for (let i = 0; i < this.pixels_x; i = i + x_grid_step) {
      for (let j = 0; j < this.pixels_y; j++) {
        let array_entry = sprite_data.pixels[j][i];

        // if singlecolor only, replace the multicolor pixels with the individual color
        if (!sprite_data.multicolor && (array_entry == 2 || array_entry == 3))
          array_entry = 1;

        let color = sprite_data.color;
        if (array_entry != 1) color = all_data.colors[array_entry];

        if (array_entry != 0) {
          this.canvas.fillStyle = this.config.colors[color];
          this.canvas.fillRect(
            i * this.zoom,
            j * this.zoom,
            this.zoom * x_grid_step,
            this.zoom
          );
        }
      }
    }
  }
}
