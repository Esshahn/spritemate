import { dom } from "./helper";
import Window_Controls from "./Window_Controls";

export default class Preview extends Window_Controls {
  canvas_element: any = {};
  canvas: any = {};

  constructor(public window: number, public config) {
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

    const template = `
      <div class="window_menu">
        <div class="icons-zoom-area">
          <img src="ui/icon-zoom-plus.png" class="icon-hover" id="icon-preview-zoom-in" title="zoom in">
          <img src="ui/icon-zoom-minus.png" class="icon-hover" id="icon-preview-zoom-out" title="zoom out">
        </div>
        <img src="ui/icon-preview-x2.png" class="icon-hover" id="icon-preview-x" title="double width">
        <img src="ui/icon-preview-y2.png" class="icon-hover" id="icon-preview-y" title="double height">
        <img src="ui/icon-preview-overlay.png" class="icon-hover" id="icon-preview-overlay" title="overlay next sprite">
      </div>
      <div id="preview-canvas"></div>
    `;

    dom.append("#window-" + this.window, template);
    dom.append_element("#preview-canvas", this.canvas_element);
  }

  update(all_data) {
    this.canvas_element.width = this.width;
    this.canvas_element.height = this.height;
    const sprite_data = all_data.sprites[all_data.current_sprite];
    let x_grid_step = 1;
    if (sprite_data.multicolor) x_grid_step = 2;

    // first fill the whole sprite with the background color
    this.canvas.fillStyle = this.config.colors[all_data.colors[0]];
    this.canvas.fillRect(0, 0, this.width, this.height);

    for (let i = 0; i < this.pixels_x; i = i + x_grid_step) {
      for (let j = 0; j < this.pixels_y; j++) {
        const array_entry = sprite_data.pixels[j][i];

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
    let double_x: number;
    let double_y: number;
    if (sprite_data.double_x) {
      double_x = 2;
      dom.add_class("#icon-preview-x", "icon-preview-x2-hi");
    } else {
      double_x = 1;
      dom.remove_class("#icon-preview-x", "icon-preview-x2-hi");
    }

    if (sprite_data.double_y) {
      double_y = 2;
      dom.add_class("#icon-preview-y", "icon-preview-y2-hi");
    } else {
      double_y = 1;
      dom.remove_class("#icon-preview-y", "icon-preview-y2-hi");
    }

    dom.css("#preview", "width", this.width * double_x + "px");
    dom.css("#preview", "height", this.height * double_y + "px");
  }

  display_overlay(all_data) {
    const sprite_data = all_data.sprites[all_data.current_sprite + 1];
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
