

class List {

  constructor(window, config) {
    this.config = config;
    this.window = window;
    this.zoom = this.config.zoom_list; // this.config.zoom;
    this.pixels_x = this.config.sprite_x;
    this.pixels_y = this.config.sprite_y;
    this.width = this.pixels_x * this.zoom;
    this.height = this.pixels_y * this.zoom;
    this.clicked_sprite = 0;
    this.sorted_array = [];

    let template = `
      <div id="list_menu">
      <img src="img/icon3/icon-list-new.png" id="icon-list-new">
      <img src="img/icon3/icon-list-delete.png" id="icon-list-delete">
      <div id="spritelist"></div>
      </div>
    `;

    $("#window-" + this.window).append(template);

    $("#spritelist").sortable({
      cursor: "move",
      tolerance: "pointer",
      revert: 'invalid'
    });

    // this line is ridiculous, but apparently it is needed for the sprite sorting to not screw up
    $("<style type='text/css'> .list-sprite-size{ width:" + this.width + "px; height:" + this.height + "px;} </style>").appendTo("head");

    $("#spritelist").disableSelection();
  }

  create_canvas(id, current_sprite) {
    let canvas_element = document.createElement('canvas');
    canvas_element.id = id;
    canvas_element.width = this.width;
    canvas_element.height = this.height;

    $("#spritelist").append(canvas_element);
    $(canvas_element).addClass("sprite_in_list");
    $(canvas_element).addClass("list-sprite-size"); // see comment in constructor

    if (current_sprite == id) $(canvas_element).addClass("sprite_in_list_selected");

    $(canvas_element).mouseup(e => {
      this.clicked_sprite = id;
    });

    $(canvas_element).mouseenter(e => $(canvas_element).addClass("sprite_in_list_hover"));
    $(canvas_element).mouseleave(e => $(canvas_element).removeClass("sprite_in_list_hover"));
  }

  get_clicked_sprite() {
    return this.clicked_sprite;
  }

  get_sorted_array() {
    return this.sorted_array;
  }

  update(all_data) {

    $(".sprite_in_list").remove();

    for (let i = 0; i < all_data.sprites.length; i++) {
      this.create_canvas(i, all_data.current_sprite);

      let canvas = document.getElementById(i).getContext('2d');
      let sprite_data = all_data.sprites[i];
      let x_grid_step = 1;
      if (sprite_data.multicolor) x_grid_step = 2;

      for (let i = 0; i < this.pixels_x; i = i + x_grid_step) {
        for (let j = 0; j < this.pixels_y; j++) {

          let pen = sprite_data.pixels[j][i];
          if (pen == "individual") {
            var color = sprite_data.color;
          } else {
            var color = all_data.colors[pen];
          }

          canvas.fillStyle = this.config.colors[color];
          canvas.fillRect(i * this.zoom, j * this.zoom, this.pixels_x * x_grid_step, this.pixels_y);
        }
      }
    }
  }

}