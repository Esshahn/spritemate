'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Preview = function (_Window_Controls) {
  _inherits(Preview, _Window_Controls);

  function Preview(window, config) {
    _classCallCheck(this, Preview);

    var _this = _possibleConstructorReturn(this, (Preview.__proto__ || Object.getPrototypeOf(Preview)).call(this));

    _this.config = config;
    _this.window = window;
    _this.canvas_element = document.createElement('canvas');
    _this.zoom = _this.config.window_preview.zoom; // this.config.zoom;
    _this.zoom_min = 4;
    _this.zoom_max = 16;
    _this.pixels_x = _this.config.sprite_x;
    _this.pixels_y = _this.config.sprite_y;
    _this.width = _this.pixels_x * _this.zoom;
    _this.height = _this.pixels_y * _this.zoom;

    _this.canvas_element.id = "preview";
    _this.canvas_element.width = _this.width;
    _this.canvas_element.height = _this.height;
    _this.canvas = _this.canvas_element.getContext('2d');

    var template = '\n      <div class="window_menu">\n        <div class="icons-zoom-area">\n          <img src="img/icon3/icon-zoom-in.png" id="icon-preview-zoom-in" title="zoom in">\n          <img src="img/icon3/icon-zoom-out.png" id="icon-preview-zoom-out" title="zoom out">\n        </div>\n        <div class="icon-preview-x2" id="icon-preview-x" title="double width"></div>\n        <div class="icon-preview-y2" id="icon-preview-y" title="double height"></div>\n        <img src="img/icon3/icon-preview-overlay.png" id="icon-preview-overlay" title="overlay next sprite">\n      </div>\n      <div id="preview-canvas"></div>\n    ';

    $("#window-" + _this.window).append(template);
    $("#preview-canvas").append(_this.canvas_element);

    return _this;
  }

  _createClass(Preview, [{
    key: 'update',
    value: function update(all_data) {
      this.canvas_element.width = this.width;
      this.canvas_element.height = this.height;
      var sprite_data = all_data.sprites[all_data.current_sprite];
      var x_grid_step = 1;
      if (sprite_data.multicolor) x_grid_step = 2;

      // first fill the whole sprite with the background color
      this.canvas.fillStyle = this.config.colors[all_data.colors[0]];
      this.canvas.fillRect(0, 0, this.width, this.height);

      for (var i = 0; i < this.pixels_x; i = i + x_grid_step) {
        for (var j = 0; j < this.pixels_y; j++) {
          var array_entry = sprite_data.pixels[j][i];

          if (array_entry != 0) // transparent
            {
              var color = sprite_data.color;
              if (array_entry != 1 && sprite_data.multicolor) color = all_data.colors[array_entry];
              this.canvas.fillStyle = this.config.colors[color];
              this.canvas.fillRect(i * this.zoom, j * this.zoom, x_grid_step * this.zoom, this.zoom);
            }
        }
      }

      if (sprite_data.overlay && all_data.current_sprite < all_data.sprites.length - 1) this.display_overlay(all_data);

      // set the preview window x and y stretch
      if (sprite_data.double_x) {
        var double_x = 2;
        $('#icon-preview-x').addClass('icon-preview-x2-hi');
      } else {
        var double_x = 1;
        $('#icon-preview-x').removeClass('icon-preview-x2-hi');
      }

      if (sprite_data.double_y) {
        var double_y = 2;
        $('#icon-preview-y').addClass('icon-preview-y2-hi');
      } else {
        var double_y = 1;
        $('#icon-preview-y').removeClass('icon-preview-y2-hi');
      }

      $('#preview').css('width', this.width * double_x);
      $('#preview').css('height', this.height * double_y);
    }
  }, {
    key: 'display_overlay',
    value: function display_overlay(all_data) {
      var sprite_data = all_data.sprites[all_data.current_sprite + 1];
      var x_grid_step = 1;
      if (sprite_data.multicolor) x_grid_step = 2;

      for (var i = 0; i < this.pixels_x; i = i + x_grid_step) {
        for (var j = 0; j < this.pixels_y; j++) {
          var array_entry = sprite_data.pixels[j][i];

          // if singlecolor only, replace the multicolor pixels with the individual color
          if (!sprite_data.multicolor && (array_entry == 2 || array_entry == 3)) array_entry = 1;

          var color = sprite_data.color;
          if (array_entry != 1) color = all_data.colors[array_entry];

          if (array_entry != 0) {
            this.canvas.fillStyle = this.config.colors[color];
            this.canvas.fillRect(i * this.zoom, j * this.zoom, this.zoom * x_grid_step, this.zoom);
          }
        }
      }
    }
  }]);

  return Preview;
}(Window_Controls);