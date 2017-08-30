"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var List = function () {
  function List(window, config) {
    _classCallCheck(this, List);

    this.config = config;
    this.window = window;
    this.canvas_element = document.createElement('canvas');
    this.zoom = 5; // this.config.zoom;
    this.pixels_x = this.config.sprite_x;
    this.pixels_y = this.config.sprite_y;
    this.width = this.pixels_x * 2;
    this.height = this.pixels_y * 2;

    this.canvas_element.id = "list";
    this.canvas_element.width = this.width;
    this.canvas_element.height = this.height;

    $("#window-" + this.window).append(this.canvas_element);

    this.canvas = this.canvas_element.getContext('2d');
  }

  _createClass(List, [{
    key: "update",
    value: function update(sprite_data) {

      var x_grid_step = 1;
      if (sprite_data.multicolor) x_grid_step = 2;

      for (var i = 0; i < this.pixels_x; i = i + x_grid_step) {
        for (var j = 0; j < this.pixels_y; j++) {
          this.canvas.fillStyle = this.config.colors[sprite_data.pixels[j][i]];
          this.canvas.fillRect(i * this.zoom, j * this.zoom, this.pixels_x * x_grid_step, this.pixels_y);
        }
      }
    }
  }]);

  return List;
}();