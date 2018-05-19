"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Playfield = function (_Window_Controls) {
  _inherits(Playfield, _Window_Controls);

  function Playfield(window, config) {
    _classCallCheck(this, Playfield);

    var _this = _possibleConstructorReturn(this, (Playfield.__proto__ || Object.getPrototypeOf(Playfield)).call(this));

    _this.config = config;
    _this.window = window;
    _this.zoom = _this.config.window_playfield.zoom;
    _this.zoom_min = 2;
    _this.zoom_max = 16;
    _this.pixels_x = _this.config.sprite_x;
    _this.pixels_y = _this.config.sprite_y;
    _this.width = _this.pixels_x * _this.config.window_playfield.canvas_x;
    _this.height = _this.pixels_y * _this.config.window_playfield.canvas_y;

    var template = "\n      <div class=\"window_menu\">\n        <div class=\"icons-zoom-area\">\n          <img src=\"img/icon3/icon-zoom-in.png\" id=\"icon-playfield-zoom-in\" title=\"zoom in\">\n          <img src=\"img/icon3/icon-zoom-out.png\" id=\"icon-playfield-zoom-out\" title=\"zoom out\">\n        </div>\n      </div>\n      <div id=\"playfield-container\">\n        <div id=\"playfield\"></div>\n      </div>\n    ";

    $("#window-" + _this.window).append(template);

    return _this;
  }

  _createClass(Playfield, [{
    key: "update",
    value: function update(all_data) {
      $("#playfield").empty();
      $("#playfield").css('background-color', this.config.colors[all_data.colors["t"]]);

      for (var i = 0; i < all_data.sprites.length; i++) {
        this.create_single_sprite_canvas(all_data.sprites[i], all_data.colors, i);
      }
    }
  }, {
    key: "create_single_sprite_canvas",
    value: function create_single_sprite_canvas(sprite_data, colors, id) {

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
        console.log("mousedown on sprite " + id);
      });

      $('#playfield-sprite-' + id).draggable({
        cursor: "crosshair",
        addClasses: false,
        grid: [this.pixels_x * this.zoom, this.pixels_y * this.zoom]
      });

      $('#playfield-sprite-' + id).mouseup(function (e) {
        console.log("mouseup on sprite " + id);
      });
    }
  }]);

  return Playfield;
}(Window_Controls);