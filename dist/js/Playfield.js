"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Playfield = function () {
  function Playfield(window, config) {
    _classCallCheck(this, Playfield);

    this.config = config;
    this.window = window;

    this.zoom = this.config.window_playfield.zoom;
    this.pixels_x = this.config.sprite_x;
    this.pixels_y = this.config.sprite_y;
    this.width = this.pixels_x * this.config.window_playfield.canvas_x;
    this.height = this.pixels_y * this.config.window_playfield.canvas_y;

    var template = "\n      <div class=\"window_menu\">\n        <div class=\"right\">\n          <img src=\"img/icon3/icon-zoom-in.png\" id=\"icon-playfield-zoom-in\" title=\"zoom in\"><img src=\"img/icon3/icon-zoom-out.png\" id=\"icon-playfield-zoom-out\" title=\"zoom out\">\n        </div>\n      </div>\n      <div id=\"playfield-container\">\n        <div id=\"playfield\"></div>\n      </div>\n    ";

    $("#window-" + this.window).append(template);
  }

  _createClass(Playfield, [{
    key: "zoom_in",
    value: function zoom_in() {
      if (this.zoom <= 16) {
        this.zoom++;
      }
    }
  }, {
    key: "zoom_out",
    value: function zoom_out() {
      if (this.zoom >= 2) {
        this.zoom--;
      }
    }
  }, {
    key: "get_zoom",
    value: function get_zoom() {
      return this.zoom;
    }
  }, {
    key: "is_min_zoom",
    value: function is_min_zoom() {
      if (this.zoom < 2) return true;
    }
  }, {
    key: "is_max_zoom",
    value: function is_max_zoom() {
      if (this.zoom > 16) return true;
    }
  }, {
    key: "update",
    value: function update(all_data) {
      $("#playfield").empty();
      $("#playfield").css('background-color', this.config.colors[all_data.colors["t"]]);

      for (var i = 0; i < all_data.sprites.length; i++) {
        this.create_sprite_canvas(all_data.sprites[i], all_data.colors, i);
      }
    }
  }, {
    key: "create_sprite_canvas",
    value: function create_sprite_canvas(sprite_data, colors, id) {

      var sprite_canvas = document.createElement('canvas');
      sprite_canvas.width = this.pixels_x * this.zoom;
      sprite_canvas.height = this.pixels_y * this.zoom;
      sprite_canvas.context = sprite_canvas.getContext('2d');
      sprite_canvas.id = "playfield-sprite-" + id;
      sprite_canvas.context.scale(this.zoom, this.zoom);

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

      $("#playfield").append(sprite_canvas);

      $('#playfield-sprite-' + id).mousedown(function (e) {
        console.log("mousedown on sprite");
      });
      $('#playfield-sprite-' + id).draggable({
        containment: "parent",
        cursor: "crosshair",
        addClasses: false,
        grid: [this.pixels_x * this.zoom, this.pixels_y * this.zoom]
      });
    }
  }]);

  return Playfield;
}();