"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Editor = function () {
  function Editor(window, config) {
    _classCallCheck(this, Editor);

    this.config = config;
    this.window = window;
    this.canvas_element = document.createElement('canvas');
    this.zoom = this.config.zoom;
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

  _createClass(Editor, [{
    key: "get_width",
    value: function get_width() {
      return this.width;
    }
  }, {
    key: "get_height",
    value: function get_height() {
      return this.height;
    }
  }, {
    key: "draw_sprite",
    value: function draw_sprite(sprite_data) {

      var x_grid_step = 1;
      if (sprite_data.multicolor) x_grid_step = 2;

      for (var i = 0; i < this.pixels_x; i = i + x_grid_step) {
        for (var j = 0; j < this.pixels_y; j++) {
          this.canvas.fillStyle = sprite_data.pixels[j][i];
          this.canvas.fillRect(i * this.zoom, j * this.zoom, this.pixels_x * x_grid_step, this.pixels_y);
        }
      }

      if (this.config.display_grid) this.display_grid(sprite_data);
    }
  }, {
    key: "display_grid",
    value: function display_grid(sprite_data) {
      // show a grid
      this.canvas.strokeStyle = "#666666";
      this.canvas.setLineDash([1, 1]);
      var x_grid_step = 1;

      if (sprite_data.multicolor) x_grid_step = 2;

      for (var i = 0; i <= this.pixels_x; i = i + x_grid_step) {
        this.canvas.beginPath();
        this.canvas.moveTo(i * this.zoom, 0);
        this.canvas.lineTo(i * this.zoom, this.height);
        this.canvas.stroke();
      }

      for (var i = 0; i <= this.pixels_y; i++) {
        this.canvas.beginPath();
        this.canvas.moveTo(0, i * this.zoom);
        this.canvas.lineTo(this.width, i * this.zoom);
        this.canvas.stroke();
      }
    }
  }, {
    key: "get_pixel",
    value: function get_pixel(x, y)
    // input: x,y position of the mouse inside the editor window in pixels
    // output: x,y position in the sprite grid
    {
      var x_grid = Math.floor(x / (this.width / this.config.sprite_x));
      var y_grid = Math.floor(y / (this.height / this.config.sprite_y));
      return { x: x_grid, y: y_grid };
    }
  }]);

  return Editor;
}();