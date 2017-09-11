

class Editor {

  constructor(window, config) {
    this.config = config;
    this.grid = this.config.display_grid;
    this.window = window;
    this.canvas_element = document.createElement('canvas');
    this.zoom = this.config.zoom_editor;
    this.pixels_x = this.config.sprite_x;
    this.pixels_y = this.config.sprite_y;
    this.width = this.pixels_x * this.zoom;
    this.height = this.pixels_y * this.zoom;

    this.canvas_element.id = "editor";
    this.canvas_element.width = this.width;
    this.canvas_element.height = this.height;

    $("#window-" + this.window).append(this.canvas_element);

    this.canvas = this.canvas_element.getContext('2d');
  }

  get_width() {
    return this.width;
  }

  get_height() {
    return this.height;
  }

  toggle_grid() {
    if (this.grid) {
      this.grid = false;
    } else {
      this.grid = true;
    }
  }

  update(all_data) {
    let s = all_data.sprites[all_data.current_sprite];
    let x_grid_step = 1;
    if (s.multicolor) x_grid_step = 2;
    for (let i = 0; i < this.pixels_x; i = i + x_grid_step) {
      for (let j = 0; j < this.pixels_y; j++) {
        let pen = s.pixels[j][i];
        if (pen == "individual") {
          var color = s.color;
        } else {
          var color = all_data.colors[pen];
        }
        this.canvas.fillStyle = this.config.colors[color];
        this.canvas.fillRect(i * this.zoom, j * this.zoom, this.pixels_x * x_grid_step, this.pixels_y);
      }
    }

    if (this.grid) this.display_grid(s);
  }

  display_grid(sprite_data) {
    // show a grid
    this.canvas.strokeStyle = "#666666";
    this.canvas.setLineDash([1, 1]);
    let x_grid_step = 1;

    if (sprite_data.multicolor) x_grid_step = 2;

    for (let i = 0; i <= this.pixels_x; i = i + x_grid_step) {
      this.canvas.beginPath();
      this.canvas.moveTo(i * this.zoom, 0);
      this.canvas.lineTo(i * this.zoom, this.height);
      this.canvas.stroke();
    }

    for (let i = 0; i <= this.pixels_y; i++) {
      this.canvas.beginPath();
      this.canvas.moveTo(0, i * this.zoom);
      this.canvas.lineTo(this.width, i * this.zoom);
      this.canvas.stroke();
    }
  }

  get_pixel(e)
  // input: x,y position of the mouse inside the editor window in pixels
  // output: x,y position in the sprite grid
  {
    let obj = this.canvas_element.getBoundingClientRect();
    let x = e.clientX - obj.left;
    let y = e.clientY - obj.top;
    let x_grid = Math.floor(x / (this.width / this.config.sprite_x));
    let y_grid = Math.floor(y / (this.height / this.config.sprite_y));
    return { x: x_grid, y: y_grid };
  }

}