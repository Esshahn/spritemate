
import { dom } from "./helper";
import Window_Controls from "./Window_Controls";

export default class List extends Window_Controls {
  clicked_sprite: number;
  sorted_array: any = [];
  grid: boolean;

  constructor(public window: number, public config) {
    super();
    this.config = config;
    this.window = window;
    this.zoom = this.config.window_list.zoom;
    this.zoom_min = 2;
    this.zoom_max = 16;
    this.pixels_x = this.config.sprite_x;
    this.pixels_y = this.config.sprite_y;
    this.width = this.pixels_x * this.zoom;
    this.height = this.pixels_y * this.zoom;
    this.clicked_sprite = 0;
    this.sorted_array = [];
    this.grid = true;

    const template = `
      <div class="window_menu">
        <div class="icons-zoom-area">
          <img src="ui/icon-zoom-in.png" id="icon-list-zoom-in" title="zoom in">
          <img src="ui/icon-zoom-out.png" id="icon-list-zoom-out" title="zoom out">
          <img src="ui/icon-grid.png" id="icon-editor-grid" title="toggle grid borders">
        </div>
        <img src="ui/icon-list-new.png" id="icon-list-new" title="new sprite">
        <img src="ui/icon-list-delete.png" id="icon-list-delete" title="remove sprite">
        <img src="ui/icon-list-copy.png" id="icon-list-copy" title="copy sprite">
        <img src="ui/icon-list-paste.png" id="icon-list-paste" title="paste sprite">
      </div>
      <div id="spritelist"></div>
    `;

    dom.append("#window-" + this.window, template);

    $("#spritelist").sortable({
      cursor: "move",
      tolerance: "pointer",
      revert: "invalid",
    });
    // TODO:
    //$-old-("#spritelist").disableSelection();
    //dom.disabled("#spritelist", true); // untested! probably not needed anyway
  }

  get_clicked_sprite() {
    return this.clicked_sprite;
  }

  toggle_grid() {
    this.grid = !this.grid;
  }

  update(all_data) {
    // this one gets called during drawing in the editor
    // because the normal update method gets too slow
    // when the sprite list is becoming longer

    $("#window-" + this.window).dialog(
      "option",
      "title",
      "sprite " +
        (all_data.current_sprite + 1) +
        " of " +
        all_data.sprites.length
    );

    const sprite_data = all_data.sprites[all_data.current_sprite];
    const c: any = document.getElementById("canvas-" + all_data.current_sprite);
    const canvas = c.getContext("2d");

    let x_grid_step = 1;
    if (sprite_data.multicolor) x_grid_step = 2;

    // first fill the whole sprite with the background color
    canvas.fillStyle = this.config.colors[all_data.colors[0]];
    canvas.fillRect(0, 0, this.width, this.height);

    for (let i = 0; i < this.pixels_x; i = i + x_grid_step) {
      for (let j = 0; j < this.pixels_y; j++) {
        const array_entry = sprite_data.pixels[j][i];

        if (array_entry != 0) {
          // transparent
          let color = sprite_data.color;
          if (array_entry != 1 && sprite_data.multicolor)
            color = all_data.colors[array_entry];
          canvas.fillStyle = this.config.colors[color];
          canvas.fillRect(
            i * this.zoom,
            j * this.zoom,
            x_grid_step * this.zoom,
            this.zoom
          );
        }
      }
    }
  }

  update_all(all_data) {
    dom.remove_all_elements(".sprite_layer");
    //$-old-(".sprite_layer").remove();

    const length = all_data.sprites.length;
    for (let i = 0; i < length; i++) {
      const canvas_element = document.createElement("canvas");
      canvas_element.id = "canvas-" + i;
      canvas_element.width = this.width;
      canvas_element.height = this.height;

      const template = `
      <div class="sprite_layer" id="${i}">
        <div class="sprite_layer_canvas"></div>
        <div class="sprite_layer_info">
          ID: #${i}<br/>
          NAME: #${i}
        </div>
        <div style="clear:both;"></div>
      </div>`;

      dom.append("#spritelist", template);
      //$-old-("#" + i + " .sprite_layer_canvas").append(canvas_element);
      dom.append_element("#" + i + " .sprite_layer_canvas", canvas_element);
      dom.sel("#" + i).onclick = (e) => (this.clicked_sprite = i);

      const canvas: any = canvas_element.getContext("2d");
      const sprite_data = all_data.sprites[i];
      let x_grid_step = 1;
      if (sprite_data.multicolor) x_grid_step = 2;

      // first fill the whole sprite with the background color
      canvas.fillStyle = this.config.colors[all_data.colors[0]];
      canvas.fillRect(0, 0, this.width, this.height);

      for (let i = 0; i < this.pixels_x; i = i + x_grid_step) {
        for (let j = 0; j < this.pixels_y; j++) {
          const array_entry = sprite_data.pixels[j][i];

          if (array_entry != 0) {
            // transparent
            let color = sprite_data.color;
            if (array_entry != 1 && sprite_data.multicolor)
              color = all_data.colors[array_entry];
            canvas.fillStyle = this.config.colors[color];
            canvas.fillRect(
              i * this.zoom,
              j * this.zoom,
              x_grid_step * this.zoom,
              this.zoom
            );
          }
        }
      }
    }
  }
}
