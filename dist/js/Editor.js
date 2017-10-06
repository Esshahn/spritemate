"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Editor = function () {
  function Editor(window, config) {
    _classCallCheck(this, Editor);

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

    var template = "\n      <div class=\"window_menu\">\n        <img src=\"img/icon3/icon-multicolor.png\" title=\"toggle single- & multicolor\" id=\"icon-multicolor\">\n        <img src=\"img/icon3/icon-shift-left.png\" title=\"shift left\" id=\"icon-shift-left\">\n        <img src=\"img/icon3/icon-shift-right.png\" title=\"shift right\" id=\"icon-shift-right\">\n        <img src=\"img/icon3/icon-shift-up.png\" title=\"shift up\" id=\"icon-shift-up\">\n        <img src=\"img/icon3/icon-shift-down.png\" title=\"shift down\" id=\"icon-shift-down\">\n        <img src=\"img/icon3/icon-flip-horizontal.png\" title=\"flip horizontal\" id=\"icon-flip-horizontal\">\n        <img src=\"img/icon3/icon-flip-vertical.png\" title=\"flip vertical\" id=\"icon-flip-vertical\">\n        \n        <div class=\"right\">\n          <img src=\"img/icon3/icon-grid.png\" id=\"icon-editor-grid\" title=\"toggle grid borders\">\n          <img src=\"img/icon3/icon-zoom-in.png\" id=\"icon-editor-zoom-in\" title=\"zoom in\">\n          <img src=\"img/icon3/icon-zoom-out.png\" id=\"icon-editor-zoom-out\" title=\"zoom out\">\n        </div>\n      </div>\n      <div id=\"editor-canvas\"></div>\n    ";

    $("#window-" + this.window).append(template);

    $("#editor-canvas").append(this.canvas_element);

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
    key: "toggle_grid",
    value: function toggle_grid() {
      if (this.grid) {
        this.grid = false;
      } else {
        this.grid = true;
      }
    }
  }, {
    key: "update",
    value: function update(all_data) {
      this.canvas_element.width = this.width;
      this.canvas_element.height = this.height;
      var sprite_data = all_data.sprites[all_data.current_sprite];
      var x_grid_step = 1;
      if (sprite_data.multicolor) x_grid_step = 2;
      for (var i = 0; i < this.pixels_x; i = i + x_grid_step) {
        for (var j = 0; j < this.pixels_y; j++) {
          var array_entry = sprite_data.pixels[j][i];
          if (array_entry == "i") {
            var color = sprite_data.color;
          } else {
            var color = all_data.colors[array_entry];

            // if singlecolor only, replace the multicolor pixels with the individual color
            if (!sprite_data.multicolor && (array_entry == "m1" || array_entry == "m2")) color = sprite_data.color;
          }
          this.canvas.fillStyle = this.config.colors[color];
          this.canvas.fillRect(i * this.zoom, j * this.zoom, this.pixels_x * x_grid_step * this.zoom, this.pixels_y * this.zoom);
        }
      }

      if (this.grid) this.display_grid(sprite_data);
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

      for (var _i = 0; _i <= this.pixels_y; _i++) {
        this.canvas.beginPath();
        this.canvas.moveTo(0, _i * this.zoom);
        this.canvas.lineTo(this.width, _i * this.zoom);
        this.canvas.stroke();
      }
    }
  }, {
    key: "get_pixel",
    value: function get_pixel(e)
    // input: x,y position of the mouse inside the editor window in pixels
    // output: x,y position in the sprite grid
    {
      var obj = this.canvas_element.getBoundingClientRect();
      var x = e.clientX - obj.left;
      var y = e.clientY - obj.top;
      var x_grid = Math.floor(x / (this.width / this.config.sprite_x));
      var y_grid = Math.floor(y / (this.height / this.config.sprite_y));
      return { x: x_grid, y: y_grid };
    }
  }, {
    key: "zoom_in",
    value: function zoom_in() {
      if (this.zoom <= 22) {
        this.zoom += 2;
        this.update_zoom();
      }
    }
  }, {
    key: "zoom_out",
    value: function zoom_out() {
      if (this.zoom >= 10) {
        this.zoom -= 2;
        this.update_zoom();
      }
    }
  }, {
    key: "update_zoom",
    value: function update_zoom() {
      this.width = this.pixels_x * this.zoom;
      this.height = this.pixels_y * this.zoom;
    }
  }]);

  return Editor;
}();