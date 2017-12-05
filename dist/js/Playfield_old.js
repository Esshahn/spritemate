'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Playfield = function () {
  function Playfield(window, config) {
    _classCallCheck(this, Playfield);

    this.config = config;
    this.window = window;
    this.canvas_element = document.createElement('canvas');
    this.zoom = this.config.window_playfield.zoom;
    this.pixels_x = this.config.sprite_x;
    this.pixels_y = this.config.sprite_y;
    this.width = this.pixels_x * this.config.window_playfield.canvas_x;
    this.height = this.pixels_y * this.config.window_playfield.canvas_y;

    this.canvas_element.id = "playfield";
    this.canvas_element.width = this.width;
    this.canvas_element.height = this.height;
    this.canvas = this.canvas_element.getContext('2d');

    var template = '\n      <div class="window_menu">\n        <div class="right">\n          <img src="img/icon3/icon-zoom-in.png" id="icon-preview-zoom-in" title="zoom in"><img src="img/icon3/icon-zoom-out.png" id="icon-preview-zoom-out" title="zoom out">\n        </div>\n      </div>\n      <div id="playfield-canvas"></div>\n    ';

    $("#window-" + this.window).append(template);
    $("#playfield-canvas").append(this.canvas_element);
  }

  _createClass(Playfield, [{
    key: 'update',
    value: function update(all_data) {

      // first fill the whole sprite with the background color
      this.canvas.fillStyle = this.config.colors[all_data.colors["t"]];
      this.canvas.fillRect(0, 0, this.width, this.height);

      var sprite_data = all_data.sprites[all_data.current_sprite];

      var y = 0;
      var x = 0;

      for (var i = 0; i < all_data.sprites.length; i++) {
        console.log(y);
        this.canvas.drawImage(this.create_sprite_canvas(all_data.sprites[i], all_data.colors), x, y);

        x += this.pixels_x;

        if (x >= this.width) {
          x = 0;
          y += this.pixels_y;
        }
      }

      $('#playfield').css('width', this.width * this.zoom);
      $('#playfield').css('height', this.height * this.zoom);
    }
  }, {
    key: 'create_sprite_canvas',
    value: function create_sprite_canvas(sprite_data, colors) {

      var sprite_canvas = document.createElement('canvas');
      sprite_canvas.width = this.pixels_x;
      sprite_canvas.height = this.pixels_x;
      sprite_canvas.context = sprite_canvas.getContext('2d');
      sprite_canvas.id = "monkey";

      var x_grid_step = 1;
      if (sprite_data.multicolor) x_grid_step = 2;

      for (var i = 0; i < this.pixels_x; i = i + x_grid_step) {
        for (var j = 0; j < this.pixels_y; j++) {
          var array_entry = sprite_data.pixels[j][i];

          if (array_entry != "t") {
            var color = sprite_data.color;
            if (array_entry != "i" && sprite_data.multicolor) color = colors[array_entry];
            sprite_canvas.context.fillStyle = this.config.colors[color];
            sprite_canvas.context.fillRect(i, j, x_grid_step, 1);
          }
        }
      }

      $('#monkey').mousedown(function (e) {
        console.log("hi");
      });

      return sprite_canvas;
    }
  }]);

  return Playfield;
}();