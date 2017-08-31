"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var List = function () {
  function List(window, config) {
    _classCallCheck(this, List);

    this.config = config;
    this.window = window;
    this.zoom = 2; // this.config.zoom;
    this.pixels_x = this.config.sprite_x;
    this.pixels_y = this.config.sprite_y;
    this.width = this.pixels_x * this.zoom;
    this.height = this.pixels_y * this.zoom;
  }

  _createClass(List, [{
    key: "create_canvas",
    value: function create_canvas(id) {
      var canvas_element = document.createElement('canvas');
      canvas_element.id = "#list-" + id;
      canvas_element.width = this.pixels_x * this.zoom;
      canvas_element.height = this.pixels_y * this.zoom;

      $("#window-" + this.window).append(canvas_element);
    }
  }, {
    key: "update",
    value: function update(spritelist) {
      $("#window-" + this.window).empty();

      for (var i = 0; i < spritelist.length; i++) {
        this.create_canvas(i);

        var canvas = document.getElementById("#list-" + i).getContext('2d');
        var sprite_data = spritelist[i];
        var x_grid_step = 1;
        if (sprite_data.multicolor) x_grid_step = 2;

        for (var _i = 0; _i < this.pixels_x; _i = _i + x_grid_step) {
          for (var j = 0; j < this.pixels_y; j++) {
            canvas.fillStyle = this.config.colors[sprite_data.pixels[j][_i]];
            canvas.fillRect(_i * this.zoom, j * this.zoom, this.pixels_x * x_grid_step, this.pixels_y);
          }
        }
      }

      $("#window-" + this.window).append('<img src="img/icon3/icon-list-new.png">');
    }
  }]);

  return List;
}();